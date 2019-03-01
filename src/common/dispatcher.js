import { dispatch } from 'd3-dispatch';
import { updateVega } from './vega-spec';
import { getMap } from '../components/map';
import { updateTimeLabel } from '../components/time-label';
import { timeFormatter, monthYearFormatter } from './time-utils';

// use d3's dispatch module to handle updating the map on user events
const dispatcher = dispatch('sliderInput', 'mapMove');

dispatcher.on('sliderInput', (value) => {
  updateVega(getMap(), timeFormatter(value));
  updateTimeLabel(monthYearFormatter(value));
});

dispatcher.on('mapMove', () => {
  updateVega(getMap());
});

export default dispatcher;
