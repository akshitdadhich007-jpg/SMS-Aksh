import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, icon, iconType = 'danger', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="mp-modal-overlay" onClick={onCancel}>
            <div className="mp-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                <div className="mp-modal-header">
                    <h2>{title}</h2>
                    <button className="mp-btn-icon" onClick={onCancel}><X size={18} /></button>
                </div>
                <div className="mp-modal-body">
                    <div className={`mp-confirm-icon ${iconType}`}>{icon || '⚠️'}</div>
                    <p className="mp-confirm-text">{message}</p>
                </div>
                <div className="mp-modal-footer">
                    <button className="mp-btn mp-btn-secondary" onClick={onCancel}>{cancelText}</button>
                    <button className={`mp-btn ${iconType === 'danger' ? 'mp-btn-danger' : 'mp-btn-primary'}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
