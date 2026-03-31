import React from 'react';
import { TextField, Box, Typography, InputAdornment } from '@mui/material';
import type { NumberRange } from '../../types/filter.types';

interface AmountRangeInputProps {
    value: NumberRange;
    onChange: (v: NumberRange) => void;
    size?: 'small' | 'medium';
}

export const AmountRangeInput: React.FC<AmountRangeInputProps> = ({ value, onChange, size = 'small' }) => (
    <Box display="flex" gap={1} alignItems="center">
        <TextField
            size={size}
            type="number"
            label="Min"
            value={value?.min ?? ''}
            onChange={(e) => onChange({ ...value, min: e.target.value === '' ? null : Number(e.target.value) })}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            inputProps={{ 'aria-label': 'Amount minimum' }}
            sx={{ flex: 1 }}
        />
        <Typography variant="caption" color="text.secondary">–</Typography>
        <TextField
            size={size}
            type="number"
            label="Max"
            value={value?.max ?? ''}
            onChange={(e) => onChange({ ...value, max: e.target.value === '' ? null : Number(e.target.value) })}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            inputProps={{ 'aria-label': 'Amount maximum' }}
            sx={{ flex: 1 }}
        />
    </Box>
);