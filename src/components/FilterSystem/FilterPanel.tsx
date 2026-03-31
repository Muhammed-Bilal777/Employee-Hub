import React, { useCallback } from 'react';
import {
    Box, Button, Typography, Divider, Paper, Chip, Stack,
} from '@mui/material';
import { Plus, Trash2, Filter } from 'lucide-react';
import type { FilterCondition, TableConfig, FilterValue, DateRange, NumberRange } from '../../types/filter.types';
import type { Operator } from '../../config/operatorRegistry';
import { operatorRegistry } from '../../config/operatorRegistry';
import { FilterRow } from './FilterRow';
import {
    TextInput, NumberInput, DateRangeInput, AmountRangeInput,
    SingleSelectInput, MultiSelectInput, BooleanInput,
} from '../inputs';
import { ActionButton } from '../buttons/Button';

interface FilterPanelProps<TRow> {
    config: TableConfig<TRow>;
    conditions: FilterCondition[];
    onAdd: (fieldKey?: string) => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, patch: Partial<FilterCondition>) => void;
    onClear: () => void;
    activeCount: number;
    disabled?: boolean;
}

export function FilterPanel<TRow>({
    config,
    conditions,
    onAdd,
    onRemove,
    onUpdate,
    onClear,
    activeCount,
    disabled = false,
}: FilterPanelProps<TRow>) {
    // Derive operators for a given field
    const getOperators = useCallback(
        (fieldKey: string): Operator[] => {
            const field = config.fields.find((f) => f.key === fieldKey);
            if (!field) return [];
            const all = operatorRegistry.getByFieldType(field.type);
            if (field.operators?.length) return all.filter((op) => field.operators!.includes(op.key));
            return all;
        },
        [config.fields],
    );

    // Inject the correct input component based on field type — zero logic in presentational layer
    const renderInput = useCallback(
        (condition: FilterCondition, field: typeof config.fields[0]): React.ReactNode => {
            const onValueChange = (val: FilterValue) => onUpdate(condition.id, { value: val });

            switch (field.type) {
                case 'text':
                    return (
                        <TextInput
                            value={(condition.value as string) ?? ''}
                            onChange={onValueChange}
                            placeholder={field.placeholder}
                            aria-label={`${field.label} filter value`}
                        />
                    );
                case 'number':
                    return (
                        <NumberInput
                            value={(condition.value as number) ?? ''}
                            onChange={onValueChange}
                            placeholder={field.placeholder}
                            aria-label={`${field.label} filter value`}
                        />
                    );
                case 'date':
                    return (
                        <DateRangeInput
                            value={(condition.value as DateRange) ?? { from: null, to: null }}
                            onChange={onValueChange}
                        />
                    );
                case 'amount':
                    return (
                        <AmountRangeInput
                            value={(condition.value as NumberRange) ?? { min: null, max: null }}
                            onChange={onValueChange}
                        />
                    );
                case 'single-select':
                    return (
                        <SingleSelectInput
                            value={(condition.value as string) ?? ''}
                            onChange={onValueChange}
                            options={field.options ?? []}
                            aria-label={`${field.label} filter value`}
                        />
                    );
                case 'multi-select':
                    return (
                        <MultiSelectInput
                            value={(condition.value as string[]) ?? []}
                            onChange={onValueChange}
                            options={field.options ?? []}
                            multiLogic={condition.multiLogic ?? 'OR'}
                            onMultiLogicChange={(logic) => onUpdate(condition.id, { multiLogic: logic })}
                        />
                    );
                case 'boolean':
                    return (
                        <BooleanInput
                            value={(condition.value as boolean) ?? false}
                            onChange={onValueChange}
                            label={field.label}
                        />
                    );
                default:
                    return null;
            }
        },
        [onUpdate],
    );

    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}
            role="region"
            aria-label="Filter panel"
        >
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Filter size={18} />
                    <Typography variant="subtitle2" fontWeight={600}>Filters</Typography>
                    {activeCount > 0 && (
                        <Chip
                            label={activeCount}
                            size="small"
                            color="primary"
                            aria-label={`${activeCount} active filters`}
                        />
                    )}
                </Box>
                <Stack direction="row" spacing={1}>
                    {activeCount > 0 && (
                        <Button
                            size="small"
                            color="error"
                            startIcon={<Trash2 size={14} />}
                            onClick={onClear}
                            aria-label="Clear all filters"
                        >
                            Clear all
                        </Button>
                    )}
                    {/* <Button
                        size="small"
                        variant="contained"
                        startIcon={<Plus size={14} />}
                        onClick={() => onAdd()}
                        disabled={disabled}
                        aria-label="Add filter"
                    >
                        Add Filter
                    </Button> */}

                    <ActionButton
                        text="Add Filter"
                        onClick={() => onAdd()}
                        icon={Plus}
                        color="success"
                        size="small"
                        disabled={disabled}
                        ariaLabel="Add filter"
                    />
                </Stack>
            </Box>

            {conditions.length > 0 && <Divider sx={{ mb: 2 }} />}

            {/* Filter rows */}
            <Stack spacing={1.5} role="list" aria-label="Active filter conditions">
                {conditions.map((condition, idx) => {
                    const operators = getOperators(condition.fieldKey);
                    return (
                        <Box key={condition.id} role="listitem">
                            {idx > 0 && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mb: 0.75, fontWeight: 600, letterSpacing: 0.5 }}
                                    aria-hidden="true"
                                >
                                    AND
                                </Typography>
                            )}
                            <FilterRow
                                condition={condition}
                                fields={config.fields}
                                operators={operators}
                                renderInput={renderInput}
                                onFieldChange={(id, fieldKey) => onUpdate(id, { fieldKey })}
                                onOperatorChange={(id, operatorKey) => onUpdate(id, { operatorKey })}
                                onValueChange={(id, value) => onUpdate(id, { value })}
                                onMultiLogicChange={(id, logic) => onUpdate(id, { multiLogic: logic })}
                                onRemove={onRemove}
                                disabled={disabled}
                            />
                        </Box>
                    );
                })}
            </Stack>

            {conditions.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                    No filters applied. Click <strong>Add Filter</strong> to start filtering.
                </Typography>
            )}
        </Paper>
    );
};