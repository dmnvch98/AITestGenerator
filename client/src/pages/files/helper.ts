import {AlertMessage} from "../../store/types";
import NotificationService from "../../services/notification/NotificationService";

const validFileExtensions = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateFiles = (files: File[]): {
    validFiles?: File[],
    invalidFilesAlerts?: AlertMessage[]
} => {
    const validFiles: File[] = [];
    const invalidFilesAlerts: AlertMessage[] = [];

    if (files.length > MAX_FILES) {
        NotificationService.addAlert(new AlertMessage(`Вы превысили лимит по количеству файлов. Максимум ${MAX_FILES} файлов.`, 'error'));
        return {};
    }

    files.forEach(file => {
        if (!validFileExtensions.includes(file.type)) {
            invalidFilesAlerts.push(new AlertMessage(`<b>${file.name}</b> не PDF/Word документ`, 'error'))
        } else if (file.size > MAX_FILE_SIZE) {
            invalidFilesAlerts.push(new AlertMessage(`<b>${file.name}</b> превышает ${MAX_FILE_SIZE_MB} MБ`, 'error'))
        } else {
            validFiles.push(file);
        }
    });

    return {validFiles, invalidFilesAlerts};
}