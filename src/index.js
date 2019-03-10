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
import { initCounterLabel } from './components/counter-label';
import { initDamageChart } from './components/damage-chart';
import { getColor } from './common/damage-color-palette';

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
      <br />
      <label class="time-label"></label>
    </div>
    <div class="time-ticks">
      <p>8</p><p>9</p><p>10</p><p>11</p><p>12</p><p>13</p><p>14</p><p>15</p><p>16</p>
      <p>17</p><p>18</p><p>19</p><p>20</p><p>21</p><p>22</p><p>23</p><p>24</p><p>25</p><p>26</p>
    </div>
    <div class="time-controls">
      <input class="time-slider" type="range" min="0" max="18" step="1" value="0" />
      <button class="play-pause-button">&#9654;</button><!-- play -->
    </div>
    <div id="content">
      <div id="map"></div>
      <div id="side-panel">
        <div class="chart">
          <span class="chart-title">Structural Damage</span>
          <hr />
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

  // TODO: add data stats queries and charts update
  
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
