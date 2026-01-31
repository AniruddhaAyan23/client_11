import { useEffect, useState } from 'react';
import { requestAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, [filterStatus, currentPage]);

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getHRRequests({ status: filterStatus, page: currentPage, limit: 10 });
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      try {
        await requestAPI.approveRequest(id);
        toast.success('Request approved successfully');
        fetchRequests();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to approve request');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await requestAPI.rejectRequest(id);
        toast.success('Request rejected');
        fetchRequests();
      } catch (error) {
        toast.error('Failed to reject request');
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
      <h1 className="text-3xl font-bold mb-6">All Asset Requests</h1>

      <div className="mb-6">
        <select
          className="select select-bordered"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No requests found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Asset Image</th>
                  <th>Asset Name</th>
                  <th>Type</th>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <img src={request.assetImage} alt={request.assetName} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td>{request.assetName}</td>
                    <td>
                      <span className={`badge ${request.assetType === 'Returnable' ? 'badge-success' : 'badge-info'}`}>
                        {request.assetType}
                      </span>
                    </td>
                    <td>{request.requesterName}</td>
                    <td>{request.requesterEmail}</td>
                    <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        request.requestStatus === 'pending' ? 'badge-warning' :
                        request.requestStatus === 'approved' ? 'badge-success' :
                        'badge-error'
                      }`}>
                        {request.requestStatus}
                      </span>
                    </td>
                    <td>{request.note || 'N/A'}</td>
                    <td>
                      {request.requestStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="btn btn-sm btn-success"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            className="btn btn-sm btn-error"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AllRequests;