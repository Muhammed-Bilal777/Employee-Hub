import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, Checkbox, Chip, Box, Typography, TablePagination,
    Paper, Skeleton,
} from '@mui/material';
import { AlertCircle } from 'lucide-react';
import type { ColumnDefinition, SortConfig, PaginationState } from '../../types/filter.types';
import { nestedGet } from '../../utils/formatUtils';


export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 8, cols = 6 }) => (
    <Table size="small" aria-label="Loading data">
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"><Skeleton variant="rounded" width={18} height={18} /></TableCell>
                {Array.from({ length: cols }).map((_, i) => (
                    <TableCell key={i}><Skeleton variant="text" width="80%" /></TableCell>
                ))}
            </TableRow>
        </TableHead>
        <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell padding="checkbox"><Skeleton variant="rounded" width={18} height={18} /></TableCell>
                    {Array.from({ length: cols }).map((_, j) => (
                        <TableCell key={j}><Skeleton variant="text" width={`${50 + Math.random() * 40}%`} /></TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);


export const EmptyState: React.FC<{ message?: string }> = ({ message = 'No records match the current filters.' }) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        gap={1.5}
        role="status"
        aria-live="polite"
    >
        <AlertCircle size={40} strokeWidth={1.5} color="#9e9e9e" />
        <Typography variant="body1" color="text.secondary">{message}</Typography>
    </Box>
);








export const RecordCount: React.FC<{ total: number; filtered: number }> = ({ total, filtered }) => (
    <Typography variant="body2" color="text.secondary" aria-live="polite" aria-atomic="true">
        Showing <strong>{filtered.toLocaleString()}</strong> of <strong>{total.toLocaleString()}</strong> records
        {filtered < total && (
            <Chip
                label={`${total - filtered} filtered out`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ ml: 1 }}
            />
        )}
    </Typography>
);


interface DataTableProps<TRow = Record<string, unknown>> {
    columns: ColumnDefinition<TRow>[];
    rows: TRow[];
    rowIdKey?: string;
    sortConfig: SortConfig | null;
    selectedRows: Set<string | number>;
    pagination: PaginationState;
    onSort: (key: string) => void;
    onRowSelect: (id: string | number, checked: boolean) => void;
    onSelectAll: (checked: boolean, ids: (string | number)[]) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    loading?: boolean;
    /** Override cell renderer per column key */
    renderCell?: (key: string, value: unknown, row: TRow) => React.ReactNode | null;
    /** Override empty state */
    renderEmpty?: () => React.ReactNode;
    /** Override skeleton */
    renderSkeleton?: () => React.ReactNode;
}
const DataRow = React.memo(function DataRow({
    row,
    columns,
    rowId,
    isSelected,
    onRowSelect,
    renderCell,
}: {
    row: any;
    columns: any[];
    rowId: string | number;
    isSelected: boolean;
    onRowSelect: (id: string | number, checked: boolean) => void;
    renderCell?: (key: string, value: unknown, row: any) => React.ReactNode | null;
}) {
    return (
        <TableRow hover selected={isSelected}>
            <TableCell padding="checkbox">
                <Checkbox
                    checked={isSelected}
                    onChange={(e) => onRowSelect(rowId, e.target.checked)}
                    size="small"
                />
            </TableCell>

            {columns.map((col) => {
                const rawVal = nestedGet(row, col.key);
                const customCell = renderCell?.(col.key, rawVal, row);

                const content =
                    customCell !== null && customCell !== undefined
                        ? customCell
                        : col.renderCell
                            ? col.renderCell(rawVal, row)
                            : String(rawVal ?? "—");

                return (
                    <TableCell key={col.key} align={col.align ?? "left"}>
                        {content}
                    </TableCell>
                );
            })}
        </TableRow>
    );
});


export function DataTable<TRow = Record<string, unknown>>({
    columns,
    rows,
    rowIdKey = 'id',
    sortConfig,
    selectedRows,
    pagination,
    onSort,
    onRowSelect,
    onSelectAll,
    onPageChange,
    onPageSizeChange,
    loading = false,
    renderCell,
    renderEmpty,
    renderSkeleton,
}: DataTableProps<TRow>) {
    const allIds = React.useMemo(
        () =>
            rows.map(
                (r) => (r as Record<string, unknown>)[rowIdKey] as string | number
            ),
        [rows, rowIdKey]
    );

    const selectionState = React.useMemo(() => {
        const allSelected =
            allIds.length > 0 && allIds.every((id) => selectedRows.has(id));
        const someSelected =
            allIds.some((id) => selectedRows.has(id)) && !allSelected;

        return { allSelected, someSelected };
    }, [allIds, selectedRows]);
    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
                {loading ? (
                    renderSkeleton ? renderSkeleton() : <TableSkeleton cols={columns.length} />
                ) : (
                    <Table size="small" aria-label="Employee data table" stickyHeader>
                        <TableHead>
                            <TableRow>
                                {/* Select all checkbox */}
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectionState.allSelected}
                                        indeterminate={selectionState.someSelected}
                                        onChange={(e) => onSelectAll(e.target.checked, allIds)}
                                        inputProps={{ 'aria-label': 'Select all rows' }}
                                        size="small"
                                    />
                                </TableCell>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        align={col.align ?? 'left'}
                                        style={{ width: col.width, whiteSpace: 'nowrap' }}
                                        sortDirection={sortConfig?.key === col.key ? sortConfig.direction : false}
                                    >
                                        {col.sortable !== false ? (
                                            <TableSortLabel
                                                active={sortConfig?.key === col.key}
                                                direction={sortConfig?.key === col.key ? sortConfig.direction : 'asc'}
                                                onClick={() => onSort(col.key)}
                                                aria-label={`Sort by ${col.label}`}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        ) : col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} sx={{ border: 0, p: 0 }}>
                                        {renderEmpty ? renderEmpty() : <EmptyState />}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => {
                                    const rowId = (row as Record<string, unknown>)[rowIdKey] as string | number;
                                    const isSelected = selectedRows.has(rowId);

                                    return (
                                        <DataRow
                                            key={rowId}
                                            row={row}
                                            columns={columns}
                                            rowId={rowId}
                                            isSelected={isSelected}
                                            onRowSelect={onRowSelect}
                                            renderCell={renderCell}
                                        />
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={pagination.filteredCount}
                page={pagination.page - 1}
                rowsPerPage={pagination.pageSize}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onPageChange={(_, p) => onPageChange(p + 1)}
                onRowsPerPageChange={(e) => onPageSizeChange(Number(e.target.value))}
                aria-label="Table pagination"
            />
        </Paper>
    );
}