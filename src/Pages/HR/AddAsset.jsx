import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetAPI, uploadImage } from '../../utils/api';
import toast from 'react-hot-toast';

const AddAsset = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productImage: '',
    productType: 'Returnable',
    productQuantity: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData({ ...formData, productImage: imageUrl });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productImage) {
      toast.error('Please upload product image');
      return;
    }

    setSaving(true);

    try {
      await assetAPI.addAsset(formData);
      toast.success('Asset added successfully!');
      navigate('/hr/assets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Asset</h1>

      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Product Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="input input-bordered"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Product Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
                required
              />
              {uploading && <span className="loading loading-spinner loading-sm mt-2"></span>}
              {formData.productImage && (
                <img src={formData.productImage} alt="Product" className="w-32 h-32 object-cover mt-2 rounded" />
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Product Type</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                required
              >
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Product Quantity</span>
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                className="input input-bordered"
                value={formData.productQuantity}
                onChange={(e) => setFormData({ ...formData, productQuantity: e.target.value })}
                min="1"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={saving || uploading}
            >
              {saving ? <span className="loading loading-spinner"></span> : 'Add Asset'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;