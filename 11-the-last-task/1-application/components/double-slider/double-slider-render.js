import DoubleSlider from "../../../../06-events-practice/3-double-slider/index.js";

export class DoubleSliderRender extends DoubleSlider {
  async render(container) {
    if (!container) {
      return;
    }

    container.appendChild(this.element);
  }
}
