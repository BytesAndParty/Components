import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { DataTable } from './data-table'
import { ColumnDef } from '@tanstack/react-table'

interface TestData {
  id: string
  name: string
  age: number
}

const columns: ColumnDef<TestData, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
]

const data: TestData[] = [
  { id: '1', name: 'Alice', age: 25 },
  { id: '2', name: 'Bob', age: 30 },
  { id: '3', name: 'Charlie', age: 35 },
]

describe('DataTable', () => {
  it('renders table headers and data correctly', () => {
    render(<DataTable columns={columns} data={data} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('handles row selection if enabled', () => {
    render(<DataTable columns={columns} data={data} enableRowSelection />)
    
    // Check for checkboxes (one in header, one per row)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(data.length + 1)
    
    // Select first row
    fireEvent.click(checkboxes[1])
    expect(checkboxes[1]).toBeChecked()
  })

  it('handles sorting', async () => {
    render(<DataTable columns={columns} data={data} />)
    
    const nameHeader = screen.getByText('Name')
    
    // Click header to sort
    fireEvent.click(nameHeader)
    
    const rows = screen.getAllByRole('row').slice(1) // exclude header
    expect(within(rows[0]).getByText('Alice')).toBeInTheDocument()
  })

  it('handles pagination', async () => {
    // Render with small page size
    render(<DataTable columns={columns} data={data} pageSize={1} />)
    
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    
    // Click next page
    const nextButton = screen.getByRole('button', { name: /nächste/i })
    fireEvent.click(nextButton)
    
    // Since AnimatePresence might keep the old row while animating out,
    // we use waitFor to check when it's gone.
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    })
    
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
