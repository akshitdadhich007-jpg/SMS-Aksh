/**
 * Admin Marketplace Routes — Connected to: AdminMarketplace.jsx
 */
const router = require('express').Router();
const { authenticateJWT, authorizeRole } = require('../../middleware/auth');
const { supabaseAdmin } = require('../../config/supabase');
const { createNotification } = require('../../services/notificationService');
const { ROLES, LISTING_STATUS, NOTIFICATION_TEMPLATES, interpolate } = require('../../config/constants');
const { success } = require('../../utils/apiResponse');

const auth = [authenticateJWT, authorizeRole(ROLES.ADMIN)];

router.get('/marketplace', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').select('*, residents(name, flat)').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/marketplace/enquiries', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('enquiries').select('*, listings(title, flat_number), residents:sender_id(name, flat)').order('created_at', { ascending: false });
        if (error) throw error;
        return success(res, data);
    } catch (err) { next(err); }
});

router.get('/marketplace/analytics', ...auth, async (req, res, next) => {
    try {
        const { data: listings } = await supabaseAdmin.from('listings').select('status, type, price, created_at');
        const { data: enquiries } = await supabaseAdmin.from('enquiries').select('created_at');
        const statusBreakdown = {};
        const typeBreakdown = {};
        listings?.forEach(l => { statusBreakdown[l.status] = (statusBreakdown[l.status] || 0) + 1; typeBreakdown[l.type] = (typeBreakdown[l.type] || 0) + 1; });
        return success(res, {
            totalListings: listings?.length || 0, totalEnquiries: enquiries?.length || 0,
            statusBreakdown, typeBreakdown,
            averagePrice: listings?.length ? listings.reduce((s, l) => s + Number(l.price || 0), 0) / listings.length : 0,
        });
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/approve', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').update({ status: LISTING_STATUS.ACTIVE, updated_at: new Date() }).eq('id', req.params.id).select('*, residents(name, flat, profile_id)').single();
        if (error) throw error;
        if (data.residents?.profile_id) {
            const tmpl = NOTIFICATION_TEMPLATES.LISTING_APPROVED;
            await createNotification(data.residents.profile_id, tmpl.title, interpolate(tmpl.body, { title: data.title }));
        }
        return success(res, data, 'Listing approved');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/reject', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').update({ status: LISTING_STATUS.REJECTED, updated_at: new Date() }).eq('id', req.params.id).select('*, residents(name, flat, profile_id)').single();
        if (error) throw error;
        if (data.residents?.profile_id) {
            const tmpl = NOTIFICATION_TEMPLATES.LISTING_REJECTED;
            await createNotification(data.residents.profile_id, tmpl.title, interpolate(tmpl.body, { title: data.title }));
        }
        return success(res, data, 'Listing rejected');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/sold', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').update({ status: LISTING_STATUS.SOLD, updated_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Listing marked as sold');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/rented', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').update({ status: LISTING_STATUS.RENTED, updated_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Listing marked as rented');
    } catch (err) { next(err); }
});

router.put('/marketplace/:id/featured', ...auth, async (req, res, next) => {
    try {
        const { data: current } = await supabaseAdmin.from('listings').select('is_featured').eq('id', req.params.id).single();
        const { data, error } = await supabaseAdmin.from('listings').update({ is_featured: !current.is_featured, updated_at: new Date() }).eq('id', req.params.id).select().single();
        if (error) throw error;
        return success(res, data, 'Featured status toggled');
    } catch (err) { next(err); }
});

router.put('/marketplace/approve-all', ...auth, async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin.from('listings').update({ status: LISTING_STATUS.ACTIVE, updated_at: new Date() }).eq('status', LISTING_STATUS.PENDING).select();
        if (error) throw error;
        return success(res, { approved: data?.length || 0 }, 'All pending listings approved');
    } catch (err) { next(err); }
});

router.delete('/marketplace/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin.from('listings').delete().eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Listing deleted');
    } catch (err) { next(err); }
});

router.delete('/marketplace/enquiry/:id', ...auth, async (req, res, next) => {
    try {
        const { error } = await supabaseAdmin.from('enquiries').delete().eq('id', req.params.id);
        if (error) throw error;
        return success(res, null, 'Enquiry deleted');
    } catch (err) { next(err); }
});

module.exports = router;
