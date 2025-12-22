import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import HRRoute from './components/HRRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterEmployee from './pages/RegisterEmployee';
import RegisterHR from './pages/RegisterHR';
import NotFound from './pages/NotFound';

import MyAssets from './pages/employee/MyAssets';
import RequestAsset from './pages/employee/RequestAsset';
import MyTeam from './pages/employee/MyTeam';
import EmployeeProfile from './pages/employee/Profile';

// HR Pages
import AssetList from './pages/hr/AssetList';
import AddAsset from './pages/hr/AddAsset';
import AllRequests from './pages/hr/AllRequests';
import EmployeeList from './pages/hr/EmployeeList';
import UpgradePackage from './pages/hr/UpgradePackage';
import HRProfile from './pages/hr/Profile';