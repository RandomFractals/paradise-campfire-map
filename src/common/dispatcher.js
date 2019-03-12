import { dispatch } from 'd3-dispatch';
import { updateVega } from './vega-spec';
import { getMap } from '../components/map';
import { updateTimeLabel } from '../components/time-label';
import { timeFormatter } from './time-utils';

// use d3 dispatcher for app interactions
export const dispatcher = dispatch('sliderInput', 'mapMove', 'damageFilter');

let damageFilter = 'all';

dispatcher.on('damageFilter', (date, damage) => {
  // update vega tiles and header label 
  // with selected date and damage data filter
  damageFilter = damage;
  updateVega(getMap(), timeFormatter(date), damage);
  updateTimeLabel(date);
});

dispatcher.on('sliderInput', (date) => {
  // update vega tiles and header label with selected date filter
  updateVega(getMap(), timeFormatter(date), damageFilter);
  updateTimeLabel(date);
});

dispatcher.on('mapMove', () => {
  // update vega tiles with new map bounds
  updateVega(getMap());
});
