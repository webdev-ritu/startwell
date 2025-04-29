import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaChartLine, FaMoneyBillWave, FaUsers, FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/main.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">StartupSim</Link>
      </div>
      
      {currentUser && (
        <div className="navbar-links">
          <Link to="/dashboard"><FaHome /> Dashboard</Link>
          <Link to="/profile"><FaUserTie /> My Startup</Link>
          <Link to="/funding"><FaMoneyBillWave /> Funding</Link>
          <Link to="/pitch-room"><FaUsers /> Pitch Room</Link>
          <Link to="/leaderboard"><FaChartLine /> Leaderboard</Link>
        </div>
      )}
      
      <div className="navbar-auth">
        {currentUser ? (
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}