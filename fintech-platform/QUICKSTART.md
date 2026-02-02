# Quick Start Guide - Society Fintech Platform

## ⚡ Quick Setup (5 minutes)

### 1️⃣ Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE society_fintech CHARACTER SET utf8mb4;"

# Import schema
mysql -u root -p society_fintech < database/schema.sql
```

### 2️⃣ Update Configuration
Edit `includes/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');  // ← Change this
define('DB_NAME', 'society_fintech');
define('SITE_URL', 'http://localhost/fintech-platform/'); // ← Update if needed
```

### 3️⃣ Upload Files
Copy all files to your web server (e.g., `/var/www/html/fintech-platform/`)

### 4️⃣ Start Using!
- **Admin Login**: `admin@society.local` / `Admin@123456`
- **Add Residents**: Admin Dashboard → Manage Residents
- **Assign Flats**: Each resident gets a unique flat
- **Share Credentials**: Give temporary passwords to residents

---

## 🎯 What's Included

### Core Files
- ✅ **login.php** - Secure authentication
- ✅ **admin/dashboard.php** - Manage residents & flats
- ✅ **resident/dashboard.php** - View payments & notices
- ✅ **logout.php** - Session cleanup

### Backend
- ✅ **includes/config.php** - Settings
- ✅ **includes/Database.php** - MySQL connection
- ✅ **includes/Auth.php** - Login/security

### Styling
- ✅ **public/css/login.css** - Login page (mobile-responsive)
- ✅ **public/css/admin.css** - Admin dashboard
- ✅ **public/css/resident.css** - Resident portal

### Database
- ✅ **database/schema.sql** - Complete setup with sample data

---

## 🔐 Default Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | `admin@society.local` | `Admin@123456` | Manage society |
| Resident 1 | `resident1@society.local` | `Resident@123` | Test resident access |
| Resident 2 | `resident2@society.local` | `Resident@123` | Test resident access |
| Resident 3 | `resident3@society.local` | `Resident@123` | Test resident access |

⚠️ **Change these immediately in production!**

---

## 📊 Admin Workflow

1. **Log in** → `/fintech-platform/login.php`
2. **Add Flats** → Dashboard → Manage Flats
   - Add flat numbers (A-101, A-102, etc.)
   - Assign blocks and floor numbers
3. **Add Residents** → Manage Residents
   - Enter name and email
   - Assign to flat
   - Set temporary password
4. **Share Credentials** → Send email to residents with:
   - Login URL
   - Email address
   - Temporary password (ask them to change it)

---

## 👥 Resident Workflow

1. **Log in** → Use credentials from admin
2. **View Dashboard** → See:
   - Your flat details
   - Payment status (Paid/Pending)
   - Due dates
   - Official notices
3. **Track Payments** → Complete history with amounts and dates

---

## 🔧 Password Management

### Resident Password Change
- Residents can change password after first login (feature coming soon)
- Admin can reset via database if needed

### Admin Password Change
- Update in database: `UPDATE users SET password = '$2y$10$...' WHERE role = 'admin'`
- Or login to admin panel and change profile (feature coming soon)

---

## 📱 Responsive Design

✅ Works perfectly on:
- Desktop (1920px, 1366px, 1024px)
- Tablet (768px, 600px)
- Mobile (480px, 375px, 320px)
- Print (PDF export)

---

## ⚠️ Important Notes

### Security
1. Change default passwords immediately
2. Use HTTPS in production (add SSL certificate)
3. Keep PHP and MySQL updated
4. Use strong unique passwords
5. Backup database regularly

### Performance
- Database indexed on email and role for fast lookups
- Session timeout set to 1 hour
- Light CSS (no heavy frameworks)
- Minimal JavaScript (fast page load)

### Troubleshooting
- Check `error_log` if issues occur
- Test database connection with: `mysql -u root -p -e "use society_fintech; SELECT 1;"`
- Verify PHP has `mysqli` extension enabled
- Check file permissions (755 for dirs, 644 for files)

---

## 📞 Support

For issues or questions, check:
1. Database connection in `config.php`
2. File permissions on server
3. PHP version (7.4+ required)
4. MySQL version (5.7+ required)
5. Browser console for JavaScript errors

---

**Ready to go!** Start with admin login and begin adding residents. 🚀
