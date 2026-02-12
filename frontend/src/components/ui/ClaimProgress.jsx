import React from 'react';
import { BadgeCheck, CheckCircle2, KeyRound, PackageCheck } from 'lucide-react';

const defaultSteps = [
    { id: 'submitted', title: 'Claim Submitted', icon: <CheckCircle2 size={18} /> },
    { id: 'approved', title: 'Claim Approved', icon: <BadgeCheck size={18} /> },
    { id: 'pin', title: 'PIN Generated', icon: <KeyRound size={18} /> },
    { id: 'returned', title: 'Item Returned', icon: <PackageCheck size={18} /> }
];

const statusForStep = (index, currentStep) => {
    if (index < currentStep) return 'Completed';
    if (index === currentStep) return 'In Progress';
    return 'Pending';
};

const ClaimProgress = ({ steps = defaultSteps, currentStep = 0, timestamps = [] }) => {
    return (
        <div className="claim-progress">
            {steps.map((step, index) => (
                <div
                    key={step.id}
                    className={`claim-step ${index === currentStep ? 'current' : ''} ${index < currentStep ? 'complete' : ''}`}
                >
                    <div className="claim-step-icon">
                        {step.icon}
                    </div>
                    <div className="claim-step-content">
                        <div className="claim-step-title">{step.title}</div>
                        <div className="claim-step-status">{statusForStep(index, currentStep)}</div>
                        <div className="claim-step-time">{timestamps[index] || 'Pending timestamp'}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClaimProgress;
