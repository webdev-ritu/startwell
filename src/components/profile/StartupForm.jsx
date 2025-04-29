import { useState } from 'react';
import '../../styles/main.css';

export default function StartupForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    companyName: '',
    vision: '',
    productDescription: '',
    marketSize: '',
    businessModel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="startup-form">
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Company Vision</label>
        <textarea
          name="vision"
          value={formData.vision}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Product Description</label>
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Market Size (TAM)</label>
        <input
          type="text"
          name="marketSize"
          value={formData.marketSize}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Business Model</label>
        <textarea
          name="businessModel"
          value={formData.businessModel}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        Save Profile
      </button>
    </form>
  );
}