import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import {
    Box,
    CircularProgress,
    Grid,
    Radio,
    Typography,
} from "@mui/material";
import { FileDto } from "../store/fileStore";
import { QueryOptions } from "../../../store/types";
import { DebouncedSearchInput } from "../../../components/main/search/DebouncedSearchInput";
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
                                                                          selectedItemId,
                                                                      }) => {
    const [items, setItems] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<number | undefined>(
        selectedItemId
    );
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");

    // Этот реф будет содержать контейнер, в котором всё скроллится
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    // Этот реф — элемент, который будем отслеживать (низ списка)
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setPage(0);
        setItems([]);
    }, [searchValue]);

    useEffect(() => {
        (async () => {
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
        })();
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
        // Если совсем мало элементов, нет смысла в обсервере
        if (totalElements <= 20) return;

        if (!scrollContainerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading && page < totalPages - 1) {
                    loadMoreFiles();
                }
            },
            {
                // Корнем наблюдения делаем контейнер со скроллом
                root: scrollContainerRef.current,
                rootMargin: "0px",
                threshold: 0.1,
            }
        );

        const el = observerRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
            observer.disconnect();
        };
    }, [loading, page, totalPages, loadMoreFiles, totalElements]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: '50vh',
            }}
        >
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#fff",
                    p: 1,
                    borderBottom: "1px solid #eee",
                }}
            >
                <DebouncedSearchInput onSearch={handleSearch} />
            </Box>

            <Box
                ref={scrollContainerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
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
                                sx={{
                                    cursor: "pointer",
                                    borderBottom: "1px solid #e0e0e0",
                                    padding: 0.5,
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
                                <Grid item xs={11}>
                                    <Box display="flex" alignItems="center">
                                        {getFileIcon(file.originalFilename)}
                                        <Typography sx={{ ml: 1 }}>
                                            {file.originalFilename}
                                        </Typography>
                                    </Box>
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
        </Box>
    );
};
