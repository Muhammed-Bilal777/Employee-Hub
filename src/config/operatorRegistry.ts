import type {
  Operator,
  FieldType,
  FilterValue,
  DateRange,
  NumberRange,
} from "../types/filter.types";

// ─── Helpers 
const toString = (v: unknown): string =>
  v == null ? "" : String(v).toLowerCase().trim();
const toNum = (v: unknown): number => Number(v);

const parseDate = (v: string | null | undefined): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// ─── Operator Definitions  
const operators: Operator[] = [
  // ── Text 
  {
    key: "text_equals",
    label: "Equals",
    fieldTypes: ["text"],
    apply: (cell, val) => toString(cell) === toString(val),
  },
  {
    key: "text_not_equals",
    label: "Not Equals",
    fieldTypes: ["text"],
    apply: (cell, val) => toString(cell) !== toString(val),
  },
  {
    key: "text_contains",
    label: "Contains",
    fieldTypes: ["text"],
    apply: (cell, val) => toString(cell).includes(toString(val)),
  },
  {
    key: "text_not_contains",
    label: "Does Not Contain",
    fieldTypes: ["text"],
    apply: (cell, val) => !toString(cell).includes(toString(val)),
  },
  {
    key: "text_starts_with",
    label: "Starts With",
    fieldTypes: ["text"],
    apply: (cell, val) => toString(cell).startsWith(toString(val)),
  },
  {
    key: "text_ends_with",
    label: "Ends With",
    fieldTypes: ["text"],
    apply: (cell, val) => toString(cell).endsWith(toString(val)),
  },

  // ── Number  
  {
    key: "num_equals",
    label: "Equals",
    fieldTypes: ["number"],
    apply: (cell, val) => toNum(cell) === toNum(val),
  },
  {
    key: "num_gt",
    label: "Greater Than",
    fieldTypes: ["number"],
    apply: (cell, val) => toNum(cell) > toNum(val),
  },
  {
    key: "num_lt",
    label: "Less Than",
    fieldTypes: ["number"],
    apply: (cell, val) => toNum(cell) < toNum(val),
  },
  {
    key: "num_gte",
    label: "Greater Than or Equal",
    fieldTypes: ["number"],
    apply: (cell, val) => toNum(cell) >= toNum(val),
  },
  {
    key: "num_lte",
    label: "Less Than or Equal",
    fieldTypes: ["number"],
    apply: (cell, val) => toNum(cell) <= toNum(val),
  },

  // ── Date  
  {
    key: "date_between",
    label: "Between",
    fieldTypes: ["date"],
    validate: (val) => {
      const r = val as DateRange;
      return !!(r?.from || r?.to);
    },
    apply: (cell, val) => {
      const range = val as DateRange;
      const cellDate = parseDate(cell as string);
      if (!cellDate) return false;
      const from = parseDate(range?.from);
      const to = parseDate(range?.to);
      if (from && cellDate < from) return false;
      if (to) {
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (cellDate > toEnd) return false;
      }
      return true;
    },
  },
  {
    key: "date_before",
    label: "Before",
    fieldTypes: ["date"],
    apply: (cell, val) => {
      const cellDate = parseDate(cell as string);
      const valDate = parseDate((val as DateRange)?.from ?? (val as string));
      if (!cellDate || !valDate) return false;
      return cellDate < valDate;
    },
  },
  {
    key: "date_after",
    label: "After",
    fieldTypes: ["date"],
    apply: (cell, val) => {
      const cellDate = parseDate(cell as string);
      const valDate = parseDate((val as DateRange)?.from ?? (val as string));
      if (!cellDate || !valDate) return false;
      return cellDate > valDate;
    },
  },

  // ── Amount / Currency  
  {
    key: "amount_between",
    label: "Between",
    fieldTypes: ["amount"],
    validate: (val) => {
      const r = val as NumberRange;
      return r?.min != null || r?.max != null;
    },
    apply: (cell, val) => {
      const range = val as NumberRange;
      const num = toNum(cell);
      if (range?.min != null && num < range.min) return false;
      if (range?.max != null && num > range.max) return false;
      return true;
    },
  },
  {
    key: "amount_gt",
    label: "Greater Than",
    fieldTypes: ["amount"],
    apply: (cell, val) => toNum(cell) > toNum((val as NumberRange)?.min ?? val),
  },
  {
    key: "amount_lt",
    label: "Less Than",
    fieldTypes: ["amount"],
    apply: (cell, val) => toNum(cell) < toNum((val as NumberRange)?.max ?? val),
  },

  // ── Single Select 
  {
    key: "select_is",
    label: "Is",
    fieldTypes: ["single-select"],
    apply: (cell, val) => toString(cell) === toString(val),
  },
  {
    key: "select_is_not",
    label: "Is Not",
    fieldTypes: ["single-select"],
    apply: (cell, val) => toString(cell) !== toString(val),
  },

  // ── Multi Select 
  {
    key: "multi_in",
    label: "In",
    fieldTypes: ["multi-select"],
    apply: (cell, val) => {
      const selected = (val as string[]) ?? [];
      if (!selected.length) return true;
      const cellArr = Array.isArray(cell)
        ? cell.map(toString)
        : [toString(cell)];
      // logic (AND/OR) handled at engine level via multiLogic
      return selected.some((s) => cellArr.includes(toString(s)));
    },
  },
  {
    key: "multi_not_in",
    label: "Not In",
    fieldTypes: ["multi-select"],
    apply: (cell, val) => {
      const selected = (val as string[]) ?? [];
      if (!selected.length) return true;
      const cellArr = Array.isArray(cell)
        ? cell.map(toString)
        : [toString(cell)];
      return !selected.some((s) => cellArr.includes(toString(s)));
    },
  },

  // ── Boolean  
  {
    key: "bool_is",
    label: "Is",
    fieldTypes: ["boolean"],
    apply: (cell, val) => Boolean(cell) === Boolean(val),
  },
];

// ─── Registry Class 
class OperatorRegistry {
  private map: Map<string, Operator> = new Map();

  constructor(initial: Operator[]) {
    initial.forEach((op) => this.map.set(op.key, op));
  }

  /** Register a new operator at runtime — enables extensibility */
  register(op: Operator): void {
    this.map.set(op.key, op);
  }

  getByKey(key: string): Operator | undefined {
    return this.map.get(key);
  }

  getByFieldType(type: FieldType): Operator[] {
    return Array.from(this.map.values()).filter((op) =>
      op.fieldTypes.includes(type),
    );
  }

  getDefaultOperatorKey(type: FieldType): string {
    const ops = this.getByFieldType(type);
    return ops[0]?.key ?? "";
  }

  all(): Operator[] {
    return Array.from(this.map.values());
  }
}

export const operatorRegistry = new OperatorRegistry(operators);

/** Helper: get operators for a field type as label/value pairs */
export const getOperatorOptions = (type: FieldType) =>
  operatorRegistry
    .getByFieldType(type)
    .map((op) => ({ label: op.label, value: op.key }));

export type { Operator, FilterValue };
