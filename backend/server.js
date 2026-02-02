const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret_in_prod',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});