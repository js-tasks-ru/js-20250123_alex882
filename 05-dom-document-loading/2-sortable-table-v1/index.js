export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTableTemplate());
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTableTemplate() {
    return (`
  <div class="sortable-table">

    <div data-element="header" class="sortable-table__header sortable-table__row">
    ${this.createHeaderTemplate(this.headerConfig)}
    </div>

    <div data-element="body" class="sortable-table__body">
    ${this.createBodyTemplate(this.data)}
    </div>

    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
  </div>`);
  }

  createHeaderTemplate(headerConfig) {
    return (`
    ${headerConfig.map(({id, title, sortable}) => this.createHeaderCellTemplate(id, title, sortable)).join(' ')}
    `);
  }

  createHeaderCellTemplate(id, title, sortable) {
    return (`
       <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>
    `);
  }

  createHeaderCellArrowElement(targetElement = document.body) {
    const headerCellArrowTemplate = (`
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`);

    const element = document.createElement('div');
    element.innerHTML = headerCellArrowTemplate;

    const headerCellArrowElement = document.body.querySelector('.sortable-table__sort-arrow');
    if (headerCellArrowElement) {
      targetElement.append(headerCellArrowElement);
    } else {
      targetElement.append(element.firstElementChild);
    }
  }

  createBodyTemplate(data) {
    return (`
    ${data.map((item) => this.createBodyRowTemplate(item)).join(' ')}
    `);
  }

  createBodyRowTemplate(item) {
    return (`
    <a href="#" class="sortable-table__row">
        ${this.createBodyCellTemplate(item)}
      </a>
    `);
  }

  createBodyCellTemplate(dataItem) {
    return this.headerConfig.map(({id, template}) => {
      if (template) {
        return (`
        ${template(dataItem[id])}
`);
      } else {
        return (`
      <div class="sortable-table__cell">${dataItem[id]}</div>`);
      }
    }).join(' ');
  }

  sort(field, direction) {
    const setDataOrder = () => {
      const previousElements = this.element.querySelectorAll(`.sortable-table__cell[data-order][data-sortable="true"]`);
      previousElements.forEach(item => item.dataset.order = '');

      const currentElement = this.element.querySelector(`.sortable-table__cell[data-id=${field}][data-sortable="true"]`);
      if (!currentElement) {
        return;
      }
      const hasHeaderCellArrow = !!currentElement.querySelector('.sortable-table__sort-arrow');
      if (!hasHeaderCellArrow) {
        this.createHeaderCellArrowElement(currentElement);
      }
      currentElement.dataset.order = direction;
    };

    if (typeof this.data[0][field] === 'string') {

      if (direction === 'asc') {
        this.data.sort((a, b) => a[field].localeCompare(b[field], ["ru", "eng"], { caseFirst: 'upper' }));
        setDataOrder();
      } else {
        this.data.sort((a, b) => b[field].localeCompare(a[field], ["ru", "eng"], { caseFirst: 'upper' }));
        setDataOrder();
      }
    }
    else if (typeof this.data[0][field] === 'number') {

      if (direction === 'asc') {
        this.data.sort((a, b) => a[field] - b[field]);
        setDataOrder();
      } else {
        this.data.sort((a, b) => b[field] - a[field]);
        setDataOrder();
      }
    }

    this.update();
  }

  update() {
    this.element.querySelector('[data-element="body"]').innerHTML = this.createBodyTemplate(this.data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

