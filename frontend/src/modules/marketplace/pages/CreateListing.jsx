import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, Send, Trash2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { validateListing, imageToBase64 } from '../utils/helpers';
import { useToast } from '../../../components/ui/Toast';
import '../styles/marketplace.css';

const CreateListing = () => {
    const navigate = useNavigate();
    const { addListing, state } = useMarketplace();
    const toast = useToast();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        type: 'sale', flatNumber: '', bedrooms: '', bathrooms: '', area: '', floor: '',
        furnishing: 'semi-furnished', parking: 'covered', description: '',
        price: '', rent: '', deposit: '', images: [],
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        try {
            const newImages = await Promise.all(files.map(f => imageToBase64(f)));
            setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
            toast.success(`${files.length} image(s) uploaded`);
        } catch {
            toast.error('Failed to process images');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (idx) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = (status) => {
        const data = {
            ...form,
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            area: Number(form.area),
            floor: Number(form.floor),
            price: Number(form.price) || 0,
            rent: Number(form.rent) || 0,
            deposit: Number(form.deposit) || 0,
        };

        if (status === 'pending') {
            const errs = validateListing(data);
            if (data.images.length === 0 && status === 'pending') errs.images = 'At least 1 image required';
            const existingFlat = state.listings.find(l => l.flatNumber === data.flatNumber && !['sold', 'rented', 'rejected'].includes(l.status));
            if (existingFlat) errs.flatNumber = 'A listing for this flat already exists';
            if (Object.keys(errs).length > 0) {
                setErrors(errs);
                toast.error('Please fix the errors before submitting');
                return;
            }
        }

        addListing({
            ...data,
            status,
            featured: false,
            premium: false,
            ownerName: 'Current Resident',
            ownerFlat: data.flatNumber,
        });

        toast.success(status === 'draft' ? 'Listing saved as draft!' : 'Listing submitted for approval!');
        navigate('/resident/marketplace/my-listings');
    };

    const clearForm = () => {
        setForm({ type: 'sale', flatNumber: '', bedrooms: '', bathrooms: '', area: '', floor: '', furnishing: 'semi-furnished', parking: 'covered', description: '', price: '', rent: '', deposit: '', images: [] });
        setErrors({});
        toast.info('Form cleared');
    };

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>Create Listing</h1>
                    <p>List your property for sale or rent within the society</p>
                </div>
            </div>

            <div className="mp-detail-section">
                <div className="mp-form">
                    {/* Listing Type */}
                    <div className="mp-form-row">
                        <div className="mp-form-group">
                            <label>Listing Type *</label>
                            <div className="mp-toggle-group">
                                <button className={`mp-toggle-btn ${form.type === 'sale' ? 'active' : ''}`} onClick={() => handleChange('type', 'sale')}>🏷️ Sale</button>
                                <button className={`mp-toggle-btn ${form.type === 'rent' ? 'active' : ''}`} onClick={() => handleChange('type', 'rent')}>🔑 Rent</button>
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <h3 style={{ margin: '8px 0 0', color: 'var(--text-primary)' }}>Property Details</h3>
                    <div className="mp-form-row">
                        <div className="mp-form-group">
                            <label>Flat Number *</label>
                            <input type="text" placeholder="e.g. A-101" value={form.flatNumber} onChange={e => handleChange('flatNumber', e.target.value)} />
                            {errors.flatNumber && <span className="mp-error">{errors.flatNumber}</span>}
                        </div>
                        <div className="mp-form-group">
                            <label>Bedrooms *</label>
                            <input type="number" min="1" placeholder="e.g. 3" value={form.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)} />
                            {errors.bedrooms && <span className="mp-error">{errors.bedrooms}</span>}
                        </div>
                        <div className="mp-form-group">
                            <label>Bathrooms *</label>
                            <input type="number" min="1" placeholder="e.g. 2" value={form.bathrooms} onChange={e => handleChange('bathrooms', e.target.value)} />
                            {errors.bathrooms && <span className="mp-error">{errors.bathrooms}</span>}
                        </div>
                    </div>
                    <div className="mp-form-row">
                        <div className="mp-form-group">
                            <label>Area (sq.ft) *</label>
                            <input type="number" min="1" placeholder="e.g. 1200" value={form.area} onChange={e => handleChange('area', e.target.value)} />
                            {errors.area && <span className="mp-error">{errors.area}</span>}
                        </div>
                        <div className="mp-form-group">
                            <label>Floor</label>
                            <input type="number" min="0" placeholder="e.g. 3" value={form.floor} onChange={e => handleChange('floor', e.target.value)} />
                        </div>
                        <div className="mp-form-group">
                            <label>Furnishing</label>
                            <select value={form.furnishing} onChange={e => handleChange('furnishing', e.target.value)}>
                                <option value="unfurnished">Unfurnished</option>
                                <option value="semi-furnished">Semi-Furnished</option>
                                <option value="fully-furnished">Fully Furnished</option>
                            </select>
                        </div>
                    </div>
                    <div className="mp-form-row">
                        <div className="mp-form-group">
                            <label>Parking</label>
                            <select value={form.parking} onChange={e => handleChange('parking', e.target.value)}>
                                <option value="none">None</option>
                                <option value="open">Open</option>
                                <option value="covered">Covered</option>
                            </select>
                        </div>
                    </div>
                    <div className="mp-form-group">
                        <label>Description *</label>
                        <textarea placeholder="Describe your property in detail..." value={form.description} onChange={e => handleChange('description', e.target.value)} rows={5} />
                        {errors.description && <span className="mp-error">{errors.description}</span>}
                    </div>

                    {/* Financial */}
                    <h3 style={{ margin: '8px 0 0', color: 'var(--text-primary)' }}>Financial Details</h3>
                    <div className="mp-form-row">
                        {form.type === 'sale' ? (
                            <div className="mp-form-group">
                                <label>Price (₹) *</label>
                                <input type="number" min="1" placeholder="e.g. 8500000" value={form.price} onChange={e => handleChange('price', e.target.value)} />
                                {errors.price && <span className="mp-error">{errors.price}</span>}
                            </div>
                        ) : (
                            <>
                                <div className="mp-form-group">
                                    <label>Monthly Rent (₹) *</label>
                                    <input type="number" min="1" placeholder="e.g. 25000" value={form.rent} onChange={e => handleChange('rent', e.target.value)} />
                                    {errors.rent && <span className="mp-error">{errors.rent}</span>}
                                </div>
                                <div className="mp-form-group">
                                    <label>Security Deposit (₹) *</label>
                                    <input type="number" min="1" placeholder="e.g. 75000" value={form.deposit} onChange={e => handleChange('deposit', e.target.value)} />
                                    {errors.deposit && <span className="mp-error">{errors.deposit}</span>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Image Upload */}
                    <h3 style={{ margin: '8px 0 0', color: 'var(--text-primary)' }}>Images</h3>
                    <div className="mp-image-upload" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={32} color="var(--text-secondary)" />
                        <p>Click to upload property images (JPEG, PNG)</p>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} />
                    </div>
                    {errors.images && <span className="mp-error">{errors.images}</span>}
                    {form.images.length > 0 && (
                        <div className="mp-image-previews">
                            {form.images.map((img, i) => (
                                <div key={i} className="mp-image-preview">
                                    <img src={img} alt={`Preview ${i + 1}`} />
                                    <button className="mp-image-remove" onClick={() => removeImage(i)} aria-label="Remove image">×</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mp-form-actions">
                        <button className="mp-btn mp-btn-secondary" onClick={clearForm}><Trash2 size={16} /> Clear Form</button>
                        <button className="mp-btn mp-btn-warning" onClick={() => handleSubmit('draft')}><Save size={16} /> Save Draft</button>
                        <button className="mp-btn mp-btn-primary" onClick={() => handleSubmit('pending')}><Send size={16} /> Submit for Approval</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
