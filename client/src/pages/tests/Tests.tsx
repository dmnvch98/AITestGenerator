import React, { useCallback, useEffect, useState } from "react";
import { BulkDeleteTestsRequestDto, useTestStore } from "../../store/tests/testStore";
import { TestTable } from "../../components/tests/TestTable";
import {useLocation, useNavigate} from "react-router-dom";
import { TestsActionToolbar } from "./components/actions/TestsActionToolbar";
import { QueryOptions } from "../../store/types";
import { GridSortModel } from "@mui/x-data-grid";

export const Tests = () => {
    const CREATE_TEST_URL = "/tests/create";
    const location = useLocation();
    const navigate = useNavigate();
    const {
        getAllUserTests,
        bulkDeleteTest,
        totalElements,
        isLoading
    } = useTestStore();

    const [selectedTestIds, setSelectedTestIds] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

    useEffect(() => {
        const fetchTest = async (options?: QueryOptions) => {
            if (!isLoading) {
                await getAllUserTests(options);
            }
        };

        const searchOptions: QueryOptions = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? 'asc',
            search: searchValue
        };

        fetchTest(searchOptions);
    }, [searchValue, paginationModel, sortModel]);

    const handleBulkDelete = useCallback(() => {
        if (selectedTestIds.length > 0) {
            const request: BulkDeleteTestsRequestDto = {
                ids: selectedTestIds
            }
            bulkDeleteTest(request);
            setSelectedTestIds([])
        }
    }, [selectedTestIds]);

    const onMultiTestSelection = useCallback((ids: number[]) => {
        setSelectedTestIds(ids);
    }, []);

    const handleAdd = () => {
        navigate(CREATE_TEST_URL, { state: { previousLocationPathname: location.pathname }});
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    return (
        <>
            <TestsActionToolbar
                onAdd={handleAdd}
                onDelete={handleBulkDelete}
                deleteDisabled={selectedTestIds.length === 0}
                onSearchChange={handleSearchChange}
            />
            <TestTable
                onSelectionModelChange={onMultiTestSelection}
                loading={isLoading}
                rowCount={totalElements}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
            />
        </>
    );
};
