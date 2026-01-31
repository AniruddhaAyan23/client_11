import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import HRRoute from './components/HRRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterEmployee from './pages/RegisterEmployee';
import RegisterHR from './pages/RegisterHR';
import NotFound from './pages/NotFound';

// Employee Pages
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register-employee" element={<RegisterEmployee />} />
              <Route path="/register-hr" element={<RegisterHR />} />

              {/* Employee Routes */}
              <Route path="/employee/my-assets" element={
                <PrivateRoute role="employee">
                  <MyAssets />
                </PrivateRoute>
              } />
              <Route path="/employee/request-asset" element={
                <PrivateRoute role="employee">
                  <RequestAsset />
                </PrivateRoute>
              } />
              <Route path="/employee/my-team" element={
                <PrivateRoute role="employee">
                  <MyTeam />
                </PrivateRoute>
              } />
              <Route path="/employee/profile" element={
                <PrivateRoute role="employee">
                  <EmployeeProfile />
                </PrivateRoute>
              } />

              {/* HR Routes */}
              <Route path="/hr/assets" element={
                <HRRoute>
                  <AssetList />
                </HRRoute>
              } />
              <Route path="/hr/add-asset" element={
                <HRRoute>
                  <AddAsset />
                </HRRoute>
              } />
              <Route path="/hr/requests" element={
                <HRRoute>
                  <AllRequests />
                </HRRoute>
              } />
              <Route path="/hr/employees" element={
                <HRRoute>
                  <EmployeeList />
                </HRRoute>
              } />
              <Route path="/hr/upgrade" element={
                <HRRoute>
                  <UpgradePackage />
                </HRRoute>
              } />
              <Route path="/hr/profile" element={
                <HRRoute>
                  <HRProfile />
                </HRRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;