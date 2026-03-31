import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

interface BooleanInputProps {
    value: boolean;
    onChange: (v: boolean) => void;
    label?: string;
}

export const BooleanInput: React.FC<BooleanInputProps> = ({ value, onChange, label }) => (
    <FormControlLabel
        control={
            <Switch
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={{ 'aria-label': label ?? 'Boolean filter' }}
            />
        }
        label={value ? 'True' : 'False'}
    />
);