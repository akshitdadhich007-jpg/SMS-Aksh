import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui';

const ClaimsPanel = ({ claims, approving, onApproveClaim }) => {
    return (
        <div>
            {claims.length === 0 ? (
                 <div className="premium-empty-state">
                    <div className="empty-icon-circle"><ShieldCheck size={32} /></div>
                    <h3>No Pending Claims</h3>
                    <p>All claims have been processed or none have been submitted yet.</p>
                </div>
            ) : (
                <div className="traceback-grid">
                    {claims.map((claim) => (
                        <div key={claim.id} className="traceback-claim-card">
                            <div className="claim-header">
                                <div className="claim-user-avatar">{claim.claimant_name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="claim-user-name">{claim.claimant_name || 'Resident'}</div>
                                    <div className="claim-item-ref">Claiming: {claim.item_details?.description}</div>
                                </div>
                                <div className="claim-status-badge">
                                    {claim.status === 'pending_approval' ? 'Needs Review' : 'Approved'}
                                </div>
                            </div>
                            
                            <div className="claim-qa-section" style={{background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
                                <h4 style={{fontSize:'14px', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px'}}>
                                    <ShieldCheck size={14} color="#6366f1"/> Verification Answers:
                                </h4>
                                <ul style={{margin:0, paddingLeft:'20px', fontSize:'14px', color:'#475569'}}>
                                    {claim.security_answers?.map((ans, i) => (
                                        <li key={i}>{ans || 'No answer provided'}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="claim-actions">
                                {claim.status === 'pending_approval' ? (
                                    <Button variant="primary" onClick={() => onApproveClaim(claim.id)} disabled={approving} className="full-width-btn btn-gradient" style={{justifyContent:'center'}}>
                                        <CheckCircle2 size={16} /> Approve & Generate Handover Token
                                    </Button>
                                ) : (
                                    <div className="traceback-info-box success text-center">
                                        Token Generated. Wait for claimant to show QR code.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClaimsPanel;
