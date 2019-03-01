import { startDate } from '../common/config';
import { monthYearFormatter } from '../common/time-utils';

let timeLabel = null;

export function initTimeLabel() {
  timeLabel = document.querySelector('.time-label');
  timeLabel.innerHTML = monthYearFormatter(startDate);
}

export function updateTimeLabel(value) {
  timeLabel.innerHTML = value;
}

export default timeLabel;
