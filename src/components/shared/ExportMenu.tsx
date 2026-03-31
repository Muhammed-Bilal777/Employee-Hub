import { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import { Download, FileText, FileJson } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../../utils/formatUtils';
import { ActionButton } from '../buttons/Button';

interface ExportMenuProps<T> {
    rows: T[];
    filename?: string;
    disabled?: boolean;
}

export function ExportMenu<T extends Record<string, unknown>>({ rows, filename = 'export', disabled }: ExportMenuProps<T>) {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    return (
        <>
            <ActionButton
                text="Export"
                icon={Download}
                onClick={(e) => setAnchor(e.currentTarget)}
                disabled={disabled || rows.length === 0}
                ariaLabel="Export data"
                ariaHaspopup={true}
                ariaExpanded={Boolean(anchor)}
                size="small"
                variant="outlined"
            />
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                <MenuItem
                    onClick={() => { exportToCSV(rows, `${filename}.csv`); setAnchor(null); }}
                    aria-label="Export as CSV"
                >
                    <ListItemIcon><FileText size={16} /></ListItemIcon>
                    <Typography variant="body2">Export as CSV</Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => { exportToJSON(rows, `${filename}.json`); setAnchor(null); }}
                    aria-label="Export as JSON"
                >
                    <ListItemIcon><FileJson size={16} /></ListItemIcon>
                    <Typography variant="body2">Export as JSON</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}