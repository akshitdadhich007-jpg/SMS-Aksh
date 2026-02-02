<?php
/**
 * Database Connection Helper
 */

class Database {
    private $connection;
    private static $instance = null;

    private function __construct() {
        $this->connect();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function connect() {
        try {
            $this->connection = new mysqli(
                DB_HOST,
                DB_USER,
                DB_PASS,
                DB_NAME
            );

            if ($this->connection->connect_error) {
                throw new Exception('Database connection failed: ' . $this->connection->connect_error);
            }

            $this->connection->set_charset('utf8mb4');
        } catch (Exception $e) {
            error_log('Database Error: ' . $e->getMessage());
            die('Database connection error. Please try again later.');
        }
    }

    public function query($sql, $params = []) {
        $stmt = $this->connection->prepare($sql);
        
        if (!$stmt) {
            throw new Exception('Query preparation failed: ' . $this->connection->error);
        }

        if (!empty($params)) {
            $types = '';
            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= 'i';
                } elseif (is_float($param)) {
                    $types .= 'd';
                } else {
                    $types .= 's';
                }
            }
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        return $stmt;
    }

    public function getConnection() {
        return $this->connection;
    }

    public function closeConnection() {
        if ($this->connection) {
            $this->connection->close();
        }
    }

    public function __destruct() {
        $this->closeConnection();
    }
}

// Get database instance
$db = Database::getInstance();
?>
