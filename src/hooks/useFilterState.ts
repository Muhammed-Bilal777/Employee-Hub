import { useState, useCallback, useEffect } from "react";
import type { FilterCondition, TableConfig } from "../types/filter.types";
import { operatorRegistry } from "../config/operatorRegistry";
import { generateId } from "../utils/formatUtils";

interface UseFilterStateOptions<TRow> {
  config: TableConfig<TRow>;
  defaultFilters?: FilterCondition[];
  persist?: boolean; // persist to localStorage
}

export function useFilterState<TRow>({
  config,
  defaultFilters,
  persist = false,
}: UseFilterStateOptions<TRow>) {
  const storageKey = `filter-state-${config.id}`;

  const getInitial = (): FilterCondition[] => {
    if (persist) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) return JSON.parse(stored) as FilterCondition[];
      } catch {
        /* ignore */
      }
    }
    return defaultFilters ?? [];
  };

  const [conditions, setConditions] = useState<FilterCondition[]>(getInitial);

  // Persist to localStorage
  useEffect(() => {
    if (persist) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(conditions));
      } catch {
        /* ignore */
      }
    }
  }, [conditions, persist, storageKey]);

  const addCondition = useCallback(
    (fieldKey?: string) => {
      const field = fieldKey
        ? config.fields.find((f) => f.key === fieldKey)
        : config.fields[0];
      if (!field) return;

      const operatorKey =
        field.defaultOperator ??
        operatorRegistry.getDefaultOperatorKey(field.type);

      setConditions((prev) => [
        ...prev,
        { id: generateId(), fieldKey: field.key, operatorKey, value: null },
      ]);
    },
    [config.fields],
  );

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCondition = useCallback(
    (id: string, patch: Partial<FilterCondition>) => {
      setConditions((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const updated = { ...c, ...patch };

          // If field changed → reset operator + value
          if (patch.fieldKey && patch.fieldKey !== c.fieldKey) {
            const newField = config.fields.find(
              (f) => f.key === patch.fieldKey,
            );
            if (newField) {
              updated.operatorKey =
                newField.defaultOperator ??
                operatorRegistry.getDefaultOperatorKey(newField.type);
              updated.value = null;
              updated.multiLogic = undefined;
            }
          }

          return updated;
        }),
      );
    },
    [config.fields],
  );

  const clearAll = useCallback(() => setConditions([]), []);

  const resetToDefault = useCallback(() => {
    setConditions(defaultFilters ?? []);
  }, [defaultFilters]);

  return {
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    clearAll,
    resetToDefault,
    activeCount: conditions.length,
  };
}
