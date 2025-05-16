#!/bin/sh
echo "🚀 Запуск тестов K6..."

# Запускаем тест и сохраняем отчёт в JSON
k6 run --insecure-skip-tls-verify /app/tests/performance/api/k6_tests/k6_test.js --out json=/app/report.json

# Проверяем, что JSON-файл не пустой
if [ ! -s "/app/report.json" ]; then
    echo "❌ Ошибка: report.json пуст или не создан"
    exit 1
fi

echo "📊 Создание текстового отчёта..."
# Просто копируем вывод консоли в текстовый файл
k6 run --quiet /app/tests/performance/api/k6_tests/k6_test.js > /app/report.txt 2>&1

echo "📄 Генерация HTML-отчёта..."
# Создаём простой HTML-отчёт
cat <<EOF > /app/report.html
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
        <pre>$(grep -A 10 "█ THRESHOLDS" /app/report.txt)</pre>
    </div>
    <div>
        <h2>Full Console Output</h2>
        <pre>$(cat /app/report.txt)</pre>
    </div>
</body>
</html>
EOF

if [ -f "/app/report.html" ]; then
    echo "✅ Отчёты успешно созданы:"
    echo "   - /app/report.html (HTML)"
    echo "   - /app/report.txt (текстовый)"
    echo "   - /app/report.json (JSON)"
else
    echo "⚠️ Не удалось создать HTML отчёт, но есть:"
    echo "   - /app/report.txt (текстовый)"
    echo "   - /app/report.json (JSON)"
fi
