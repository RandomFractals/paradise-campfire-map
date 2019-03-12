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
  // update vega tiles and header label 
  // with selected date and damage data filter
  damageFilter = damage;
  updateVega(getMap(), timeFormatter(endDateFilter), damageFilter);
  updateTimeLabel(endDateFilter);
});

dispatcher.on('sliderInput', (date) => {
  // update vega tiles and header label with selected date filter
  endDateFilter = date;
  updateVega(getMap(),timeFormatter(endDateFilter), damageFilter);
  updateTimeLabel(date);
});

dispatcher.on('mapMove', () => {
  // update vega tiles with new map bounds
  updateVega(getMap(), timeFormatter(endDateFilter), damageFilter);
});
