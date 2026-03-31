import React from 'react';
import {
    Select, MenuItem, FormControl, Checkbox, Chip, Box,
    OutlinedInput, ListItemText, Typography, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { SelectOption } from '../../types/filter.types';

interface MultiSelectInputProps {
    value: string[];
    onChange: (v: string[]) => void;
    options: SelectOption[];
    multiLogic?: 'AND' | 'OR';
    onMultiLogicChange?: (v: 'AND' | 'OR') => void;
    size?: 'small' | 'medium';
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
    value, onChange, options, multiLogic = 'OR', onMultiLogicChange, size = 'small',
}) => {
    const selected = value ?? [];

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <FormControl size={size} fullWidth>
                <Select
                    multiple
                    value={selected}
                    onChange={(e: SelectChangeEvent<string[]>) => onChange(e.target.value as string[])}
                    input={<OutlinedInput />}
                    renderValue={(sel) => (
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {(sel as string[]).map((v) => (
                                <Chip key={v} label={v} size="small" />
                            ))}
                        </Box>
                    )}
                    inputProps={{ 'aria-label': 'Multi-select values' }}
                >
                    {options.map((opt) => (
                        <MenuItem key={String(opt.value)} value={String(opt.value)}>
                            <Checkbox checked={selected.includes(String(opt.value))} size="small" />
                            <ListItemText primary={opt.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {onMultiLogicChange && selected.length > 1 && (
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary">Match:</Typography>
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={multiLogic}
                        onChange={(_, v) => v && onMultiLogicChange(v as 'AND' | 'OR')}
                    >
                        <ToggleButton value="OR">Any</ToggleButton>
                        <ToggleButton value="AND">All</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            )}
        </Box>
    );
};