import throttle from 'lodash.throttle';
import { dispatcher } from '../common/dispatcher';
import {
  dayCount,
  timeFormatter,
  timeScale
} from '../common/time-utils';

let slider = null;
const WAIT_TIME_MS = 100;

function onInput(event) {
  const sliderValue = event.target.value;
  const endDate = timeScale.invert(sliderValue);
  console.log('time-slider:onInput(): value:', sliderValue, 'endDate:', timeFormatter(endDate));
  dispatcher.call('sliderInput', null, endDate); // null = that/this context
}

export function updateSliderPosition(value) {
  slider.value = value.toString();
  dispatcher.call('sliderInput', null, timeScale.invert(value)); // null = that/this context
}

export function getValue() {
  return Number(slider.value);
}

export function initTimeSlider() {
  slider = document.querySelector('input.time-slider');
  console.log('time-slider:dayCount:', dayCount);
  slider.setAttribute('max', dayCount);
  slider.addEventListener('input', throttle(onInput, WAIT_TIME_MS, {leading: true}));
  return slider;
}
