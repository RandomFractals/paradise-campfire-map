import { updateMap } from '../components/map';
import { renderVega } from './mapd-connector';
import { conv4326To900913 } from './map-utils';
import sls from 'single-line-string';

export const createVegaSpec = ({
  width,
  height,
  minXBounds,
  minYBounds,
  maxYBounds,
  maxXBounds,
  dateString
}) => ({
  "width": width,
  "height": height,
  "data": [
    {
      "name": "pointmap",
      "sql": sls`
        SELECT
        conv_4326_900913_x(lon) as x,
        conv_4326_900913_y(lat) as y,
        issuing_agency as color,
        parking_violations.rowid
        FROM parking_violations
        WHERE conv_4326_900913_x(lon) between ${minXBounds} and ${maxXBounds}
        AND conv_4326_900913_y(lat) between ${minYBounds} and ${maxYBounds}
        AND date_trunc(month, issue_datetime) = '${dateString}'
      `
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "domain": [minXBounds, maxXBounds],
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "domain": [minYBounds, maxYBounds],
      "range": "height"
    },
    {
      "name": "pointmap_fillColor",
      "type": "ordinal",
      "domain": [
        "PPA",
        "POLICE",
        "CENTER C",
        "SEPTA",
        "PENN",
        "TEMPLE",
        "HOUSING",
        "PRISONS",
        "FAIRMNT",
        "UNASSIGN",
        "Other"
      ],
      "range": [
        "rgba(234,85,69,0.85)",
        "rgba(189,207,50,0.85)",
        "rgba(179,61,198,0.85)",
        "rgba(239,155,32,0.85)",
        "rgba(135,188,69,0.85)",
        "rgba(244,106,155,0.85)",
        "rgba(172,229,199,0.85)",
        "rgba(237,225,91,0.85)",
        "rgba(131,109,197,0.85)",
        "rgba(134,216,127,0.85)",
        "rgba(39,174,239,0.85)"
      ],
      "default": "rgba(39,174,239,0.85)",
      "nullValue": "rgba(202,202,202,0.85)"
    }
  ],
  "projections": [],
  "marks": [
    {
      "type": "points",
      "from": {
        "data": "pointmap"
      },
      "properties": {
        "x": {
          "scale": "x",
          "field": "x"
        },
        "y": {
          "scale": "y",
          "field": "y"
        },
        "fillColor": {
          "scale": "pointmap_fillColor",
          "field": "color"
        },
        "size": 2
      }
    }
  ]
});

export function updateVega(map, dateString = '2018-11-08 00:00:00') {
  const container = map.getContainer();
  const height = container.clientHeight;
  const width = container.clientWidth;

  const {_sw, _ne} = map.getBounds();
  const [xMin, yMin] = conv4326To900913([_sw.lng, _sw.lat]);
  const [xMax, yMax] = conv4326To900913([_ne.lng, _ne.lat]);

  const vegaSpec = createVegaSpec({
    width,
    height,
    minXBounds: xMin,
    maxXBounds: xMax,
    minYBounds: yMin,
    maxYBounds: yMax,
    dateString
  });

  // render the vega and add it to the map
  renderVega(vegaSpec)
    .then(result => {
      updateMap(result);
    })
    .catch(error => {
      throw error;
    });
};
