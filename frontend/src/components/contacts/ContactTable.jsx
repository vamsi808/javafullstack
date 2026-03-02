import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import './ContactTable.css';

const ContactTable = ({ contacts }) => {
    const navigate = useNavigate();

    return (
        <table className="contact-table">
            <thead>
                <tr>
                    <th>Name / ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
                {contacts.map(contact => (
                    <tr
                        key={contact.id}
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                        className="table-row-clickable"
                    >
                        <td>
                            <div className="contact-info">
                                <div className="avatar-small">{contact.name.charAt(0)}</div>
                                <div className="contact-name-id">
                                    <span className="contact-name">{contact.name}</span>
                                    <span className="contact-id">#{contact.id}</span>
                                </div>
                            </div>
                        </td>
                        <td>{contact.email}</td>
                        <td>{contact.phone || '-'}</td>
                        <td>{contact.company || '-'}</td>
                        <td>{formatDate(contact.createdAt)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ContactTable;
