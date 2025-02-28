import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};

  constructor (productId) {
    this.productId = productId;

    this.categoriesPath = 'api/rest/categories';
    this.productsPath = 'api/rest/products';
    this.sort = {_sort: 'weight'};
    this.refs = {_refs: 'subcategory'};

    this.categoriesData = null;
    this.productsData = null;

    this.defaultFormData = {
      title: '',
      description: '',
      quantity: 1,
      subcategory: '',
      status: 1,
      price: 100,
      discount: 0,
      images: [],
    };
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  async render() {
    this.categoriesData = await this.loadData(this.categoriesPath, BACKEND_URL, {...this.sort, ...this.refs});
    const product = await this.loadData(this.productsPath, BACKEND_URL, {id: this.productId});
    if (Array.isArray(product) && !!product.length) {
      this.productsData = product[0];
    } else {
      this.productsData = this.defaultFormData;
    }

    this.element = this.createElement(this.createTableTemplate());
    this.selectSubElements();
    this.createListeners();
    return this.element;
  }

  createListeners() {
    const form = this.element.querySelector('[data-element="productForm"]');
    form.addEventListener('submit', this.handleFormSubmit);
  }

  destroyListeners() {
    const form = this.element.querySelector('[data-element="productForm"]');
    form.removeEventListener('submit', this.handleFormSubmit);
  }

   handleFormSubmit = async (e) => {
     e.preventDefault();

     const form = this.element.querySelector('[data-element="productForm"]');
     const formData = new FormData(form);
     const response = await this.loadData(this.productsPath, BACKEND_URL, {}, {
       method: 'PATCH',
       body: formData
     });

     const result = await response.json();

     this.save();
   }

   async loadData(path, baseUrl, { ...params }, fetchParams) {
     const url = this.createUrl(path, baseUrl, { ...params });
     return this.fetchData(url, fetchParams);
   }

   createUrl(url, baseUrl, { ...params }) {
     const resultUrl = new URL(url, baseUrl);
     Object.entries(params).forEach(([key, value]) => {
       if (value !== undefined) {
         resultUrl.searchParams.append(key, value);
       }
     });

     return resultUrl;
   }

   async fetchData(url, params) {
     try {
       return await fetchJson(url, params);
     } catch (err) {
       console.log(err.response.status);
       return [];
     }
   }

   createElement(template) {
     const element = document.createElement('div');
     element.innerHTML = template;

     return element.firstElementChild;
   }

   createTableTemplate() {
     return (`
      <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input
            required=""
            type="text"
            name="title"
            id="title"
            class="form-control"
            placeholder="Название товара"
            value="${escapeHtml(this.productsData.title)}"
          >
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea
            required=""
            class="form-control"
            name="description"
            id="description"
            data-element="productDescription"
            placeholder="Описание товара">${escapeHtml(this.productsData.description)}</textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
            <ul class="sortable-list">
                ${this.productsData.images.map(({source, url}) => this.createImagesTemplate(source, url)).reverse().join('')}
            </ul>
        </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory" id="subcategory">
        ${this.createSubcategoryTemplate()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" id="price" class="form-control" placeholder="100" value="${this.productsData.price}">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0" value="${this.productsData.discount}">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1" value="${this.productsData.quantity}">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status" id="status">
          <option value="1" ${this.productsData.status == "1" ? "selected" : ""}>Активен</option>
          <option value="0" ${this.productsData.status == "0" ? "selected" : ""}>Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `);
   }

   createSubcategoryTemplate() {
     const prepareCategoryName = (categoriesData) => {
       const names = [];

       for (const category of categoriesData) {
         for (const child of category.subcategories) {
           names.push(`<option value="${escapeHtml(child.id)}">${escapeHtml(category.title)} &gt; ${escapeHtml(child.title)}</option>`);
         }
       }

       return names.join('');
     };

     return prepareCategoryName(this.categoriesData);
   }

   createImagesTemplate(source, url) {
     return (`
        <li class="products-edit__imagelist-item sortable-list__item">
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
        </li>
  `);
   }

   save() {
     if (this.productId) {
       this.dispatchProductUpdatedEvent();
     } else {
       this.dispatchProductSavedEvent();
     }
   }

   dispatchProductUpdatedEvent() {
     const event = new CustomEvent('product-updated');
     this.element.dispatchEvent(event);
   }

   dispatchProductSavedEvent() {
     const event = new CustomEvent('product-saved');
     this.element.dispatchEvent(event);
   }

   remove() {
     this.element.remove();
   }

   destroy() {
     this.remove();
     this.destroyListeners();
   }
}
