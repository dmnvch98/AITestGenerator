export interface AlertMessage {
    id: number;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

export enum GenerationStatus {
    WAITING = "WAITING",
    SUCCESS = "SUCCESS" ,
    IN_PROCESS = "IN_PROCESS",
    FAILED = "FAILED"
}
