/** Shared error shape. Codes: INVALID_CREDENTIALS | NETWORK | FORBIDDEN | VALIDATION | UNKNOWN */
export class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}
