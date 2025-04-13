import SortableTableV3 from "../../../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js";

export default class SortableTableRender extends SortableTableV3 {
  async render(container, routeParams) {
    if (!container) {
      return;
    }

    this.element = this.createElement(this.createTableTemplate());
    await super.render();
    this.selectSubElements();
    this.createListeners();

    container.appendChild(this.element);
  }

  handleWindowScroll = () => {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      super.render();
    }
  }

  createBodyRowTemplate(item) {
    const id = item.id;

    return (`
    <a href=/products/${id} class="sortable-table__row">
        ${this.createBodyCellTemplate(item)}
      </a>
    `);
  }
}
