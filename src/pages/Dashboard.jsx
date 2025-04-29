import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import DashboardCard from '../components/dashboard/DashboardCard';
import '../styles/main.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartupData = async () => {
      if (currentUser) {
        const docRef = doc(db, 'startups', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStartupData(docSnap.data());
        }
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [currentUser]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <h1>Welcome, {currentUser?.email}</h1>
      <p className="subtitle">Your startup at a glance</p>
      
      <div className="dashboard-grid">
        <DashboardCard 
          title="Startup Profile" 
          value={startupData?.companyName || 'Not created'} 
          link="/profile"
          linkText={startupData ? 'View Profile' : 'Create Profile'}
          icon="profile"
        />
        
        <DashboardCard 
          title="Current Valuation" 
          value={`$${startupData?.valuation?.toLocaleString() || '0'}`} 
          link="/funding"
          linkText="Funding Rounds"
          icon="valuation"
        />
        
        <DashboardCard 
          title="Investor Interest" 
          value={startupData?.investorCount || '0'} 
          link="/pitch-room"
          linkText="Pitch Room"
          icon="investors"
        />
        
        <DashboardCard 
          title="Your Ranking" 
          value={`#${startupData?.ranking || 'N/A'}`} 
          link="/leaderboard"
          linkText="View Leaderboard"
          icon="ranking"
        />
      </div>
      
     
    </div>
  );
}