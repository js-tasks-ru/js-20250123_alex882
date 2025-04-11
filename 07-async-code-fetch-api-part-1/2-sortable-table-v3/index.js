import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    url = '',
    isSortLocally,
    sorted = {},
  } = {}) {
    super(headersConfig, {
      data,
      sorted: {
        id: sorted.id || 'title',
        order: sorted.order || 'asc'
      }
    });

    this.data = data;
    this.url = url;
    this.isSortLocally = isSortLocally;

    const { id, order, ...rest } = sorted;
    this.sorted = {
      ...rest,
      _sort: id || 'title',
      _order: order || 'asc'
    };

    this.defaultInitialValue = 0;
    this.defaultEndValue = 30;
    this.initialValue = this.defaultInitialValue;
    this.endValue = this.defaultEndValue;
    this.scrollStep = 10;

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
    const createUrlParams = {
      baseUrl: BACKEND_URL,
      ...this.sorted,
      _start: this.initialValue,
      _end: this.endValue,
    };

    return this.fetchData(this.createUrl(this.url, createUrlParams));
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
      return await fetchJson(url);
    } catch (err) {
      console.log(err.response.status);
      return [];
    }
  }

  async sortOnServer (sortField, sortOrder) {
    this.sorted = {
      ...this.sorted,
      _sort: sortField,
      _order: sortOrder,
    };

    super.setDataOrder(this.sorted['_sort'], this.sorted['_order']);
    await this.changeData();
  }

  async updateWithFilters(filters) {
    this.sorted = {
      ...this.sorted,
      ...filters
    };
    this.removeEmptyStrings(this.sorted);
    await this.changeData();
  }

  async changeData() {
    this.initialValue = this.defaultInitialValue;
    this.endValue = this.defaultEndValue;
    this.data = await this.loadData();
    this.endValue += this.scrollStep;
    super.update(this.data);
  }

  removeEmptyStrings(obj) {
    for (const key in obj) {
      if (Object.hasOwn(obj, key) && obj[key] === "") {
        delete obj[key];
      }
    }
  }
}
