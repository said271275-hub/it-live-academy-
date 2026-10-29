import { useState, useMemo } from 'react'

export function useTable({ data = [], initialPageSize = 10, searchKeys = ['name'] }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [selectedIds, setSelectedIds] = useState([])

  // Filtered & Searched data
  const processedData = useMemo(() => {
    let result = [...data]

    // Search
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(item =>
        searchKeys.some(key => {
          const val = item[key]
          return val ? String(val).toLowerCase().includes(query) : false
        })
      )
    }

    // Dynamic Filters
    Object.keys(filters).forEach(key => {
      const val = filters[key]
      if (val && val !== 'ALL') {
        result = result.filter(item => String(item[key]) === String(val))
      }
    })

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        let valA = a[sortBy] ?? ''
        let valB = b[sortBy] ?? ''
        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, search, filters, sortBy, sortDirection, searchKeys])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedData.slice(start, start + pageSize)
  }, [processedData, currentPage, pageSize])

  // Sorting helper
  const handleSort = (field) => {
    if (sortBy === field) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else {
        setSortBy(null)
        setSortDirection('asc')
      }
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  // Selection helpers
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedData.map(item => item.id))
    }
  }

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return {
    search,
    setSearch,
    filters,
    setFilter: (key, val) => {
      setFilters(prev => ({ ...prev, [key]: val }))
      setCurrentPage(1)
    },
    resetFilters: () => {
      setFilters({})
      setSearch('')
      setCurrentPage(1)
    },
    sortBy,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize: (size) => {
      setPageSize(size)
      setCurrentPage(1)
    },
    totalPages,
    totalItems: processedData.length,
    data: paginatedData,
    allFilteredData: processedData,
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelectOne,
  }
}
