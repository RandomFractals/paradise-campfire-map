import throttle from 'lodash.throttle';
import { dispatcher } from '../common/dispatcher';
import { dayCount, timeFormatter, timeScale } from '../common/time-utils';
import { startDate, ticksPerDay } from '../common/config';

let slider = null;
let sliderTicks = null;
const WAIT_TIME_MS = 100;

export function initTimeSlider() {
  // initialize time slider
  slider = document.querySelector('input.time-slider');
  slider.setAttribute('max', dayCount * ticksPerDay);
  slider.setAttribute('value', 0); // use dayCount * ticksPerDay for endDate on app load

  // create day ticks
  sliderTicks = document.querySelector('.time-ticks');
  let ticksHtml = '';
  let currentDay = startDate.getUTCDate();
  for (let i = 0; i <= dayCount; i++) {
    ticksHtml += `<p>${currentDay + i}</p>`;
  }
  sliderTicks.innerHTML = ticksHtml;

  // add slider input handler
  slider.addEventListener('input', throttle(onInput, WAIT_TIME_MS, {leading: true}));
  console.log('time-slider:dayCount:', dayCount);
  return slider;
}

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
