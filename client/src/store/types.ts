import {v4 as uuidv4} from "uuid";
import {ConfirmationButtonProps} from "../components/main/ConfirmationButton";

export class AlertMessage {
    id: string;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;

    constructor(message: string, severity: 'success' | 'info' | 'warning' | 'error' | undefined) {
        this.id = uuidv4();
        this.message = message;
        this.severity = severity;
    }
}

export enum GenerationStatus {
    WAITING = "WAITING",
    SUCCESS = "SUCCESS",
    IN_PROCESS = "IN_PROCESS",
    FAILED = "FAILED"
}

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