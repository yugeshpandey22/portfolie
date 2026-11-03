<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'includes/PHPMailer/Exception.php';
require 'includes/PHPMailer/PHPMailer.php';
require 'includes/PHPMailer/SMTP.php';

// Clean any previous output to avoid JSON errors
ob_start();
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $service = strip_tags(trim($_POST['service'] ?? 'General Inquiry'));
    $message = strip_tags(trim($_POST['message'] ?? ''));

    if (empty($name) || empty($email) || empty($message)) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Please fill all fields."]);
        exit;
    }

    // Check if OpenSSL is enabled
    if (!extension_loaded('openssl')) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Error: PHP OpenSSL extension is not enabled on your server/XAMPP."]);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Load credentials from config.php
        $smtp_user = 'pyugesh66@gmail.com';
        $smtp_pass = '';
        if (file_exists(__DIR__ . '/config.php')) {
            require_once __DIR__ . '/config.php';
            if (defined('SMTP_USER')) $smtp_user = SMTP_USER;
            if (defined('SMTP_PASS')) $smtp_pass = SMTP_PASS;
        }

        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_user; 
        $mail->Password   = $smtp_pass; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Fix for local SSL verification issues
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        // Recipients
        $mail->setFrom('pyugesh66@gmail.com', 'Portfolio Website');
        $mail->addAddress('pyugesh66@gmail.com');
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Portfolio Message from $name";
        $mail->Body    = "
            <div style='font-family: sans-serif; padding: 20px; border: 1px solid #eee;'>
                <h2 style='color: #00f2fe; background: #060813; padding: 10px 15px; border-radius: 6px;'>New Message from Portfolio</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Service Requested:</strong> $service</p>
                <p><strong>Message:</strong></p>
                <div style='background: #f9f9f9; padding: 15px; border-radius: 5px;'>
                    " . nl2br($message) . "
                </div>
            </div>
        ";

        $mail->send();
        ob_clean();
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent successfully."]);
    } catch (Exception $e) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Mailer Error: " . $mail->ErrorInfo]);
    }
} else {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
