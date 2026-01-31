import { useEffect, useState } from 'react';
import { assetAPI, requestAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const RequestAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchAvailableAssets();
  }, [searchTerm]);

  const fetchAvailableAssets = async () => {
    try {
      const response = await assetAPI.getAvailableAssets({ search: searchTerm });
      setAssets(response.data.assets);
    } catch (error) {
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setNote('');
    document.getElementById('request_modal').showModal();
  };

  const handleRequest = async () => {
    setRequesting(true);
    try {
      await requestAPI.createRequest({
        assetId: selectedAsset._id,
        note
      });
      toast.success('Asset request submitted successfully!');
      document.getElementById('request_modal').close();
      fetchAvailableAssets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Request an Asset</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search assets..."
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No assets available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={asset.productImage} alt={asset.productName} className="h-48 w-full object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{asset.productName}</h2>
                <p className="text-sm text-gray-600">{asset.companyName}</p>
                <div className="flex justify-between items-center">
                  <span className={`badge ${asset.productType === 'Returnable' ? 'badge-success' : 'badge-info'}`}>
                    {asset.productType}
                  </span>
                  <span className="text-sm">Available: {asset.availableQuantity}</span>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => openModal(asset)}
                    className="btn btn-primary btn-sm"
                    disabled={asset.availableQuantity === 0}
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <dialog id="request_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Request Asset</h3>
          {selectedAsset && (
            <>
              <p className="mb-4">
                You are requesting: <strong>{selectedAsset.productName}</strong>
              </p>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="4"
              ></textarea>
              <div className="modal-action">
                <button onClick={handleRequest} className="btn btn-primary" disabled={requesting}>
                  {requesting ? <span className="loading loading-spinner"></span> : 'Submit Request'}
                </button>
                <button onClick={() => document.getElementById('request_modal').close()} className="btn">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default RequestAsset;