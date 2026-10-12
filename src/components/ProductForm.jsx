import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImagePlus, Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { productsApi } from '@/services'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80, 'Keep it under 80 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Enter a price of 0 or more'),
  description: z.string().max(200, 'Keep it under 200 characters'),
  quantity: z.string().max(40),
  weight: z.string().max(40),
  size: z.string().max(40),
  colour: z.string().max(40),
})

const defaults = { name: '', price: '', description: '', quantity: '', weight: '', size: '', colour: '' }

export default function ProductForm({ onCreated }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const fileRef = useRef(null)
  const { isSubmitting } = form.formState

  useEffect(() => {
    if (!file) return setPreview('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function clearImage() {
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function onSubmit(values) {
    try {
      const image_url = file ? await productsApi.uploadImage(file) : ''
      const row = await productsApi.create({ ...values, price: Number(values.price), image_url })
      onCreated(row)
      toast.success(`Added “${row.name}”`)
      form.reset(defaults)
      clearImage()
    } catch (e) {
      toast.error(e.message || 'Could not add item')
    }
  }

  const text = (name, label, placeholder, className) => (
    <FormField
      name={name}
      label={label}
      className={className}
      render={({ field }) => <Input placeholder={placeholder} {...field} />}
    />
  )

  return (
    <Card>
      <CardHeader><CardTitle>Add item</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
            {text('name', 'Name', 'e.g. Jasmine Rice')}
            <FormField
              name="price"
              label="Price"
              render={({ field }) => <Input type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" {...field} />}
            />
            <FormField
              name="description"
              label="Description"
              className="sm:col-span-2"
              render={({ field }) => <Textarea rows={2} placeholder="Short description" {...field} />}
            />
            {text('quantity', 'Quantity', 'e.g. 12 pack')}
            {text('weight', 'Weight', 'e.g. 5 kg')}
            {text('size', 'Size', 'e.g. Large')}
            {text('colour', 'Colour', 'e.g. White')}

            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="image" className="text-sm font-bold">Image</label>
              <div className="flex items-center gap-4">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-dashed border-input bg-muted">
                  {preview ? <img src={preview} alt="Selected preview" className="size-full object-cover" /> : <ImagePlus className="text-muted-foreground" aria-hidden="true" />}
                </div>
                <Input
                  id="image"
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="h-auto min-h-11 py-2"
                />
                {file && (
                  <Button type="button" variant="ghost" size="icon" onClick={clearImage} aria-label="Remove image">
                    <X />
                  </Button>
                )}
              </div>
            </div>

            <Button type="submit" variant="ink" size="lg" disabled={isSubmitting} className="sm:col-span-2">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />} {isSubmitting ? 'Saving…' : 'Add item'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
