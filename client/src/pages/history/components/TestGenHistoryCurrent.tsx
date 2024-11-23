import {GridColDef, GridEventListener} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import {TestGenActivity, useUserStore} from "../../../store/userStore";
import {GenericTableActions} from "../../../components/main/GenericTableActions";
import {GenerationErrorModal} from "../../../components/generationErrors/GenerationErrorModal";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {createColumns} from "./helper";

const noTestTitle = '-- Недоступно --'

export const TestGenHistoryCurrent = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [failCode, setFailCode] = useState<number | null>(null);
    const navigate = useNavigate();

    const {
        currentActivities,
        initState,
        deleteFinishedUserActivitiesFromServer
    } = useUserStore();

    useEffect(() => {
        let unmounted = false;
        const isUnmounted = () => unmounted;

        const fetchActivity = async () => {
            await initState(isUnmounted);
        };

        fetchActivity();

        return () => {
            unmounted = true;
            deleteFinishedUserActivitiesFromServer();
        };
    }, []);


    const handleOpenModal = (code: number) => {
        setFailCode(code);
        setModalOpen(true);
    };

    const columns: GridColDef[] = createColumns(handleOpenModal);

    const prepareData = (): TestGenActivity[] => {
        if (currentActivities.length > 0) {
            return currentActivities.map(item => {
                if (!item.testTitle) {
                    return {
                        ...item,
                        testTitle: noTestTitle
                    };
                }
                return item;
            });
        }
        return currentActivities;
    };

    const handleEvent: GridEventListener<'cellClick'> = (params) => {
        if (params.field !== 'failCode' && params.row.testId) {
            navigate(`/tests/${params.row.testId}`);
        }
    }

    const style: SxProps<Theme> = {
        '& .MuiDataGrid-cell:hover': {
            cursor: 'pointer'
        },
    }

    return (
        <>
            <Box>
                <GenericTableActions<TestGenActivity>
                    data={prepareData()}
                    columns={columns}
                    rowIdGetter={(row) => row.id}
                    checkboxSelection={false}
                    handleEvent={handleEvent}
                    rowCount={currentActivities.length}
                    sx={style}
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
}