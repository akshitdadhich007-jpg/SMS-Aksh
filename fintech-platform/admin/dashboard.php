<?php
require_once '../includes/config.php';
require_once '../includes/Database.php';
require_once '../includes/Auth.php';

$auth->requireLogin();
$auth->requireAdmin();

$db = Database::getInstance();
$user = $auth->getCurrentUser();

// Initialize variables
$success_message = '';
$error_message = '';
$action = isset($_GET['action']) ? $_GET['action'] : 'dashboard';

// Handle adding resident
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'add_resident') {
        $name = trim($_POST['name'] ?? '');
        $email = trim(strtolower($_POST['email'] ?? ''));
        $flat_id = intval($_POST['flat_id'] ?? 0);
        $password = $_POST['password'] ?? '';
        
        if (empty($name) || empty($email) || empty($flat_id) || empty($password)) {
            $error_message = 'All fields are required.';
        } elseif (strlen($password) < PASSWORD_MIN_LENGTH) {
            $error_message = 'Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters.';
        } else {
            // Check if email already exists
            $stmt = $db->query('SELECT id FROM users WHERE email = ?', [$email]);
            if ($stmt->get_result()->num_rows > 0) {
                $error_message = 'Email already registered.';
            } else {
                // Hash password
                $hashed_password = $auth->hashPassword($password);
                
                // Insert new resident
                $stmt = $db->query(
                    'INSERT INTO users (name, email, password, flat_id, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
                    [$name, $email, $hashed_password, $flat_id, 'resident']
                );
                
                if ($stmt) {
                    $success_message = 'Resident added successfully!';
                } else {
                    $error_message = 'Failed to add resident. Please try again.';
                }
            }
        }
    }
    
    // Handle adding flat
    elseif ($_POST['action'] === 'add_flat') {
        $flat_number = trim($_POST['flat_number'] ?? '');
        $block_name = trim($_POST['block_name'] ?? '');
        $floor_number = intval($_POST['floor_number'] ?? 0);
        $owner_name = trim($_POST['owner_name'] ?? '');
        
        if (empty($flat_number)) {
            $error_message = 'Flat number is required.';
        } else {
            $stmt = $db->query(
                'INSERT INTO flats (flat_number, block_name, floor_number, owner_name) VALUES (?, ?, ?, ?)',
                [$flat_number, $block_name, $floor_number, $owner_name]
            );
            
            if ($stmt) {
                $success_message = 'Flat added successfully!';
            } else {
                $error_message = 'Failed to add flat. Please try again.';
            }
        }
    }
}

// Get all flats
$flats_stmt = $db->query('SELECT id, flat_number, block_name FROM flats ORDER BY flat_number');
$flats = $flats_stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get all residents
$residents_stmt = $db->query(
    'SELECT u.id, u.name, u.email, f.flat_number, u.is_active, u.created_at 
     FROM users u 
     LEFT JOIN flats f ON u.flat_id = f.id 
     WHERE u.role = "resident" 
     ORDER BY u.created_at DESC'
);
$residents = $residents_stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get statistics
$total_residents_stmt = $db->query('SELECT COUNT(*) as count FROM users WHERE role = "resident"');
$total_residents = $total_residents_stmt->get_result()->fetch_assoc()['count'];

$total_flats_stmt = $db->query('SELECT COUNT(*) as count FROM flats');
$total_flats = $total_flats_stmt->get_result()->fetch_assoc()['count'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Society Fintech</title>
    <link rel="stylesheet" href="../public/css/admin.css">
</head>
<body>
    <div class="container">
        <nav class="navbar">
            <div class="navbar-brand">
                <h1>Society Fintech</h1>
                <p>Admin Panel</p>
            </div>
            <div class="navbar-user">
                <span class="user-info">Welcome, <?php echo htmlspecialchars($user['name']); ?></span>
                <a href="../logout.php" class="logout-btn">Logout</a>
            </div>
        </nav>

        <div class="dashboard-content">
            <!-- Sidebar -->
            <aside class="sidebar">
                <ul class="menu">
                    <li><a href="?action=dashboard" class="menu-item <?php echo $action === 'dashboard' ? 'active' : ''; ?>">Dashboard</a></li>
                    <li><a href="?action=residents" class="menu-item <?php echo $action === 'residents' ? 'active' : ''; ?>">Manage Residents</a></li>
                    <li><a href="?action=flats" class="menu-item <?php echo $action === 'flats' ? 'active' : ''; ?>">Manage Flats</a></li>
                    <li><a href="?action=maintenance" class="menu-item <?php echo $action === 'maintenance' ? 'active' : ''; ?>">Maintenance Charges</a></li>
                </ul>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <?php if (!empty($success_message)): ?>
                    <div class="alert alert-success">
                        <?php echo htmlspecialchars($success_message); ?>
                    </div>
                <?php endif; ?>

                <?php if (!empty($error_message)): ?>
                    <div class="alert alert-error">
                        <?php echo htmlspecialchars($error_message); ?>
                    </div>
                <?php endif; ?>

                <?php if ($action === 'dashboard'): ?>
                    <div class="dashboard-header">
                        <h2>Dashboard</h2>
                        <p>Overview of your society management</p>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-info">
                                <h3><?php echo $total_residents; ?></h3>
                                <p>Total Residents</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🏠</div>
                            <div class="stat-info">
                                <h3><?php echo $total_flats; ?></h3>
                                <p>Total Flats</p>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Quick Actions</h3>
                        <div class="action-buttons">
                            <a href="?action=residents" class="btn btn-primary">Add New Resident</a>
                            <a href="?action=flats" class="btn btn-secondary">Add New Flat</a>
                        </div>
                    </div>

                <?php elseif ($action === 'residents'): ?>
                    <div class="section">
                        <h2>Manage Residents</h2>
                        
                        <div class="form-section">
                            <h3>Add New Resident</h3>
                            <form method="POST" class="form">
                                <input type="hidden" name="action" value="add_resident">
                                
                                <div class="form-group">
                                    <label for="name">Resident Name</label>
                                    <input type="text" id="name" name="name" placeholder="Enter resident name" required>
                                </div>

                                <div class="form-group">
                                    <label for="email">Email Address</label>
                                    <input type="email" id="email" name="email" placeholder="Enter email" required>
                                </div>

                                <div class="form-group">
                                    <label for="flat_id">Flat Number</label>
                                    <select id="flat_id" name="flat_id" required>
                                        <option value="">Select a flat</option>
                                        <?php foreach ($flats as $flat): ?>
                                            <option value="<?php echo $flat['id']; ?>">
                                                <?php echo htmlspecialchars($flat['flat_number'] . ' - ' . $flat['block_name']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="password">Temporary Password</label>
                                    <input type="password" id="password" name="password" placeholder="Minimum 8 characters" required>
                                </div>

                                <button type="submit" class="btn btn-primary">Add Resident</button>
                            </form>
                        </div>

                        <div class="table-section">
                            <h3>All Residents</h3>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Flat Number</th>
                                        <th>Status</th>
                                        <th>Added On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($residents as $resident): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($resident['name']); ?></td>
                                            <td><?php echo htmlspecialchars($resident['email']); ?></td>
                                            <td><?php echo htmlspecialchars($resident['flat_number'] ?? 'N/A'); ?></td>
                                            <td>
                                                <span class="status <?php echo $resident['is_active'] ? 'active' : 'inactive'; ?>">
                                                    <?php echo $resident['is_active'] ? 'Active' : 'Inactive'; ?>
                                                </span>
                                            </td>
                                            <td><?php echo date('M d, Y', strtotime($resident['created_at'])); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>

                <?php elseif ($action === 'flats'): ?>
                    <div class="section">
                        <h2>Manage Flats</h2>
                        
                        <div class="form-section">
                            <h3>Add New Flat</h3>
                            <form method="POST" class="form">
                                <input type="hidden" name="action" value="add_flat">
                                
                                <div class="form-group">
                                    <label for="flat_number">Flat Number</label>
                                    <input type="text" id="flat_number" name="flat_number" placeholder="e.g., A-101" required>
                                </div>

                                <div class="form-group">
                                    <label for="block_name">Block Name</label>
                                    <input type="text" id="block_name" name="block_name" placeholder="e.g., Block A" required>
                                </div>

                                <div class="form-group">
                                    <label for="floor_number">Floor Number</label>
                                    <input type="number" id="floor_number" name="floor_number" placeholder="e.g., 1" min="1" required>
                                </div>

                                <div class="form-group">
                                    <label for="owner_name">Owner Name (Optional)</label>
                                    <input type="text" id="owner_name" name="owner_name" placeholder="Enter owner name">
                                </div>

                                <button type="submit" class="btn btn-primary">Add Flat</button>
                            </form>
                        </div>

                        <div class="table-section">
                            <h3>All Flats</h3>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Flat Number</th>
                                        <th>Block</th>
                                        <th>Floor</th>
                                        <th>Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                    $all_flats_stmt = $db->query('SELECT * FROM flats ORDER BY flat_number');
                                    $all_flats = $all_flats_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
                                    foreach ($all_flats as $flat): 
                                    ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($flat['flat_number']); ?></td>
                                            <td><?php echo htmlspecialchars($flat['block_name']); ?></td>
                                            <td><?php echo $flat['floor_number']; ?></td>
                                            <td><?php echo htmlspecialchars($flat['owner_name'] ?? 'N/A'); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>

                <?php elseif ($action === 'maintenance'): ?>
                    <div class="section">
                        <h2>Maintenance Charges</h2>
                        <p style="color: #6b7280; margin-top: 10px;">Maintenance charges management coming soon...</p>
                    </div>

                <?php endif; ?>
            </main>
        </div>
    </div>
</body>
</html>
