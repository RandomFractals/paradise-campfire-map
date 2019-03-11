import { dispatch } from 'd3-dispatch';
import { updateVega } from './vega-spec';
import { getMap } from '../components/map';
import { updateTimeLabel } from '../components/time-label';
import { timeFormatter } from './time-utils';

// use d3 dispatcher for app interactions
export const dispatcher = dispatch('sliderInput', 'mapMove');

dispatcher.on('sliderInput', (date) => {
  // update vega tiles and header label with selected date filter
  updateVega(getMap(), timeFormatter(date));
  updateTimeLabel(date);
});

dispatcher.on('mapMove', () => {
  // update vega tiles with new map bounds
  updateVega(getMap());
});
