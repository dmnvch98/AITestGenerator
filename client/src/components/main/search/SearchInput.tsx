import {Box, IconButton, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";

interface SearchInputProps {
    searchValue?: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchClear: () => void;
}

export const SearchInput = ({searchValue, onSearchChange, onSearchClear}: SearchInputProps) => {
    return (
        <>
            <Box sx={{ flex: 1, ml: 'auto', maxWidth: 300 }}>
                <TextField
                    size="small"
                    variant="standard"
                    fullWidth
                    placeholder="Поиск"
                    value={searchValue}
                    onChange={onSearchChange}

                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchValue && searchValue?.length > 0 && (
                                    <IconButton onClick={onSearchClear}>
                                        <CancelIcon sx={{fontSize: 14}}/>
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </>
    )
}