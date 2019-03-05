import { interval } from 'd3-timer';
import { updateSliderPosition, getValue } from './time-slider';
import { dayCount } from '../common/time-utils';

let playPauseButton = null;
let timerInstance = null;
let isPlaying = false;
let sliderValue = 0;

const ONE_SEC = 1000;
const totalTime = 10 * 10 * ONE_SEC;
const delay = totalTime / dayCount;

function stop () {
  isPlaying = false;
  timerInstance.stop();
  playPauseButton.innerHTML = '&#9654;'; // play
}

function play () {
  if (timerInstance) {
    timerInstance = null;
  }

  isPlaying = true;
  playPauseButton.innerHTML = '&#9208;'; // pause
  sliderValue = getValue();
  timerInstance = interval(elapsed => {
    console.log('play-pause-control:time-elapsed:', elapsed);
    if (!isPlaying) {
      stop();
    } else if (sliderValue > dayCount) {
      sliderValue = 0;
      updateSliderPosition(sliderValue);
    } else {
      sliderValue = sliderValue + 1;
      updateSliderPosition(sliderValue);
    }
  }, delay);
}

function onClick (event) {
  event.preventDefault();
  if (isPlaying) {
    stop();
  } else {
    play();
  }
}

export function initPlayPauseButton () {
  playPauseButton = document.querySelector('button.play-pause-button');
  playPauseButton.addEventListener('click', onClick);
}
