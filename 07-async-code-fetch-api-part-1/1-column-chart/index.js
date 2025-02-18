import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
  url;
  subElements = {};

  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    formatHeading = data => data
  } = {}) {
    super({ label, link, formatHeading });
    this.url = url;
    const { from, to } = range;
    this.from = from;
    this.to = to;

    this.data = null;
    this.selectSubElements();
    this.update(from, to);
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createUrl(from, to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);
    return url;
  }

  async fetchData(from, to) {
    try {
      const response = await fetch(this.createUrl(from, to).toString());
      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async update(from, to) {
    this.data = null;
    this.element.classList.add('column-chart_loading');

    const data = await this.fetchData(from, to);

    if (data && typeof data === 'object') {
      const normalizedData = Object.values(data);
      const value = normalizedData.reduce((sum, cur) => sum + cur, 0);
      this.element.querySelector('[data-element="header"]').innerHTML = this.formatHeading(value);
      super.update(normalizedData);
      this.element.classList.remove('column-chart_loading');
      return this.data = data;
    }
  }
}
