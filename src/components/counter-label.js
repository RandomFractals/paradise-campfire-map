let counterLabel = null;

export function initCounterLabel() {
  counterLabel = document.querySelector('label.counter-label');
  counterLabel.innerHTML = '0';
}

export function updateCounterLabel(count, color) {
  counterLabel.innerHTML = Number(count).toLocaleString();
  counterLabel.style.color = color;
}

export default counterLabel;
