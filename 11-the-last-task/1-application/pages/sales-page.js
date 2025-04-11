import {BasePage} from "./base-page.js";
import {RangePickerRender} from "../components/dashboard-page-components/dashboard-page-components.js";
import salesSortableTableRender from "../components/sales-sortable-table-render/sales-sortable-table-render.js";
import header from "../components/sales-header.js";

export class SalesPage extends BasePage {
  createTemplate() {
    return (`
    <div class="sales full-height flex-column">
      <div class="content__top-panel">
        <h1 class="page-title">Продажи</h1>
        <div data-component="rangePicker" class="rangepicker"></div>
      </div>
      <div data-component="ordersContainer" class="full-height flex-column"></div>
    </div>
    `);
  }

  async render(container, routeParams) {
    this.createComponentMap();
    await super.render(container, routeParams);
    this.createListeners();
  }

  createComponentMap() {
    const { from, to } = this.getRange();

    return this.componentMap = {
      rangePicker: this.createRangePickerComponent(from, to),
      ordersContainer: this.createSortableTableComponent(from, to),
    };
  }

  createListeners() {
    this.rangePicker.element.addEventListener('date-select', this.handleRangePickerDateSelect);
  }

  destroyListeners() {
    this.rangePicker.element.removeEventListener('date-select', this.handleRangePickerDateSelect);
  }

  handleRangePickerDateSelect = (e) => {
    const { from, to } = e.detail;
    from.setHours(from.getHours() + 3);
    to.setHours(to.getHours() + 3);

    this.sortableTable.updateWithFilters({
      createdAt_gte: from.toISOString(),
      createdAt_lte: to.toISOString(),
    });
  }

  getRange() {
    const now = new Date();
    const to = new Date();
    const from = new Date(now.setMonth(now.getMonth() - 1));

    return { from, to };
  }

  createRangePickerComponent(from, to) {
    const formattedDateFrom = new Date(`${from.getFullYear()}, ${from.getMonth() + 1}, ${from.getDate()}`);
    const formattedDateTo = new Date(`${to.getFullYear()}, ${to.getMonth() + 1}, ${to.getDate()}`);

    this.rangePicker = new RangePickerRender({
      from: formattedDateFrom,
      to: formattedDateTo
    });

    return this.rangePicker;
  }

  createSortableTableComponent(from, to) {
    this.sortableTable = new salesSortableTableRender(header, {
      url: 'api/rest/orders',
      sorted: {
        createdAt_gte: from.toISOString(),
        createdAt_lte: to.toISOString(),
        id: 'createdAt',
        order: 'desc',
      },
    });

    return this.sortableTable;
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
