import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl/dist/mapboxgl-overrides';
import './styles.css';

import { serverInfo } from './common/config';
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
import { initCounterLabel, updateCounterLabel } from './components/counter-label';

// main app bootstrapping on content loaded
document.addEventListener('DOMContentLoaded', main);
function main() {
  // render markup for our UI
  document.querySelector("#app").innerHTML = `
    <div class="header">
      <img class="logo" height="75px" width="75px" src="images/omni-sci-logo.png" />
      <div class="title-bar">
        <h2 class="title">Paradise, CA 2018 Campfire</h2>
      </div>
    </div>
    <div class="counter-box">
      <label class="counter-label"></label>
    </div>
    <div class="time-controls">
      <input class="time-slider" type="range" min="0" max="18" step="1" value="0" />
      <button class="play-pause-button">&#9654;</button><!-- play -->
      <label class="time-label"></label>
    </div>
    <div id="content">
      <div id="map"></div>
      <div id="side-panel">
        <div class="chart">
          <span class="chart-title">Damaged Buildings</span>
          <hr />
          <p>TODO: add damage by category bar chart</p>
        </div>
        <div class="chart">
          <span class="chart-title">Avg Acres by Land Use</span>
          <hr />
          <p>TODO: add avg acres by land use donut chart</p>
        </div>
      </div>
    </div>
    <div class='legend-box'>
      <div class='legend-title'>Buildings:</div>
      <div class='legend-scale'>
        <ul class='legend-labels'>
          <li><span style='background: rgba(234,85,69,1);'></span>Destroyed (>50%)</li>
          <li><span style='background: rgba(189,207,50,1);'></span>Affected (1-9%)</li>
          <li><span style='background: rgba(179,61,198,1);'></span>Minor (10-25%)</li>
          <li><span style='background: rgba(239,155,32,1);'></span>Major (26-50%)</li>
          <li><span style='background: rgba(39,174,239,1);'></span>Other</li>
        </ul>
      </div>
      <div class='legend-source'>Source: <a href="#link to source">Name of source</a></div>
    </div>`;

  // initialize app controls
  const map = initMap();
  initTimeSlider();
  initTimeLabel();
  initPlayPauseButton();
  initCounterLabel();

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
        updateVega(map);
      } else {
        throw Error('omniSci back-end rendering is not enabled :(');
      }
    })
    .catch(error => {
      throw error;
    });
}
