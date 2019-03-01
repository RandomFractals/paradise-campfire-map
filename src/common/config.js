import { timeParser } from './time-utils';

// map data replay start and end date
export const startDate = timeParser('January 01 2012');
export const endDate = timeParser('December 31 2017');

// access token for MapboxGLJS
// https://www.mapbox.com/mapbox-gl-js/api/
// https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
// https://docs.mapbox.com/help/glossary/access-token/
export const mapboxAccessToken = 'apikey';

export const mapboxConfig = {
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-97.5,39.8],
  zoom: 2,
  minZoom: 2,
  maxZoom: 16,
  maxBounds: [[-75.651855,39.760519], [-74.665833,40.183070]]
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
