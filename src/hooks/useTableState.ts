import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import type {
  FilterCondition,
  SortConfig,
  PaginationState,
} from "../types/filter.types";
import { applyFilters } from "../engine/filterEngine";
import { nestedGet } from "../utils/formatUtils";
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay]);

  return debounced;
}

// 🔥 Filtered Data
export function useFilteredData<TRow>(
  data: TRow[],
  conditions: FilterCondition[],
) {
  const debouncedConditions = useDebounce(conditions, 250);

  const filteredData = useMemo(() => {
    if (!debouncedConditions.length) return data;
    return applyFilters(data, debouncedConditions);
  }, [data, debouncedConditions]);

  return {
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
  };
}

// 🔥 Table State
interface UseTableStateOptions {
  rowIdKey?: string;
  defaultPageSize?: number;
}

export function useTableState<TRow>(
  data: TRow[],
  totalCount: number,
  filteredCount: number,
  options: UseTableStateOptions = {},
) {
  const { rowIdKey = "id", defaultPageSize = 10 } = options;

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Reset page
  useEffect(() => {
    setPage(1);
  }, [filteredCount]);

  // 🔥 Clean selection on data change
  useEffect(() => {
    setSelectedRows((prev) => {
      const validIds = new Set(
        data.map((row) => (row as Record<string, unknown>)[rowIdKey]),
      );

      const next = new Set<string | number>();
      prev.forEach((id) => {
        if (validIds.has(id)) next.add(id);
      });

      return next;
    });
  }, [data, rowIdKey]);

  // 🔥 Memo all IDs
  const allIds = useMemo<(string | number)[]>(
    () =>
      data.map(
        (row) => (row as Record<string, unknown>)[rowIdKey] as string | number,
      ),
    [data, rowIdKey],
  );

  // 🔥 Optimized sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;

    return [...data]
      .map((row) => ({
        row,
        value: nestedGet(row as Record<string, unknown>, key),
      }))
      .sort((a, b) => {
        const av = a.value;
        const bv = b.value;

        let cmp = 0;

        if (av == null && bv == null) cmp = 0;
        else if (av == null) cmp = 1;
        else if (bv == null) cmp = -1;
        else if (typeof av === "string" && typeof bv === "string") {
          cmp = av.localeCompare(bv);
        } else {
          cmp = av < bv ? -1 : av > bv ? 1 : 0;
        }

        return direction === "asc" ? cmp : -cmp;
      })
      .map((item) => item.row);
  }, [data, sortConfig]);

  // 🔥 Optimized pagination
  const pagedRows = useMemo(() => {
    if (pageSize >= sortedData.length) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // 🔥 Handlers
  const onSort = useCallback((key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  }, []);

  const onRowSelect = useCallback((id: string | number, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }, []);

  const onSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedRows(checked ? new Set(allIds) : new Set());
    },
    [allIds],
  );

  const onPageChange = useCallback((p: number) => setPage(p), []);

  const onPageSizeChange = useCallback((s: number) => {
    setPageSize(s);
    setPage(1);
  }, []);

  const pagination: PaginationState = {
    page,
    pageSize,
    totalCount,
    filteredCount,
  };

  return {
    pagedRows,
    sortConfig,
    selectedRows,
    pagination,
    onSort,
    onRowSelect,
    onSelectAll,
    onPageChange,
    onPageSizeChange,
    rowIdKey,
  };
}
