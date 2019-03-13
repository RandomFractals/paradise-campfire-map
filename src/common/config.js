// map data over time playback start/end date
export const startDate = new Date('2018-11-08');
export const endDate = new Date('2018-11-26');

// time slider minor/hours ticks/steps per day 
// Note: hours period ticks are not displayed on below the time slider 
// to keep those ticks display UI clean.
// Only day ticks are displayed on the time slider, 
// but users can scrub them with arrow keys and slider mouse clicks
// for hourly thumb updates and date filter queries
export const ticksPerDay = 24; // every hour

// replay timer delay in msecs
export const timerDelay = 500; 

// access token for MapboxGLJS
// https://www.mapbox.com/mapbox-gl-js/api/
// https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
// https://docs.mapbox.com/help/glossary/access-token/
export const mapboxAccessToken = '<mapbox-access-token>';

export const mapboxConfig = {
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-121.62, 39.70],
  zoom: 2,
  minZoom: 2,
  maxZoom: 16,
  maxBounds: [[-121.82, 39.60], [-121.38, 39.86]]
};

// mapd server connection string
// TODO: add link to mapd connnection string config docs
export const serverInfo = {
  host: 'localhost',
  port: 9092,
  database: 'db',
  username: 'user',
  password: 'password'
};
