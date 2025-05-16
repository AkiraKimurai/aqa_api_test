# K6 Performance Testing Framework

## 📌 Описание проекта
K6 Performance Testing Framework — это решение для автоматизированного нагрузочного тестирования API с использованием **K6**. Включает в себя:

✅ Подготовку тестовых сценариев  
✅ Валидацию ответов по OpenAPI-спецификации  
✅ Генерацию отчетов в JSON, TXT и HTML  
✅ Возможность запуска как локально, так и в Docker  

---

## 📋 Требования
- **Node.js** — если используются npm-скрипты
- **Docker** — для запуска в контейнере
- **K6** — для выполнения тестов

### Установка K6:
```bash
npm install -g k6
```

---

## 🚀 Быстрый старт
1️⃣ Клонируйте репозиторий:
```bash
git clone <ваш-репозиторий>
cd qa-performance
```

2️⃣ Убедитесь, что K6 установлен:
```bash
k6 version
```

3️⃣ Запустите тесты:
```bash
./tests/performance/api/files/run_local.sh
```

---

## ⚡ Запуск тестов

### Локальный запуск
```bash
# Запуск тестов с генерацией отчетов
./tests/performance/api/files/run_local.sh

# Запуск только тестов (без отчетов)
k6 run --insecure-skip-tls-verify tests/performance/api/k6_tests/k6_test.js
```
📌 Отчеты сохраняются в:
- `tests/performance/api/logs/report.json` — структурированные данные
- `tests/performance/api/logs/report.txt` — консольный вывод
- `tests/performance/api/logs/report.html` — визуализированный отчет

---

### Запуск в Docker
```bash
# Сборка и запуск контейнера
docker-compose -f tests/performance/api/docker/docker-compose.yml up --build

# После завершения тестов отчеты появятся в:
ls ./report.*  # HTML, JSON, TXT
```

---

## 📂 Структура проекта
```
qa-performance/
├── tests/performance/api/
│   ├── docker/               # Docker-конфигурация
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── run-tests.sh
│   ├── files/
│   │   └── run_local.sh      # Скрипт для локального запуска
│   ├── k6_tests/
│   │   ├── api.js            # Основные API-методы
│   │   ├── k6_test.js        # Тестовый сценарий
│   │   ├── openapi_parser.js # Парсер OpenAPI
│   │   ├── validators.js     # Валидация ответов
│   │   └── utils.js          # Вспомогательные функции
│   └── logs/                 # Отчеты (создаются после запуска)
│       ├── report.html
│       ├── report.json
│       └── report.txt
└── README.md
```

---

## ⚙ Настройка тестов

### 1️⃣ Изменение тестовых данных
Файл: `k6_test.js`
```javascript
export let options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '10s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    'errors': ['rate<0.1']
  }
};
```

### 2️⃣ Добавление новых API-запросов
Файл: `api.js`
```javascript
export function apiGet(endpoint) {
  return retryOperation(() => {
    const res = http.get(`${BASE_URL}${endpoint}`);
    check(res, { 'status is 200': (r) => r.status === 200 });
    return res;
  });
}
```

---

## 📊 Генерация отчетов
После запуска тестов отчеты автоматически сохраняются в `tests/performance/api/logs/`:

| Файл          | Описание                               |
|----------------|---------------------------------------|
| `report.json` | Данные в формате JSON (для анализа)    |
| `report.txt`  | Лог выполнения (как в консоли)         |
| `report.html` | Визуализированный HTML-отчет           |

---

## 🔧 Дополнительные возможности

### 1️⃣ Валидация по OpenAPI
Тесты могут автоматически проверять структуру ответов.
```javascript
loadOpenApiSpec(`${BASE_URL}/openapi.json`);
validateObject(schema, response);
```

### 2️⃣ Ретри-логика
Автоматический повтор запросов при ошибках (настраивается в `utils.js`).

### 3️⃣ Кастомные метрики
Можно добавить свои метрики в `k6_test.js`:
```javascript
const myTrend = new Trend('my_custom_metric');
myTrend.add(response.timings.duration);
```

---

## ❗ Возможные ошибки и их решение

1️⃣ **Проблемы с Docker Compose**
- Ошибка: `docker-compose not found`
- Решение: Убедитесь, что Docker Compose установлен:
```bash
docker-compose --version
```

2️⃣ **Ошибка запуска K6: Command not found**
- Ошибка: `k6: command not found`
- Решение: Проверьте установку K6:
```bash
npm install -g k6
```

3️⃣ **Проблемы с доступом к OpenAPI спецификации**
- Ошибка: `OpenAPI загружен с ошибкой`
- Решение: Проверьте, доступен ли путь:
```bash
curl https://<ваш-url>/openapi.json
```

4️⃣ **Не генерируются отчеты в Docker**
- Ошибка: `report.json not found`
- Решение: Проверьте права на директорию `logs` и доступ к файлам в контейнере.

---

## 📌 Заключение
Этот фреймворк позволяет:

✅ Быстро запускать нагрузочные тесты  
✅ Валидировать API по OpenAPI  
✅ Получать детализированные отчеты  
✅ Работать как локально, так и в Docker

Для вопросов или доработок создавайте Issues или Pull Requests.
