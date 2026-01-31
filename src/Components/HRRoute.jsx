import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HRRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'hr') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default HRRoute;