import { getData, renderVega } from "./mapd-connector";
import { conv4326To900913 } from "./map-utils";
import { getLabel, getColor } from "./config";
import { updateMap } from "../components/map";
import { updateCounterLabel } from '../components/counter-label';
import { updateDamageChart } from '../components/damage-chart';

export const createVegaSpec = ({map, endDateString, damageFilter}) => {
  // get map size
  const mapContainer = map.getContainer();
  const mapWidth = mapContainer.clientWidth;
  const mapHeight = mapContainer.clientHeight;
  
  // convert NE/SW map bounds back to our custom Mercator x/y
  const {_ne, _sw} = map.getBounds();
  const [xMax, yMax] = conv4326To900913([_ne.lng, _ne.lat]);
  const [xMin, yMin] = conv4326To900913([_sw.lng, _sw.lat]);
  // console.log('vega-spec:mapBounds: (x/y)', [mapWidth, mapHeight], [xMin, xMax, yMin, yMax]);
  console.log('vega-spec:mapBounds: (NE/SW)', _ne, _sw);
  console.log('vega-spec:endDate:', endDateString, 'damageFilter:', damageFilter);

  // TODO: plug in date param in query (per day or hr???)
  const vegaSpec = {
    width: mapWidth,
    height: mapHeight,
    data: [
      {
        name: "pointmapLayer0",
        sql: `SELECT conv_4326_900913_x(ST_X(omnisci_geo)) as x, 
          conv_4326_900913_y(ST_Y(omnisci_geo)) as y, 
          DAMAGE as color, 
          ca_butte_county_damaged_points_earliestdate.rowid 
        FROM ca_butte_county_damaged_points_earliestdate 
        WHERE ((ST_X(omnisci_geo) >= ${_sw.lng} AND ST_X(omnisci_geo) <= ${_ne.lng}) 
          AND (ST_Y(omnisci_geo) >= ${_sw.lat} AND ST_Y(omnisci_geo) <= ${_ne.lat}))
          AND perDatTime <= '${endDateString}'
        LIMIT 2000000`
      },
      {
        name: "backendChoroplethLayer0",
        format: "polys",
        geocolumn: "omnisci_geo",
        sql: `SELECT fire_perim_camp.rowid as rowid 
          FROM fire_perim_camp
          WHERE perDatTime <= '${endDateString}'`
      },
      {
        name: "backendChoroplethLayer1",
        format: "polys",
        geocolumn: "omnisci_geo",
        sql: `SELECT ca_butte_county_parcels.rowid as rowid 
        FROM ca_butte_county_parcels 
        WHERE (ca_butte_county_parcels.LandUse ILIKE '%RS%')`
      },
      {
        name: "backendChoroplethLayer3",
        format: "polys",
        geocolumn: "omnisci_geo",
        sql: `SELECT s2_DAMAGE as color, 
          ca_butte_county_damaged_buildings_earliestdate.rowid as rowid 
          FROM ca_butte_county_damaged_buildings_earliestdate
          WHERE perDatTime <= '${endDateString}'`
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
        name: "pointmapLayer0_fillColor",
        type: "ordinal",
        domain: [
          "Destroyed (>50%)",
          "Affected (1-9%)",
          "Minor (10-25%)",
          "Major (26-50%)",
          "Other"
        ],
        range: [
          "rgba(234,85,69,1)",
          "rgba(189,207,50,1)",
          "rgba(179,61,198,1)",
          "rgba(239,155,32,1)",
          "rgba(39,174,239,1)"
        ],
        default: "rgba(39,174,239,1)",
        nullValue: "rgba(202,202,202,1)"
      },
      {
        name: "backendChoroplethLayer3_fillColor",
        type: "ordinal",
        domain: [
          "Destroyed (>50%)",
          "Affected (1-9%)",
          "Minor (10-25%)",
          "Major (26-50%)",
          "Other"
        ],
        range: [
          "rgba(234,85,69,0.9)",
          "rgba(189,207,50,0.9)",
          "rgba(179,61,198,0.9)",
          "rgba(239,155,32,0.9)",
          "rgba(39,174,239,0.9)"
        ],
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
        from: { data: "backendChoroplethLayer0" },
        properties: {
          x: { field: "x" },
          y: { field: "y" },
          fillColor: { value: "rgba(237,225,91,0.05)" },
          strokeColor: "white",
          strokeWidth: 0,
          lineJoin: "miter",
          miterLimit: 10
        },
        transform: { projection: "mercator_map_projection" }
      },
      {
        type: "polys",
        from: { data: "backendChoroplethLayer1" },
        properties: {
          x: { field: "x" },
          y: { field: "y" },
          fillColor: { value: "rgba(39,174,239,0.2)" },
          strokeColor: "white",
          strokeWidth: 1,
          lineJoin: "miter",
          miterLimit: 10
        },
        transform: { projection: "mercator_map_projection" }
      },
      {
        type: "polys",
        from: { data: "backendChoroplethLayer3" },
        properties: {
          x: { field: "x" },
          y: { field: "y" },
          fillColor: {
            scale: "backendChoroplethLayer3_fillColor",
            field: "color"
          },
          strokeColor: "white",
          strokeWidth: 0,
          lineJoin: "miter",
          miterLimit: 10
        },
        transform: { projection: "mercator_map_projection" }
      },
      {
        type: "symbol",
        from: { data: "pointmapLayer0" },
        properties: {
          xc: { scale: "x", field: "x" },
          yc: { scale: "y", field: "y" },
          fillColor: { scale: "pointmapLayer0_fillColor", field: "color" },
          shape: "circle",
          width: 4,
          height: 4
        }
      }
    ]
  };
  return vegaSpec;
};

export const getDamageDataQuery = ({map, endDateString}) => {
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

export function updateVega(map, endDateString = '2018-11-08 00:00:00', damageFilter = 'all') {
  // get data stats
  getData(getDamageDataQuery({map, endDateString}))
    .then(result => {
      // NOTE: damage results are sorted by count values (see query above :)
      updateCounterLabel(result[0].val, getColor(result[0].key0));
      updateDamageChart(result);
    })
    .catch(error => {
      throw error;
    });

  // get vega tiles for the map
  const vegaSpec = createVegaSpec({map, endDateString, damageFilter});
  renderVega(vegaSpec)
    .then(result => {
      updateMap(result);
    })
    .catch(error => {
      throw error;
    });
};
