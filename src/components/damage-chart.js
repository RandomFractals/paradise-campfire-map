import {default as vegaEmbed } from 'vega-embed';
import { getLabel, getColor } from '../common/damage-color-palette';

let damageChart = null;

export function initDamageChart() {
  damageChart = document.querySelector('#damage-chart');
};

export function updateDamageChart(damageData) {
  // console.log('damage-chart:updateDamageChart(): damage-data:', damageData);
  const chartData = damageData.map(damage => {
      return {damage: getLabel(damage.key0), color: getColor(damage.key0), count: damage.val};
    });
  
  // damage bar chart vega spec
  const vegaSpec = {
    "width": 160,
    "height": 70,
    "padding": 5,
    "data": {
      "values": chartData
    },
    "encoding": {
      "x": {
        "field": "count", 
        "type": "quantitative",
        "axis": {
          "title": "",
          "tickCount": 3,
          "format": ",d"
        }
      },
      "y": {
        "field": "damage", 
        "type": "ordinal",
        "axis": {
          "title": ""
        }
      },
      "color": {
        "field": "color", 
        "type": "nominal", 
        "scale": null
      }
    },
    "layer": [{
      "mark": "bar"
    }, {
      "mark": {
        "type": "text",
        "align": "left",
        "baseline": "middle",
        "dx": 3
      },
      "encoding": {
        "text": {
          "field": "count", 
          "type": "quantitative",
          "format": ",d"
        }
      }
    }]
  };

  // render vega chart
  vegaEmbed('#damage-chart', vegaSpec, {mode: 'vega-lite'});
};

export default damageChart;
