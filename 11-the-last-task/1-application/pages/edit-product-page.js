import {BasePage} from "./base-page.js";
import {ProductFormRender} from "../components/products-list-page-components/products-list-page-components.js";

export class EditProductPage extends BasePage {
  createTemplate() {
    return (`
    <div class="products-edit">
        <div class="content__top-panel">
            <h1 class="page-title">
            <a href="/products" class="link">Товары</a>
             / Редактировать
        </h1>
        </div>
        <div data-component="productForm" class="content-box"></div>
    </div>
    `);
  }

  async render(container, routeParams) {
    this.componentMap = {
      productForm: new ProductFormRender(routeParams),
    };
    this.setActive();
    await super.render(container, routeParams);
  }

  setActive() {
    const productsLi = document.getElementById('products');

    if (!productsLi) {
      return;
    }

    this.activeLi = productsLi;
    productsLi.classList.add('active');
  }

  destroy() {
    if (this.activeLi) {
      this.activeLi.classList.remove('active');
      this.activeLi = null;
    }
    super.destroy();
  }
}


