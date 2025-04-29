import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/main.css'; // Import your CSS file for styling

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Startup Pitch Simulator</h1>
          <p>Practice your pitch, simulate funding rounds, and get feedback from mock investors</p>
          <div className="hero-buttons">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/startup-hero.svg" alt="Startup Illustration" />
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧱</div>
            <h3>Startup Profile</h3>
            <p>Build your startup profile with vision, product details, market size, and business model</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Funding Simulation</h3>
            <p>Create funding rounds, negotiate with investors, and track your cap table</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣</div>
            <h3>Pitch Rooms</h3>
            <p>Practice your pitch in real-time with mock investors and get instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Scoring & Feedback</h3>
            <p>Receive ratings on your team, product, and market potential</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Leaderboard</h3>
            <p>Compete with other founders and track your ranking</p>
          </div>
        </div>
      </div>
    </div>
  );
}