import {useUserStore} from "../../store/userStore";
import {useEffect} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import moment from "moment";

export const TestGenHistoryTable = () => {
    const testGenHistory = useUserStore(state => state.testGenHistory);
    const getTestGenHistory = useUserStore(state => state.getTestGenHistory);

    useEffect(() => {
        getTestGenHistory();
    }, [])

    const columns: GridColDef[] = [
        { field: 'testId', headerName: 'Test Id'},
        { field: 'textId', headerName: 'Text id' },
        {
            field: 'generationStart',
            headerName: 'Start time',
            width: 200,
            valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            field: 'generationEnd',
            headerName: 'End time',
            width: 200,
            valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD HH:mm:ss'),
        },
        { field: 'inputTokensCount', headerName: 'Input tokens'},
        { field: 'outputTokensCount', headerName: 'Output tokens'},
        { field: 'generationStatus', headerName: 'Status'},
    ];

    return (
        <Box>
            <DataGrid
                rows={testGenHistory}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </Box>
    );
}