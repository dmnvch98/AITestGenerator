import {v4 as uuidv4} from "uuid";

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