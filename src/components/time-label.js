import { startDate } from '../common/config';
import { dayFormatter } from '../common/time-utils';

let timeLabel = null;

export function initTimeLabel() {
  timeLabel = document.querySelector('label.time-label');
  timeLabel.innerHTML = dayFormatter(startDate);
  console.log('time-label:startDate:', startDate.toUTCString());
}

export function updateTimeLabel(date) {
  timeLabel.innerHTML = dayFormatter(
    new Date(date.getTime() + (date.getTimezoneOffset() * 60000))); // to UTC
}

export default timeLabel;
