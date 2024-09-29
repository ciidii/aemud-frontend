export interface ResponsePageableApi<T>{
  records: number;
  items: T;
  pages:number;
  page:number;
  record_from:number;
  record_to:number;
}
