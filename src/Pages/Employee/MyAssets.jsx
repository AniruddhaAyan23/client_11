import { useEffect, useState } from 'react';
import { employeeAPI, requestAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MyAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchMyAssets();
  }, [searchTerm, filterType]);

  const fetchMyAssets = async () => {
    try {
      const response = await employeeAPI.getMyAssets({ search: searchTerm, type: filterType });
      setAssets(response.data.assets);
    } catch (error) {
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (assignmentId) => {
    if (window.confirm('Are you sure you want to return this asset?')) {
      try {
        await requestAPI.returnAsset(assignmentId);
        toast.success('Asset returned successfully');
        fetchMyAssets();
      } catch (error) {
        toast.error('Failed to return asset');
      }
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text('My Assets', 14, 15);
    
    const tableData = assets.map(asset => [
      asset.assetName,
      asset.assetType,
      asset.companyName,
      new Date(asset.assignmentDate).toLocaleDateString(),
      asset.status
    ]);

    doc.autoTable({
      head: [['Asset Name', 'Type', 'Company', 'Assigned Date', 'Status']],
      body: tableData,
      startY: 25
    });

    doc.save('my-assets.pdf');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Assets</h1>
        <button onClick={handlePrint} className="btn btn-primary">
          Print Assets
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search assets..."
          className="input input-bordered flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No assets assigned yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Company</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id}>
                  <td>
                    <img src={asset.assetImage} alt={asset.assetName} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td>{asset.assetName}</td>
                  <td>
                    <span className={`badge ${asset.assetType === 'Returnable' ? 'badge-success' : 'badge-info'}`}>
                      {asset.assetType}
                    </span>
                  </td>
                  <td>{asset.companyName}</td>
                  <td>{new Date(asset.assignmentDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-success">Assigned</span>
                  </td>
                  <td>
                    {asset.assetType === 'Returnable' && asset.status === 'assigned' && (
                      <button
                        onClick={() => handleReturn(asset._id)}
                        className="btn btn-sm btn-warning"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAssets;