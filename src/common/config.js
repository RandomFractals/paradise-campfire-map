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
export const serverInfo = {
  host: 'localhost',
  port: 9092,
  database: 'db',
  username: 'user',
  password: 'password'
};

// fire perimeter and parcel fill colors
export const firePerimeterColor = "rgba(237,225,91,0.05)";
export const parcelColor = "rgba(39,174,239,0.2)"

// damage color palette and labels config
export const colorPalette = {
  "Destroyed (>50%)": "rgba(234,85,69,1)",
  "Major (26-50%)": "rgba(239,155,32,1)",
  "Minor (10-25%)": "rgba(179,61,198,1)",
  "Affected (1-9%)": "rgba(189,207,50,1)",
  "Other": "rgba(39,174,239,1)"
};

export const labels = {
  "Destroyed (>50%)": ">50%",
  "Major (26-50%)": "26-50%",
  "Minor (10-25%)": "10-25%",
  "Affected (1-9%)": "1-9%",
  "Other": "Other"
};

export function getColor(damageCategory) {
  return colorPalette[damageCategory];
}

export function getLabel(damageCategory) {
  return labels[damageCategory];
}
