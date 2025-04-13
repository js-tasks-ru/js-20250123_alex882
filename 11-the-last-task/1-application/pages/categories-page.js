import {BasePage} from "./base-page.js";
import fetchJson from '../utils/fetch-json.js';
import SortableList from '../../../09-tests-for-frontend-apps/2-sortable-list/index.js';
import escapeHtml from "../../../09-tests-for-frontend-apps/1-product-form-v2/utils/escape-html.js";

export class CategoriesPage extends BasePage {

  BACKEND_URL = 'https://course-js.javascript.ru';
  url = 'api/rest/categories';
  constructor() {
    super();
    this.data = [];
  }

  createTemplate() {
    return (`
    <div class="categories">
        <div class="content__top-panel">
            <h1 class="page-title">Категории товаров</h1>
        </div>
        <p>Подкатегории можно перетаскивать, меняя их порядок внутри своей категории.</p>
        <div data-component="categoriesContainer"></div>
    </div>
    `);
  }

  createCategoryElement(id, title, subcategories) {
    const categoryTemplate = `
        <header class="category__header">${title}</header>
        <div class="category__body">
            <div class="subcategory-list"></div>
        </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = categoryTemplate;
    element.classList.add('category');
    element.classList.add('category_open');
    element.dataset.id = id;

    const sortableList = this.createSortableListElement(subcategories);
    const subcategorylistContainer = element.querySelector('.subcategory-list');
    subcategorylistContainer.innerHTML = '';
    subcategorylistContainer.append(sortableList.element);

    return element;
  }

  createSortableListElement(subcategories) {
    return new SortableList({
      items: subcategories.map(({title, count, id}) => {
        const element = document.createElement('li');
        element.classList.add('categories__sortable-list-item');
        element.classList.add('sortable-list__item');
        element.dataset.id = id;

        element.innerHTML = (`
        <strong>${title}</strong>
        <span>
            <b>${count}</b>
            products
        </span>
        `);
        return element;
      })
    });
  }

  async render(container, routeParams) {
    this.data = await this.loadData({
      _sort: 'weight',
      _refs: 'subcategory',
    });

    await super.render(container, routeParams);

    const categoriesContainer = document.querySelector('div[data-component="categoriesContainer"]');
    this.data.forEach(({ id, title, subcategories }) => {
      const categoryEl = this.createCategoryElement(id, title, subcategories);
      categoriesContainer.append(categoryEl);
    });

    const items = document.querySelectorAll('.sortable-list__item');
    items.forEach(item => {
      item.setAttribute('data-grab-handle', '');
      item.setAttribute('data-delete-handle', '');
    });

    this.createListeners();
  }

  createListeners() {
    const categoriesContainer = document.querySelector('div[data-component="categoriesContainer"]');
    categoriesContainer.addEventListener('pointerdown', this.handlePointerdownCategoriesContainer);
  }

  destroyListeners() {
    const categoriesContainer = document.querySelector('div[data-component="categoriesContainer"]');
    categoriesContainer.removeEventListener('pointerdown', this.handlePointerdownCategoriesContainer);
  }

  handlePointerdownCategoriesContainer = (e) => {
    e.target.parentElement.classList.toggle('category_open');
  }

  async loadData(params) {
    const createUrlParams = {
      baseUrl: this.BACKEND_URL,
      ...params
    };

    return this.fetchData(this.createUrl(this.url, createUrlParams));
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

  async fetchData(url) {
    try {
      return await fetchJson(url);
    } catch (err) {
      console.log(err.response.status);
      return [];
    }
  }

  destroy() {
    this.destroyListeners();
    const content = document.getElementById('content');
    content.innerHTML = '';
    super.destroy();
  }
}
