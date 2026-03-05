/**
 * Approval Code Generator
 * ───────────────────────
 * Connected to: VisitorPreApproval.jsx → "Generate Approval Code" button
 * Generates unique alphanumeric codes for visitor pre-approvals.
 * Code length and charset are configurable via environment variables.
 */

const config = require('../config/env');

function generateApprovalCode() {
    const chars = config.approvalCodeChars;
    const length = config.approvalCodeLength;
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

module.exports = { generateApprovalCode };
