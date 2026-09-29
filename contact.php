<?php
/**
 * contact.php — recebe o formulário do portfólio e envia-te um email.
 * Funciona na maioria dos alojamentos cPanel com a função mail().
 * (Se preferires Gmail SMTP, podes trocar por PHPMailer mais tarde.)
 */

// ================= [EDITAR] =================
$TO_EMAIL   = 'sofia04sousa@icloud.com';   // onde recebes as mensagens
$FROM_EMAIL = 'noreply@oteudominio.pt';              // um email do TEU domínio (evita ir para spam)
$SUBJECT    = 'Nova mensagem do portfólio';
// ============================================

header('Content-Type: application/json; charset=utf-8');

function respond(bool $ok, string $message, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Método não permitido.', 405);
}

// Honeypot: se um bot preencheu o campo escondido, fingimos sucesso
if (!empty($_POST['website'])) {
    respond(true, 'Mensagem enviada.');
}

// Limite simples: 1 mensagem por 60 s por sessão
session_start();
if (isset($_SESSION['last_send']) && time() - $_SESSION['last_send'] < 60) {
    respond(false, 'Aguarda um minuto antes de enviar outra mensagem.', 429);
}

// Limpeza e validação
$clean = fn($v, $max) => mb_substr(trim(strip_tags((string)($v ?? ''))), 0, $max);

$name    = $clean($_POST['name']    ?? '', 80);
$email   = $clean($_POST['email']   ?? '', 120);
$company = $clean($_POST['company'] ?? '', 100);
$message = $clean($_POST['message'] ?? '', 3000);

// Impede injeção de cabeçalhos
$name  = str_replace(["\r", "\n"], ' ', $name);
$email = str_replace(["\r", "\n"], '', $email);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Dados inválidos. Verifica o nome, email e mensagem.', 422);
}

$body  = "Nome: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Empresa: " . ($company ?: '—') . "\n";
$body .= "Data: " . date('d/m/Y H:i') . "\n\n";
$body .= "Mensagem:\n{$message}\n";

$headers  = "From: Portfólio <{$FROM_EMAIL}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$subject = '=?UTF-8?B?' . base64_encode("{$SUBJECT} — {$name}") . '?=';

if (@mail($TO_EMAIL, $subject, $body, $headers)) {
    $_SESSION['last_send'] = time();
    respond(true, 'Mensagem enviada.');
}

respond(false, 'O servidor não conseguiu enviar o email.', 500);
