export interface AlertMessage {
    id: number;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}