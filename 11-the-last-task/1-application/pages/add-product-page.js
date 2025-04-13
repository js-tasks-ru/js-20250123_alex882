import {EditProductPage} from "./edit-product-page.js";

export class AddProductPage extends EditProductPage {

  createTemplate() {
    return (`
    <div class="products-edit">
        <div class="content__top-panel">
            <h1 class="page-title">
            <a href="/products" class="link">Товары</a>
             / Добавить
        </h1>
        </div>
        <div data-component="productForm" class="content-box"></div>
    </div>
    `);
  }
}
