import type { AxiosInstance } from 'axios';

declare module './axios' {
  const client: AxiosInstance;

  export { client };
}
