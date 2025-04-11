import { BasePage } from "./base-page.js";
import {
  ColumnChartRender, RangePickerRender
} from "../components/dashboard-page-components/dashboard-page-components.js";
import SortableTableRender from "../components/sortable-table-v4/sortable-table-v4.js";
import header from "../components/dashboard-page-components/bestsellers-header.js";

export class DashboardPage extends BasePage {
  createTemplate() {
    return (`
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Панель управления</h2>
        <div data-component="rangePicker"></div>
      </div>
      <div data-component="chartsRoot" class="dashboard__charts">
        <div data-component="ordersChart" class="dashboard__chart_orders"></div>
        <div data-component="salesChart" class="dashboard__chart_sales"></div>
        <div data-component="customersChart" class="dashboard__chart_customers"></div>
      </div>
      <h3 class="block-title">Лидеры продаж</h3>
      <div data-component="sortableTable">
      </div>
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
      ordersChart: this.createOrdersChartComponent(from, to),
      salesChart: this.createSalesChartComponent(from, to),
      customersChart: this.createCustomersChartComponent(from, to),
      sortableTable: this.createSortableTableComponent(from, to),
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

    this.ordersChart.update(from, to);
    this.salesChart.update(from, to);
    this.customersChart.update(from, to);
    this.sortableTable.updateWithFilters({from: from.toISOString(), to: to.toISOString()});
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


  createOrdersChartComponent(from, to) {
    this.ordersChart = new ColumnChartRender({
      url: 'api/dashboard/orders',
      range: {
        from,
        to
      },
      label: 'orders',
      link: '#'
    });

    return this.ordersChart;
  }

  createSalesChartComponent(from, to) {
    this.salesChart = new ColumnChartRender({
      url: 'api/dashboard/sales',
      range: {
        from,
        to
      },
      label: 'sales',
      formatHeading: data => `$${data}`
    });

    return this.salesChart;
  }

  createCustomersChartComponent(from, to) {
    this.customersChart = new ColumnChartRender({
      url: 'api/dashboard/customers',
      range: {
        from,
        to
      },
      label: 'customers',
    });

    return this.customersChart;
  }

  createSortableTableComponent(from, to) {
    this.sortableTable = new SortableTableRender(header, {
      url: 'api/dashboard/bestsellers',
      isSortLocally: true,
      sorted: {
        from: from.toISOString(),
        to: to.toISOString()
      },
    });

    return this.sortableTable;
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
