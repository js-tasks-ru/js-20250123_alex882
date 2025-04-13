import RangePicker from "../../../../08-forms-fetch-api-part-2/2-range-picker/index.js";
import ColumnChartV2 from "../../../../07-async-code-fetch-api-part-1/1-column-chart/index.js";

export class RangePickerRender extends RangePicker {
  async render(container) {
    if (!container) {
      return;
    }

    container.appendChild(this.element);
  }
}

export class ColumnChartRender extends ColumnChartV2 {
  async render(container) {
    if (!container) {
      return;
    }

    container.appendChild(this.element);
  }
}
