export default class SortableList {
  element;
  items;
  constructor({ items = [] }) {
    this.items = items;

    this.element = this.createElement();
    this.draggingElement = null;
    this.placeholder = null;
    this.createListeners();
  }

  createElement() {
    const element = document.createElement('ul');
    element.classList.add('sortable-list');

    this.items.forEach((item) => {
      item.classList.add('sortable-list__item');
      element.append(item);
    });

    return element;
  }

  createPlaceholder() {
    if (!this.draggingElement) {
      return;
    }

    const placeholder = document.createElement('div');
    placeholder.className = 'sortable-list__placeholder';
    placeholder.style.height = `${this.draggingElement.offsetHeight}px`;
    this.placeholder = placeholder;
  }

  createListeners() {
    this.element.addEventListener('pointerdown', this.handleSortableListPointerdown);
  }

  destroyListeners() {
    this.element.removeEventListener('pointerdown', this.handleSortableListPointerdown);
  }

  handleSortableListPointerdown = (e) => {
    const { target } = e;

    if (target.closest('[data-grab-handle]')) {
      this.handleListItemDragStart(e);
    } else if (target.closest('[data-delete-handle]')) {
      this.handleListItemDelete(e);
    }
  }

  handleListItemDelete(e) {
    const item = e.target.closest('.sortable-list__item');
    if (item) {
      item.remove();
      this.items = this.items.filter(el => el !== item);
    }
  }

  handleListItemDragStart(e) {
    e.preventDefault();

    this.draggingElement = e.target.closest('.sortable-list__item');
    if (!this.draggingElement) {
      return;
    }

    this.createPlaceholder();

    this.draggingElement.classList.add('sortable-list__item_dragging');
    this.draggingElement.style.width = '100%';
    this.draggingElement.style.pointerEvents = 'none';

    this.draggingElement.after(this.placeholder);
    this.moveAt(e.pageY);

    document.addEventListener('pointermove', this.handleDocumentPointermove);
    document.addEventListener('pointerover', this.handleDocumentPointerover);
    document.addEventListener('pointerout', this.handleDocumentPointerout);
    document.addEventListener('pointerup', this.handleDocumentPointerup);
  }

  handleDocumentPointermove = (e) => {
    this.moveAt(e.pageY);
  };

  handleDocumentPointerover = (e) => {
    const listItem = e.target.closest('.sortable-list__item');
    const isPointerOverList = listItem && listItem !== this.draggingElement && listItem !== this.placeholder;

    if (isPointerOverList) {
      listItem.before(this.placeholder);
    }
  };

  handleDocumentPointerout = (e) => {
    const listItem = e.target.closest('.sortable-list__item');
    const isPointerOutList = listItem && listItem !== this.draggingElement && listItem !== this.placeholder;
    const listItemLast = this.element.lastElementChild;

    if (isPointerOutList && listItem === listItemLast) {
      listItem.after(this.placeholder);
    }
  }

  handleDocumentPointerup = () => {
    this.placeholder.replaceWith(this.draggingElement);
    this.draggingElement.classList.remove('sortable-list__item_dragging');
    this.draggingElement.style.pointerEvents = '';
    this.draggingElement.style = '';
    this.draggingElement = null;
    this.placeholder = null;

    document.removeEventListener('pointermove', this.handleDocumentPointermove);
    document.removeEventListener('pointerover', this.handleDocumentPointerover);
    document.removeEventListener('pointerout', this.handleDocumentPointerout);
    document.removeEventListener('pointerup', this.handleDocumentPointerup);
  };

  moveAt(pageY) {
    this.draggingElement.style.top = `${pageY - this.draggingElement.offsetHeight / 2}px`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
