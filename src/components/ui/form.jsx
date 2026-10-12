import * as React from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const Form = FormProvider

const FieldContext = React.createContext({})

/** Wraps one field: <FormField control name render={({ field }) => <Input {...field} />} /> inside <FormItem>. */
function FormField({ name, label, description, className, render, ...props }) {
  const { control, formState } = useFormContext()
  const id = React.useId()
  const error = formState.errors?.[name]
  return (
    <FieldContext.Provider value={{ id, name }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Controller
          control={control}
          name={name}
          {...props}
          render={({ field }) =>
            render({
              field: { ...field, id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-msg` : undefined },
            })
          }
        />
        {description && !error && <p className="text-sm text-muted-foreground">{description}</p>}
        {error && (
          <p id={`${id}-msg`} role="alert" className="text-sm font-medium text-destructive">
            {String(error.message)}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

export { Form, FormField }
