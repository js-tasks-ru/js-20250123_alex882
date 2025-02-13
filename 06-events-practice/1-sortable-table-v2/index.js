import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {

  constructor(headersConfig, {
    data = [],
    sorted: { id: sortField, order: sortOrder } = {}
  } = {}) {
    super(headersConfig, data);
    this.isSortLocally = true;
    this.sort(sortField, sortOrder);
    this.createListeners();
  }

  createListeners() {
    document.body.addEventListener('pointerdown', this.handleTableHeaderPointerdown);
  }

  destroyListeners() {
    document.body.removeEventListener('pointerdown', this.handleTableHeaderPointerdown);
  }

  handleTableHeaderPointerdown = (e) => {
    const { target } = e;

    const cellElement = target.closest('[data-sortable="true"]');

    if (!cellElement) {
      return;
    }

    const sortField = cellElement.dataset.id;
    const sortOrder = !cellElement.dataset.order || cellElement.dataset.order === 'asc' ? 'desc' : 'asc';
    this.sort(sortField, sortOrder);
  }

  sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer(sortField, sortOrder);
    }
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  sortOnServer(sortField, sortOrder) {}

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
