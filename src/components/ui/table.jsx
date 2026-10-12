import * as React from 'react'
import { cn } from '@/lib/utils'

function Table({ className, ...props }) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}
const TableHeader = ({ className, ...props }) => <thead className={cn('[&_tr]:border-b', className)} {...props} />
const TableBody = ({ className, ...props }) => <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
const TableRow = ({ className, ...props }) => (
  <tr className={cn('border-b border-ink/10 transition-colors hover:bg-muted/50', className)} {...props} />
)
const TableHead = ({ className, ...props }) => (
  <th className={cn('h-10 px-3 text-left align-middle text-xs font-bold uppercase tracking-wide text-muted-foreground', className)} {...props} />
)
const TableCell = ({ className, ...props }) => <td className={cn('px-3 py-3 align-middle', className)} {...props} />

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
