import React, { useState, useEffect } from "react";
import { Box, Grid, Radio, CircularProgress, Typography } from "@mui/material";
import { FileDto } from "../store/fileStore";
import { QueryOptions } from "../../../store/types";
import {SearchInput} from "../../../components/main/search/SearchInput";

interface DataGridProps {
    files: FileDto[];
    onFileSelect: (file: FileDto) => void;
    fetchFiles: (options?: QueryOptions) => Promise<void>;
}

export const ServerDataGridWithRadio: React.FC<DataGridProps> = ({ files, onFileSelect, fetchFiles }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        const fetchInitialFiles = async () => {
            setLoading(true);
            try {
                await fetchFiles({ search: "", page: 1, size: 10 });
            } catch (error) {
                console.error("Ошибка загрузки файлов:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialFiles();
    }, [fetchFiles]);

    useEffect(() => {
        fetchFiles({ page: 0, size: 10 });
    }, []);

    const handleSearchChange = async (value: string) => {
        setSearchValue(value);
        setLoading(true);
        try {
            await fetchFiles({ search: value, page: 1, size: 5 });
        } catch (error) {
            console.error("Ошибка фильтрации файлов:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectionChange = (file: FileDto) => {
        setSelectedFileId(file.id);
        onFileSelect(file);
    };

    return (
        <Box>
            <SearchInput
                searchValue={searchValue}
                onSearchChange={(e) => handleSearchChange(e.target.value)}
                onSearchClear={() => handleSearchChange("")}
            />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {files.map((file) => (
                        <Grid container key={file.id} alignItems="center" sx={{
                            cursor: "pointer",
                            backgroundColor: selectedFileId === file.id ? "#f0f8ff" : "inherit",
                            borderBottom: "1px solid #e0e0e0",
                            padding: 1
                        }} onClick={() => handleSelectionChange(file)}>
                            <Grid item xs={1} textAlign="center">
                                <Radio
                                    checked={selectedFileId === file.id}
                                    onChange={() => handleSelectionChange(file)}
                                    value={file.id}
                                />
                            </Grid>
                            <Grid item xs={2} textAlign="left">
                                <Typography>{file.id}</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="left">
                                <Typography>{file.originalFilename}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
