import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { SelectOption } from '../../types/filter.types';

interface SingleSelectInputProps {
    value: string;
    onChange: (v: string) => void;
    options: SelectOption[];
    size?: 'small' | 'medium';
    'aria-label'?: string;
}

export const SingleSelectInput: React.FC<SingleSelectInputProps> = ({ value, onChange, options, size = 'small', ...rest }) => (
    <FormControl size={size} fullWidth>
        <Select
            value={value ?? ''}
            onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': rest['aria-label'] ?? 'Select value' }}
        >
            <MenuItem value="" disabled><em>Select…</em></MenuItem>
            {options.map((opt) => (
                <MenuItem key={String(opt.value)} value={String(opt.value)}>{opt.label}</MenuItem>
            ))}
        </Select>
    </FormControl>
);