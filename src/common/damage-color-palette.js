const colorPalette = {
  "Destroyed (>50%)": "rgba(234,85,69,1)",
  "Major (26-50%)": "rgba(239,155,32,1)",
  "Minor (10-25%)": "rgba(179,61,198,1)",
  "Affected (1-9%)": "rgba(189,207,50,1)",
  "Other": "rgba(39,174,239,1)"
};

const labels = {
  "Destroyed (>50%)": ">50%",
  "Major (26-50%)": "26-50%",
  "Minor (10-25%)": "10-25%",
  "Affected (1-9%)": "1-9%",
  "Other": "Other"
};

export function getColor(damageCategory) {
  return colorPalette[damageCategory];
}

export function getLabel(damageCategory) {
  return labels[damageCategory];
}
