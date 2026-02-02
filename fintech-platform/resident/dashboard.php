<?php
require_once '../includes/config.php';
require_once '../includes/Database.php';
require_once '../includes/Auth.php';

$auth->requireLogin();
$auth->requireResident();

$db = Database::getInstance();
$user = $auth->getCurrentUser();

// Get resident's flat and maintenance charges
$stmt = $db->query(
    'SELECT u.id, u.name, u.email, f.id as flat_id, f.flat_number, f.block_name, f.floor_number 
     FROM users u 
     LEFT JOIN flats f ON u.flat_id = f.id 
     WHERE u.id = ?',
    [$user['id']]
);
$resident = $stmt->get_result()->fetch_assoc();

// Get maintenance charges for this flat
$maintenance_stmt = $db->query(
    'SELECT * FROM maintenance_charges WHERE flat_id = ? ORDER BY year DESC, month DESC',
    [$resident['flat_id']]
);
$charges = $maintenance_stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get notices
$notices_stmt = $db->query(
    'SELECT * FROM notices WHERE is_published = 1 ORDER BY created_at DESC LIMIT 5'
);
$notices = $notices_stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Calculate statistics
$pending_stmt = $db->query(
    'SELECT SUM(amount) as total FROM maintenance_charges WHERE flat_id = ? AND status = "pending"',
    [$resident['flat_id']]
);
$pending_total = $pending_stmt->get_result()->fetch_assoc()['total'] ?? 0;

$paid_stmt = $db->query(
    'SELECT SUM(amount) as total FROM maintenance_charges WHERE flat_id = ? AND status = "paid"',
    [$resident['flat_id']]
);
$paid_total = $paid_stmt->get_result()->fetch_assoc()['total'] ?? 0;

$month_names = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resident Dashboard - Society Fintech</title>
    <link rel="stylesheet" href="../public/css/resident.css">
</head>
<body>
    <div class="container">
        <nav class="navbar">
            <div class="navbar-brand">
                <h1>Society Fintech</h1>
                <p>Resident Portal</p>
            </div>
            <div class="navbar-user">
                <span class="user-info">Welcome, <?php echo htmlspecialchars($resident['name']); ?></span>
                <a href="../logout.php" class="logout-btn">Logout</a>
            </div>
        </nav>

        <div class="dashboard-content">
            <!-- Main Content -->
            <main class="main-content">
                <!-- Flat Details -->
                <section class="card">
                    <h2>Your Flat Details</h2>
                    <div class="flat-info">
                        <div class="info-item">
                            <span class="label">Flat Number:</span>
                            <span class="value"><?php echo htmlspecialchars($resident['flat_number'] ?? 'N/A'); ?></span>
                        </div>
                        <div class="info-item">
                            <span class="label">Block:</span>
                            <span class="value"><?php echo htmlspecialchars($resident['block_name'] ?? 'N/A'); ?></span>
                        </div>
                        <div class="info-item">
                            <span class="label">Floor:</span>
                            <span class="value"><?php echo $resident['floor_number'] ?? 'N/A'; ?></span>
                        </div>
                    </div>
                </section>

                <!-- Payment Summary -->
                <section class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-amount"><?php echo '₹' . number_format($paid_total, 2); ?></div>
                        <div class="stat-label">Total Paid</div>
                        <div class="stat-indicator paid">Paid</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-amount"><?php echo '₹' . number_format($pending_total, 2); ?></div>
                        <div class="stat-label">Pending Amount</div>
                        <div class="stat-indicator pending">Pending</div>
                    </div>
                </section>

                <!-- Maintenance Charges -->
                <section class="card">
                    <h2>Maintenance Payment History</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Year</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Payment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($charges as $charge): ?>
                                <tr>
                                    <td><?php echo $month_names[$charge['month']]; ?></td>
                                    <td><?php echo $charge['year']; ?></td>
                                    <td><?php echo '₹' . number_format($charge['amount'], 2); ?></td>
                                    <td><?php echo date('M d, Y', strtotime($charge['due_date'])); ?></td>
                                    <td>
                                        <span class="status-badge <?php echo strtolower($charge['status']); ?>">
                                            <?php echo ucfirst($charge['status']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo $charge['payment_date'] ? date('M d, Y', strtotime($charge['payment_date'])) : 'N/A'; ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php if (empty($charges)): ?>
                        <p style="text-align: center; color: #6b7280; padding: 20px;">No charges found for your flat.</p>
                    <?php endif; ?>
                </section>

                <!-- Notices -->
                <section class="card">
                    <h2>Official Notices</h2>
                    <div class="notices-list">
                        <?php foreach ($notices as $notice): ?>
                            <div class="notice-item">
                                <h3><?php echo htmlspecialchars($notice['title']); ?></h3>
                                <p><?php echo htmlspecialchars(substr($notice['content'], 0, 150)) . '...'; ?></p>
                                <span class="notice-date"><?php echo date('M d, Y', strtotime($notice['created_at'])); ?></span>
                            </div>
                        <?php endforeach; ?>
                        <?php if (empty($notices)): ?>
                            <p style="color: #6b7280;">No notices at the moment.</p>
                        <?php endif; ?>
                    </div>
                </section>
            </main>
        </div>
    </div>
</body>
</html>
