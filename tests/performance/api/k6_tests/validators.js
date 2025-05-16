import { logError } from './utils.js';

function validateType(expected, actual) {
    return expected === actual || (expected === 'number' && !isNaN(actual));
}

function validateRequiredFields(schema, response) {
    const requiredFields = schema.required || [];
    for (const field of requiredFields) {
        if (!(field in response)) {
            return `Поле '${field}' отсутствует в ответе`;
        }
    }
    return null;
}

export function validateObject(schema, response) {
    const errors = [];
    const requiredError = validateRequiredFields(schema, response);
    if (requiredError) errors.push(requiredError);

    for (const [key, value] of Object.entries(schema.properties || {})) {
        const responseValue = response[key];
        if (value.type === 'object') {
            errors.push(...validateObject(value, responseValue));
        } else if (value.type === 'array' && Array.isArray(responseValue)) {
            for (const item of responseValue) {
                errors.push(...validateObject(value.items, item));
            }
        } else if (!validateType(value.type, typeof responseValue)) {
            errors.push(`Ошибка типа в поле '${key}': ожидается ${value.type}, получено ${typeof responseValue}`);
        }
    }
    return errors;
}
