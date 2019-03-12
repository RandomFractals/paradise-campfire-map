import { dispatch } from 'd3-dispatch';
import { updateVega } from './vega-spec';
import { getMap } from '../components/map';
import { updateTimeLabel } from '../components/time-label';
import { timeFormatter } from './time-utils';
import { endDate } from './config.js';

// use d3 dispatcher for app interactions
export const dispatcher = dispatch('sliderInput', 'mapMove', 'damageFilter');

// date/data filters
let endDateFilter = endDate;
let damageFilter = 'all';

dispatcher.on('damageFilter', (damage) => {
  damageFilter = damage;
  updateVega(getMap(), timeFormatter(endDateFilter), damageFilter);
  updateTimeLabel(endDateFilter);
});

dispatcher.on('sliderInput', (date) => {
  endDateFilter = date;
  updateVega(getMap(),timeFormatter(endDateFilter), damageFilter);
  updateTimeLabel(date);
});

dispatcher.on('mapMove', () => {
  // update vega tiles with new map bounds
  updateVega(getMap(), timeFormatter(endDateFilter), damageFilter);
});
