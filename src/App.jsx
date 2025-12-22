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