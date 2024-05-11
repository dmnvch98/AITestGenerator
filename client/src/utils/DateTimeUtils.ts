import moment from 'moment/moment';

class DateTimeUtils {
  formatDate(dateStr: Date | undefined) {
    return dateStr ? moment(dateStr).format('YYYY-MM-DD HH:mm:ss') : "Время не установлено";
  }
}

export default new DateTimeUtils();
