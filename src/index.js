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
import { initSlider } from './components/slider';
import { initTimeLabel } from './components/time-label';
import { initPlayPauseButton } from './components/play-pause-control';

// main app bootstrapping on content loaded
document.addEventListener('DOMContentLoaded', main);
function main() {
  // render markup for our UI
  document.querySelector("#app").innerHTML = `
    <div class="header">
      <img class="logo" height="75px" width="75px" src="images/mapd-logo.png" />
      <div class="title-bar">
        <h2 class="title">Paradise, CA 2018 Campfire</h2>
      </div>
    </div>
    <div class="slider-controls">
      <input class="slider" type="range" min="0" max="11" step="1" value="0" />
      <button class="play-pause-button">&#9654;</button><!-- play -->
      <label class="time-label"></label>
    </div>
    <div id="map"></div>`;

  // initialize app controls
  const map = initMap();
  const slider = initSlider();
  initTimeLabel();
  initPlayPauseButton();

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
        throw Error("MapD back-end rendering is not enabled :(");
      }
    })
    .catch(error => {
      throw error;
    });
}
