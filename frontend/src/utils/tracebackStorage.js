const DB_KEY = "tracebackDB";

const now = Date.now();
const day = 86400000;

const SEED_DATA = {
    items: [
        {
            id: 'TI001', type: 'lost', category: 'electronics', color: 'black',
            description: 'Black Samsung Galaxy S23 phone with a cracked screen protector. Has a dark blue silicone case.',
            location: 'Block A Lobby', event_date: new Date(now - 5 * day).toISOString().split('T')[0],
            contact: 'resident1@society.com', image_url: '', status: 'reported',
            reporter_id: 'resident_001', created_at: new Date(now - 5 * day).toISOString(),
        },
        {
            id: 'TI002', type: 'lost', category: 'keys', color: 'silver',
            description: 'Set of 3 silver keys on a Toyota keyring. One key has a red rubber cover.',
            location: 'Parking Level B2', event_date: new Date(now - 3 * day).toISOString().split('T')[0],
            contact: '9876543210', image_url: '', status: 'reported',
            reporter_id: 'resident_002', created_at: new Date(now - 3 * day).toISOString(),
        },
        {
            id: 'TI003', type: 'lost', category: 'accessories', color: 'brown',
            description: 'Brown leather wallet with initials "RS" embossed. Contains Axis Bank debit card.',
            location: 'Clubhouse', event_date: new Date(now - 10 * day).toISOString().split('T')[0],
            contact: 'rahul.s@email.com', image_url: '', status: 'matched',
            reporter_id: 'resident_003', created_at: new Date(now - 10 * day).toISOString(),
        },
        {
            id: 'TI004', type: 'found', category: 'electronics', color: 'black',
            description: 'Black smartphone found near Block A entrance. Samsung model, has a blue case. Screen protector is damaged.',
            location: 'Block A Main Gate', event_date: new Date(now - 4 * day).toISOString().split('T')[0],
            contact: 'security@society.com', image_url: '', status: 'reported',
            reporter_id: 'security', created_at: new Date(now - 4 * day).toISOString(),
        },
        {
            id: 'TI005', type: 'found', category: 'accessories', color: 'brown',
            description: 'Brown leather wallet found in clubhouse locker room. Has cards inside with name starting with R.',
            location: 'Clubhouse Locker Room', event_date: new Date(now - 9 * day).toISOString().split('T')[0],
            contact: 'guard2@society.com', image_url: '', status: 'matched',
            reporter_id: 'security', created_at: new Date(now - 9 * day).toISOString(),
        },
        {
            id: 'TI006', type: 'found', category: 'clothing', color: 'red',
            description: 'Red Nike hoodie, size L, left on park bench near swimming pool.',
            location: 'Park / Pool Area', event_date: new Date(now - 2 * day).toISOString().split('T')[0],
            contact: 'frontdesk@society.com', image_url: '', status: 'reported',
            reporter_id: 'security', created_at: new Date(now - 2 * day).toISOString(),
        },
        {
            id: 'TI007', type: 'lost', category: 'documents', color: '',
            description: 'Aadhaar card and PAN card in a transparent plastic sleeve. Name: Priya Mehta.',
            location: 'Community Hall', event_date: new Date(now - 70 * day).toISOString().split('T')[0],
            contact: 'priya.m@email.com', image_url: '', status: 'expired',
            reporter_id: 'resident_005', created_at: new Date(now - 70 * day).toISOString(),
        },
    ],
    matches: [
        {
            id: 'TM001', lostId: 'TI003', foundId: 'TI005', score: 78,
            status: 'matched', claim_status: null,
            created_at: new Date(now - 8 * day).toISOString(),
        },
    ],
    claims: [],
    tokens: [],
    auditLog: [
        { id: 'AL001', action: 'item_reported', itemId: 'TI001', details: 'Lost electronics reported', actor: 'resident_001', timestamp: new Date(now - 5 * day).toISOString() },
        { id: 'AL002', action: 'item_reported', itemId: 'TI004', details: 'Found electronics reported', actor: 'security', timestamp: new Date(now - 4 * day).toISOString() },
        { id: 'AL003', action: 'match_created', itemId: 'TM001', details: 'Auto-match: TI003 ↔ TI005 (78%)', actor: 'system', timestamp: new Date(now - 8 * day).toISOString() },
    ],
};

export const getDB = () => {
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) {
            const db = JSON.parse(raw);
            // Ensure all arrays exist
            if (db && db.items && db.items.length > 0) {
                db.auditLog = db.auditLog || [];
                db.tokens = db.tokens || [];
                db.claims = db.claims || [];
                db.matches = db.matches || [];
                return db;
            }
        }
    } catch { /* ignore */ }
    // Return seed data for fresh start
    return JSON.parse(JSON.stringify(SEED_DATA));
};

export const saveDB = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const logAction = (db, action, itemId, details, actor = 'current_user') => {
    if (!db.auditLog) db.auditLog = [];
    db.auditLog.unshift({
        id: 'AL' + Date.now(),
        action,
        itemId,
        details,
        actor,
        timestamp: new Date().toISOString(),
    });
};

export const getItem = (id) => {
    const db = getDB();
    return db.items.find(i => i.id === id) || null;
};

export const updateItem = (id, updates) => {
    const db = getDB();
    const idx = db.items.findIndex(i => i.id === id);
    if (idx >= 0) {
        db.items[idx] = { ...db.items[idx], ...updates };
        saveDB(db);
        return db.items[idx];
    }
    return null;
};

export const checkExpiry = (db) => {
    const now = Date.now();
    let changed = false;
    db.items.forEach(item => {
        if (['expired', 'archived', 'returned', 'collected'].includes(item.status)) return;
        const age = now - new Date(item.created_at).getTime();
        if (item.type === 'lost' && age > 60 * day && item.status === 'reported') {
            item.status = 'expired';
            logAction(db, 'item_expired', item.id, 'Lost item auto-expired after 60 days', 'system');
            changed = true;
        }
        if (item.type === 'found' && age > 90 * day && item.status === 'reported') {
            item.status = 'archived';
            logAction(db, 'item_archived', item.id, 'Found item auto-archived after 90 days', 'system');
            changed = true;
        }
    });
    if (changed) saveDB(db);
    return db;
};

export const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
