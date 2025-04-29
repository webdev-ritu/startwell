import { Link } from 'react-router-dom';
import '../../styles/main.css'; // Import your CSS file for styling

export default function StartupCard({ startup }) {
  return (
    <div className="startup-card">
      <div className="card-header">
        <h3>{startup.companyName}</h3>
        <span className="stage">{startup.stage || 'Early Stage'}</span>
      </div>
      
      <p className="vision">{startup.vision || 'No vision statement provided'}</p>
      
      <div className="card-footer">
        <Link to={`/startup/${startup.id}`} className="btn btn-outline">
          View Details
        </Link>
        
        <div className="metrics">
          <span>${startup.valuation?.toLocaleString() || '0'} valuation</span>
          <span>{startup.investorCount || 0} investors</span>
        </div>
      </div>
    </div>
  );
}