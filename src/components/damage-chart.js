import { default as vegaEmbed } from "vega-embed";
import { getLabel, getColor } from "../common/config";
import { zoomOut } from "../components/map";
import { dispatcher } from "../common/dispatcher";

let damageChart = null;
export function initDamageChart() {
  damageChart = document.querySelector("#damage-chart");
  let showAllDamageLink = document.querySelector("#show-all-damage-link");
  showAllDamageLink.addEventListener("click", onShowAllDamageLinkClick);
}

function onShowAllDamageLinkClick(event) {
  showDamage("all");
}

function showDamage(damage = "all") {
  console.log("damage-chart:showDamage:", damage);
  dispatcher.call("damageFilter", null, damage); // null = that/this context
  if (damage === "all") {
    // zoom out for full area damage display
    zoomOut();
  }
}

export function updateDamageChart(damageData) {
  // console.log('damage-chart:updateDamageChart(): damage-data:', damageData);
  const chartData = damageData.map(damage => {
    return {
      damage: getLabel(damage.key0),
      color: getColor(damage.key0),
      count: damage.val
    };
  });

  // damage bar chart vega spec
  const vegaSpec = {
    width: 180,
    height: 120,
    padding: 10,
    data: {
      values: chartData
    },
    encoding: {
      x: {
        field: "count",
        type: "quantitative",
        axis: {
          title: "",
          tickCount: 3,
          format: ",d",
          grid: false
        }
      },
      y: {
        field: "damage",
        type: "ordinal",
        axis: {
          title: ""
        }
      },
      color: {
        field: "color",
        type: "nominal",
        scale: null
      },
      tooltip: {
        field: "count",
        type: "quantitative",
        format: ",d"
      }
    },
    layer: [
      {
        mark: {
          type: "bar",
          stroke: "#eee",
          cursor: "pointer"  
        }
      },
      {
        mark: {
          type: "text",
          align: "left",
          baseline: "middle",
          dx: 3
        },
        encoding: {
          text: {
            field: "count",
            type: "quantitative",
            format: ",d"
          }
        }
      }
    ],
    selection: {
      "barSelection": {
        fields: ["damage"],
        on: "click",
        type: "single"
      }
    }
  };

  // render vega damage chart
  vegaEmbed("#damage-chart", vegaSpec, { mode: "vega-lite" }).then(result => {
    // add damage bar selection handler
    // result.view.addSignalListener("barSelection", (name, value) => showDamage(value));
  });
}

export default damageChart;
