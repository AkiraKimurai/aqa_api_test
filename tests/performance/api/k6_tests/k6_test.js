import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { loadOpenApiSpec } from './openapi_parser.js';
import { Trend, Rate, Counter } from 'k6/metrics';
import { sleep } from 'k6';

const BASE_URL = 'https://test-service.azza.cc';

// === Метрики ===
export const options = {
    stages: [
        { duration: '3s', target: 1 },  // 10 VUs в течение 30 секунд
        { duration: '1s', target: 2 },   // 20 VUs в течение 1 минуты
        { duration: '3s', target: 0 }    // Завершаем тест
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% запросов должны быть < 500ms
        'errors': ['rate<0.1'],           // Ошибки не более 10%
    },
};

const ResponseTime = new Trend('response_time');
const SuccessRate = new Rate('success_rate');
const errors = new Rate('errors'); // <---- Переименовал из ErrorCount в errors

export default function () {
    // 🔄 Загрузка OpenAPI в контексте VU
    if (__ITER == 0) {
        loadOpenApiSpec(`${BASE_URL}/openapi.json`);
    }

    console.log('🔎 Тестирование API...');

    // ✅ **GET /data/** — Получение данных
    let dataResponse = apiGet('/data/');
    ResponseTime.add(dataResponse.timings.duration);
    SuccessRate.add(dataResponse.status === 200);
    if (dataResponse.status !== 200) {
        errors.add(1); // <---- Добавляем ошибку
    }
    sleep(1);

    // ✅ **PUT /data/** — Обновление данных
    let putResponse = apiPut('/data/', { "test1": "updatedData" });
    ResponseTime.add(putResponse.timings.duration);
    SuccessRate.add(putResponse.status === 200);
    if (putResponse.status !== 200) {
        errors.add(1); // <---- Добавляем ошибку
    }
    sleep(1);

    // ✅ **DELETE /data/** — Удаление данных
    let deleteResponse = apiDelete('/data/');
    ResponseTime.add(deleteResponse.timings.duration);
    SuccessRate.add(deleteResponse.status === 204);
    if (deleteResponse.status !== 204) {
        errors.add(1); // <---- Добавляем ошибку
    }
    sleep(1);

    // ✅ **POST /plans/** — Создание плана
    let postPlanResponse = apiPost('/plans/', { name: "New Test Plan", paths: ["test1"] });
    ResponseTime.add(postPlanResponse.timings.duration);
    SuccessRate.add(postPlanResponse.status === 201);
    if (postPlanResponse.status === 201) {
        const planId = postPlanResponse.json().id;

        // ✅ **GET /plans/{plan_id}** — Получение плана
        let getPlanResponse = apiGet(`/plans/${planId}`);
        ResponseTime.add(getPlanResponse.timings.duration);
        SuccessRate.add(getPlanResponse.status === 200);

        // ✅ **DELETE /plans/{plan_id}** — Удаление плана
        let deletePlanResponse = apiDelete(`/plans/${planId}`);
        ResponseTime.add(deletePlanResponse.timings.duration);
        SuccessRate.add(deletePlanResponse.status === 204);

        if (getPlanResponse.status !== 200 || deletePlanResponse.status !== 204) {
            errors.add(1); // <---- Добавляем ошибку
        }
    } else {
        errors.add(1); // <---- Добавляем ошибку
    }

    // ✅ **GET /restore_points/** — Список Restore Points
    let restorePointsResponse = apiGet('/restore_points/');
    ResponseTime.add(restorePointsResponse.timings.duration);
    SuccessRate.add(restorePointsResponse.status === 200);
    if (restorePointsResponse.status !== 200) {
        errors.add(1); // <---- Добавляем ошибку
    }

    // ✅ **GET /tasks/** — Список задач
    let tasksResponse = apiGet('/tasks/');
    ResponseTime.add(tasksResponse.timings.duration);
    SuccessRate.add(tasksResponse.status === 200);
    if (tasksResponse.status !== 200) {
        errors.add(1); // <---- Добавляем ошибку
    }
}
