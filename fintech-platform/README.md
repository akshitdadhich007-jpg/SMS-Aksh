# Society Fintech Platform

A secure, transparent web-based fintech platform for residential societies to manage recurring maintenance payments, track dues, and maintain financial clarity.

## 📋 Features

### Authentication & Access Control
- ✅ Role-based login (Admin and Resident)
- ✅ Secure session-based authentication with bcrypt password hashing
- ✅ Admin-controlled user onboarding
- ✅ Email-based verification and access control

### Admin Features
- ✅ Dashboard with key statistics
- ✅ Manage flats (add, view, organize by block)
- ✅ Add and manage residents
- ✅ Assign residents to flats securely
- ✅ Set temporary passwords for new residents
- ✅ View all resident records

### Resident Features
- ✅ View flat details and information
- ✅ Check maintenance payment status
- ✅ View complete payment history
- ✅ Track paid vs. pending charges
- ✅ Read official society notices

### Design Principles
- ✅ Minimal and modern fintech UI
- ✅ Accessible for elderly and non-technical users
- ✅ Mobile-responsive across all devices
- ✅ No unnecessary animations or bloat
- ✅ Clean spacing and readable typography
- ✅ Professional blue color palette

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Minimal JavaScript
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Security**: bcrypt password hashing, prepared statements, session tokens

## 📁 Project Structure

```
fintech-platform/
├── login.php                    # Main login page
├── logout.php                   # Logout handler
├── database/
│   └── schema.sql              # Complete database schema
├── includes/
│   ├── config.php              # Configuration and environment settings
│   ├── Database.php            # Database connection class
│   └── Auth.php                # Authentication helper class
├── public/
│   ├── css/
│   │   ├── login.css          # Login page styling
│   │   ├── admin.css          # Admin dashboard styling
│   │   └── resident.css       # Resident dashboard styling
│   └── js/
│       └── (future scripts)
├── admin/
│   └── dashboard.php          # Admin control panel
└── resident/
    └── dashboard.php          # Resident portal
```

## 🚀 Installation & Setup

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server with PHP support

### Step 1: Database Setup

1. Create a new MySQL database:
```sql
CREATE DATABASE society_fintech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import the schema:
```bash
mysql -u root -p society_fintech < database/schema.sql
```

### Step 2: Configure the Application

1. Edit `includes/config.php` with your database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'society_fintech');
```

2. Update `SITE_URL` if hosting on a different path:
```php
define('SITE_URL', 'http://your-domain.com/fintech-platform/');
```

### Step 3: Place Files

Copy all files to your web server's public directory (e.g., `/var/www/html/fintech-platform/`)

### Step 4: Set Permissions

```bash
chmod 755 /path/to/fintech-platform
chmod 644 /path/to/fintech-platform/*.php
```

## 🔐 Security Features

- ✅ Bcrypt password hashing with salt
- ✅ SQL prepared statements (prevent SQL injection)
- ✅ Session timeout (1 hour default)
- ✅ Admin-only user creation (no public signup)
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ HTTPS recommended for production

## 👥 Default Credentials

After installation, use these credentials to log in:

**Admin Account:**
- Email: `admin@society.local`
- Password: `Admin@123456`

⚠️ **Change these credentials immediately after first login!**

## 📖 User Guide

### For Admins

1. **Login**: Use admin credentials at `/fintech-platform/login.php`
2. **Add Flats**: Go to "Manage Flats" → Enter flat details
3. **Add Residents**: Go to "Manage Residents" → Assign to flats and set temporary passwords
4. **Track Payments**: Monitor maintenance charges and payment status
5. **Post Notices**: Create announcements visible to all residents

### For Residents

1. **Login**: Use credentials provided by admin
2. **View Flat**: See your assigned flat details
3. **Check Dues**: View pending and paid maintenance charges
4. **Read Notices**: Stay updated with society announcements

## 🔧 Maintenance & Operations

### Database Backup
```bash
mysqldump -u root -p society_fintech > backup.sql
```

### Database Restore
```bash
mysql -u root -p society_fintech < backup.sql
```

### Add New Admin User (via MySQL)
```sql
INSERT INTO users (email, password, name, role, is_active) 
VALUES ('admin2@society.local', '$2y$10$[hashed_password]', 'New Admin', 'admin', 1);
```

## 🐛 Troubleshooting

### Login Issues
- Ensure database connection is correct in `config.php`
- Check user email and password in database
- Verify user `is_active` status is `1`

### Page Not Found
- Ensure all files are in correct directory
- Check Apache/Nginx URL rewriting
- Verify PHP is executable on the server

### Database Connection Error
- Test credentials: `mysql -u root -p`
- Ensure MySQL service is running
- Check firewall and port access

## 🚀 Future Enhancements

- Payment gateway integration
- Email notifications
- SMS alerts for overdue payments
- Advanced analytics and reporting
- Mobile app (React Native/Flutter)
- Automated payment reminders
- Two-factor authentication
- Audit logging

## 📝 License

This project is proprietary software for residential societies. All rights reserved.

## 🤝 Support

For issues or feature requests, contact: support@societyfintech.local

---

**Version**: 1.0.0  
**Last Updated**: January 31, 2026
