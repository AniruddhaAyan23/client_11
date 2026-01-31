import { useEffect, useState } from 'react';
import { employeeAPI, packageAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
    fetchPackageInfo();
  }, [searchTerm, currentPage]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getHREmployees({ search: searchTerm, page: currentPage, limit: 10 });
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageInfo = async () => {
    try {
      const response = await packageAPI.getMyPackage();
      setPackageInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch package info');
    }
  };

  const handleRemove = async (email) => {
    if (window.confirm('Are you sure you want to remove this employee from your team?')) {
      try {
        await employeeAPI.removeEmployee(email);
        toast.success('Employee removed successfully');
        fetchEmployees();
        fetchPackageInfo();
      } catch (error) {
        toast.error('Failed to remove employee');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Employee List</h1>
        {packageInfo && (
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Employees</div>
              <div className="stat-value text-2xl">{packageInfo.currentEmployees} / {packageInfo.packageLimit}</div>
              <div className="stat-desc">
                {packageInfo.currentEmployees >= packageInfo.packageLimit ? (
                  <Link to="/hr/upgrade" className="link link-error">Upgrade needed</Link>
                ) : (
                  <span className="text-success">Available slots: {packageInfo.packageLimit - packageInfo.currentEmployees}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No employees yet</p>
          <p className="text-sm text-gray-400 mt-2">Employees will appear here after you approve their asset requests</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <div key={employee._id} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={employee.profileImage || 'https://i.ibb.co/hL3hMHY/default-avatar.png'} alt={employee.name} />
                    </div>
                  </div>
                  <h2 className="card-title">{employee.name}</h2>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                  <div className="badge badge-primary">Assets: {employee.assetCount}</div>
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(employee.affiliationDate).toLocaleDateString()}
                  </p>
                  <div className="card-actions mt-4">
                    <button
                      onClick={() => handleRemove(employee.email)}
                      className="btn btn-sm btn-error"
                    >
                      Remove from Team
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn">Page {currentPage} of {totalPages}</button>
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeList;