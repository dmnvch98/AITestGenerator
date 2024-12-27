import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, CircularProgress, Grid, Radio, Typography } from "@mui/material";
import { FileDto } from "../store/fileStore";
import { QueryOptions } from "../../../store/types";
import { DebouncedSearchInput } from "../../../components/main/search/DebouncedSearchInput";
import DateTimeUtils from "../../../utils/DateTimeUtils";
import { NotFoundIcon } from "./NotFoundIcon";
import { getFileIcon } from "./helper";

interface InfinityScrollGridProps {
    fetchData: (options: QueryOptions) => Promise<FileDto[]>;
    onSelect: (file: FileDto) => void;
    totalPages: number;
    totalElements: number;
    selectedItemId?: number;
}

export const InfinityScrollGrid: React.FC<InfinityScrollGridProps> = ({
                                                                          fetchData,
                                                                          onSelect,
                                                                          totalPages,
                                                                          totalElements,
                                                                          selectedItemId
                                                                      }) => {
    const [items, setItems] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<number | undefined>(selectedItemId);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setPage(0);
        setItems([]);
    }, [searchValue]);

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const newData = await fetchData({
                    page,
                    size: 20,
                    sortBy: "id",
                    sortDirection: "asc",
                    search: searchValue,
                });
                setItems((prev) => (page === 0 ? newData : [...prev, ...newData]));
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [page, searchValue, fetchData]);

    const handleSelectionChange = (file: FileDto) => {
        setSelectedFileId(file.id);
        onSelect(file);
    };

    const loadMoreFiles = useCallback(() => {
        if (!loading && page < totalPages - 1) {
            setPage((prev) => prev + 1);
        }
    }, [loading, page, totalPages]);

    useEffect(() => {
        if (totalElements <= 20) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading && page < totalPages - 1) {
                loadMoreFiles();
            }
        });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
            observer.disconnect();
        };
    }, [loading, page, totalPages, loadMoreFiles, totalElements]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
                <Box width="50%">
                    <DebouncedSearchInput onSearch={handleSearch} />
                </Box>
            </Box>
            {items.length === 0 ? (
                <NotFoundIcon />
            ) : (
                <Grid container sx={{ mt: 2 }}>
                    {items.map((file) => (
                        <Grid
                            container
                            spacing={2}
                            key={file.id}
                            alignItems="center"
                            sx={{ cursor: "pointer", borderBottom: "1px solid #e0e0e0", padding: 0.5 }}
                            onClick={() => handleSelectionChange(file)}
                        >
                            <Grid item xs={1} textAlign="center">
                                <Radio
                                    checked={selectedFileId === file.id}
                                    onChange={() => handleSelectionChange(file)}
                                    value={file.id}
                                />
                            </Grid>
                            <Grid item xs={9} textAlign="left">
                                <Box display="flex" alignItems="center">
                                    {getFileIcon(file.originalFilename)}
                                    <Typography sx={{ ml: 1 }}>{file.originalFilename}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={2} textAlign="left">
                                <Typography>{DateTimeUtils.formatDate(file.uploadTime)}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            )}
            <div ref={observerRef} style={{ height: 20, width: "100%" }} />
            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};
