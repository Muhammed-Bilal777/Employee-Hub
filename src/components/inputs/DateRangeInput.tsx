import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import type { DateRange } from '../../types/filter.types';

interface DateRangeInputProps {
    value: DateRange;
    onChange: (v: DateRange) => void;
    size?: 'small' | 'medium';
}

export const DateRangeInput: React.FC<DateRangeInputProps> = ({ value, onChange, size = 'small' }) => (
    <Box display="flex" gap={1} alignItems="center">
        <TextField
            size={size}
            type="date"
            label="From"
            value={value?.from ?? ''}
            onChange={(e) => onChange({ ...value, from: e.target.value || null })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'Date from' }}
            sx={{ flex: 1 }}
        />
        <Typography variant="caption" color="text.secondary">–</Typography>
        <TextField
            size={size}
            type="date"
            label="To"
            value={value?.to ?? ''}
            onChange={(e) => onChange({ ...value, to: e.target.value || null })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'Date to' }}
            sx={{ flex: 1 }}
        />
    </Box>
);