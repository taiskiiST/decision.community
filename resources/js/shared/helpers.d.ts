import { csrfToken, truncateText, isJson, toBase64, normalizeRussianPhone } from './helpers';

declare module './helpers' {
    export { csrfToken, truncateText, isJson, toBase64, normalizeRussianPhone };
}
