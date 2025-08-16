import React from "react"

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: React.TableHTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`[&_tr]:border-b ${className}`} {...props} />
}

export function TableBody({ className, ...props }: React.TableHTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
}

export function TableRow({ className, ...props }: React.TableHTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.TableHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.TableHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
}
