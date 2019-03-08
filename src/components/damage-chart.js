import {default as vegaEmbed } from 'vega-embed';
import { getLabel, getColor } from '../common/damage-color-palette';

let damageChart = null;

export function initDamageChart() {
  damageChart = document.querySelector('#damage-chart');
  damageChart.innerHTML = '<p>damage by category bar chart</p>';
}

export function updateDamageChart(damageData) {
  console.log('damage-chart:updateDamageChart(): damage-data:', damageData);
  const chartData = damageData.sort((a, b) => b.val - a.val)
    .map(damage => {
      return {damage: getLabel(damage.key0), color: getColor(damage.key0), count: damage.val};
    });
  // damage bar chart vega spec
  const vegaSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": {
      "values": chartData
    },
    "encoding": {
      "x": {"field": "count", "type": "quantitative"},
      "y": {"field": "damage", "type": "ordinal"},
      "color": {"field": "color", "type": "nominal", "scale": null}
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
        "text": {"field": "count", "type": "quantitative"}
      }
    }]
  };
  vegaEmbed('#damage-chart', vegaSpec);
}

export default damageChart;
