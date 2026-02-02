<?php
/**
 * Authentication Helper
 */

class Auth {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Hash password using bcrypt
     */
    public function hashPassword($password) {
        return password_hash($password, PASSWORD_HASH_ALGO, PASSWORD_HASH_OPTIONS);
    }

    /**
     * Verify password
     */
    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    /**
     * Login user
     */
    public function login($email, $password) {
        $email = trim(strtolower($email));
        
        $stmt = $this->db->query(
            'SELECT id, email, password, name, role, is_active FROM users WHERE email = ? AND is_active = 1',
            [$email]
        );
        
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user) {
            return ['success' => false, 'message' => 'Email not found or account is inactive.'];
        }

        if (!$this->verifyPassword($password, $user['password'])) {
            return ['success' => false, 'message' => 'Invalid password.'];
        }

        // Create session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['logged_in'] = true;

        return ['success' => true, 'message' => 'Login successful.', 'role' => $user['role']];
    }

    /**
     * Logout user
     */
    public function logout() {
        session_destroy();
        return true;
    }

    /**
     * Check if user is logged in
     */
    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin() {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
    }

    /**
     * Check if user is resident
     */
    public function isResident() {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'resident';
    }

    /**
     * Get current user ID
     */
    public function getCurrentUserId() {
        return $_SESSION['user_id'] ?? null;
    }

    /**
     * Get current user data
     */
    public function getCurrentUser() {
        return [
            'id' => $_SESSION['user_id'] ?? null,
            'email' => $_SESSION['email'] ?? null,
            'name' => $_SESSION['name'] ?? null,
            'role' => $_SESSION['role'] ?? null
        ];
    }

    /**
     * Redirect if not logged in
     */
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header('Location: ' . SITE_URL . 'login.php?redirect=1');
            exit();
        }
    }

    /**
     * Redirect if not admin
     */
    public function requireAdmin() {
        if (!$this->isAdmin()) {
            header('Location: ' . SITE_URL . 'access-denied.php');
            exit();
        }
    }

    /**
     * Redirect if not resident
     */
    public function requireResident() {
        if (!$this->isResident()) {
            header('Location: ' . SITE_URL . 'access-denied.php');
            exit();
        }
    }
}

$auth = new Auth();
?>
