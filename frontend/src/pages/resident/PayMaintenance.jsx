<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import {
    CreditCard, Landmark, Smartphone, Shield, Lock, CheckCircle2,
    ChevronRight, Zap, FileText, ShieldCheck, Calendar, Home,
    Receipt, Download, X, Wallet
} from 'lucide-react';
import '../../styles/PayMaintenance.css';

const PayMaintenance = () => {
    const [selectedMethod, setSelectedMethod] = useState('UPI');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1=Select, 2=Confirm, 3=Success
    const totalAmount = 2500;
    const txnRef = useRef(`TXN${Date.now()}`);

    const methods = [
        { id: 'UPI', label: 'UPI / GPay / PhonePe', sub: 'Instant payment, no extra charges', icon: <Smartphone size={24} />, iconClass: 'ic-upi' },
        { id: 'Card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: <CreditCard size={24} />, iconClass: 'ic-card' },
        { id: 'NetBanking', label: 'Net Banking', sub: 'All major banks supported', icon: <Landmark size={24} />, iconClass: 'ic-bank' },
    ];

    const handlePay = () => {
        setIsProcessing(true);
        setCurrentStep(2);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
            setCurrentStep(3);
        }, 2200);
    };

    const handleDownloadReceipt = () => {
        const receiptContent = `
════════════════════════════════════════
           PAYMENT RECEIPT
════════════════════════════════════════

Transaction ID:   ${txnRef.current}
Date:             ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Time:             ${new Date().toLocaleTimeString('en-IN')}

────────────────────────────────────────
Amount Paid:      ₹${totalAmount.toLocaleString()}
Payment Method:   ${selectedMethod}
Status:           SUCCESS ✓
────────────────────────────────────────

Billing Period:   March 2026
Unit:             A-204
Society:          Greenfield Residency

════════════════════════════════════════
        Thank you for your payment!
════════════════════════════════════════
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${txnRef.current}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const closeSuccess = () => {
        setPaymentSuccess(false);
        setCurrentStep(1);
    };

    return (
        <div className="pm-page">
            <div className="pm-wrapper">

                {/* ── Header ── */}
                <div className="pm-page-header">
                    <h1>Maintenance Payment</h1>
                    <p>Secure checkout for your society maintenance dues</p>
                </div>

                {/* ── Stepper ── */}
                <div className="pm-stepper">
                    <div className={`pm-step ${currentStep >= 1 ? (currentStep > 1 ? 'done' : 'active') : ''}`}>
                        <div className="pm-step-circle">
                            {currentStep > 1 ? <CheckCircle2 size={16} /> : '1'}
                        </div>
                        <span>Select Method</span>
                    </div>
                    <div className={`pm-step-line ${currentStep > 1 ? 'done' : ''}`} />
                    <div className={`pm-step ${currentStep >= 2 ? (currentStep > 2 ? 'done' : 'active') : ''}`}>
                        <div className="pm-step-circle">
                            {currentStep > 2 ? <CheckCircle2 size={16} /> : '2'}
                        </div>
                        <span>Confirm</span>
                    </div>
                    <div className={`pm-step-line ${currentStep > 2 ? 'done' : ''}`} />
                    <div className={`pm-step ${currentStep >= 3 ? 'active done' : ''}`}>
                        <div className="pm-step-circle">
                            {currentStep >= 3 ? <CheckCircle2 size={16} /> : '3'}
                        </div>
                        <span>Success</span>
                    </div>
                </div>

                {/* ── Summary Card ── */}
                <div className="pm-summary-card">
                    <div className="pm-summary-inner">
                        <div className="pm-summary-top">
                            <div className="pm-summary-badge">
                                <Wallet size={14} /> Maintenance Due
                            </div>
                            <div className="pm-summary-icon">
                                <Receipt size={24} />
                            </div>
                        </div>
                        <div className="pm-summary-amount-label">Total Amount Due</div>
                        <div className="pm-summary-amount">₹{totalAmount.toLocaleString()}</div>
                        <div className="pm-summary-details">
                            <div className="pm-summary-detail">
                                <Calendar size={14} /> March 2026
                            </div>
                            <div className="pm-summary-detail">
                                <Home size={14} /> Unit A-204
                            </div>
                            <div className="pm-summary-detail">
                                <FileText size={14} /> Due: 10 Mar
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Payment Methods ── */}
                <div className="pm-section">
                    <div className="pm-section-title">
                        <CreditCard size={20} /> Select Payment Method
                    </div>

                    <div className="pm-methods-list">
                        {methods.map((method) => (
                            <div key={method.id}>
                                <div
                                    className={`pm-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <div className="pm-method-radio">
                                        <div className="pm-method-radio-inner" />
                                    </div>
                                    <div className={`pm-method-icon ${method.iconClass}`}>
                                        {method.icon}
                                    </div>
                                    <div className="pm-method-info">
                                        <div className="pm-method-label">{method.label}</div>
                                        <div className="pm-method-sub">{method.sub}</div>
                                    </div>
                                    <ChevronRight size={18} className="pm-method-arrow" />
                                </div>

                                {/* UPI Expanded */}
                                {method.id === 'UPI' && (
                                    <div className={`pm-upi-panel ${selectedMethod === 'UPI' ? 'open' : ''}`}>
                                        <div className="pm-upi-inner">
                                            <div className="pm-upi-apps">
                                                <div className="pm-upi-app">
                                                    <div className="pm-upi-app-icon" style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)' }}>GP</div>
                                                    GPay
                                                </div>
                                                <div className="pm-upi-app">
                                                    <div className="pm-upi-app-icon" style={{ background: 'linear-gradient(135deg, #5F259F, #844BD2)' }}>PP</div>
                                                    PhonePe
                                                </div>
                                                <div className="pm-upi-app">
                                                    <div className="pm-upi-app-icon" style={{ background: 'linear-gradient(135deg, #002970, #00BAF2)' }}>PT</div>
                                                    Paytm
                                                </div>
                                            </div>

                                            <div className="pm-upi-divider">OR ENTER UPI ID</div>

                                            <div className="pm-upi-id-input">
                                                <input
                                                    type="text"
                                                    placeholder="yourname@upi"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                />
                                                <button className="pm-upi-verify-btn">Verify</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Pay Button ── */}
                <div className="pm-pay-section">
                    <button
                        className="pm-pay-btn"
                        onClick={handlePay}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <div className="pm-spinner" />
                                Processing Payment...
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                Pay ₹{totalAmount.toLocaleString()} Securely
                            </>
                        )}
                    </button>
                </div>

                {/* ── Security Indicators ── */}
                <div className="pm-security-row">
                    <div className="pm-security-badge">
                        <ShieldCheck size={16} /> Secure Payment
                    </div>
                    <div className="pm-security-badge">
                        <Lock size={16} /> 256-bit SSL
                    </div>
                    <div className="pm-security-badge">
                        <Shield size={16} /> Trusted Gateway
                    </div>
                </div>

                {/* ── Benefits ── */}
                <div className="pm-benefits">
                    <div className="pm-benefits-title">Why pay online?</div>
                    <div className="pm-benefits-list">
                        <div className="pm-benefit-item">
                            <div className="pm-benefit-icon ic-1"><Zap size={18} /></div>
                            <div className="pm-benefit-text">Instant Confirmation</div>
                        </div>
                        <div className="pm-benefit-item">
                            <div className="pm-benefit-icon ic-2"><FileText size={18} /></div>
                            <div className="pm-benefit-text">Auto Receipt</div>
                        </div>
                        <div className="pm-benefit-item">
                            <div className="pm-benefit-icon ic-3"><ShieldCheck size={18} /></div>
                            <div className="pm-benefit-text">100% Secure</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Success Overlay ── */}
            {paymentSuccess && (
                <div className="pm-success-overlay" onClick={closeSuccess}>
                    <div className="pm-success-card" onClick={(e) => e.stopPropagation()}>
                        <div className="pm-success-checkmark">
                            <CheckCircle2 size={40} color="white" />
                        </div>
                        <h2>Payment Successful!</h2>
                        <p>Your maintenance payment has been processed</p>

                        <div className="pm-success-detail-row">
                            <span className="pm-success-label">Amount</span>
                            <span className="pm-success-value">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="pm-success-detail-row">
                            <span className="pm-success-label">Method</span>
                            <span className="pm-success-value">{selectedMethod}</span>
                        </div>
                        <div className="pm-success-detail-row">
                            <span className="pm-success-label">Transaction ID</span>
                            <span className="pm-success-value" style={{ fontSize: 12 }}>{txnRef.current}</span>
                        </div>
                        <div className="pm-success-detail-row">
                            <span className="pm-success-label">Date</span>
                            <span className="pm-success-value">
                                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        <div className="pm-success-actions">
                            <button className="pm-success-btn secondary" onClick={handleDownloadReceipt}>
                                <Download size={16} /> Download Receipt
                            </button>
                            <button className="pm-success-btn primary" onClick={closeSuccess}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
=======
import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { CreditCard, Landmark, Smartphone } from "lucide-react";
import api from "../../services/api";
const PayMaintenance = () => {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    api
      .get("/api/resident/bills/current")
      .then((res) => {
        const bill = res.data || {};
        setTotalAmount((bill.maintenance || 0) + (bill.additional || 0));
      })
      .catch((err) => console.error("Failed to load amount:", err));
  }, []);
  const methods = [
    {
      id: "UPI",
      label: "UPI / GPay / PhonePe",
      sub: "Instant payment, no extra charges",
      icon: <Smartphone size={24} className="text-blue-600" />,
    },
    {
      id: "Card",
      label: "Credit / Debit Card",
      sub: "Visa, Mastercard, RuPay",
      icon: <CreditCard size={24} className="text-blue-600" />,
    },
    {
      id: "NetBanking",
      label: "Net Banking",
      sub: "All major banks supported",
      icon: <Landmark size={24} className="text-blue-600" />,
    },
  ];
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Pay Maintenance"
        subtitle="Select a payment method to proceed"
      />

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border)",
          }}
          className="pb-24 mb-24"
        >
          <span
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              fontWeight: "500",
            }}
          >
            Total Payable
          </span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "var(--brand-dark)",
            }}
          >
            ₹{totalAmount.toLocaleString()}
          </span>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
        </div>

        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Select Payment Method
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          className="gap-16 mb-32"
        >
          {methods.map((method) => (
            <label
              key={method.id}
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${selectedMethod === method.id ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                background:
                  selectedMethod === method.id
                    ? "rgba(37, 99, 235, 0.04)"
                    : "transparent",
                transition: "all 0.2s ease",
              }}
              className="gap-16 p-16"
            >
              <input
                type="radio"
                name="method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                style={{
                  accentColor: "var(--primary)",
                  width: "20px",
                  height: "20px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  background: "var(--bg-light)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--primary)",
                }}
              >
                {method.icon}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "16px",
                  }}
                >
                  {method.label}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                  className="mt-16"
                >
                  {method.sub}
                </span>
              </div>
            </label>
          ))}
        </div>

        <Button
          size="lg"
          style={{
            width: "100%",
            height: "48px",
            fontSize: "16px",
          }}
        >
          Pay ₹{totalAmount.toLocaleString()}
        </Button>
      </Card>
    </div>
  );
};
export default PayMaintenance;
