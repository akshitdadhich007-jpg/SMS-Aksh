let counter = Date.now();

export function generateId(prefix = 'ID') {
    counter++;
    return `${prefix}${counter.toString(36).toUpperCase()}`;
}

export function formatPrice(amount) {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
}

export function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

export function isExpired(createdAt, days = 60) {
    return Date.now() - new Date(createdAt).getTime() > days * 86400000;
}

export function getStatusColor(status) {
    const map = {
        draft: '#64748b',
        pending: '#f59e0b',
        approved: '#22c55e',
        rejected: '#ef4444',
        under_visit: '#3b82f6',
        sold: '#8b5cf6',
        rented: '#06b6d4',
    };
    return map[status] || '#94a3b8';
}

export function getStatusLabel(status) {
    const map = {
        draft: 'Draft',
        pending: 'Pending Approval',
        approved: 'Active',
        rejected: 'Rejected',
        under_visit: 'Under Visit',
        sold: 'Sold',
        rented: 'Rented',
    };
    return map[status] || status;
}

export function validateListing(data) {
    const errors = {};
    if (!data.flatNumber || !data.flatNumber.trim()) errors.flatNumber = 'Flat number is required';
    if (!data.bedrooms || data.bedrooms < 1) errors.bedrooms = 'At least 1 bedroom required';
    if (!data.bathrooms || data.bathrooms < 1) errors.bathrooms = 'At least 1 bathroom required';
    if (!data.area || data.area <= 0) errors.area = 'Area must be positive';
    if (data.type === 'sale' && (!data.price || data.price <= 0)) errors.price = 'Price must be positive';
    if (data.type === 'rent') {
        if (!data.rent || data.rent <= 0) errors.rent = 'Rent must be positive';
        if (!data.deposit || data.deposit <= 0) errors.deposit = 'Deposit must be positive';
    }
    if (!data.description || data.description.trim().length < 10) errors.description = 'Description must be at least 10 characters';
    return errors;
}

export function debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

export function paginate(items, page, perPage = 10) {
    const start = (page - 1) * perPage;
    return {
        items: items.slice(start, start + perPage),
        totalPages: Math.ceil(items.length / perPage),
        total: items.length,
    };
}

export function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
