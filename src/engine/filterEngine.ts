import type {
  FilterCondition,
  FilterValue,
  DateRange,
  NumberRange,
} from "../types/filter.types";
import { operatorRegistry } from "../config/operatorRegistry";
import { nestedGet } from "../utils/formatUtils";

// ─── Multi-select AND/OR override 
function applyMultiSelect(
  cellValue: unknown,
  filterValue: FilterValue,
  operatorKey: string,
  multiLogic: "AND" | "OR" = "OR",
): boolean {
  const selected = (filterValue as string[]) ?? [];
  if (!selected.length) return true;

  const cellArr = Array.isArray(cellValue)
    ? cellValue.map((v) => String(v).toLowerCase())
    : [String(cellValue ?? "").toLowerCase()];

  const isIn = operatorKey === "multi_in";

  if (multiLogic === "AND") {
    // All selected values must exist in cell
    const match = selected.every((s) =>
      cellArr.includes(String(s).toLowerCase()),
    );
    return isIn ? match : !match;
  } else {
    // Any selected value exists in cell
    const match = selected.some((s) =>
      cellArr.includes(String(s).toLowerCase()),
    );
    return isIn ? match : !match;
  }
}

// ─── Single condition evaluator  
function evaluateCondition(row: unknown, condition: FilterCondition): boolean {
  const { fieldKey, operatorKey, value, multiLogic } = condition;

  // Skip empty / unset conditions gracefully
  if (!fieldKey || !operatorKey) return true;
  if (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    // For ranges, skip if both sides are null
    if (typeof value === "object" && value !== null) {
      const range = value as unknown as DateRange | NumberRange;
      const isEmpty =
        ("from" in range && range.from == null && range.to == null) ||
        ("min" in range && range.min == null && range.max == null);
      if (isEmpty) return true;
    } else {
      return true;
    }
  }

  const cellValue = nestedGet(row as Record<string, unknown>, fieldKey);

  // Multi-select: delegate to logic-aware handler
  if (operatorKey === "multi_in" || operatorKey === "multi_not_in") {
    return applyMultiSelect(cellValue, value, operatorKey, multiLogic);
  }

  const operator = operatorRegistry.getByKey(operatorKey);
  if (!operator) return true;

  return operator.apply(cellValue, value);
}

// ─── Main filter engine: AND across different fields  
export function applyFilters<TRow>(
  data: TRow[],
  conditions: FilterCondition[],
): TRow[] {
  const active = conditions.filter((c) => {
    if (!c.fieldKey || !c.operatorKey) return false;
    const v = c.value;
    if (v == null || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    if (typeof v === "object" && v !== null) {
      if (
        "from" in v &&
        (v as DateRange).from == null &&
        (v as DateRange).to == null
      )
        return false;
      if (
        "min" in v &&
        (v as NumberRange).min == null &&
        (v as NumberRange).max == null
      )
        return false;
    }
    return true;
  });

  if (!active.length) return data;

  return data.filter((row) =>
    // AND across all active conditions
    active.every((condition) => evaluateCondition(row, condition)),
  );
}
