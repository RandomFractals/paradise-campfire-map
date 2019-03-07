let damageChart = null;

export function initDamageChart() {
  damageChart = document.querySelector('#damage-chart');
  damageChart.innerHTML = '<p>TODO: add damage by category bar chart</p>';
}

export function updateDamageChart(damageData) {
  console.log('damage-chart:updateDamageChart(): damage-data:', damageData);
  // TODO: add vegaLite damage horizontal bar chart display
}

export default damageChart;
