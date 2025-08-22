export interface BaseError extends Error {
  code: string;
  message: string;
  details?: string;
  status: number;
}
