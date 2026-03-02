import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { contactService } from '../../services/contactService';
import Loader from '../common/Loader';
import './ContactForm.css';

const ContactForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchContact();
        }
        // eslint-disable-next-line
    }, [id]);

    const fetchContact = async () => {
        try {
            const contactData = await contactService.getById(id);
            setFormData({
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone || '',
                company: contactData.company || ''
            });
        } catch (error) {
            console.error('Error fetching contact:', error);
            navigate('/contacts');
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
        setSaving(true);
        try {
            if (isEditMode) {
                await contactService.update(id, formData);
                navigate(`/contacts/${id}`);
            } else {
                const newContact = await contactService.create(formData);
                navigate(`/contacts/${newContact.id}`);
            }
        } catch (error) {
            console.error('Failed to save contact:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="contact-form-page">
            <div className="page-header">
                <div className="header-left">
                    <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="page-title">{isEditMode ? 'Edit Contact' : 'Create New Contact'}</h1>
                </div>
            </div>

            <div className="form-container glass-panel">
                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label className="form-label">Full Name <span className="required">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>

                        <div className="form-group flex-1">
                            <label className="form-label">Email Address <span className="required">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="form-group flex-1">
                            <label className="form-label">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Company Name LLC"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
