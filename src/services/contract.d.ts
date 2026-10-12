// Integration contract. The frontend only talks to a backend through these two interfaces.
// services/mock/* implements them now; services/api/* will implement them for the real backend.

export type Product = {
  id: string
  name: string
  description: string
  quantity: string      // free text, e.g. "12 pack"
  weight: string        // e.g. "5 kg"
  size: string          // e.g. "Large"
  colour: string        // e.g. "White"
  price: number         // 2 decimal places, >= 0
  image_url: string     // absolute URL or ''
  created_at?: string   // ISO
  updated_at?: string   // ISO
}

export type NewProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>

export interface ProductsApi {
  list(): Promise<Product[]>                                 // public, sorted by name
  create(p: NewProduct): Promise<Product>                    // owner only
  updatePrice(id: string, price: number): Promise<Product>   // owner only
  remove(id: string): Promise<void>                          // owner only
  uploadImage(file: File): Promise<string>                   // owner only -> returns image URL
}

export type Session = { email: string }

export interface AuthApi {
  getSession(): Promise<Session | null>
  signIn(email: string, password: string): Promise<Session>  // throws ApiError('INVALID_CREDENTIALS')
  signOut(): Promise<void>
  onChange?(cb: (session: Session | null) => void): () => void // optional; returns unsubscribe
}

export class ApiError extends Error {
  code: 'INVALID_CREDENTIALS' | 'NETWORK' | 'FORBIDDEN' | 'VALIDATION' | 'UNKNOWN'
}
