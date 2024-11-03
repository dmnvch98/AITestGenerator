// columns.ts
import {GridColDef} from "@mui/x-data-grid";
import {IconButton} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StatusIndicator from "../../../components/status/StatusIndicator";
import DateTimeUtils from "../../../utils/DateTimeUtils";
import Box from "@mui/material/Box";

export const createColumns = (handleOpenModal: (code: number) => void): GridColDef[] => {
    return [
        {
            flex: 1,
            field: 'status',
            headerName: 'Статус',
            minWidth: 10,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <StatusIndicator status={params.value}/>
            ),
        },
        {
            field: 'testTitle',
            headerName: 'Тест',
            minWidth: 350,
            flex: 1,
        },
        {
            field: 'fileName',
            headerName: 'Файл',
            minWidth: 270,
            flex: 1,
            sortable: false,
        },
        {
            field: 'startDate',
            headerName: 'Начало генерации',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <Box>
                    {DateTimeUtils.formatDateTime(params.value)}
                </Box>
            ),
        },
        {
            field: 'endDate',
            headerName: 'Конец генерации',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <Box>
                    {DateTimeUtils.formatDateTime(params.value)}
                </Box>
            ),
        },
        {
            flex: 1,
            field: 'failCode',
            headerName: 'Ошибка',
            minWidth: 70,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => params.value && (
                <IconButton onClick={() => handleOpenModal(params.value)}>
                    <VisibilityOutlinedIcon/>
                </IconButton>
            ),
        },
    ];
};
