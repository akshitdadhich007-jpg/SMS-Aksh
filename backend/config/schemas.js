/**
 * Joi Validation Schemas
 * ──────────────────────
 * Centralized schemas for all route validation.
 * Prevents raw request bodies from reaching the database.
 */

const Joi = require('joi');

// ── Auth ──
const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).required(),
});

// ── Resident Management ──
const residentSchema = Joi.object({
    name: Joi.string().required(),
    flat: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9+\s-]{10,15}$/).required(),
    email: Joi.string().email().required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
});

// ── Bills ──
const billSchema = Joi.object({
    resident_id: Joi.string().uuid().required(),
    month: Joi.string().required(),
    total_amount: Joi.number().positive().required(),
    due_date: Joi.string().required(),
});

// ── Complaints ──
const complaintSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000).allow('', null),
});

const complaintStatusSchema = Joi.object({
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').required(),
});

// ── Staff ──
const staffSchema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9+\s-]{10,15}$/).allow('', null),
    salary: Joi.number().min(0).allow(null),
    shift: Joi.string().allow('', null),
    status: Joi.string().valid('active', 'inactive').allow(null),
});

// ── Committee ──
const committeeRoleSchema = Joi.object({
    position: Joi.string().required(),
});

// ── Expenses ──
const expenseSchema = Joi.object({
    category: Joi.string().required(),
    description: Joi.string().allow('', null),
    amount: Joi.number().positive().required(),
    date: Joi.string().required(),
    vendor: Joi.string().allow('', null),
});

// ── Expense Categories ──
const expenseCategorySchema = Joi.object({
    name: Joi.string().required(),
    budget: Joi.number().min(0).allow(null),
});

// ── Events ──
const eventSchema = Joi.object({
    type: Joi.string().valid('event', 'announcement').required(),
    title: Joi.string().max(200).required(),
    message: Joi.string().max(5000).required(),
    date: Joi.string().allow('', null),
    time: Joi.string().allow('', null),
    location: Joi.string().allow('', null),
});

// ── Deliveries ──
const deliverySchema = Joi.object({
    flat: Joi.string().required(),
    courier: Joi.string().allow('', null),
    date: Joi.string().required(),
    type: Joi.string().allow('', null),
});

// ── Assets ──
const assetSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    capacity: Joi.number().min(0).allow(null),
    charges: Joi.number().min(0).allow(null),
    booking_rules: Joi.string().allow('', null),
});

// ── Booking ──
const bookingSchema = Joi.object({
    asset_id: Joi.string().uuid().required(),
    date: Joi.string().required(),
    start_time: Joi.string().allow('', null),
    end_time: Joi.string().allow('', null),
    purpose: Joi.string().allow('', null),
});

// ── Emergency ──
const emergencySchema = Joi.object({
    type: Joi.string().required(),
    message: Joi.string().max(2000).required(),
});

// ── Vehicles ──
const vehicleSchema = Joi.object({
    vehicle_number: Joi.string().required(),
    vehicle_type: Joi.string().allow('', null),
    owner_name: Joi.string().allow('', null),
    flat: Joi.string().allow('', null),
});

// ── Visitor Entry ──
const visitorEntrySchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().allow('', null),
    purpose: Joi.string().allow('', null),
    flat: Joi.string().required(),
    vehicle_number: Joi.string().allow('', null),
    id_type: Joi.string().allow('', null),
    id_number: Joi.string().allow('', null),
    photo_url: Joi.string().allow('', null),
});

// ── Vehicle Entry ──
const vehicleEntrySchema = Joi.object({
    vehicle_number: Joi.string().required(),
    vehicle_type: Joi.string().allow('', null),
    driver_name: Joi.string().allow('', null),
    purpose: Joi.string().allow('', null),
    flat: Joi.string().allow('', null),
});

// ── Visitor Pre-Approval ──
const visitorPreApprovalSchema = Joi.object({
    visitorName: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    purpose: Joi.string().allow('', null),
    dateOfVisit: Joi.string().required(),
    startTime: Joi.string().allow('', null),
    endTime: Joi.string().allow('', null),
    vehicleNumber: Joi.string().allow('', null),
});

// ── Settings ──
const societySettingsSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    registration_no: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phone: Joi.string().allow('', null),
    total_flats: Joi.number().allow(null),
    blocks: Joi.alternatives().try(Joi.string(), Joi.array()).allow(null),
});

const maintenanceSettingsSchema = Joi.object({
    id: Joi.string().required(),
    monthly_amount: Joi.number().allow(null),
    due_date: Joi.number().allow(null),
    late_fee: Joi.number().allow(null),
    auto_bill_generation: Joi.boolean().allow(null),
});

const paymentSettingsSchema = Joi.object({
    id: Joi.string().required(),
    enable_online_payments: Joi.boolean().allow(null),
    upi: Joi.boolean().allow(null),
    card: Joi.boolean().allow(null),
    net_banking: Joi.boolean().allow(null),
});

const lostFoundSettingsSchema = Joi.object({
    id: Joi.string().required(),
    enable_feature: Joi.boolean().allow(null),
    require_approval: Joi.boolean().allow(null),
    enable_disputes: Joi.boolean().allow(null),
    pin_expiry: Joi.number().allow(null),
});

// ── Marketplace ──
const enquirySchema = Joi.object({
    listing_id: Joi.string().uuid().required(),
    message: Joi.string().max(2000).required(),
});

const visitSchema = Joi.object({
    listing_id: Joi.string().uuid().required(),
    date: Joi.string().required(),
    time: Joi.string().allow('', null),
});

const favoriteSchema = Joi.object({
    listing_id: Joi.string().uuid().required(),
});

const priceUpdateSchema = Joi.object({
    price: Joi.number().positive().required(),
});

const featuresUpdateSchema = Joi.object({
    features: Joi.array().items(Joi.string()).allow(null),
});

// ── Payment ──
const paymentSchema = Joi.object({
    method: Joi.string().valid('upi', 'card', 'netbanking').default('upi'),
});

// ── Traceback Claims ──
const claimStatusSchema = Joi.object({
    status: Joi.string().valid('approved', 'rejected', 'info_requested').required(),
    adminComment: Joi.string().allow('', null),
    rejectReason: Joi.string().allow('', null),
});

// ── Attendance ──
const attendanceSchema = Joi.object({
    staff_id: Joi.string().uuid().required(),
    date: Joi.string().required(),
    check_in: Joi.string().allow('', null),
    check_out: Joi.string().allow('', null),
    status: Joi.string().valid('present', 'absent', 'late', 'half_day').default('present'),
    photo_url: Joi.string().allow('', null),
});

// ── Documents ──
const documentSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().allow('', null),
    size: Joi.number().allow(null),
});

// ── Profile/Settings ──
const profileUpdateSchema = Joi.object({
    name: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    avatar_url: Joi.string().allow('', null),
});

module.exports = {
    loginSchema,
    residentSchema,
    billSchema,
    complaintSchema,
    complaintStatusSchema,
    staffSchema,
    committeeRoleSchema,
    expenseSchema,
    expenseCategorySchema,
    eventSchema,
    deliverySchema,
    assetSchema,
    bookingSchema,
    emergencySchema,
    vehicleSchema,
    visitorEntrySchema,
    vehicleEntrySchema,
    visitorPreApprovalSchema,
    societySettingsSchema,
    maintenanceSettingsSchema,
    paymentSettingsSchema,
    lostFoundSettingsSchema,
    enquirySchema,
    visitSchema,
    favoriteSchema,
    priceUpdateSchema,
    featuresUpdateSchema,
    paymentSchema,
    claimStatusSchema,
    attendanceSchema,
    documentSchema,
    profileUpdateSchema,
};
