import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {ActivityDto, useUserStore} from "../../../store/userStore";
import {useNavigate} from "react-router-dom";
import {GridColDef, GridEventListener, GridSortModel} from "@mui/x-data-grid";
import {GenericTableActions} from "../../../components/main/data-display/GenericTableActions";
import {GenerationErrorModal} from "../../../components/generationErrors/GenerationErrorModal";
import {QueryOptions} from "../../../store/types";
import {createColumns} from "./helper";

const noTestTitle = "¯\\_(ツ)_/¯";

export const TestGenHistoryPast = () => {
    const { getTestGenHistory, testGenHistoryPast, totalElements } = useUserStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [failCode, setFailCode] = useState<number | null>(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'endDate', sort: 'desc' }]);

    const handleOpenModal = (code: number) => {
        setFailCode(code);
        setModalOpen(true);
    };

    const columns: GridColDef[] = createColumns(handleOpenModal);

    const fetchHistory = async (options?: QueryOptions) => {
        setLoading(true);
        await getTestGenHistory(options);
        setLoading(false);
    }

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        const searchOptions: QueryOptions = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? 'asc',
        };

        fetchHistory(searchOptions);
    }, [paginationModel, sortModel]);

    const prepareData = (): ActivityDto[] => {
        if (testGenHistoryPast.length > 0) {
            return testGenHistoryPast.map(item => {
                if (!item.testTitle) {
                    return {
                        ...item,
                        testTitle: noTestTitle
                    };
                }
                return item;
            });
        }
        return testGenHistoryPast;
    };

    const handleEvent: GridEventListener<'cellClick'> = (params) => {
        if (params.field !== 'failCode' && params.row.testId) {
            navigate(`/tests/${params.row.testId}`);
        }
    }

    return (
        <>
            <Box>
                <GenericTableActions<ActivityDto>
                    data={prepareData()}
                    columns={columns}
                    rowIdGetter={(row) => row.id || row.cid}
                    loading={loading}
                    checkboxSelection={false}
                    handleEvent={handleEvent}
                    rowCount={totalElements}
                    paginationModel={paginationModel}
                    setPaginationModel={setPaginationModel}
                    sortModel={sortModel}
                    setSortModel={setSortModel}
                />
            </Box>
            <GenerationErrorModal
                failCode={failCode}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setFailCode(null);
                }}
            />
        </>
    );
};