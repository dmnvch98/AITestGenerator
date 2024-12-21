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
    } = useTestStore();

    const [selectedTestIds, setSelectedTestIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>(searchValue);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }]);
    const fetchTest = async (options?: QueryOptions) => {
        if (!loading) {
            setLoading(true);
            await getAllUserTests(options);
            setLoading(false);
        }
    };
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    useEffect(() => {
        const searchOptions: QueryOptions = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? 'asc',
            search: debouncedSearchValue
        };

        fetchTest(searchOptions);
    }, [debouncedSearchValue, paginationModel, sortModel]);

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

    const handleClearSearch = () => {
        setSearchValue('');
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
                onSearchClear={handleClearSearch}
            />
            <TestTable
                onSelectionModelChange={onMultiTestSelection}
                loading={loading}
                rowCount={totalElements}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
            />
        </>
    );
};
