import { timeParser } from './time-utils';

// map data replay start and end date
export const startDateString = '2018-11-08 00:00:00';
export const startDate = timeParser('November 08 2018');
export const endDate = timeParser('November 25 2018');

// access token for MapboxGLJS
// https://www.mapbox.com/mapbox-gl-js/api/
// https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
// https://docs.mapbox.com/help/glossary/access-token/
export const mapboxAccessToken = 'apiKey';

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
