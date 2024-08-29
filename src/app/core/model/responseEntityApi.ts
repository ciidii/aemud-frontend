export interface ResponseEntityApi<T> {
  status: string;
  result: string;
  error: any;
  data: T;
}
