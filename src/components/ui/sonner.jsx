import { Toaster as Sonner } from 'sonner'

function Toaster(props) {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: '!rounded-full !border-ink/10 !bg-ink !text-background !font-sans !px-5',
          success: '!bg-ink',
          error: '!bg-destructive !text-white',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
