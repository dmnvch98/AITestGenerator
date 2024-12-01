import {useNotificationStore} from "../../store/notificationStore";
import {AlertMessage} from "../../store/types";

class NotificationService {

    public addAlert(alert: AlertMessage) {
        useNotificationStore.getState().addAlert(alert);
    }

    public addAlerts(alerts: AlertMessage[]) {
        useNotificationStore.getState().addAlerts(alerts);
    }

    public deleteAlert(alertToDelete: AlertMessage) {
        useNotificationStore.getState().deleteAlert(alertToDelete);
    }

    public clearAlerts() {
        useNotificationStore.getState().clearAlerts();
    }
}

export default new NotificationService();
