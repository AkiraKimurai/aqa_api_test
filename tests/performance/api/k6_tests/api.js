import http from 'k6/http';
import { check } from 'k6';
import { logError, retryOperation } from './utils.js';

const BASE_URL = 'https://test-service.azza.cc';
const HEADERS = { 'Content-Type': 'application/json' };

export function apiGet(url) {
    return retryOperation(() => {
        const res = http.get(`${BASE_URL}${url}`, { headers: HEADERS });
        if (res.status === 404) logError(`Ресурс ${url} не найден (404)`);
        return res;
    });
}

export function apiPost(url, body) {
    return retryOperation(() => {
        const res = http.post(`${BASE_URL}${url}`, JSON.stringify(body), { headers: HEADERS });
        if (res.status === 404) logError(`Ресурс ${url} не найден (404)`);
        return res;
    });
}

export function apiPut(url, body) {
    return retryOperation(() => {
        const res = http.put(`${BASE_URL}${url}`, JSON.stringify(body), { headers: HEADERS });
        if (res.status === 404) logError(`Ресурс ${url} не найден (404)`);
        return res;
    });
}

export function apiDelete(url) {
    return retryOperation(() => {
        const res = http.del(`${BASE_URL}${url}`, null, { headers: HEADERS });
        if (res.status === 404) logError(`Ресурс ${url} не найден (404)`);
        return res;
    });
}
