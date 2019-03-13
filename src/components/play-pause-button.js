import { interval } from 'd3-timer';
import { dayCount } from '../common/time-utils';
import { ticksPerDay, timerDelay } from '../common/config';
import { updateSliderPosition, getValue } from './time-slider';

let playPauseButton = null;
let timerInstance = null;
let isPlaying = false;
let sliderValue = 0;

export function initPlayPauseButton () {
  playPauseButton = document.querySelector('button.play-pause-button');
  playPauseButton.addEventListener('click', onClick);
}

function onClick (event) {
  event.preventDefault();
  if (isPlaying) {
    stop();
  } else {
    play();
  }
}

function stop () {
  isPlaying = false;
  timerInstance.stop();
  playPauseButton.innerHTML = '▶️'; // play
}

function play () {
  if (timerInstance) {
    timerInstance = null;
  }
  isPlaying = true;
  playPauseButton.innerHTML = '||'; // pause
  sliderValue = getValue();
  timerInstance = interval(elapsed => {
    console.log('play-pause-control:time-elapsed:', elapsed);
    if (!isPlaying) {
      stop();
    } else if (sliderValue > (dayCount * ticksPerDay)) {
      sliderValue = 0;
      updateSliderPosition(sliderValue);
    } else {
      sliderValue = sliderValue + 1;
      updateSliderPosition(sliderValue);
    }
  }, timerDelay);
}
