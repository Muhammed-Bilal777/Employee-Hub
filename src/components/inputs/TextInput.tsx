import React from 'react';
import { TextField } from '@mui/material';

interface TextInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    size?: 'small' | 'medium';
    'aria-label'?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder, size = 'small', ...rest }) => (
    <TextField
        size={size}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Enter value…'}
        fullWidth
        inputProps={{ 'aria-label': rest['aria-label'] }}
    />
);