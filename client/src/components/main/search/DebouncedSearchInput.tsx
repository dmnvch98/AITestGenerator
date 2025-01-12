// DebouncedSearchInput.tsx
import React, {useState, useEffect, ChangeEvent} from "react";
import {TextField, InputAdornment} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

interface DebouncedSearchInputProps {
    onSearch: (value: string) => void;
    delay?: number;
    isLoading?: boolean;
}

export const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
                                                                              onSearch,
                                                                              delay = 500,
                                                                              isLoading= false
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
            placeholder="Поиск"
            value={searchValue}
            onChange={handleChange}
            disabled={isLoading}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="action" />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        {searchValue && (
                            <Box onClick={handleClear} sx={{cursor: 'pointer'}}>
                                <ClearIcon/>
                            </Box>
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};
