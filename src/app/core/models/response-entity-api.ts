export interface ResponseEntityApi<T> {
  status: string;
  result: string;
  error: unknown;
  data: T;
}
