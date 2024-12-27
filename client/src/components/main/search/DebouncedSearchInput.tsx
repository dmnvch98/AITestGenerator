// DebouncedSearchInput.tsx
import React, {useState, useEffect, ChangeEvent} from "react";
import {TextField, IconButton, InputAdornment} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface DebouncedSearchInputProps {
    onSearch: (value: string) => void;
    delay?: number;
}

export const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
                                                                              onSearch,
                                                                              delay = 500,
                                                                          }) => {
    const [searchValue, setSearchValue] = useState<string>('');

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClear = () => {
        setSearchValue("");
    };

    return (
        <TextField
            fullWidth
            variant="standard"
            placeholder="Поиск по названию..."
            value={searchValue}
            onChange={handleChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {searchValue && (
                            <IconButton onClick={handleClear} edge="end">
                                <ClearIcon/>
                            </IconButton>
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};