import http from 'k6/http';
import { check } from 'k6';
import { logError } from './utils.js';

let openapiSpec = null;

export function loadOpenApiSpec(url) {
    console.log(`🔄 Загрузка OpenAPI спецификации с ${url}...`);
    const response = http.get(url);
    
    if (check(response, { 'OpenAPI загружен успешно': (r) => r.status === 200 })) {
        console.log('✅ Спецификация OpenAPI загружена');
        openapiSpec = response.json();
    } else {
        logError('❌ Ошибка загрузки OpenAPI схемы');
    }
}

export function getSchemaForEndpoint(method, path) {
    if (!openapiSpec) {
        logError('❌ OpenAPI спецификация не загружена.');
        return null;
    }

    const pathItem = openapiSpec.paths[path];
    if (!pathItem) {
        logError(`Путь ${path} не найден в спецификации`);
        return null;
    }

    const operation = pathItem[method.toLowerCase()];
    if (!operation) {
        logError(`Метод ${method} не найден для пути ${path}`);
        return null;
    }

    const response200 = operation.responses["200"] || operation.responses["201"];
    if (!response200) {
        logError(`Ответ 200 или 201 не найден для ${method} ${path}`);
        return null;
    }

    const schemaRef = response200.content["application/json"].schema["$ref"];
    if (!schemaRef) {
        logError(`$ref не найден для ${method} ${path}`);
        return null;
    }

    const schemaName = schemaRef.split('/').pop();
    return openapiSpec.components.schemas[schemaName];
}
