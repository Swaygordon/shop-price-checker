// ProductsApi implementation (see ../contract.d.ts) backed by Supabase.
import { supabase } from '../supabase/client'
import { toApiError } from '../supabase/mapError'

const TABLE = 'products'
const BUCKET = 'product-images'

const toProduct = (row) => ({
  id: row.id,
  name: row.name,
  size: row.size ?? undefined,
  unit: row.unit ?? undefined,
  price: row.price === null || row.price === undefined ? null : Number(row.price),
  image_url: row.image_url ?? '',
  created_at: row.created_at,
  updated_at: row.updated_at,
})

export const productsApi = {
  /** Public. All products, sorted by name. */
  async list() {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').order('name', { ascending: true })
      if (error) throw error
      return (data ?? []).map(toProduct)
    } catch (e) {
      throw toApiError(e)
    }
  },

  /** Owner only. */
  async create(p) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({
          name: p.name,
          size: p.size ?? null,
          unit: p.unit ?? null,
          price: p.price ?? null,
          image_url: p.image_url ?? '',
        })
        .select()
        .single()
      if (error) throw error
      return toProduct(data)
    } catch (e) {
      throw toApiError(e)
    }
  },

  /** Owner only. */
  async updatePrice(id, price) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .update({ price })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return toProduct(data)
    } catch (e) {
      throw toApiError(e)
    }
  },

  /** Owner only. */
  async remove(id) {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id)
      if (error) throw error
    } catch (e) {
      throw toApiError(e)
    }
  },

  /** Owner only. Uploads to the product-images bucket; returns the public URL. */
  async uploadImage(file) {
    try {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
      const path = `${crypto.randomUUID()}.${ext.toLowerCase()}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: '3600',
      })
      if (error) throw error
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return data.publicUrl
    } catch (e) {
      throw toApiError(e)
    }
  },
}
