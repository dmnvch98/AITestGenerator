import React from 'react';
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

interface TestViewModeSelectorProps {
    viewMode: 'list' | 'paginated';
    onChange: (viewMode: 'list' | 'paginated') => void;
}

export const TestViewModeSelector: React.FC<TestViewModeSelectorProps> = ({ viewMode, onChange }) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="view-mode-select-label">Режим отображения</InputLabel>
            <Select
                size="small"
                labelId="view-mode-select-label"
                value={viewMode}
                label="Режим отображения"
                onChange={(e) => onChange(e.target.value as 'list' | 'paginated')}
            >
                <MenuItem value="list">Список</MenuItem>
                <MenuItem value="paginated">Постранично</MenuItem>
            </Select>
        </FormControl>
    );
};
