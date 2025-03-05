import RangePicker from '../../08-forms-fetch-api-part-2/2-range-picker/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import header from './bestsellers-header.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element;
  subElements = {};

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  async render() {
    this.element = this.createElement(this.createDashboardPageTemplate());
    const { from, to } = this.getRange();

    this.createRangePickerElement(from, to);
    this.createOrdersChartElement(from, to);
    this.createSalesChartElement(from, to);
    this.createCustomersChartElement(from, to);
    this.createSortableTableElement(from, to);

    this.selectSubElements();
    this.createListeners();

    return this.element;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createDashboardPageTemplate() {
    return (`
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>
      <h3 class="block-title">Best sellers</h3>
      <div data-element="sortableTable">
      </div>
    </div>
    `);
  }

  createListeners() {
    this.rangePicker.element.addEventListener('date-select', this.handleRangePickerDateSelect);
  }

  destroyListeners() {
    this.rangePicker.element.removeEventListener('date-select', this.handleRangePickerDateSelect);
  }

  handleRangePickerDateSelect = (e) => {
    const { from, to } = e.detail;
    this.ordersChart.update(from, to);
    this.salesChart.update(from, to);
    this.customersChart.update(from, to);
    this.sortableTable.updateWithRange(from.toISOString(), to.toISOString());
  }

  createRangePickerElement(from, to) {
    const formattedDateFrom = new Date(`${from.getFullYear()}, ${from.getMonth()}, ${from.getDate()}`);
    const formattedDateTo = new Date(`${to.getFullYear()}, ${to.getMonth()}, ${to.getDate()}`);

    this.rangePicker = new RangePicker({
      from: formattedDateFrom,
      to: formattedDateTo
    });

    const rangePickerContainer = this.element.querySelector('[data-element="rangePicker"]');
    rangePickerContainer.append(this.rangePicker.element);
  }

  createOrdersChartElement(from, to) {
    this.ordersChart = new ColumnChart({
      url: 'api/dashboard/orders',
      range: {
        from,
        to
      },
      label: 'orders',
      link: '#'
    });

    const ordersChartContainer = this.element.querySelector('[data-element="ordersChart"]');
    ordersChartContainer.append(this.ordersChart.element);
  }

  createSalesChartElement(from, to) {
    this.salesChart = new ColumnChart({
      url: 'api/dashboard/sales',
      range: {
        from,
        to
      },
      label: 'sales',
      formatHeading: data => `$${data}`
    });

    const salesChartContainer = this.element.querySelector('[data-element="salesChart"]');
    salesChartContainer.append(this.salesChart.element);
  }

  createCustomersChartElement(from, to) {
    this.customersChart = new ColumnChart({
      url: 'api/dashboard/customers',
      range: {
        from,
        to
      },
      label: 'customers',
    });

    const customersChartContainer = this.element.querySelector('[data-element="customersChart"]');
    customersChartContainer.append(this.customersChart.element);
  }

  createSortableTableElement(from, to) {
    this.sortableTable = new SortableTable(header, {
      url: 'api/dashboard/bestsellers',
      isSortLocally: true,
      from: from.toISOString(),
      to: to.toISOString()
    });

    const sortableTableContainer = this.element.querySelector('[data-element="sortableTable"]');
    sortableTableContainer.append(this.sortableTable.element);
  }

  getRange() {
    const now = new Date();
    const to = new Date();
    const from = new Date(now.setMonth(now.getMonth() - 1));

    return { from, to };
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
