"use client"

import React, { useState, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Box,
} from "@mui/material"

const DataTable = ({ data, columns, enableCheckbox = false, onSelectionChange }) => {
 

  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState({})

  // Notify parent component when selection changes
  useEffect(() => {
    if (enableCheckbox && onSelectionChange) {
      const selectedRows = Object.keys(rowSelection).map((index) => data[Number.parseInt(index)])
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, data, enableCheckbox])

  // Create checkbox column
  const checkboxColumn = React.useMemo(
    () => ({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 40,
    }),
    [],
  )

  // Add checkbox column if enabled
  const tableColumns = React.useMemo(() => {
    return enableCheckbox ? [checkboxColumn, ...columns] : columns
  }, [columns, enableCheckbox, checkboxColumn])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      globalFilter,
      sorting,
      pagination,
      rowSelection,
    },
    enableRowSelection: enableCheckbox,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div >
      <Paper sx={{ boxShadow: "none",backgroundColor:'transparent'}}>
        <TextField
          value={globalFilter ?? ""}
          size="small"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          variant="outlined"
          sx={{
            borderRadius: "12px",
            mb:4,
            ".MuiOutlinedInput-root": {
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              "& fieldset": { border: "none" },
              "&:hover": {
                border: "2px solid #0076bf",
              },
              "&.Mui-focused": {
                border: "2px solid #0076bf",
                "& fieldset": { border: "none" },
                svg: {
                  path: {
                    fill: "#0076bf",
                  },
                },
              },
            },
           
          }}
        />
        <TableContainer sx={{ maxHeight: 440, height: "auto", overflowX: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
          <TableHead>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header, index) => (
        <TableCell
          key={header.id}
          align="left"
          sortDirection={header.column.getIsSorted()}
          sx={{
            minWidth: header.column.columnDef.id === "select" ? "60px" : "150px",
            whiteSpace: "nowrap",
            borderTopLeftRadius: index === 0 ? "8px" : 0, // First cell
            borderTopRightRadius: index === headerGroup.headers.length - 1 ? "8px" : 0, // Last cell
            overflow: "hidden", // Ensures border-radius applies correctly
          }}
        >
          {header.isPlaceholder ? null : header.column.columnDef.id === "select" ? (
            flexRender(header.column.columnDef.header, header.getContext())
          ) : (
            <TableSortLabel
              active={header.column.getIsSorted() !== false}
              direction={header.column.getIsSorted() || undefined}
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableSortLabel>
          )}
        </TableCell>
      ))}
    </TableRow>
  ))}
</TableHead>

            <TableBody>
  {table.getRowModel().rows.length > 0 ? (
    table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        hover={enableCheckbox}
        onClick={enableCheckbox ? () => row.toggleSelected() : undefined}
        selected={row.getIsSelected()}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            sx={{
              minWidth: cell.column.columnDef.id === "select" ? "60px" : "150px",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={table.getAllColumns().length} sx={{ textAlign: "center", fontWeight: "bold",fontSize:'23px' }}>
        No Data Found
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
        {table.getRowModel().rows.length > 0 && <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, newPage) => {
            table.setPageIndex(newPage)
          }}
          onRowsPerPageChange={(e) => {
            const size = e.target.value ? Number(e.target.value) : 10
            table.setPageSize(size)
          }}
        />}
      </Paper>
    </div>
  )
}

export default DataTable

