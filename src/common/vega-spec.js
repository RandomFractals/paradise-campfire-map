import { scaleLinear } from 'd3-scale';
import { getData, renderVega } from "./mapd-connector";
import { conv4326To900913 } from "./map-utils";
import { timeFormatter } from "./time-utils";
import { updateMap } from "../components/map";
import { updateCounterLabel } from '../components/counter-label';
import { updateDamageChart } from '../components/damage-chart';
import { labels, getLabel, getColor, firePerimeterColor, parcelColor, endDate } from "./config";

// initialize damage color coding from config
const damageCategories = Object.keys(labels);
const damageColors = damageCategories.map(damage => getColor(damage));
const damageLabels = getDamageLabels(damageCategories);

function getDamageLabels(damageCategories) {
  let damageLabels = {}
  damageCategories.map(damage => damageLabels[getLabel(damage)] = damage);
  return damageLabels;
}

function getMarkSize(neLat, zoom) {
  const pixelSize = 10;
  const width = 10;
  const numBinsX = Math.round(width / pixelSize);
  const markWidth = width / numBinsX;
  const markHeight = 2 * markWidth / Math.sqrt(3.0);
  return [markWidth, markHeight];
}

export const createVegaSpec = ({map, endDate, damageFilter}) => {
  // get map size
  const mapContainer = map.getContainer();
  const mapWidth = mapContainer.clientWidth;
  const mapHeight = mapContainer.clientHeight;
  const endDateString = timeFormatter(endDate);

  // convert NE/SW map bounds back to our custom Mercator x/y
  const {_ne, _sw} = map.getBounds();
  const [xMax, yMax] = conv4326To900913([_ne.lng, _ne.lat]);
  const [xMin, yMin] = conv4326To900913([_sw.lng, _sw.lat]);
  // console.log('vega-spec:mapBounds: (x/y)', [mapWidth, mapHeight], [xMin, xMax, yMin, yMax]);
  console.log('vega-spec:mapBounds: (NE/SW)', _ne, _sw);
  console.log('vega-spec:endDate:', endDateString, 'damageFilter:', damageFilter);
  //console.log('vega-spec:damageCategories:', damageCategories, damageColors, damageLabels);

  // create damage query filter
  let damageQueryFilter = '';
  if (damageFilter !== 'all') {
    damageQueryFilter = ` AND (DAMAGE ILIKE '%${damageLabels[damageFilter]}%')`;
  }
  const damageQueryFilter2 = damageQueryFilter.replace('DAMAGE', 's2_DAMAGE');

  // set dynamic stroke/point scales and colors based on map zoom
  const mapZoom = map.getZoom();
  const mapZoomMin = map.getMinZoom();
  const mapZoomMax = map.getMaxZoom();
  const strokeWidthScale = scaleLinear().domain([mapZoomMin, mapZoomMax]).range([5, 1]);
  const pointScale = scaleLinear().domain([mapZoomMin, mapZoomMax]).range([0, 5]);
  const [markWidth, markHeight] = getMarkSize(_ne.lat, mapZoom);

  // set default and dynamic damage color opacity based on map zoom
  const defaultOpacity = 0.3; // for null and default color values
  const damageColorAlphaScale = scaleLinear().domain([mapZoomMin, mapZoomMax]).range([0.05, 0.4]);
  damageColors[0] = getColor('Destroyed (>50%)').replace('0.7', damageColorAlphaScale(mapZoom));

  const vegaSpec = {
    width: mapWidth,
    height: mapHeight,
    data: [
      {
        name: "damagePointData",
        sql: `SELECT conv_4326_900913_x(ST_X(omnisci_geo)) as x, 
          conv_4326_900913_y(ST_Y(omnisci_geo)) as y, 
          DAMAGE as color, 
          ca_butte_county_damaged_points_earliestdate.rowid 
        FROM ca_butte_county_damaged_points_earliestdate 
        WHERE ((ST_X(omnisci_geo) >= ${_sw.lng} AND ST_X(omnisci_geo) <= ${_ne.lng}) 
          AND (ST_Y(omnisci_geo) >= ${_sw.lat} AND ST_Y(omnisci_geo) <= ${_ne.lat}))
          AND perDatTime <= '${endDateString}' ${damageQueryFilter}
        LIMIT 2000000`
      },
      {
        name: "firePerimeterData",
        format: "polys",
        geocolumn: "omnisci_geo",
        sql: `SELECT fire_perim_camp.rowid as rowid 
          FROM fire_perim_camp
          WHERE perDatTime <= '${endDateString}'`
      },
      {
        name: "parcelData",
        format: "polys",
        geocolumn: "omnisci_geo",
        sql: `SELECT ca_butte_county_parcels.rowid as rowid 
        FROM ca_butte_county_parcels 
        WHERE (ca_butte_county_parcels.LandUse ILIKE '%RS%')`
      },
      {
        name: "buildingData",
        format: "polys",
        geocolumn: "omnisci_geo",
        sql: `SELECT s2_DAMAGE as color, 
          ca_butte_county_damaged_buildings_earliestdate.rowid as rowid 
          FROM ca_butte_county_damaged_buildings_earliestdate
          WHERE perDatTime <= '${endDateString}' ${damageQueryFilter2}`
      }
    ],
    scales: [
      {
        name: "x",
        type: "linear",
        domain: [xMin, xMax],
        range: "width"
      },
      {
        name: "y",
        type: "linear",
        domain: [yMin, yMax],
        range: "height"
      },
      {
        name: "damagePointFillColor",
        type: "ordinal",
        domain: damageCategories,
        range: damageColors,
        default: getColor('Other'),
        nullValue: "rgba(202,202,202,1)"
      },
      {
        name: "buildingFillColor",
        type: "ordinal",
        domain: damageCategories,
        range: damageColors,
        nullValue: "rgba(214, 215, 214, 0.65)",
        default: "rgba(214, 215, 214, 0.65)"
      }
    ],
    projections: [
      {
        name: "mercator_map_projection",
        type: "mercator",
        bounds: {
          x: [_sw.lng, _ne.lng],
          y: [_sw.lat, _ne.lat]
        }
      }
    ],
    marks: [
      {
        type: "polys",
        from: { data: "firePerimeterData" },
        properties: {
          x: { field: "x" },
          y: { field: "y" },
          fillColor: { value: firePerimeterColor },
          strokeColor: "white",
          strokeWidth: 0,
          lineJoin: "miter",
          miterLimit: 10
        },
        transform: { projection: "mercator_map_projection" }
      },      
      {
        type: "polys",
        from: { data: "parcelData" },
        properties: {
          x: { field: "x" },
          y: { field: "y" },
          fillColor: { value: parcelColor },
          strokeColor: "white",
          strokeWidth: 0,
          lineJoin: "miter",
          miterLimit: 10
        },
        transform: { projection: "mercator_map_projection" }
      },
      {
        type: "polys",
        from: { data: "buildingData" },
        properties: {
          x: { field: "x" },
          y: { field: "y" },
          fillColor: {
            scale: "buildingFillColor",
            field: "color"
          },
          strokeColor: {
            scale: "buildingFillColor",
            field: "color"
          },
          strokeWidth: strokeWidthScale(mapZoom),
          lineJoin: "miter",
          miterLimit: 10
        },
        transform: { projection: "mercator_map_projection" }
      },
      {
        type: "symbol",
        from: { data: "damagePointData" },
        properties: {
          xc: { scale: "x", field: "x" },
          yc: { scale: "y", field: "y" },
          fillColor: { scale: "damagePointFillColor", field: "color" },
          shape: "circle",
          width: pointScale(mapZoom),
          height: pointScale(mapZoom)
        }
      }
    ]
  };
  return vegaSpec;
};

export const getDamageDataQuery = ({map, endDate}) => {
  const endDateString = timeFormatter(endDate);
  const {_ne, _sw} = map.getBounds();
  return `with filler as(
    select DAMAGE, 
    sum(0) as nonecount
    from ca_butte_county_damaged_points_earliestdate
    group by 1
  ),
  damagequery as (
    SELECT 
    ca_butte_county_damaged_points_earliestdate.DAMAGE, 
    COUNT(*) AS val 
    FROM ca_butte_county_damaged_points_earliestdate 
    WHERE (
        (ST_X(omnisci_geo) >= ${_sw.lng} AND ST_X(omnisci_geo) <= ${_ne.lng}) 
        AND 
        (ST_Y(omnisci_geo) >= ${_sw.lat} AND ST_Y(omnisci_geo) <= ${_ne.lat})
  ) AND perDatTime <= '${endDateString}'
    GROUP BY 1 
    ORDER BY val DESC 
    NULLS LAST 
    LIMIT 100
  )
  select
  filler.damage as key0,
  filler.nonecount + coalesce(damagequery.val,0) as val
  from filler
  left join damagequery on filler.damage = damagequery.damage;`;
}

export function updateVega(map, endDate, damageFilter = 'all') {
  // get data stats
  getData(getDamageDataQuery({map, endDate}))
    .then(result => {
      if (damageFilter === 'all') {
        // show largest damage counter value
        // NOTE: damage results are sorted by count values (see query above :)
        updateCounterLabel(result[0].val, getColor(result[0].key0));
      } else {
        // show selected damage filter counter in app header
        const damageKey = damageLabels[damageFilter];
        const damageValue = result.filter(damage => (damage.key0 === damageKey))[0].val;
        updateCounterLabel(damageValue, getColor(damageKey));
      }
      updateDamageChart(result, endDate);
    })
    .catch(error => {
      // show 0 counts
      const damageData = damageCategories.map(damage => {
        return {key0: damage, val: 0};
      });
      // updateCounterLabel(0, getColor(damageCategories[0]));
      // updateDamageChart(damageData, endDate);
      throw error;
    });

  // get vega tiles for the map
  const vegaSpec = createVegaSpec({map, endDate, damageFilter});
  renderVega(vegaSpec)
    .then(result => {
      updateMap(result);
    })
    .catch(error => {
      throw error;
    });
};
