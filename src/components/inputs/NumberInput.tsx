import React from 'react';
import { TextField } from '@mui/material';

interface NumberInputProps {
    value: number | '';
    onChange: (v: number | null) => void;
    placeholder?: string;
    size?: 'small' | 'medium';
    'aria-label'?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, placeholder, size = 'small', ...rest }) => (
    <TextField
        size={size}
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        placeholder={placeholder ?? 'Enter number…'}
        fullWidth
        inputProps={{ 'aria-label': rest['aria-label'] }}
    />
);