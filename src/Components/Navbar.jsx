import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-lg px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/">Home</Link></li>
            {!user && (
              <>
                <li><Link to="/register-employee">Join as Employee</Link></li>
                <li><Link to="/register-hr">Join as HR Manager</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl lg:text-2xl font-bold">
          <span className="text-primary">Asset</span>
          <span className="text-secondary">Verse</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/" className="font-medium">Home</Link></li>
          {!user && (
            <>
              <li><Link to="/register-employee" className="font-medium">Join as Employee</Link></li>
              <li><Link to="/register-hr" className="font-medium">Join as HR Manager</Link></li>
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.profileImage || user.companyLogo || 'https://i.ibb.co/hL3hMHY/default-avatar.png'} alt="Profile" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user.name}</span>
                <span className="text-xs">{user.email}</span>
              </li>
              <div className="divider my-0"></div>
              
              {user.role === 'employee' ? (
                <>
                  <li><Link to="/employee/my-assets">My Assets</Link></li>
                  <li><Link to="/employee/request-asset">Request Asset</Link></li>
                  <li><Link to="/employee/my-team">My Team</Link></li>
                  <li><Link to="/employee/profile">Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/hr/assets">Asset List</Link></li>
                  <li><Link to="/hr/add-asset">Add Asset</Link></li>
                  <li><Link to="/hr/requests">All Requests</Link></li>
                  <li><Link to="/hr/employees">Employee List</Link></li>
                  <li><Link to="/hr/upgrade">Upgrade Package</Link></li>
                  <li><Link to="/hr/profile">Profile</Link></li>
                </>
              )}
              
              <div className="divider my-0"></div>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;