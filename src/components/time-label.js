import { startDate } from '../common/config';
import { dayFormatter } from '../common/time-utils';

let timeLabel = null;

export function initTimeLabel() {
  timeLabel = document.querySelector('label.time-label');
  timeLabel.innerHTML = dayFormatter(startDate);
}

export function updateTimeLabel(value) {
  timeLabel.innerHTML = value;
}

export default timeLabel;
