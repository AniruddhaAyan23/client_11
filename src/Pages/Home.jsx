import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { packageAPI } from '../utils/api';

const Home = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getAllPackages();
      setPackages(response.data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hero min-h-[80vh] bg-gradient-to-r from-primary to-secondary text-white"
      >
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-7xl font-bold mb-6"
            >
              Manage Assets <br />& Teams Effortlessly
            </motion.h1>
            <motion.p 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl mb-8"
            >
              The complete B2B solution for HR & Asset Management. 
              Track equipment, manage employees, and streamline operations.
            </motion.p>
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link to="/register-hr" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
                Join as HR Manager
              </Link>
              <Link to="/register-employee" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
                Join as Employee
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why Choose AssetVerse?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for B2B companies to efficiently manage physical assets and employee relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📊', title: 'Asset Tracking', desc: 'Track all company assets in one place with real-time updates' },
              { icon: '👥', title: 'Employee Management', desc: 'Manage employee affiliations and asset assignments effortlessly' },
              { icon: '🔄', title: 'Request Workflow', desc: 'Streamlined asset request and approval process' },
              { icon: '📈', title: 'Analytics', desc: 'Gain insights with comprehensive reports and charts' }
            ].map((feature, index) => (
              <div key={index} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body items-center text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="card-title text-xl">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Flexible packages that grow with your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={pkg._id} className={`card bg-base-100 shadow-xl ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                <div className="card-body">
                  {index === 1 && <div className="badge badge-primary mb-2">POPULAR</div>}
                  <h3 className="card-title text-2xl">{pkg.name}</h3>
                  <div className="text-4xl font-bold my-4">
                    ${pkg.price}<span className="text-lg font-normal">/month</span>
                  </div>
                  <p className="text-gray-600 mb-4">Up to {pkg.employeeLimit} employees</p>
                  <div className="divider"></div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions mt-6">
                    <Link to="/register-hr" className="btn btn-primary w-full">Get Started</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already managing their assets efficiently with AssetVerse
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register-hr" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
              Start Free Trial
            </Link>
            <Link to="/login" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;