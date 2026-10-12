// Real backend implementation of ProductsApi (see ../contract.d.ts).
// To be written by the backend developer at integration time. Base URL: import.meta.env.VITE_API_URL
import { ApiError } from '../errors'

const notReady = () => {
  throw new ApiError('Backend not connected yet.')
}

export const productsApi = {
  list: notReady,
  create: notReady,
  updatePrice: notReady,
  remove: notReady,
  uploadImage: notReady,
}
