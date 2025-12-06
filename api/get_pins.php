<?php
header('Content-Type: application/json');

$file = __DIR__ . '/pins.json';

if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

$content = file_get_contents($file);
echo $content;
