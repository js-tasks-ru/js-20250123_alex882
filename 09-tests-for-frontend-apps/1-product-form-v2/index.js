import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import ProductFormV1 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm extends ProductFormV1 {
  element;

  async render () {
    const productForm = await super.render();
    const imageListContainer = this.element.querySelector('[data-element="imageListContainer"]');
    imageListContainer.innerHTML = '';
    const sortableList = this.createSortableListElement();
    imageListContainer.append(sortableList.element);

    return productForm;
  }

  createSortableListElement() {
    return new SortableList({
      items: this.productsData.images.map(({source, url}) => {
        const element = document.createElement('li');
        element.classList.add('products-edit__imagelist-item');

        element.innerHTML = (`
          <input type="hidden" name="url" value="${escapeHtml(url)}">
          <input type="hidden" name="source" value="${escapeHtml(source)}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(url)}">
            <span>${escapeHtml(source)}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        `);
        return element;
      })
    });
  }
}
