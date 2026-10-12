import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return <div data-slot="skeleton" className={cn('animate-pulse rounded-xl bg-ink/10', className)} {...props} />
}

export { Skeleton }
