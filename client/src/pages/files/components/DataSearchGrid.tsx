import React, {useEffect, useRef, useState, useCallback} from "react";
import {Box, CircularProgress, Grid, Radio, Typography} from "@mui/material";
import {FileDto} from "../store/fileStore";
import {QueryOptions} from "../../../store/types";
import {DebouncedSearchInput} from "../../../components/main/search/DebouncedSearchInput";
import DateTimeUtils from "../../../utils/DateTimeUtils";
import {NotFoundIcon} from "./NotFoundIcon";
import {getFileIcon} from "./helper";

interface InfinityScrollGridProps {
    data: FileDto[];
    onSelect: (file: FileDto) => void;
    fetchData: (options?: QueryOptions) => Promise<void>;
    totalPages: number;
    totalElements: number;
    selectedItemId?: number;
}

export const InfinityScrollGrid: React.FC<InfinityScrollGridProps> = ({
                                                                          data,
                                                                          onSelect,
                                                                          fetchData,
                                                                          totalPages,
                                                                          totalElements,
                                                                          selectedItemId
                                                                      }) => {
    const [items, setItems] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<number | undefined>(selectedItemId);
    const [page, setPage] = useState(0);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const isSearchRef = useRef(false);

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                await fetchData({
                    page,
                    size: 20,
                    sortBy: "uploadTime",
                    search: searchValue,
                });
                if (page === 0) isSearchRef.current = false;
            } finally {
                setLoading(false);
            }
        };
        setItems([]);
        setPage(0);
        isSearchRef.current = true;
        loadItems();
    }, [searchValue]);

    useEffect(() => {
        setItems((prev) => [...prev, ...data]);
    }, [data]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const handleSelectionChange = (file: FileDto) => {
        setSelectedFileId(file.id);
        onSelect(file);
    };

    const loadMoreFiles = useCallback(() => {
        if (!loading && page < totalPages) setPage((prev) => prev + 1);
    }, [loading, page, totalPages]);

    useEffect(() => {
        if (totalElements < 20) return;

        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (
                target.isIntersecting &&
                !loading &&
                page < totalPages &&
                !isSearchRef.current
            ) {
                loadMoreFiles();
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
            observer.disconnect();
        };
    }, [loading, page, totalPages, loadMoreFiles, totalElements]);

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
                <Box width="50%">
                    <DebouncedSearchInput onSearch={handleSearch}/>
                </Box>
            </Box>
            {
                items.length === 0
                    ? <NotFoundIcon/>
                    : <Grid container sx={{mt: 2}}>
                        {items.map((file) => (
                            <Grid
                                container
                                spacing={2}
                                key={file.id}
                                alignItems="center"
                                sx={{
                                    cursor: "pointer",
                                    borderBottom: "1px solid #e0e0e0",
                                    padding: 0.5
                                }}
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
                                        <Typography sx={{ml: 1}}>{file.originalFilename}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={2} textAlign="left">
                                    <Typography>{DateTimeUtils.formatDate(file.uploadTime)}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
            }

            <div ref={observerRef} style={{height: 20, width: "100%"}}/>

            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress/>
                </Box>
            )}
        </Box>
    );
};
