import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StartupProvider } from './context/StartupContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StartupProfile from './pages/StartupProfile';
import Funding from './pages/Funding';
import PitchRoom from './pages/PitchRoom';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import './styles/main.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <StartupProvider>
          <div className="app-container">
            <Navbar />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><StartupProfile /></PrivateRoute>} />
                <Route path="/funding" element={<PrivateRoute><Funding /></PrivateRoute>} />
                <Route path="/pitch-room" element={<PrivateRoute><PitchRoom /></PrivateRoute>} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </StartupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;