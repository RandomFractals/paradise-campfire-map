import {default as vegaEmbed } from 'vega-embed';
import { getLabel } from '../common/damage-color-palette';

let damageChart = null;

export function initDamageChart() {
  damageChart = document.querySelector('#damage-chart');
  damageChart.innerHTML = '<p>damage by category bar chart</p>';
}

export function updateDamageChart(damageData) {
  console.log('damage-chart:updateDamageChart(): damage-data:', damageData);
  const sortedDamageData = damageData.sort((a, b) => b.val - a.val);
  // damage bar chart vega spec
  const vegaSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": {
      "values": sortedDamageData
    },
    "encoding": {
      "y": {"field": "key0", "type": "ordinal"},
      "x": {"field": "val", "type": "quantitative"}
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
        "text": {"field": "val", "type": "quantitative"}
      }
    }]
  };
  vegaEmbed('#damage-chart', vegaSpec);
}

export default damageChart;
