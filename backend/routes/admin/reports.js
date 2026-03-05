/**
 * Admin Reports & Analytics Routes — Connected to: ReportsAnalytics.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { ROLES, COMPLAINT_STATUS, BILL_STATUS } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/reports/full', ...auth, async (req, res, next) => {
    try {
        const [payments, expenses, complaints, residents, bills] = await Promise.all([
            supabaseAdmin.from('payments').select('amount, method, paid_at'),
            supabaseAdmin.from('expenses').select('amount, category, date'),
            supabaseAdmin.from('complaints').select('status, created_at'),
            supabaseAdmin.from('residents').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('bills').select('total_amount, status'),
        ]);

        const totalRevenue = payments.data?.reduce((s, p) => s + Number(p.amount), 0) || 0;
        const totalExpenses = expenses.data?.reduce((s, e) => s + Number(e.amount), 0) || 0;
        const pendingBills = bills.data?.filter(b => b.status === BILL_STATUS.PENDING).length || 0;
        const overdueBills = bills.data?.filter(b => b.status === BILL_STATUS.OVERDUE).length || 0;

        const expenseByCategory = {};
        expenses.data?.forEach(e => { expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + Number(e.amount); });

        const paymentByMethod = {};
        payments.data?.forEach(p => { paymentByMethod[p.method] = (paymentByMethod[p.method] || 0) + Number(p.amount); });

        return success(res, {
            totalRevenue, totalExpenses, netBalance: totalRevenue - totalExpenses,
            totalResidents: residents.count || 0, pendingBills, overdueBills,
            complaintsOpen: complaints.data?.filter(c => c.status === COMPLAINT_STATUS.OPEN).length || 0,
            complaintsClosed: complaints.data?.filter(c => c.status === COMPLAINT_STATUS.CLOSED).length || 0,
            expenseByCategory, paymentByMethod,
        });
    } catch (err) { next(err); }
});

module.exports = router;
