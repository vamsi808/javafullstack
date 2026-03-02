import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Mail, Phone, Building, Clock } from 'lucide-react';
import { contactService } from '../../services/contactService';
import { formatDate } from '../../utils/helpers';
import Loader from '../common/Loader';
import ConfirmModal from '../common/ConfirmModal';
import './ContactDetails.css';

const ContactDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchContact();
        // eslint-disable-next-line
    }, [id]);

    const fetchContact = async () => {
        try {
            const data = await contactService.getById(id);
            setContact(data);
        } catch (error) {
            console.error('Failed to fetch contact:', error);
            navigate('/contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await contactService.delete(id);
            navigate('/contacts');
        } catch (error) {
            console.error('Failed to delete contact:', error);
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    if (loading) return <Loader />;
    if (!contact) return null;

    return (
        <div className="contact-details-page">
            <div className="page-header">
                <div className="header-left">
                    <button className="btn btn-secondary back-btn" onClick={() => navigate('/contacts')}>
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>

                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate(`/contacts/edit/${contact.id}`)}>
                        <Edit2 size={18} /> Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => setDeleteModalOpen(true)}>
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            <div className="profile-card glass-panel">
                <div className="profile-header">
                    <div className="avatar-large">{contact.name.charAt(0)}</div>
                    <div className="profile-titles">
                        <h2>{contact.name}</h2>
                        <span className="contact-id-badge">#{contact.id}</span>
                    </div>
                </div>

                <div className="profile-info-grid">
                    <div className="info-item">
                        <Mail className="info-icon" size={20} />
                        <div className="info-content">
                            <span className="info-label">Email</span>
                            <span className="info-value"><a href={`mailto:${contact.email}`}>{contact.email}</a></span>
                        </div>
                    </div>

                    <div className="info-item">
                        <Phone className="info-icon" size={20} />
                        <div className="info-content">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{contact.phone || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <Building className="info-icon" size={20} />
                        <div className="info-content">
                            <span className="info-label">Company</span>
                            <span className="info-value">{contact.company || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <Clock className="info-icon" size={20} />
                        <div className="info-content">
                            <span className="info-label">Created At</span>
                            <span className="info-value">{formatDate(contact.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Contact"
                message={`Are you sure you want to delete ${contact.name}? If they have associated tickets, this might affect ticket history.`}
                confirmText={deleting ? "Deleting..." : "Delete"}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                isDestructive={true}
            />
        </div>
    );
};

export default ContactDetails;
