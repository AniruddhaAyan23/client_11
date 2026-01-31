import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImage } from '../utils/api';
import toast from 'react-hot-toast';

const RegisterHR = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyLogo: '',
    dateOfBirth: ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { registerHR } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData({ ...formData, companyLogo: imageUrl });
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.companyLogo) {
      toast.error('Please upload company logo');
      return;
    }

    setLoading(true);

    try {
      await registerHR(formData);
      toast.success('Registration successful!');
      navigate('/hr/assets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-6">
            Join as HR Manager
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="input input-bordered"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Company Name</span>
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Enter company name"
                className="input input-bordered"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Company Logo</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
                required
              />
              {uploading && <span className="loading loading-spinner loading-sm mt-2"></span>}
              {formData.companyLogo && (
                <img src={formData.companyLogo} alt="Logo" className="w-20 h-20 object-cover mt-2 rounded" />
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                className="input input-bordered"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="input input-bordered"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading || uploading}
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Register'}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterHR;