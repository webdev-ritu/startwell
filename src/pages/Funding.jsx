import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import FundingRoundForm from '../components/funding/FundingRoundForm';
import CapTable from '../components/funding/CapTable';
import InvestorOffers from '../components/funding/InvestorOffers';
import '../styles/main.css';

export default function Funding() {
  const { currentUser } = useAuth();
  const [startupData, setStartupData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Fetch startup data
        const startupRef = doc(db, 'startups', currentUser.uid);
        const startupSnap = await getDoc(startupRef);
        
        if (startupSnap.exists()) {
          setStartupData(startupSnap.data());
        } else {
          console.warn("No startup data found for user:", currentUser.uid);
        }

        // Fetch funding offers
        const offersRef = collection(db, 'fundingOffers');
        const q = query(offersRef, where('startupId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const offersData = [];
        querySnapshot.forEach((doc) => {
          offersData.push({ id: doc.id, ...doc.data() });
        });
        setOffers(offersData);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleCreateRound = async (roundData) => {
    try {
      await addDoc(collection(db, 'fundingRounds'), {
        ...roundData,
        startupId: currentUser.uid,
        createdAt: new Date(),
        status: 'open'
      });
      alert('Funding round created successfully!');
    } catch (error) {
      console.error("Error creating funding round: ", error);
      alert("Failed to create funding round. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser) return <div className="error">Please login to access this page</div>;

  return (
    <div className="funding-page">
      <h1>Funding Simulation</h1>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Round
        </button>
        <button 
          className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          Investor Offers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cap' ? 'active' : ''}`}
          onClick={() => setActiveTab('cap')}
        >
          Cap Table
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'create' && (
          <FundingRoundForm 
            startupData={startupData} 
            onSubmit={handleCreateRound} 
          />
        )}
        
        {activeTab === 'offers' && (
          <InvestorOffers 
            offers={offers} 
            startupData={startupData} 
          />
        )}
        
        {activeTab === 'cap' && (
          <CapTable 
            startupData={startupData} 
            offers={offers.filter(o => o.status === 'accepted')} 
          />
        )}
      </div>
    </div>
  );
}