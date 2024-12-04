import {v4 as uuidv4} from "uuid";
import {ConfirmationButtonProps} from "../components/main/ConfirmationButton";
import {GridSortDirection} from "@mui/x-data-grid/models/gridSortModel";

export class AlertMessage {
    id: string;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
    icon?: 'progress';
    closeable?: boolean = true;

    constructor(message: string, severity: 'success' | 'info' | 'warning' | 'error' | undefined, icon?: 'progress', closeable?: boolean) {
        this.id = uuidv4();
        this.message = message;
        this.severity = severity;
        this.icon = icon;
        this.closeable = closeable ?? true;
    }
}

export enum GenerationStatus {
    WAITING = "WAITING",
    SUCCESS = "SUCCESS",
    IN_PROCESS = "IN_PROCESS",
    FAILED = "FAILED"
}

export enum GenerationStatusHint {
    WAITING = "Ожидание начала генерации",
    SUCCESS = "Генерация выполнена успешно",
    IN_PROCESS = "Генерация в процессе",
    FAILED = "Генерация не удалась"
}

export const getStatusHint = (status: GenerationStatus): string => {
    return GenerationStatusHint[status] || "Неизвестный статус";
};

export interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string
}

export interface ActionIcon {
    name: string;
    icon: any;
    onClick: () => void;
    disabled?: boolean;
    confirmProps?: ConfirmationButtonProps;
}

export interface QueryOptions {
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: GridSortDirection
    search?: string
}