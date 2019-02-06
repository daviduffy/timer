const display = (timeInSeconds = 0, displayFunc) => { // 1h 32m 32s
  const hours = Math.round(Math.floor(timeInSeconds / 3600));
  const minutes = Math.round(Math.floor(timeInSeconds % 3600) / 60);
  const seconds = Math.round(Math.floor(timeInSeconds % 60));
  return displayFunc(hours, minutes, seconds);
};

const euro = (h = 0, m = 0, s = 0) => {
  const d = (t, str) => t > 0 ? `${('0'+t).slice(-2)}${str}` : '';
  return [d(h, 'h'), d(m, 'm'), d(s, 's')].join(' ');
};

const timer = (h = 0, m = 0, s = 0) => {
  const d = (t) => t > 0 ? ('0'+t).slice(-2) : '00';
  return [d(h), d(m), d(s)].join(':');
};

const jsx = (h = 0, m = 0, s = 0) => {
  const d = (t, str) => (`<span class="${str}">${('0'+t).slice(-2)}</span>`);
  return [d(h, 'h'), d(m, 'm'), d(s, 's')].join(`<span class="c">:</span>`);
};

export { euro, timer, jsx, display as default };
