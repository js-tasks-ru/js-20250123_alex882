import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {

  constructor(headersConfig, {
    data = [],
    sorted: { id, order } = {}
  } = {}) {
    super(headersConfig, data);
    this.isSortLocally = true;
    this.id = id;
    this.order = order;
    this.sort();
    this.createListeners();
  }

  createListeners() {
    document.body.addEventListener('pointerdown', (e) => this.handleTableHeaderPointerdown(e));
  }

  destroyListeners() {
    document.body.removeEventListener('pointerdown', (e) => this.handleTableHeaderPointerdown(e));
  }

  handleTableHeaderPointerdown(e) {
    const { target } = e;

    const elem = target.closest('[data-sortable="true"]');
    if (!elem) {
      return;
    }

    this.id = elem.dataset.id;
    this.order = !elem.dataset.order || elem.dataset.order === 'asc' ? 'desc' : 'asc';
    this.sort();
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient() {
    super.sort(this.id, this.order);
  }

  sortOnServer() {}

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
