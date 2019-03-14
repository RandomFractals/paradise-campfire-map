import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/mapboxgl-overrides';
import './styles.css';

import { serverInfo, startDate } from './common/config';
import { timeFormatter } from './common/time-utils';
import { updateVega } from './common/vega-spec';
import { 
  getConnection, 
  getConnectionStatus, 
  saveConnection 
} from './common/mapd-connector';
import { initMap } from './components/map';
import { initTimeSlider } from './components/time-slider';
import { initTimeLabel } from './components/time-label';
import { initPlayPauseButton } from './components/play-pause-button';
import { initCounterLabel } from './components/counter-label';
import { initDamageChart } from './components/damage-chart';

// main app bootstrapping on content loaded
document.addEventListener('DOMContentLoaded', main);
function main() {
  // set webapp markup
  document.querySelector("#app").innerHTML = `
    <div class="header">
      <img class="logo" height="75px" width="75px" src="images/omni-sci-logo.png" />
      <div class="title-bar">
        <h2 class="title">Paradise, CA 2018 Camp Fire</h2>
      </div>
    </div>
    <div class="counter-box">
      <label class="counter-label"></label>
      <br />
      <label class="time-label">0</label>
    </div>
    <div class="time-ticks">
    </div>
    <div class="time-controls">
      <input class="time-slider" type="range" min="0" max="18" step="1" value="0" />
      <button class="play-pause-button">&#9654;</button><!-- play -->
    </div>
    <div id="content">
      <div id="map"></div>
      <div id="side-panel">
        <div class="chart">
          <div class="chart-title-bar">
            <span class="chart-title">Structural Damage</span>
            <div class="chart-actions">
              <a id="show-all-damage-link" href="#" class="chart-action-link">Show All</a>
            </div>
          <div>
          <div id="damage-chart" class="chart-container"></div>
        </div>
      </div>
    </div>`;
  
  // initialize app controls
  const map = initMap();
  initTimeSlider();
  initTimeLabel();
  initPlayPauseButton();
  initCounterLabel();
  initDamageChart();
  
  // connect to the mapd backend
  getConnection(serverInfo)
    .then(connection => {
      // save connection for later use
      saveConnection(connection);
      // check connection status
      return getConnectionStatus(connection);
    })
    .then(status => {
      if (status && status[0] && status[0].rendering_enabled) {
        // render updated vega spec and add it to the map
        updateVega(map, timeFormatter(startDate));
      } else {
        throw Error('omniSci back-end rendering is not enabled :(');
      }
    })
    .catch(error => {
      throw error;
    });
}
