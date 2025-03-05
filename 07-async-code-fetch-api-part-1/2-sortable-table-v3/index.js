import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted: { id = 'title', order = 'asc' } = {},
    url = '',
    isSortLocally,
    from = null,
    to = null
  } = {}) {
    super(headersConfig, {
      data,
      sorted: { id, order }
    });
    this.data = data;
    this.sortField = id;
    this.sortOrder = order;
    this.defaultInitialValue = 0;
    this.defaultEndValue = 30;
    this.initialValue = this.defaultInitialValue;
    this.endValue = this.defaultEndValue;
    this.scrollStep = 10;
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.from = from;
    this.to = to;
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
      _embed: 'subcategory.category',
      _sort: this.sortField,
      _order: this.sortOrder,
      _start: this.initialValue,
      _end: this.endValue,
    };

    const url = (this.from && this.to)
      ? this.createUrl(this.url,
        {
          from: this.from,
          to: this.to,
          ...createUrlParams,
        })
      : this.createUrl(this.url, createUrlParams);

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
      return await fetchJson(url);
    } catch (err) {
      console.log(err.response.status);
      return [];
    }
  }

  async sortOnServer (sortField, sortOrder) {
    this.sortField = sortField;
    this.sortOrder = sortOrder;
    super.setDataOrder(this.sortField, this.sortOrder);
    await this.changeData();
  }

  async updateWithRange(from, to) {
    this.from = from;
    this.to = to;
    await this.changeData();
  }

  async changeData() {
    this.initialValue = this.defaultInitialValue;
    this.endValue = this.defaultEndValue;
    this.data = await this.loadData();
    this.endValue += this.scrollStep;
    super.update(this.data);
  }
}
