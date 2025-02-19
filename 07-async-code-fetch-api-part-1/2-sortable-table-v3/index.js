import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted: { id = 'title', order = 'asc' } = {},
    url = '',
    isSortLocally,
  } = {}) {
    super(headersConfig, {
      data,
      sorted: { id, order }
    });
    this.data = data;
    this.sortField = id;
    this.sortOrder = order;
    this.defaultInitialValue = 0;
    this.defaultEndValue = 340;
    this.initialValue = this.defaultInitialValue;
    this.endValue = this.defaultEndValue;
    this.scrollStep = 10;
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.render();
    this.createListeners();
  }

  createListeners() {
    window.addEventListener('scroll', this.handleWindowScroll);
    super.createListeners();
  }

  destroyListeners() {
    window.removeEventListener('scroll', this.handleWindowScroll);
    super.destroyListeners();
  }

  handleWindowScroll = () => {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      this.render();
    }
  }

  async render() {
    const loadingIndicator = this.element.querySelector('[data-element="loading"]');
    const emptyPlaceholder = this.element.querySelector('[data-element="emptyPlaceholder"]');

    emptyPlaceholder.style.display = 'none';
    loadingIndicator.style.display = 'block';

    const newData = await this.loadData();
    if (Array.isArray(newData) && !!newData.length) {
      loadingIndicator.style.display = 'none';

      if (this.data.length !== newData.length) {
        this.data = newData;
        super.update(this.data);
        this.endValue += this.scrollStep;

      }
    } else {
      loadingIndicator.style.display = 'none';
      emptyPlaceholder.style.display = 'block';
    }
  }

  async loadData() {
    const url = this.createUrl(this.url, {
      baseUrl: BACKEND_URL,
      _embed: 'subcategory.category',
      _sort: this.sortField,
      _order: this.sortOrder,
      _start: this.initialValue,
      _end: this.endValue,
    });

    return this.fetchData(url);
  }

  createUrl(url, { baseUrl, ...params }) {
    const resultUrl = new URL(url, baseUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        resultUrl.searchParams.append(key, value);
      }
    });

    return resultUrl;
  }

  async fetchData(url) {
    try {
      const response = await fetch(url.toString());
      return await response.json();
    } catch (err) {
      console.log(err.message);
      return [];
    }
  }

  async sortOnServer (sortField, sortOrder) {
    this.sortField = sortField;
    this.sortOrder = sortOrder;
    this.initialValue = this.defaultInitialValue;
    this.endValue = this.defaultEndValue;
    this.data = await this.loadData();
    this.endValue += this.scrollStep;
    super.setDataOrder(sortField, sortOrder);
    super.update(this.data);
  }
}
