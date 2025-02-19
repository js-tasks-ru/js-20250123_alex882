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
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.render();
  }

  async render() {
    const loadingIndicator = this.element.querySelector('[data-element="loading"]');
    const emptyPlaceholder = this.element.querySelector('[data-element="emptyPlaceholder"]');

    emptyPlaceholder.style.display = 'none';
    loadingIndicator.style.display = 'block';

    this.data = await this.loadData();
    if (Array.isArray(this.data) && !!this.data.length) {
      loadingIndicator.style.display = 'none';
      super.update(this.data);
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
      _start: '0',
      _end: '30',
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
    this.data = await this.loadData();
    super.setDataOrder(sortField, sortOrder);
    super.update(this.data);
  }
}
