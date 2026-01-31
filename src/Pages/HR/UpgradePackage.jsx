import { useEffect, useState } from 'react';
import { packageAPI } from '../../utils/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UpgradePackage = () => {
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, currentRes] = await Promise.all([
        packageAPI.getAllPackages(),
        packageAPI.getMyPackage()
      ]);
      setPackages(packagesRes.data.packages);
      setCurrentPackage(currentRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upgrade Package</h1>

      {currentPackage && (
        <div className="alert alert-info mb-6">
          <div>
            <h3 className="font-bold">Current Package: {currentPackage.subscription}</h3>
            <p>Employee Limit: {currentPackage.currentEmployees} / {currentPackage.packageLimit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {packages.map((pkg, index) => (
          <div
            key={pkg._id}
            className={`card bg-base-100 shadow-xl ${index === 1 ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="card-body">
              {index === 1 && <div className="badge badge-primary mb-2">POPULAR</div>}
              <h2 className="card-title text-2xl">{pkg.name}</h2>
              <div className="text-4xl font-bold my-4">
                ${pkg.price}<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-gray-600 mb-4">Up to {pkg.employeeLimit} employees</p>
              <div className="divider"></div>
              <ul className="space-y-2">
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
                {currentPackage && pkg.employeeLimit <= currentPackage.packageLimit ? (
                  <button className="btn btn-disabled w-full">Current/Lower Plan</button>
                ) : (
                  <button className="btn btn-primary w-full">
                    Upgrade (Stripe Integration Coming Soon)
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePackage;