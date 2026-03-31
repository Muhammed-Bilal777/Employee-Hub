import React from 'react';
import {
    Box, FormControl, Select, MenuItem, IconButton, Tooltip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { X } from 'lucide-react';
import type { FilterCondition, FieldDefinition, FilterValue } from '../../types/filter.types';
import type { Operator } from '../../config/operatorRegistry';

interface FilterRowProps {
    condition: FilterCondition;
    fields: FieldDefinition[];
    operators: Operator[];
    renderInput: (condition: FilterCondition, field: FieldDefinition) => React.ReactNode;
    onFieldChange: (id: string, fieldKey: string) => void;
    onOperatorChange: (id: string, operatorKey: string) => void;
    onValueChange: (id: string, value: FilterValue) => void;
    onMultiLogicChange?: (id: string, logic: 'AND' | 'OR') => void;
    onRemove: (id: string) => void;
    disabled?: boolean;
}

export const FilterRow: React.FC<FilterRowProps> = ({
    condition,
    fields,
    operators,
    renderInput,
    onFieldChange,
    onOperatorChange,
    onRemove,
    disabled = false,
}) => {
    const currentField = fields.find((f) => f.key === condition.fieldKey);

    return (
        <Box
            display="flex"
            alignItems="center" // 🔥 fixed vertical alignment
            gap={1.5}
            sx={{
                flexWrap: { xs: 'wrap', sm: 'nowrap' }, // keep your original behavior
            }}
            role="group"
            aria-label={`Filter condition for ${currentField?.label ?? condition.fieldKey}`}
        >
            {/* Field selector */}
            <FormControl
                size="small"
                sx={{
                    minWidth: { xs: '100%', sm: 160 }, // 🔥 responsive instead of fixed
                    flexShrink: 1, // 🔥 allow shrinking
                }}
            >
                <Select
                    value={condition.fieldKey}
                    onChange={(e: SelectChangeEvent) => onFieldChange(condition.id, e.target.value)}
                    disabled={disabled}
                    inputProps={{ 'aria-label': 'Select filter field' }}
                >
                    {fields.map((f) => (
                        <MenuItem key={f.key} value={f.key}>{f.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Operator selector */}
            <FormControl
                size="small"
                sx={{
                    minWidth: { xs: '100%', sm: 180 }, // 🔥 responsive
                    flexShrink: 1, // 🔥 allow shrinking
                }}
            >
                <Select
                    value={condition.operatorKey}
                    onChange={(e: SelectChangeEvent) => onOperatorChange(condition.id, e.target.value)}
                    disabled={disabled}
                    inputProps={{ 'aria-label': 'Select filter operator' }}
                >
                    {operators.map((op) => (
                        <MenuItem key={op.key} value={op.key}>{op.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Value input — injected renderer */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0, // 🔥 critical fix (prevents overflow)
                }}
            >
                {currentField
                    ? renderInput(condition, currentField)
                    : null}
            </Box>

            {/* Remove button */}
            <Tooltip title="Remove filter">
                <span>
                    <IconButton
                        size="small"
                        onClick={() => onRemove(condition.id)}
                        disabled={disabled}
                        aria-label={`Remove filter for ${currentField?.label ?? condition.fieldKey}`}
                        sx={{
                            flexShrink: 0,
                            alignSelf: 'center', // 🔥 fixes misalignment
                        }}
                    >
                        <X size={16} />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );
};