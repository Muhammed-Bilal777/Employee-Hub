import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Alert, Collapse } from '@mui/material';
import type { Employee } from '../types/data.types';
import { Users, Sparkles, Database } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { useFilterState } from '../hooks/useFilterState';
import { useFilteredData } from '../hooks/useTableState';
import { useTableState } from '../hooks/useTableState';
import { FilterPanel } from '../components/FilterSystem/FilterPanel';
import { DataTable, RecordCount, TableSkeleton } from '../components/DataTable/DataTable';
import { ExportMenu } from '../components/shared/ExportMenu';
import { employeeConfig } from '../config/employeeConfig';
export const EmployeesPage: React.FC = () => {
    // ── Data fetching 
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        employeeService.fetchAll()
            .then(setEmployees)
            .catch(() => setError('Failed to load employee data.'))
            .finally(() => setLoading(false));
    }, []);

    // ── Headless hooks 
    const filterState = useFilterState({
        config: employeeConfig,
        defaultFilters: employeeConfig.defaultFilters,
        persist: true,
    });

    const { filteredData, totalCount, filteredCount } = useFilteredData<Employee>(
        employees,
        filterState.conditions,
    );

    const tableState = useTableState<Employee>(filteredData, totalCount, filteredCount, {
        rowIdKey: 'id',
        defaultPageSize: 10,
    });
    const selectedData = filteredData.filter((row) =>
        tableState.selectedRows.has(row.id)
    );
    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            {/* Page Header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
                mb={3}
            >

                <Box display="flex" alignItems="center" gap={2}>

                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                        }}
                    >
                        <Users size={24} color="white" />
                    </Box>

                    {/* Title */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h5" fontWeight={700}>
                                Employee Directory
                            </Typography>

                            {/* Badge */}
                            <Box
                                sx={{
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                    backgroundColor: 'rgba(34,197,94,0.15)',
                                    color: '#22c55e',
                                    border: '1px solid rgba(34,197,94,0.3)',
                                }}
                            >
                                LIVE
                            </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                            Manage, filter and explore employee data efficiently
                        </Typography>
                    </Box>
                </Box>

                {/* Right Section (optional actions/info) */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Database size={16} />
                        <Typography variant="caption" color="text.secondary">
                            Data synced
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Sparkles size={16} />
                        <Typography variant="caption" color="text.secondary">
                            Smart Filters
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Collapse in={Boolean(error)}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            </Collapse>

            <Stack spacing={2}>

                <FilterPanel
                    config={employeeConfig}
                    conditions={filterState.conditions}
                    onAdd={filterState.addCondition}
                    onRemove={filterState.removeCondition}
                    onUpdate={filterState.updateCondition}
                    onClear={filterState.clearAll}
                    activeCount={filterState.activeCount}
                    disabled={loading}
                />

                {/* Table Toolbar */}
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary">Loading…</Typography>
                    ) : (
                        <RecordCount total={totalCount} filtered={filteredCount} />
                    )}
                    <ExportMenu<Record<string, unknown>>
                        rows={
                            (selectedData.length > 0 ? selectedData : filteredData) as unknown as Record<string, unknown>[]
                        }
                        filename="employees"
                        disabled={loading}
                    />
                </Box>

                {/* Data Table */}
                {loading ? (
                    <TableSkeleton rows={10} cols={employeeConfig.columns.length} />
                ) : (
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        <DataTable<Employee>
                            columns={employeeConfig.columns}
                            rows={tableState.pagedRows}
                            rowIdKey="id"
                            sortConfig={tableState.sortConfig}
                            selectedRows={tableState.selectedRows}
                            pagination={tableState.pagination}
                            onSort={tableState.onSort}
                            onRowSelect={tableState.onRowSelect}
                            onSelectAll={tableState.onSelectAll}
                            onPageChange={tableState.onPageChange}
                            onPageSizeChange={tableState.onPageSizeChange}
                        />
                    </Box>
                )}
            </Stack>
        </Box>
    );
};