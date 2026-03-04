import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contactService } from '../../services/contactService';
import { ArrowLeft, Save, User, Mail, Phone, Building } from 'lucide-react';
import Loader from '../common/Loader';

const ContactForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        address: ''
    });

    useEffect(() => {
        if (isEditing) {
            fetchContact();
        }
    }, [id]);

    const fetchContact = async () => {
        try {
            const data = await contactService.getById(id);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                company: data.company || '',
                title: data.title || '',
                address: data.address || ''
            });
        } catch (err) {
            setError('Failed to fetch contact details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (isEditing) {
                await contactService.update(id, formData);
            } else {
                await contactService.create(formData);
            }
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving the contact.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/contacts')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">{isEditing ? 'Edit Contact' : 'New Contact'}</h1>
                    <p className="text-slate-400 mt-1">{isEditing ? 'Update existing customer details.' : 'Add a new customer to your database.'}</p>
                </div>
            </div>

            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Basic Info Section */}
                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2 flex items-center gap-2">
                            <User size={18} className="text-primary" /> Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="Software Engineer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="space-y-6 md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2 flex items-center gap-2">
                            <Mail size={18} className="text-secondary" /> Contact Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="jane.doe@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Info Section */}
                    <div className="space-y-6 md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2 flex items-center gap-2">
                            <Building size={18} className="text-emerald-400" /> Company Integration
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="Acme Corp"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Address</label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="glass-input resize-none"
                                    placeholder="123 Business Ave, Suite 100, City, Country"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={() => navigate('/contacts')}
                        className="btn-secondary"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary flex items-center gap-2"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={18} /> {isEditing ? 'Save Changes' : 'Create Contact'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
