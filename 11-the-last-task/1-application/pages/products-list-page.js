import { BasePage } from "./base-page.js";
import SortableTableRender from "../components/sortable-table-v4/sortable-table-v4.js";
import header from "../components/dashboard-page-components/bestsellers-header.js";
import {DoubleSliderRender} from "../components/double-slider/double-slider-render.js";

export class ProductsListPage extends BasePage {
  createTemplate() {
    return (`
    <div class="products-list">
        <div class="content__top-panel">
            <h1 class="page-title">Товары</h1>
            <a href="/products/add" class="button-primary">Добавить товар</a>
        </div>
        <div data-component="sortForm" class="content-box content-box_small">${this.createSortFormTemplate()}</div>
        <div data-component="sortableTable" class="products-list__container"></div>
    </div>
    `);
  }

  createSortFormTemplate() {
    return `<form class="form-inline">
            <div class="form-group">
                <label class="form-label">Сортировать по:</label>
                <input type="text" data-component="filterName" class="form-control" placeholder="Название товара"/>
            </div>
            <div class="form-group" data-component="sliderContainer">
                <label class="form-label">Цена:</label>
            </div>
            <div class="form-group">
                 <label class="form-label">Статус:</label>
                 <select class="form-control" data-component="filterStatus">
                    <option value selected>Любой</option>
                    <option value="1">Активный</option>
                    <option value="0">Неактивный</option>
                 </select>
            </div>
        </form>`;
  }

  async render(container, routeParams) {
    this.createComponentMap();
    await super.render(container, routeParams);
    this.createListeners();
  }

  createComponentMap() {
    return this.componentMap = {
      sliderContainer: this.createDoubleSliderComponent(),
      sortableTable: this.createSortableTableComponent(),
    };
  }

  createListeners() {
    document.querySelector('[data-component="filterName"]').addEventListener('input', this.handleFilterNameInput);
    document.querySelector('.range-slider').addEventListener('range-select', this.handleSliderContainerRangeSelect);
    document.querySelector('[data-component="filterStatus"]').addEventListener('change', this.handleFilterStatusInput);
  }

  destroyListeners() {
    const filterName = document.querySelector('[data-component="filterName"]');
    if (filterName) {
      filterName.removeEventListener('input', this.handleFilterNameInput);
    }

    const rangeSlider = document.querySelector('.range-slider');
    if (rangeSlider) {
      rangeSlider.addEventListener('range-select', this.handleSliderContainerRangeSelect);
    }

    const filterStatus = document.querySelector('[data-component="filterStatus"]');
    if (filterStatus) {
      filterStatus.removeEventListener('change', this.handleFilterStatusInput);
    }
  }

  handleFilterNameInput = (e) => {
    this.sortableTable.updateWithFilters({ title_like: e.target.value });
  }

  handleSliderContainerRangeSelect = (e) => {
    const { from, to } = e.detail;
    this.sortableTable.updateWithFilters({
      price_gte: from,
      price_lte: to
    });
  }

  handleFilterStatusInput = (e) => {
    this.sortableTable.updateWithFilters({status: e.target.value});
  }

  createDoubleSliderComponent() {
    const config = {
      min: 0,
      max: 4000,
      selected: {
        from: 0,
        to: 4000
      }
    };

    this.doubleSlider = new DoubleSliderRender(config);
    return this.doubleSlider;
  }

  createSortableTableComponent() {
    this.sortableTable = new SortableTableRender(header, {
      url: 'api/rest/products',
      isSortLocally: true,
    });

    return this.sortableTable;
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
