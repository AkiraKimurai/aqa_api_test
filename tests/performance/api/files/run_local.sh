#!/bin/bash

# Путь к директории с логами
LOG_DIR="tests/performance/api/logs"

# Создаем директорию, если её нет
mkdir -p "$LOG_DIR"

echo "🚀 Запуск тестов K6..."

# Запускаем тест и сохраняем отчёт в JSON
k6 run --insecure-skip-tls-verify tests/performance/api/k6_tests/k6_test.js \
  --out json="$LOG_DIR/report.json"

# Генерация текстового отчёта
k6 run --quiet --insecure-skip-tls-verify tests/performance/api/k6_tests/k6_test.js > "$LOG_DIR/report.txt" 2>&1

# Генерация HTML-отчёта
cat <<EOF > "$LOG_DIR/report.html"
<!DOCTYPE html>
<html>
<head>
    <title>K6 Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
        .summary { margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>K6 Performance Test Report</h1>
    <div class="summary">
        <h2>Test Summary</h2>
        <pre>$(grep -A 10 "█ THRESHOLDS" "$LOG_DIR/report.txt")</pre>
    </div>
    <div>
        <h2>Full Console Output</h2>
        <pre>$(cat "$LOG_DIR/report.txt")</pre>
    </div>
</body>
</html>
EOF

echo "✅ Отчёты сохранены в: $LOG_DIR/"
echo "   - report.html (HTML)"
echo "   - report.txt (текстовый)"
echo "   - report.json (JSON)"
