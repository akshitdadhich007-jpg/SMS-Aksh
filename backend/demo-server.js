const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'demo-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  })
);

// Serve static public files
app.use(express.static(path.join(__dirname, 'public')));

// IN-MEMORY DEMO DATA
const demoUsers = [
  {
    id: 1,
    email: 'admin@society.local',
    password: '$2a$10$YOixghIWvgL0h5vUNFKz5.LuWrCZjqX5pP0xJ0x0x0x0x0x0x0x0x0', // Admin@123456
    name: 'Society Admin',
    role: 'admin'
  },
  {
    id: 2,
    email: 'resident1@society.local',
    password: '$2a$10$YOixghIWvgL0h5vUNFKz5.LuWrCZjqX5pP0xJ0x0x0x0x0x0x0x0', // Resident@123
    name: 'Raj Kumar',
    role: 'resident',
    flat: 'A-101'
  },
  {
    id: 3,
    email: 'resident2@society.local',
    password: '$2a$10$YOixghIWvgL0h5vUNFKz5.LuWrCZjqX5pP0xJ0x0x0x0x0x0x0x0', // Resident@123
    name: 'Priya Singh',
    role: 'resident',
    flat: 'A-102'
  }
];

const demoFlats = [
  { id: 1, flat_number: 'A-101', block_name: 'Block A', floor_number: 1 },
  { id: 2, flat_number: 'A-102', block_name: 'Block A', floor_number: 1 },
  { id: 3, flat_number: 'B-201', block_name: 'Block B', floor_number: 2 },
  { id: 4, flat_number: 'B-202', block_name: 'Block B', floor_number: 2 },
  { id: 5, flat_number: 'C-301', block_name: 'Block C', floor_number: 3 }
];

const demoCharges = [
  { month: 1, year: 2026, amount: 2500, due_date: '2026-01-15', status: 'paid', payment_date: '2026-01-10', flat_id: 1 },
  { month: 2, year: 2026, amount: 2500, due_date: '2026-02-15', status: 'pending', payment_date: null, flat_id: 1 },
  { month: 1, year: 2026, amount: 2500, due_date: '2026-01-15', status: 'pending', payment_date: null, flat_id: 2 }
];

const demoNotices = [
  { id: 1, title: 'Annual Society Meeting', content: 'Annual general meeting scheduled for February 15, 2026 at 7:00 PM in the community hall.', created_at: '2026-01-10' },
  { id: 2, title: 'Maintenance Fee Increase', content: 'Please note that maintenance fees will be revised from March 2026. Details will be shared soon.', created_at: '2026-01-20' }
];

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).json({ success: false, message: 'Not authenticated' });
}

function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Forbidden' });
}

// Login API (DEMO - in-memory users)
app.post('/api/login', async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const password = req.body.password || '';

    const user = demoUsers.find(u => u.email.toLowerCase() === email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Demo: Accept any password for demo users
    const ok = (password === 'Admin@123456' && email === 'admin@society.local') ||
               (password === 'Resident@123' && email === 'resident1@society.local') ||
               (password === 'Resident@123' && email === 'resident2@society.local');

    if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role, flat: user.flat };
    return res.json({ success: true, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current session user
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

// Admin APIs (DEMO DATA)
app.get('/api/admin/flats', requireLogin, requireAdmin, async (req, res) => {
  res.json({ success: true, flats: demoFlats });
});

app.get('/api/admin/residents', requireLogin, requireAdmin, async (req, res) => {
  const residentsWithFlat = demoUsers
    .filter(u => u.role === 'resident')
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      flat_number: u.flat,
      is_active: true,
      created_at: '2026-01-15'
    }));
  res.json({ success: true, residents: residentsWithFlat });
});

app.post('/api/admin/add-flat', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { flat_number, block_name, floor_number } = req.body;
    if (!flat_number) return res.status(400).json({ success: false, message: 'Flat number required' });
    const newFlat = {
      id: demoFlats.length + 1,
      flat_number,
      block_name: block_name || '',
      floor_number: floor_number || 1
    };
    demoFlats.push(newFlat);
    res.json({ success: true, message: 'Flat added (demo mode)' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

app.post('/api/admin/add-resident', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { name, email, flat_id, password } = req.body;
    if (!name || !email || !flat_id || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
    const flatNum = demoFlats.find(f => f.id == flat_id)?.flat_number || 'N/A';
    const newResident = {
      id: demoUsers.length + 1,
      name,
      email: email.toLowerCase().trim(),
      password,
      role: 'resident',
      flat: flatNum
    };
    demoUsers.push(newResident);
    res.json({ success: true, message: 'Resident added (demo mode)' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Resident APIs (DEMO DATA)
app.get('/api/resident/charges', requireLogin, async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'resident') return res.status(403).json({ success: false });
  const charges = demoCharges.filter(c => c.flat_id === req.session.user.id);
  res.json({ success: true, charges });
});

app.get('/api/resident/notices', requireLogin, async (req, res) => {
  res.json({ success: true, notices: demoNotices });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         DEMO SERVER RUNNING (In-Memory Mode)              ║
╠════════════════════════════════════════════════════════════╣
║  🌐 http://localhost:${PORT}                               ║
║                                                            ║
║  📝 DEMO CREDENTIALS:                                      ║
║     Admin:    admin@society.local / Admin@123456           ║
║     Resident: resident1@society.local / Resident@123       ║
║                                                            ║
║  ⚠️  NOTE: This is DEMO mode with in-memory data.         ║
║  Data will be lost when server restarts!                  ║
╚════════════════════════════════════════════════════════════╝
  `);
});
