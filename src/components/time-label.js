import { endDate } from '../common/config';
import { dayFormatter } from '../common/time-utils';

let timeLabel = null;

export function initTimeLabel() {
  timeLabel = document.querySelector('label.time-label');
  timeLabel.innerHTML = dayFormatter(endDate);
  console.log('time-label:endDate:', endDate.toUTCString());
}

export function updateTimeLabel(date) {
  timeLabel.innerHTML = dayFormatter(date);
}

export default timeLabel;
