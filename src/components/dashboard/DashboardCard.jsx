import { Link } from 'react-router-dom';
import '../../styles/main.css';

export default function DashboardCard({ title, value, link, linkText, icon }) {
  const getIcon = () => {
    switch(icon) {
      case 'profile': return '👤';
      case 'valuation': return '💰';
      case 'investors': return '👥';
      case 'ranking': return '🏆';
      default: return '📊';
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-icon">{getIcon()}</div>
      <h3>{title}</h3>
      <p className="card-value">{value}</p>
      <Link to={link} className="card-link">
        {linkText}
      </Link>
    </div>
  );
}