import ProductFormV2 from '../../../../09-tests-for-frontend-apps/1-product-form-v2/index.js';

export class ProductFormRender extends ProductFormV2 {
  async render(container) {
    if (!container) {
      return;
    }

    await super.render();
    container.appendChild(this.element);
  }
}
