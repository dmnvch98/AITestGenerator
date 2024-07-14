import moment from 'moment/moment';

class DateTimeUtils {
  formatDateTime(dateStr: Date | undefined) {
    return dateStr ? moment(dateStr).format('YYYY-MM-DD HH:mm:ss') : "Время не установлено";
  }

  formatDate(dateStr: Date | undefined) {
    return dateStr ? moment(dateStr).format('YYYY-MM-DD') : "Время не установлено";
  }
}

export default new DateTimeUtils();
