import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BulkDeleteTestsRequestDto, useTestStore } from "../../store/tests/testStore";
import { TestTable } from "../../components/tests/TestTable";
import {Alert, Box, Snackbar} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TestsActionToolbar } from "./components/actions/TestsActionToolbar";
import { QueryOptions } from "../../store/types";
import { GridSortModel } from "@mui/x-data-grid";

export const Tests = () => {
    const CREATE_TEST_URL = "/tests/create";

    const {
        getAllUserTests,
        alerts,
        clearAlerts,
        deleteAlert,
        bulkDeleteTest,
        totalElements
    } = useTestStore();

    const [selectedTestIds, setSelectedTestIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }]);

    const searchOptions: QueryOptions = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sortBy: sortModel[0]?.field,
        sortDirection: sortModel[0]?.sort ?? 'asc',
        search: searchValue.length > 0 ? searchValue : undefined
    };

    const fetchTest = async (options?: QueryOptions) => {
        if (!loading) {
            setLoading(true);
            await getAllUserTests(options);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTest(searchOptions);
    }, [paginationModel, sortModel]);

    const handleBulkDelete = useCallback(() => {
        if (selectedTestIds.length > 0) {
            const request: BulkDeleteTestsRequestDto = {
                ids: selectedTestIds
            }
            bulkDeleteTest(request);
        }
    }, [selectedTestIds]);

    const onMultiTestSelection = useCallback((ids: number[]) => {
        setSelectedTestIds(ids);
    }, []);

    const handleAdd = () => {
        navigate(CREATE_TEST_URL);
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <>
            <TestsActionToolbar
                onAdd={handleAdd}
                onDelete={handleBulkDelete}
                deleteDisabled={selectedTestIds.length === 0}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
            />
            <TestTable
                onSelectionModelChange={onMultiTestSelection}
                loading={loading}
                searchValue={searchValue}
                rowCount={totalElements}
                onQueryChange={fetchTest}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
            />
            <Snackbar
                open={alerts.length > 0}
                autoHideDuration={6000}
                onClose={clearAlerts}
            >
                <Box sx={{ maxWidth: '400px' }}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} sx={{ mb: 0.5, textAlign: 'left' }}
                               onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{ __html: alert.message }} />
                        </Alert>
                    ))}
                </Box>
            </Snackbar>
        </>
    )
}
