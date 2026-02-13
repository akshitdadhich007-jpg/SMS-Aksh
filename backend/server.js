const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const { createClient } = require('@supabase/supabase-js');

// SSE Clients List
let tracebackClients = [];

function broadcastTracebackUpdate(type, data) {
    tracebackClients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    });
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true, // Allow all origins dynamically for development to fix "Not Authenticated"
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret_in_prod',
    resave: true, // Changed to true to ensure session is saved
    saveUninitialized: true, // Changed to true to ensure cookie is sent
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, 
        secure: false, // Ensure this is false for localhost
        httpOnly: true 
    }
  })
);

// Serve static public files
app.use(express.static(path.join(__dirname, 'public')));

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).json({ success: false, message: 'Not authenticated' });
}

function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Forbidden' });
}

// Login API (uses MySQL users table)
app.post('/api/login', async (req, res) => {
    // Special dev mode bypass for demo users
    if (process.env.NODE_ENV !== 'production' && req.body.isDemoLogin) {
        req.session.user = req.body.user;
        req.session.save(); // Explicitly save session
        return res.json({ success: true, role: req.session.user.role });
    }

  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const password = req.body.password || '';

    const { data: usersData, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .limit(1);

    if (userErr) throw userErr;
    if (!usersData || usersData.length === 0) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const user = usersData[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    let flatNumber = null;
    if (user.flat_id) {
      const { data: flatData } = await supabase.from('flats').select('flat_number').eq('id', user.flat_id).limit(1);
      if (flatData && flatData.length > 0) flatNumber = flatData[0].flat_number;
    }

    req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role, flat: flatNumber };
    return res.json({ success: true, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Google OAuth Login
app.post('/api/google-login', async (req, res) => {
  try {
    const { token, role } = req.body;

    if (!token) return res.status(400).json({ success: false, message: 'No token provided' });
    if (!role || !['admin', 'resident', 'security'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Decode the Google JWT token (without verification since we trust it from client)
    // In production, verify with Google's public keys
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const email = decoded.email.toLowerCase().trim();
    const googleName = decoded.name || decoded.email;

    // Check if user exists in the system
    const { data: usersData, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .limit(1);

    if (userErr) throw userErr;

    // User not found in system
    if (!usersData || usersData.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'This Google account is not registered. Please contact your admin.'
      });
    }

    const user = usersData[0];

    // Get flat number if user is resident
    let flatNumber = null;
    if (user.flat_id) {
      const { data: flatData } = await supabase
        .from('flats')
        .select('flat_number')
        .eq('id', user.flat_id)
        .limit(1);
      if (flatData && flatData.length > 0) flatNumber = flatData[0].flat_number;
    }

    // Create session with the selected role (respecting user's actual role from DB)
    // Important: We assign the role from database, not from the user's selection
    // The role selection is just for UI convenience, but actual role is from database
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name || googleName,
      role: user.role, // Use the role from database, not client-selected role
      flat: flatNumber,
      authMethod: 'google'
    };

    return res.json({
      success: true,
      role: user.role,
      user: req.session.user
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(500).json({ success: false, message: 'Server error during Google authentication' });
  }
});
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Admin APIs
app.get('/api/admin/flats', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { data: rows, error } = await supabase.from('flats').select('id, flat_number, block_name, floor_number').order('flat_number', { ascending: true });
    if (error) throw error;
    res.json({ success: true, flats: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/residents', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { data: residents, error } = await supabase.from('users').select('id, name, email, flat_id, is_active, created_at').eq('role', 'resident').order('created_at', { ascending: false });
    if (error) throw error;
    // fetch flats map
    const { data: flats } = await supabase.from('flats').select('id, flat_number');
    const flatMap = {};
    if (flats) flats.forEach(f => { flatMap[f.id] = f.flat_number; });
    const residentsWithFlat = residents.map(r => ({ ...r, flat_number: flatMap[r.flat_id] || null }));
    res.json({ success: true, residents: residentsWithFlat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/add-flat', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { flat_number, block_name, floor_number, owner_name } = req.body;
    if (!flat_number) return res.status(400).json({ success: false, message: 'Flat number required' });
    const { error } = await supabase.from('flats').insert([{ flat_number, block_name: block_name || null, floor_number: floor_number || null, owner_name: owner_name || null }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/add-resident', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { name, email, flat_id, password } = req.body;
    if (!name || !email || !flat_id || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
    const { data: exists, error: existsErr } = await supabase.from('users').select('id').eq('email', email.toLowerCase().trim()).limit(1);
    if (existsErr) throw existsErr;
    if (exists && exists.length > 0) return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const { error } = await supabase.from('users').insert([{ name, email: email.toLowerCase().trim(), password: hashed, flat_id, role: 'resident', is_active: true }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/stats', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { count: residentsCount, error: residentsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'resident');

    if (residentsError) throw residentsError;

    const { count: flatsCount, error: flatsError } = await supabase
      .from('flats')
      .select('*', { count: 'exact', head: true });

    if (flatsError) throw flatsError;

    res.json({
      success: true,
      stats: {
        totalResidents: residentsCount,
        totalFlats: flatsCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Resident APIs
app.get('/api/resident/charges', requireLogin, async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'resident') return res.status(403).json({ success: false, message: 'Forbidden' });
    const flatNumber = req.session.user.flat;
    const { data: flatRows } = await supabase.from('flats').select('id').eq('flat_number', flatNumber).limit(1);
    if (!flatRows || flatRows.length === 0) return res.json({ success: true, charges: [] });
    const flatId = flatRows[0].id;
    const { data: charges } = await supabase.from('maintenance_charges').select('month, year, amount, due_date, status, payment_date').eq('flat_id', flatId).order('year', { ascending: false }).order('month', { ascending: false });
    res.json({ success: true, charges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/resident/notices', requireLogin, async (req, res) => {
  try {
    const [notices] = await db.query('SELECT id, title, content, created_at FROM notices WHERE is_published = 1 ORDER BY created_at DESC LIMIT 10');
    res.json({ success: true, notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


const fs = require('fs');
const DB_FILE = path.join(__dirname, 'database.json');

// Helper to read/write local DB
const getLocalDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        return { 
            traceback_items: [], 
            traceback_matches: [], 
            traceback_claims: [],
            traceback_tokens: [],
            traceback_handover_logs: [],
            traceback_audit_logs: []
        };
    }
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    // Ensure new collections exist
    if (!db.traceback_items) db.traceback_items = [];
    if (!db.traceback_matches) db.traceback_matches = [];
    if (!db.traceback_claims) db.traceback_claims = [];
    if (!db.traceback_tokens) db.traceback_tokens = [];
    if (!db.traceback_handover_logs) db.traceback_handover_logs = [];
    if (!db.traceback_audit_logs) db.traceback_audit_logs = [];
    return db;
};

// --- AUDIT LOGGING ---
const logTracebackAction = (db, user, action, itemId, meta = {}) => {
    const log = {
        id: crypto.randomUUID(),
        user_id: user.id || 'system',
        user_email: user.email || 'system',
        role: user.role || 'system',
        timestamp: new Date().toISOString(),
        action,
        item_id: itemId,
        meta // Any extra details (match_id, token_id, etc.)
    };
    db.traceback_audit_logs.push(log);
    // Don't save here to avoid I/O blocking if multiple updates happen, caller must save.
    // However, for safety in this simple file-db, we might want to return the log object and let caller save.
    // Or just push to reference. Caller calls saveLocalDB(db) anyway.
    return log;
};
const saveLocalDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 4));
};

// --- FSM STATE LOGIC ---
const VALID_STATES = {
    lost: ['reported', 'matched', 'claimed', 'approved', 'collected', 'expired', 'closed', 'archived'],
    found: ['reported', 'matched', 'claim_pending', 'approved', 'handed_over', 'archived', 'unclaimed_archive']
};

const validateTransition = (currentState, newState, type) => {
    // If no current state (new item), allow 'reported'
    if (!currentState && newState === 'reported') return true;

    const rules = {
        lost: {
            'reported': ['matched', 'expired', 'closed', 'archived'],
            'matched': ['claimed', 'expired', 'closed', 'archived'],
            'claimed': ['approved', 'matched', 'closed', 'archived'], // matched if claim rejected
            'approved': ['collected', 'closed', 'archived'],
            'collected': ['closed'],
            'expired': ['closed', 'archived'],
            'closed': [],
            'archived': []
        },
        found: {
            'reported': ['matched', 'archived', 'unclaimed_archive'],
            'matched': ['claim_pending', 'archived', 'unclaimed_archive'],
            'claim_pending': ['approved', 'matched', 'archived', 'unclaimed_archive'],
            'approved': ['handed_over', 'archived', 'unclaimed_archive'],
            'handed_over': ['archived'],
            'archived': [],
            'unclaimed_archive': []
        }
    };
    
    // Normalize mapping for migration (map 'open' to 'reported')
    const normalizedCurrent = (currentState === 'open') ? 'reported' : currentState;
    
    // Allow staying in same state (idempotency)
    if (normalizedCurrent === newState) return true;

    const validNext = rules[type][normalizedCurrent];
    if (!validNext) return false; // Invalid current state
    return validNext.includes(newState);
};

// --- Expiration Logic ---
function runExpirationJob() {
    console.log('[CRON] Running Expiration Job...');
    const db = getLocalDB();
    const now = new Date();
    let changes = 0;

    // 1. Archive Old Lost Reports ( > 60 days )
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
    db.traceback_items.forEach(item => {
        if (item.type === 'lost' && ['reported', 'matched'].includes(item.status)) {
            if (new Date(item.created_at) < sixtyDaysAgo) {
                console.log(`[CRON] Archiving lost item: ${item.id}`);
                item.status = 'archived';
                changes++;
            }
        }
    });

    // 2. Archive Unclaimed Found Items ( > 30 days )
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    db.traceback_items.forEach(item => {
        if (item.type === 'found' && ['reported', 'matched'].includes(item.status)) {
            if (new Date(item.created_at) < thirtyDaysAgo) {
                console.log(`[CRON] Archiving unclaimed found item: ${item.id}`);
                item.status = 'unclaimed_archive';
                changes++;
            }
        }
    });

    // 3. Expire Uncollected Approvals ( > 48 hours )
    const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
    
    // Find approved claims where corresponding token is old
    db.traceback_claims.forEach(claim => {
        if (claim.status === 'approved') {
            // Find creation time of the token for this claim
            const token = db.traceback_tokens.find(t => t.claim_id === claim.id);
            // Fallback to claim update time if implicit
            const claimTime = token ? new Date(token.created_at) : new Date(claim.created_at); // simplistic fallback

            if (claimTime < fortyEightHoursAgo) {
                 console.log(`[CRON] Expiring uncollected claim: ${claim.id}`);
                 claim.status = 'expired_approval';
                 changes++;

                 // Revert Found Item
                 const foundItem = db.traceback_items.find(i => i.id === claim.item_id);
                 if (foundItem) {
                     foundItem.status = 'reported';
                     foundItem.match_id = null; // Unlink
                 }

                 // Revert Lost Item (via Match)
                 const match = db.traceback_matches.find(m => m.found_item_id === claim.item_id); // Finding match logic
                 // If we had match_id stored on items (new model), we could use that.
                 // For now, search matches.
                 if (match) {
                     const lostItem = db.traceback_items.find(l => l.id === match.lost_item_id);
                     if (lostItem) {
                         lostItem.status = 'reported';
                         lostItem.match_id = null; // Unlink
                     }
                 }
            }
        }
    });

    if (changes > 0) {
        saveLocalDB(db);
        console.log(`[CRON] Expiration Job Complete. ${changes} updates saved.`);
    } else {
        console.log('[CRON] No expirations found.');
    }
}

// Run Daily (and on startup for demo)
setInterval(runExpirationJob, 24 * 60 * 60 * 1000); 
setTimeout(runExpirationJob, 5000); // Run once shortly after startup

// --- Traceback / Lost & Found APIs (Local File Based) ---

// SSE Events Endpoint for Real-time Updates
app.get('/api/traceback/events', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': 'http://localhost:5173', // Adjust for frontend
        'Access-Control-Allow-Credentials': 'true'
    };
    res.writeHead(200, headers);

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    tracebackClients.push(newClient);

    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    req.on('close', () => {
        tracebackClients = tracebackClients.filter(c => c.id !== clientId);
    });
});

// 1. Report Item (Lost or Found)
app.post('/api/traceback/items', requireLogin, async (req, res) => {
    try {
        const { type, category, description, location, event_date, image_url } = req.body;
        
        if (!validateTransition(null, 'reported', type)) {
             return res.status(400).json({ success: false, message: 'Invalid initial state' });
        }

        const db = getLocalDB();
        const newItem = {
            id: crypto.randomUUID(),
            type,
            category,
            description,
            location,
            event_date,
            reporter_id: req.session.user.id,
            status: 'reported', // Initial State
            image_url,
            created_at: new Date().toISOString()
        };

        db.traceback_items.push(newItem);
        
        // Audit Log: Report Created
        logTracebackAction(db, req.session.user, 'report_created', newItem.id, { type: newItem.type, category: newItem.category });

        // MATCHING LOGIC
        const oppositeType = type === 'lost' ? 'found' : 'lost';
        
        // Find candidates that are 'reported' or 'matched' (still available)
        const candidates = db.traceback_items.filter(i => 
            i.type === oppositeType && 
            i.category === category && 
            (i.status === 'reported' || i.status === 'matched') // Look for available items
        );

        const matchesToInsert = [];
        if (candidates.length > 0) {
            // --- UPDATED MATCHING ENGINE ---
            const STOP_WORDS = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'it', 'my', 'mine', 'was', 'were', 'lost', 'found', 'item', 'please']);
            
            const normalize = (text) => {
                if (!text) return [];
                return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => !STOP_WORDS.has(w) && w.length > 2);
            };

            const getSynonyms = (word) => {
                const map = {
                    'phone': ['smartphone', 'iphone', 'android', 'mobile', 'cell', 'device'],
                    'laptop': ['computer', 'notebook', 'macbook', 'pc', 'machine'],
                    'bag': ['backpack', 'tote', 'handbag', 'suitcase', 'purse', 'luggage'],
                    'wallet': ['billfold', 'cardholder', 'purse'],
                    'keys': ['keychain', 'fob', 'remote'],
                    'glasses': ['spectacles', 'sunglasses', 'shades', 'eyewear'],
                    'watch': ['timepiece', 'smartwatch', 'clock', 'band']
                };
                for (const [key, vals] of Object.entries(map)) {
                    if (key === word) return vals;
                    if (vals.includes(word)) return [key, ...vals.filter(v => v !== word)];
                }
                return [];
            };

            const calculateDayDiff = (d1, d2) => {
                const date1 = new Date(d1);
                const date2 = new Date(d2);
                if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return 100; 
                return Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
            };

            const newWords = normalize(description);
            
            for (const candidate of candidates) {
                // 1. Keyword Score (Max 50)
                const candWords = normalize(candidate.description);
                let matchCount = 0;
                
                newWords.forEach(w1 => {
                    if (candWords.includes(w1)) {
                        matchCount += 1.0;
                    } else {
                        const syns = getSynonyms(w1);
                        if (syns.some(s => candWords.includes(s))) {
                            matchCount += 0.8;
                        }
                    }
                });
                
                const maxLen = Math.max(newWords.length, candWords.length, 1);
                const keywordScore = Math.min((matchCount / maxLen) * 100, 100);
                const weightedKeyword = keywordScore * 0.50; 

                // 2. Category Score (Max 30) - Baseline for passing filter
                const weightedCategory = 30; 

                // 3. Location Proximity (Max 10)
                let locationScore = 0;
                if (location && candidate.location) {
                    const loc1 = location.toLowerCase();
                    const loc2 = candidate.location.toLowerCase();
                    if (loc1 === loc2 || loc1.includes(loc2) || loc2.includes(loc1)) {
                        locationScore = 100;
                    }
                }
                const weightedLocation = locationScore * 0.10;

                // 4. Time Proximity (Max 10)
                const eventDate1 = event_date || newItem.created_at;
                const eventDate2 = candidate.event_date || candidate.created_at;
                const daysDiff = calculateDayDiff(eventDate1, eventDate2);
                const timeScore = Math.max(0, 100 - (daysDiff * 7)); 
                const weightedTime = timeScore * 0.10; 

                // Total Calculation
                let totalScore = weightedKeyword + weightedCategory + weightedLocation + weightedTime;

                // 5. Penalty for Staleness
                const candidateAgeDays = calculateDayDiff(new Date(), candidate.created_at);
                if (candidateAgeDays > 30) totalScore -= 10; 

                totalScore = Math.min(Math.max(totalScore, 0), 100); 

                if (totalScore >= 40) {
                    const match = {
                        id: crypto.randomUUID(),
                        lost_item_id: type === 'lost' ? newItem.id : candidate.id,
                        found_item_id: type === 'found' ? newItem.id : candidate.id,
                        match_score: Math.round(totalScore),
                        ai_reason: `Score: ${Math.round(totalScore)} (Kw:${Math.round(weightedKeyword)} Loc:${Math.round(weightedLocation)} Time:${Math.round(weightedTime)})`,
                        status: 'potential',
                        created_at: new Date().toISOString()
                    };
                    db.traceback_matches.push(match);
                    matchesToInsert.push(match);

                    // UPDATE STATES & LINK MATCH ID
                    if (validateTransition(newItem.status, 'matched', newItem.type)) {
                         newItem.status = 'matched';
                         newItem.match_id = match.id;
                    }
                    if (validateTransition(candidate.status, 'matched', candidate.type)) {
                         candidate.status = 'matched';
                         candidate.match_id = match.id;
                    }
                    
                    // Audit Log: Match Generated
                    logTracebackAction(db, { id: 'system', role: 'system' }, 'match_generated', newItem.id, { 
                        match_id: match.id, 
                        score: match.match_score, 
                        linked_item: candidate.id 
                    });
                }
            }
        }

        saveLocalDB(db);
        
        broadcastTracebackUpdate('new_item', { item: newItem });

        res.json({ success: true, item: newItem, matches: matchesToInsert, message: 'Item reported and saved locally.' });

    } catch (err) {
        console.error('Traceback report error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Get Matches for User and My Reports
app.get('/api/traceback/matches', requireLogin, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const userRole = req.session.user.role;
        const db = getLocalDB();

        // Standard User Data (Everyone gets their own)
        const myLostItems = db.traceback_items.filter(i => i.reporter_id === userId && i.type === 'lost');
        const myFoundItems = db.traceback_items.filter(i => i.reporter_id === userId && i.type === 'found');

        // Admin/Security Data (They get everything)
        let allLostReports = [];
        let allFoundReports = [];
        if (userRole === 'admin' || userRole === 'security') {
            allLostReports = db.traceback_items.filter(i => i.type === 'lost');
            allFoundReports = db.traceback_items.filter(i => i.type === 'found');
        }

        // Find matches specifically for MY LOST items (where I am the claimant)
        const myLostItemIds = new Set(myLostItems.map(i => i.id));
        const matchesForMyLost = db.traceback_matches.filter(m => myLostItemIds.has(m.lost_item_id));

        const formattedMatches = matchesForMyLost.map(m => {
            const foundItem = db.traceback_items.find(i => i.id === m.found_item_id) || {};
            const lostItem = db.traceback_items.find(i => i.id === m.lost_item_id) || {};
            
            // Should check if already claimed
            const existingClaim = db.traceback_claims.find(c => c.item_id === m.found_item_id && c.claimant_id === userId);

            return {
                ...m,
                found_item: foundItem,
                lost_item: lostItem,
                claim_status: existingClaim ? existingClaim.status : null,
                claim_token: existingClaim ? existingClaim.verification_token : null
            };
        });

        // Find claims made on MY FOUND items (Or ALL found items if admin)
        let itemsIManage = [];
        if (userRole === 'admin' || userRole === 'security') {
            itemsIManage = db.traceback_items.filter(i => i.type === 'found');
        } else {
            itemsIManage = db.traceback_items.filter(i => i.reporter_id === userId && i.type === 'found'); // Residents only manage what they found
        }
        
        const itemsIManageIds = new Set(itemsIManage.map(i => i.id));
        const incomingClaims = db.traceback_claims.filter(c => itemsIManageIds.has(c.item_id));

        // Attach item details to incoming claims
        const claimsWithDetails = incomingClaims.map(c => {
             const item = db.traceback_items.find(i => i.id === c.item_id);
             return { ...c, item_details: item, claimant_name: getClaimantName(c.claimant_id, db) }; // Helper to get name
        });
        
        // Helper function for claimant name mock (or fetch from users table if real DB)
        // For local file DB we might not have names, but we can try to find them if stored, else 'Resident'
        // In this simple file version, we won't have the user table joined. 
        // We'll rely on the frontend or existing session info if possible, but for now 'Resident' is safe default.

        res.json({ 
            success: true, 
            matches: formattedMatches, 
            my_lost_items: myLostItems, 
            my_found_items: myFoundItems,
            
            // Admin Extras
            is_admin: (userRole === 'admin' || userRole === 'security'),
            all_lost_reports: allLostReports,
            all_found_reports: allFoundReports,

            incoming_claims: claimsWithDetails 
        });

    } catch (err) {
        console.error('Match fetch error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

function getClaimantName(id, db) {
    // Basic lookup or placeholder
    return "Resident"; 
}

// Helper: Calculate text similarity (Jaccard Index)
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    const words1 = new Set(str1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(str2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    
    if (words1.size === 0 || words2.size === 0) return 0;
    
    let intersection = 0;
    words1.forEach(w => { if (words2.has(w)) intersection++; });
    
    const union = new Set([...words1, ...words2]).size;
    return Math.round((intersection / union) * 100);
}

// 3. Submit Claim Request (Claimant answers security questions)
app.post('/api/traceback/claim', requireLogin, async (req, res) => {
    try {
        const { item_id, security_answers } = req.body;
        const db = getLocalDB();
        const userId = req.session.user.id;

        // 1. Found Item Integrity
        const foundItem = db.traceback_items.find(i => i.id === item_id);
        if (!foundItem) return res.status(404).json({message: 'Item not found'});
        
        // Prevent claiming own item
        if (foundItem.reporter_id === userId) {
            return res.status(400).json({ success: false, message: 'You cannot claim an item you reported as found.' });
        }

        // 2. Rate Limiting (Max 5 claims per 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentClaims = db.traceback_claims.filter(c => 
            c.claimant_id === userId && new Date(c.created_at) > oneDayAgo
        );
        if (recentClaims.length >= 5) {
            return res.status(429).json({ success: false, message: 'Daily claim limit reached. Please try again tomorrow.' });
        }

        // 3. Validate State
        if (!validateTransition(foundItem.status, 'claim_pending', 'found')) {
             return res.status(400).json({ success: false, message: `Cannot claim item in state '${foundItem.status}'` });
        }

        // 4. Duplicate Claim Check
        const existing = db.traceback_claims.find(c => c.item_id === item_id && c.claimant_id === userId);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Claim already submitted.' });
        }

        // 5. Confidence Scoring
        let confidenceScore = 0;
        let lostItem = null;
        let scoringDetails = [];

        // Attempt to find linked Lost Item for validation
        // a) Check existing matches
        const existingMatch = db.traceback_matches.find(m => {
            if (m.found_item_id !== item_id) return false;
            const lItem = db.traceback_items.find(l => l.id === m.lost_item_id);
            return lItem && lItem.reporter_id === userId;
        });

        if (existingMatch) {
            lostItem = db.traceback_items.find(l => l.id === existingMatch.lost_item_id);
            confidenceScore += 50; // Base score for existing system match
            scoringDetails.push("System linked match found (+50)");
        } else {
            // b) Search user's lost items for best candidate
            const userLostItems = db.traceback_items.filter(i => 
                i.reporter_id === userId && i.type === 'lost' && i.status !== 'closed'
            );
            // Simple heuristic to pick best candidate
            lostItem = userLostItems.find(l => l.category === foundItem.category);
        }

        if (lostItem) {
            // Category Match
            if (lostItem.category === foundItem.category) {
                confidenceScore += 20;
                scoringDetails.push("Category match (+20)");
            }

            // Keyword Similarity
            const textScore = calculateSimilarity(lostItem.description, foundItem.description);
            if (textScore > 20) {
                confidenceScore += 15;
                scoringDetails.push(`Description similarity ${textScore}% (+15)`);
            }

            // Location Similarity
            const locScore = calculateSimilarity(lostItem.location, foundItem.location);
            if (locScore > 30) {
               confidenceScore += 10;
               scoringDetails.push("Location similarity (+10)");
            }
            
            // Date Logic (Found date should be after Lost date)
            const dLost = new Date(lostItem.event_date);
            const dFound = new Date(foundItem.event_date);
            if (!isNaN(dLost) && !isNaN(dFound)) {
                const diffTime = dFound - dLost;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                if (diffDays >= 0 && diffDays < 14) {
                    confidenceScore += 5;
                    scoringDetails.push("Date consistency (+5)");
                }
            }
        } else {
            scoringDetails.push("No linked Lost Item report found. Low confidence.");
        }

        // Cap score
        if (confidenceScore > 100) confidenceScore = 100;

        // Determine Status based on Confidence
        // Threshold: 40 (Arbitrary for demo)
        const isLowConfidence = confidenceScore < 40;
        const claimStatus = isLowConfidence ? 'flagged_for_review' : 'pending_approval';

        const newClaim = {
            id: crypto.randomUUID(),
            item_id, // Found Item ID
            claimant_id: userId,
            claimant_name: req.session.user.name || req.session.user.email,
            security_answers,
            status: claimStatus,
            confidence_score: confidenceScore,
            confidence_details: scoringDetails,
            is_flagged: isLowConfidence,
            verification_token: null,
            created_at: new Date().toISOString()
        };

        db.traceback_claims.push(newClaim);
        
        // Audit Log: Claim Submitted
        logTracebackAction(db, req.session.user, 'claim_submitted', item_id, { 
            claim_id: newClaim.id, 
            confidence: confidenceScore,
            status: claimStatus 
        });

        // Update Item State
        foundItem.status = 'claim_pending';
        
        // Update Lost Item State if exists
        if (lostItem && validateTransition(lostItem.status, 'claimed', 'lost')) {
            lostItem.status = 'claimed';
        }

        saveLocalDB(db);

        broadcastTracebackUpdate('claim_update', { claim: newClaim, item_id });

        if (isLowConfidence) {
            res.json({ success: true, message: 'Claim submitted but flagged for review due to low confidence match.' });
        } else {
            res.json({ success: true, message: 'Claim submitted successfully. Waiting for finder approval.' });
        }

    } catch (err) {
        console.error('Claim error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3.5 Get My Found Items & Claims on them (For the Finder)
app.get('/api/traceback/my-found-items', requireLogin, async (req, res) => {
    try {
        const db = getLocalDB();
        const myFoundItems = db.traceback_items.filter(i => i.reporter_id === req.session.user.id && i.type === 'found');
        
        // Attach active claims to these items
        const results = myFoundItems.map(item => {
            const claims = db.traceback_claims.filter(c => c.item_id === item.id && c.status === 'pending_approval');
            return { ...item, pending_claims: claims };
        });

        res.json({ success: true, items: results });
    } catch (err) {
        console.error('Error fetching found items:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3.6 Approve Claim (Finder approves matches)
app.post('/api/traceback/approve-claim', requireLogin, async (req, res) => {
    try {
        const { claim_id } = req.body;
        const db = getLocalDB();
        
        const claimIndex = db.traceback_claims.findIndex(c => c.id === claim_id);
        if (claimIndex === -1) return res.status(404).json({ success: false, message: 'Claim not found' });

        const claim = db.traceback_claims[claimIndex];
        const foundItem = db.traceback_items.find(i => i.id === claim.item_id);

        // 1. Validate Transition
        if (!foundItem || !validateTransition(foundItem.status, 'approved', 'found')) {
            return res.status(400).json({ success: false, message: `Invalid transition to 'approved' from '${foundItem?.status}'` });
        }

        // Generate Secure Token
        const token = crypto.randomUUID(); // Secure UUID v4
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 15); // Strict 15-minute expiry

        // Update Claim Record
        db.traceback_claims[claimIndex].status = 'approved';
        
        // Remove old embedded fields if they exist
        delete db.traceback_claims[claimIndex].verification_token;
        delete db.traceback_claims[claimIndex].token_expiry;
        delete db.traceback_claims[claimIndex].token_used;

        // Create Normalized Token Record
        db.traceback_tokens.push({
            id: token,
            claim_id: claim.id,
            expiry: expiry.toISOString(),
            used: false,
            created_at: new Date().toISOString()
        });

        // Update Found Item Status
        foundItem.status = 'approved';

        // Update Lost Item Status (if linked)
        // We find the lost item by looking at who made the claim
        // This is a bit tricky if multiple lost items match, but generally one user has one lost report per item
        // Ideally we store lost_item_id in the claim, but for now we look up via matches
        const matches = db.traceback_matches.filter(m => m.found_item_id === foundItem.id);
        // Find the match that belongs to the claimant
        // Actually, we need to find the lost item owned by claimant that matched this found item
        const displayMatch = matches.find(m => {
            const lItem = db.traceback_items.find(l => l.id === m.lost_item_id);
            return lItem && lItem.reporter_id === claim.claimant_id;
        });

        if (displayMatch) {
            const lostItem = db.traceback_items.find(i => i.id === displayMatch.lost_item_id);
            if (lostItem && validateTransition(lostItem.status, 'approved', 'lost')) {
                lostItem.status = 'approved';
                // Lock items (already implicit by status 'approved' but ensure match_id is firm)
                if (!lostItem.match_id) lostItem.match_id = displayMatch.id;
            }
        }
        
        // Ensure found item has match_id
        const matchedId = matches.find(m => m.lost_item_id)?.id;
        if (!foundItem.match_id && matchedId) foundItem.match_id = matchedId;

        // Audit Log: Claim Approved & Token Generated
        logTracebackAction(db, req.session.user, 'claim_approved', foundItem.id, { claim_id: claim.id });
        logTracebackAction(db, { id: 'system', role: 'system'}, 'token_generated', foundItem.id, { token_id: token, expiry: expiry.toISOString() });

        saveLocalDB(db);

        broadcastTracebackUpdate('claim_approved', { claim_id, found_item_id: foundItem.id });

        res.json({ success: true, message: 'Claim approved. Token generated.', token });
    } catch (err) {
        console.error('Approval error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3.7 Reject Claim (Finder rejects match)
app.post('/api/traceback/reject-claim', requireLogin, async (req, res) => {
    try {
        const { claim_id } = req.body;
        const db = getLocalDB();

        const claimIndex = db.traceback_claims.findIndex(c => c.id === claim_id);
        if (claimIndex === -1) return res.status(404).json({ success: false, message: 'Claim not found' });

        const claim = db.traceback_claims[claimIndex];
        
        // 1. Update Claim Status
        db.traceback_claims[claimIndex].status = 'rejected';

        // 2. Dissolve Match / Unlock Items
        const foundItem = db.traceback_items.find(i => i.id === claim.item_id);
        
        // Get the Match record
        // We need to find the match that links this found item to the claimant's lost item
        // But the claim tracks the FOUND item directly.
        // We look for any match involving this found item and a lost item owned by claimant
        const match = db.traceback_matches.find(m => 
            m.found_item_id === claim.item_id && 
            db.traceback_items.find(l => l.id === m.lost_item_id && l.reporter_id === claim.claimant_id)
        );

        if (match) {
            // Remove match_id association from both items
            if (foundItem) {
                foundItem.match_id = null;
                // Revert status to 'reported' if it was 'claim_pending' or 'matched'
                if (['claim_pending', 'matched'].includes(foundItem.status)) {
                    foundItem.status = 'reported';
                }
            }

            const lostItem = db.traceback_items.find(i => i.id === match.lost_item_id);
            if (lostItem) {
                lostItem.match_id = null;
                if (['claimed', 'matched'].includes(lostItem.status)) {
                    lostItem.status = 'reported';
                }
            }
        } else {
            // Fallback: If no explicit match record found (direct claim without system match), still reset found item
             if (foundItem) {
                foundItem.status = 'reported';
            }
        }

        saveLocalDB(db);

        broadcastTracebackUpdate('claim_rejected', { claim_id, item_id: claim.item_id });

        res.json({ success: true, message: 'Claim rejected. Items returned to pool.' });

    } catch (err) {
        console.error('Rejection error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 4. Verify QR Token
app.post('/api/traceback/verify-qr', requireLogin, async (req, res) => {
    try {
        const { token } = req.body;
        console.log(`[VERIFY] Verifying token: ${token}`);
        const db = getLocalDB();

        // 1. Find Token Record (Normalized Lookup)
        const tokenRecord = db.traceback_tokens.find(t => t.id === token);
        if (!tokenRecord) {
            // Fallback for legacy (embedded) tokens during migration
            const legacyClaim = db.traceback_claims.find(c => c.verification_token === token);
            if (legacyClaim) {
                 // Migrate on the fly if needed, or fail. Let's just fail or use legacy logic if critical. 
                 // For now, strict new system:
                 return res.status(404).json({ success: false, message: 'Invalid or missing token record' });
            }
            return res.status(404).json({ success: false, message: 'Invalid or missing token record' });
        }

        // 2. Find Linked Claim
        const claimIndex = db.traceback_claims.findIndex(c => c.id === tokenRecord.claim_id);
        if (claimIndex === -1) return res.status(404).json({ success: false, message: 'Orphaned token (Claim not found)' });
        const claim = db.traceback_claims[claimIndex];

        // --- SECURITY VALIDATION ---
        
        // 2.1 Check Token Expiry
        const now = new Date();
        const expiry = new Date(tokenRecord.expiry);
        if (now > expiry) {
            return res.status(400).json({ success: false, message: 'Token has expired. Please request a new one.' });
        }

        // 2.2 Check Token Usage (Replay Protection)
        if (tokenRecord.used === true) {
            return res.status(400).json({ success: false, message: 'Token has already been used.' });
        }

        // 2.3 Check Claim State (Must be 'approved')
        if (claim.status !== 'approved') {
            return res.status(400).json({ success: false, message: `Invalid claim state: ${claim.status}. Claim must be approved.` });
        }

        // 2.4 Check Item State (Must be 'approved')
        const foundItemIndex = db.traceback_items.findIndex(i => i.id === claim.item_id);
        if (foundItemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found' });
        
        const foundItem = db.traceback_items[foundItemIndex];
        if (foundItem.status !== 'approved') {
             return res.status(400).json({ success: false, message: `Invalid item state: ${foundItem.status}. Item must be waiting for pickup (approved).` });
        }

        // --- END SECURITY VALIDATION ---

        // Update statuses
        db.traceback_claims[claimIndex].status = 'verified'; 
        
        // Update Token Status
        const tokenIndex = db.traceback_tokens.findIndex(t => t.id === token);
        if (tokenIndex !== -1) db.traceback_tokens[tokenIndex].used = true;
        
        if (foundItemIndex !== -1) {
            db.traceback_items[foundItemIndex].status = 'handed_over';
            db.traceback_items[foundItemIndex].handed_over_at = new Date().toISOString();
            db.traceback_items[foundItemIndex].handed_over_by = req.session.user.name;
        }

        // Audit Log: Token Used / Item Collected
        logTracebackAction(db, req.session.user, 'token_used', foundItem ? foundItem.id : 'unknown', { token_id: token, claim_id: claim.id });
        logTracebackAction(db, req.session.user, 'item_collected', foundItem ? foundItem.id : 'unknown', { handed_over_to: claim.claimant_name });

        // Update Lost Item -> Collected
        const matches = db.traceback_matches.filter(m => m.found_item_id === foundItem.id);
        const displayMatch = matches.find(m => {
             const lItem = db.traceback_items.find(l => l.id === m.lost_item_id);
             return lItem && lItem.reporter_id === claim.claimant_id;
        });
        if (displayMatch) {
             const lostItem = db.traceback_items.find(i => i.id === displayMatch.lost_item_id);
             if (lostItem && validateTransition(lostItem.status, 'collected', 'lost')) {
                 lostItem.status = 'collected';
             }
        }

        db.traceback_handover_logs.push({
            id: crypto.randomUUID(),
            claim_id: claim.id,
            verifier_id: req.session.user.id,
            verif_timestamp: new Date().toISOString()
        });

        saveLocalDB(db);
        
        const item = foundItemIndex !== -1 ? db.traceback_items[foundItemIndex] : {};
        
        broadcastTracebackUpdate('item_handover', { item_id: item.id, item });

        res.json({ success: true, message: 'Verification Successful. Item Handed Over.', item });

    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/* 
// 5. Audit Logs (Admin Only)
app.get('/api/traceback/audit-logs', requireLogin, async (req, res) => {
    try {
        if (!['admin', 'security'].includes(req.session.user.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const db = getLocalDB();
        // Return most recent 100 logs
        const logs = db.traceback_audit_logs.slice(-100).reverse();
        res.json({ success: true, logs });
    } catch (err) {
        console.error('Audit Log error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- Traceback / Lost & Found APIs (Supabase - ORIGINAL) ---

// 1. Report Item (Lost or Found)
app.post('/api/traceback/items', requireLogin, async (req, res) => {
    try {
        const { type, category, description, location, event_date, image_url } = req.body;
        if (!['lost', 'found'].includes(type) || !category || !description) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Insert Item
        const { data: itemData, error: insertError } = await supabase
            .from('traceback_items')
            .insert([{
                type,
                category,
                description,
                location,
                event_date,
                reporter_id: req.session.user.id,
                status: 'open',
                image_url
            }])
            .select();

        if (insertError) throw insertError;
        const newItem = itemData[0];

        // Trigger Matching Logic
        // Find opposite items with same category
        const oppositeType = type === 'lost' ? 'found' : 'lost';
        const { data: candidates } = await supabase
            .from('traceback_items')
            .select('*')
            .eq('type', oppositeType)
            .eq('category', category)
            .eq('status', 'open');

        if (candidates && candidates.length > 0) {
            const matchesToInsert = [];
            const newDescWords = new Set(description.toLowerCase().split(/\s+/));

            for (const candidate of candidates) {
                // Simple keyword matching score
                const candDescWords = candidate.description.toLowerCase().split(/\s+/);
                let matchCount = 0;
                candDescWords.forEach(w => {
                    if (newDescWords.has(w) && w.length > 3) matchCount++;
                });
                
                // Calculate simple similarity score (0-100)
                // Base score 40 for category match + points for keywords
                let score = 40 + (matchCount * 15);
                if (score > 100) score = 100;

                if (score >= 50) {
                    matchesToInsert.push({
                        lost_item_id: type === 'lost' ? newItem.id : candidate.id,
                        found_item_id: type === 'found' ? newItem.id : candidate.id,
                        match_score: score,
                        ai_reason: `Category match (${category}) with ${matchCount} keyword overlaps in description.`,
                        status: 'potential'
                    });
                }
            }

            if (matchesToInsert.length > 0) {
                await supabase.from('traceback_matches').insert(matchesToInsert);
            }
        }

        res.json({ success: true, item: newItem, message: 'Item reported and matching processed.' });

    } catch (err) {
        console.error('Traceback report error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Get Matches for User
app.get('/api/traceback/matches', requireLogin, async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // Find items reported by this user
        const { data: myItems } = await supabase
            .from('traceback_items')
            .select('id, type')
            .eq('reporter_id', userId);

        if (!myItems || myItems.length === 0) return res.json({ success: true, matches: [] });

        const lostIds = myItems.filter(i => i.type === 'lost').map(i => i.id);
        const foundIds = myItems.filter(i => i.type === 'found').map(i => i.id);

        let query = supabase.from('traceback_matches').select(`
            *,
            lost_item:traceback_items!lost_item_id(*),
            found_item:traceback_items!found_item_id(*)
        `);

        // If user lost something, show them found items matched to it.
        // If user found something, show them lost items matched to it.
        const conditions = [];
        if (lostIds.length > 0) conditions.push(`lost_item_id.in.(${lostIds.join(',')})`);
        if (foundIds.length > 0) conditions.push(`found_item_id.in.(${foundIds.join(',')})`);
        
        if (conditions.length === 0) return res.json({ success: true, matches: [] });

        const { data: matches, error } = await query.or(conditions.join(','));

        if (error) throw error;
        res.json({ success: true, matches });

    } catch (err) {
        console.error('Get matches error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Claim Item
app.post('/api/traceback/claim', requireLogin, async (req, res) => {
    try {
        const { item_id } = req.body;
        if (!item_id) return res.status(400).json({ success: false, message: 'Item ID required' });

        // Generate Secure Token (Random Bytes)
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24); // 24 hour expiry

        // Create Claim
        const { data, error } = await supabase
            .from('traceback_claims')
            .insert([{
                item_id,
                claimant_id: req.session.user.id,
                status: 'pending_verification',
                verification_token: token,
                token_expiry: expiry.toISOString()
            }])
            .select();

        if (error) throw error;

        res.json({ success: true, claim: data[0], token });

    } catch (err) {
        console.error('Claim error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 4. Verify QR Token (Security/Admin)
app.post('/api/traceback/verify-qr', requireLogin, async (req, res) => {
    try {
        const { token } = req.body;
        const verifierRole = req.session.user.role;

        // Only Security or Admin can verify
        if (!['admin', 'security'].includes(verifierRole)) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Only Security or Admin can verify claims.' });
        }

        // Find Claim
        const { data: claims, error } = await supabase
            .from('traceback_claims')
            .select('*, item:traceback_items(*)')
            .eq('verification_token', token)
            .limit(1);

        if (error) throw error;
        if (!claims || claims.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid token' });
        }

        const claim = claims[0];

        // Checks
        if (claim.status !== 'pending_verification') {
            return res.status(400).json({ success: false, message: `Claim is already ${claim.status}` });
        }
        if (new Date(claim.token_expiry) < new Date()) {
            return res.status(400).json({ success: false, message: 'Token expired' });
        }

        // Execute Verification Update
        // 1. Update Claim Status
        await supabase.from('traceback_claims').update({ status: 'verified' }).eq('id', claim.id);
        
        // 2. Update Item Status
        await supabase.from('traceback_items').update({ status: 'resolved' }).eq('id', claim.item_id);

        // 3. Log Handover
        await supabase.from('traceback_handover_logs').insert([{
            claim_id: claim.id,
            verifier_id: req.session.user.id,
            verif_timestamp: new Date().toISOString()
        }]);

        res.json({ success: true, message: 'Verification successful. Handover recorded.', item: claim.item });

    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
*/

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});