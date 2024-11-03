import moment from 'moment/moment';

class DateTimeUtils {
  formatDateTime(dateStr: Date | undefined) {
    return dateStr ? moment(dateStr).format('YYYY-MM-DD HH:mm:ss') : "Не установлено";
  }

  formatDate(dateStr: Date | undefined) {
    return dateStr ? moment(dateStr).format('YYYY-MM-DD') : "Не установлено";
  }
}

export default new DateTimeUtils();
