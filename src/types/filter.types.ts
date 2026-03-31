// ─── Field Types ────────────────────────────────────────────────────────────
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "amount"
  | "single-select"
  | "multi-select"
  | "boolean";

// ─── Operator
export interface Operator {
  key: string;
  label: string;
  /** Which field types this operator applies to */
  fieldTypes: FieldType[];
  /** Optional: validate the filter value before applying */
  validate?: (value: FilterValue) => boolean;
  /** Core matching function — used by the filter engine */
  apply: (cellValue: unknown, filterValue: FilterValue) => boolean;
}

// ─── Filter Values
export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | DateRange
  | NumberRange
  | null
  | undefined;

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface NumberRange {
  min: number | null;
  max: number | null;
}

// ─── Filter Condition
export interface FilterCondition {
  id: string;
  fieldKey: string;
  operatorKey: string;
  value: FilterValue;

  multiLogic?: "AND" | "OR";
}

// ─── Field Definition
export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: SelectOption[];
  placeholder?: string;
  defaultOperator?: string;
  operators?: string[];
}

export interface ColumnDefinition<TRow = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  renderCell?: (value: unknown, row: TRow) => React.ReactNode;
}

// ─── Table Config
export interface TableConfig<TRow = Record<string, unknown>> {
  id: string;
  fields: FieldDefinition[];
  columns: ColumnDefinition<TRow>[];
  defaultFilters?: FilterCondition[];
}

// ─── Sort Config
export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// ─── Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  filteredCount: number;
}

// ─── Filter State (returned by useFilterState)
export interface FilterState {
  conditions: FilterCondition[];
  addCondition: (fieldKey?: string) => void;
  removeCondition: (id: string) => void;
  updateCondition: (id: string, patch: Partial<FilterCondition>) => void;
  clearAll: () => void;
  activeCount: number;
}

// ─── Filtered Data State (returned by useFilteredData)
export interface FilteredDataState<TRow> {
  filteredData: TRow[];
  totalCount: number;
  filteredCount: number;
}

// ─── Table State (returned by useTableState)
export interface TableStateResult<TRow> {
  pagedRows: TRow[];
  sortConfig: SortConfig | null;
  selectedRows: Set<string | number>;
  pagination: PaginationState;
  onSort: (key: string) => void;
  onRowSelect: (id: string | number, checked: boolean) => void;
  onSelectAll: (checked: boolean, ids: (string | number)[]) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// ─── Export Types
export type ExportFormat = "csv" | "json";
