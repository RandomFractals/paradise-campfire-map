let counterLabel = null;

export function initCounterLabel() {
  counterLabel = document.querySelector('label.counter-label');
  counterLabel.innerHTML = '18,804';
}

export function updateCounterLabel(count) {
  counterLabel.innerHTML = Number(count).toLocaleString();
}

export default counterLabel;
