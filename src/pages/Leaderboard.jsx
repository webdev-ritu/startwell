import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import StartupCard from '../components/common/StartupCard';
import '../styles/main.css';

export default function Leaderboard() {
  const [topStartups, setTopStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopStartups = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const startupsRef = collection(db, 'startups');
        const q = query(
          startupsRef, 
          orderBy('valuation', 'desc'), 
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        
        const startupsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Startup',
            logo: data.logo || '',
            description: data.description || '',
            valuation: data.valuation || 0,
            totalFunding: data.totalFunding || 0,
            investorCount: data.investorCount || 0,
            industry: data.industry || 'Other'
          };
        });
        
        setTopStartups(startupsData);
      } catch (err) {
        console.error("Error fetching startups:", err);
        setError(err.code === 'permission-denied' 
          ? "You don't have permission to view this data" 
          : "Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopStartups();
  }, []);

  if (loading) return <div className="loading">Loading leaderboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="leaderboard-page">
      <h1>Top Startups</h1>
      <p className="subtitle">Ranked by valuation</p>
      
      <div className="leaderboard-list">
        {topStartups.map((startup, index) => (
          <div key={startup.id} className="leaderboard-item">
            <div className="rank-badge">#{index + 1}</div>
            <StartupCard startup={startup} />
            <div className="metrics">
              <div className="metric">
                <span className="metric-label">Valuation:</span>
                <span className="metric-value">
                  ${startup.valuation.toLocaleString()}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Investors:</span>
                <span className="metric-value">
                  {startup.investorCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
