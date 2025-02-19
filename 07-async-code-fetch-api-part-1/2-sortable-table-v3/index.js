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

    // this.data = this.loadData();
    this.render();
  }

  async render() {
    this.data = await this.loadData();
    // this.sort(this.sortField, this.sortOrder);

    super.update(this.data);
  }

  async loadData() {
    return fetchJson(this.createUrl(this.url, {
      baseUrl: BACKEND_URL,
      _embed: 'subcategory.category',
      _sort: this.sortField,
      _order: this.sortOrder,
      _start: '0',
      _end: '30',
    }));
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

  // sortOnClient (id, order) {
  //   // super.sortOnClient(id, order);
  // }

  async sortOnServer (sortField, sortOrder) {
    // console.log('sortOnServer вызван!');
    this.sortField = sortField;
    this.sortOrder = sortOrder;

    this.data = await this.loadData();

    super.setDataOrder(sortField, sortOrder);
    super.update(this.data);
  }
}
