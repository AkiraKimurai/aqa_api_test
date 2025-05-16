import { sleep } from 'k6';

export function logError(message) {
    console.error(`❌ ${message}`);
}

export function retryOperation(func, maxRetries = 3, delay = 1) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const result = func();
        if (result) return result;
        sleep(delay * Math.pow(2, attempt));
    }
    return null;
}
