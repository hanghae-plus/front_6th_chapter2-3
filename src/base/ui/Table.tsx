import type { ComponentPropsWithRef } from "react"

import { mergeClasses } from "@/base/lib/styles"

type TableRootProps = ComponentPropsWithRef<"table">
type TableHeaderProps = ComponentPropsWithRef<"thead">
type TableBodyProps = ComponentPropsWithRef<"tbody">
type TableRowProps = ComponentPropsWithRef<"tr">
type TableHeadProps = ComponentPropsWithRef<"th">
type TableCellProps = ComponentPropsWithRef<"td">

function TableRoot({ className, ...rest }: TableRootProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={mergeClasses("w-full table-fixed caption-bottom text-sm", className)} {...rest} />
    </div>
  )
}

function TableHeader({ className, ...rest }: TableHeaderProps) {
  return <thead className={mergeClasses("[&_tr]:border-b", className)} {...rest} />
}

function TableBody({ className, ...rest }: TableBodyProps) {
  return <tbody className={mergeClasses("[&_tr:last-child]:border-0", className)} {...rest} />
}

function TableRow({ className, ...rest }: TableRowProps) {
  return (
    <tr
      className={mergeClasses(
        "hover:bg-muted/50 data-[state=selected]:bg-muted h-14 border-b transition-colors",
        className,
      )}
      {...rest}
    />
  )
}

function TableHead({ className, ...rest }: TableHeadProps) {
  return (
    <th
      className={mergeClasses(
        "text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...rest}
    />
  )
}

function TableCell({ className, ...rest }: TableCellProps) {
  return <td className={mergeClasses("p-2 align-middle [&:has([role=checkbox])]:pr-0", className)} {...rest} />
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
})
