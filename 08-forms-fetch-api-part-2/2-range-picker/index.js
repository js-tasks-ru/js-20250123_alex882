export default class RangePicker {
  element;

  constructor({ from = new Date(Date.now()), to = new Date(Date.now()), lang = 'ru-RU' }) {
    this.from = from;
    this.to = to;
    this.selectedValue = null;
    this.lang = lang;

    this.monthsNames = this.getMonthsNames(this.lang, { month: 'long' });
    this.currentMonth = new Date(this.from.getFullYear(), this.from.getMonth());
    this.nextMonth = new Date(this.from.getFullYear(), this.from.getMonth() + 1);

    this.element = this.createElement(this.createRangePickerTemplate());
    this.createListeners();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }


  //TODO При клике за пределами календаря необходимо его закрыть (подумайте какая фаза события лучше для этого подойдет)

  createListeners() {
    this.element.querySelector('.rangepicker__input').addEventListener('click', this.handleInputClick);
    this.element.querySelector('.rangepicker__selector').addEventListener('click', this.handleSelectorClick);
  }

  destroyListeners() {
    this.element.querySelector('.rangepicker__input').removeEventListener('click', this.handleInputClick);
    this.element.querySelector('.rangepicker__selector').removeEventListener('click', this.handleSelectorClick);
  }

  handleInputClick = () => {
    const container = this.element;
    const selector = this.element.querySelector('.rangepicker__selector');

    if (container.classList.contains('rangepicker_open')) {
      container.classList.remove('rangepicker_open');
      return;
    }

    selector.innerHTML = this.createRangePickerSelectorTemplate();
    this.updateDateGridsElements();
    container.classList.add('rangepicker_open');
  };

  handleSelectorClick = (e) => {
    const { target } = e;

    if (target.closest('.rangepicker__cell')) {
      this.selectDate(target.closest('.rangepicker__cell'));
    } else if (target.closest('.rangepicker__selector-control-left')) {
      this.updateMonth(-1);
    } else if (target.closest('.rangepicker__selector-control-right')) {
      this.updateMonth(1);
    }
  }

  selectDate(cell) {
    const isOneDayBefore = this.checkIsOneDayBefore(this.from.toISOString(), cell.dataset.value);
    if (isOneDayBefore) {
      this.clearHighlighting();
    }

    const prevFrom = this.element.querySelector('.rangepicker__selected-from');
    const prevTo = this.element.querySelector('.rangepicker__selected-to');

    if (this.selectedValue) {
      this.from = this.mixString(this.selectedValue.toISOString(), cell.dataset.value);
      this.to = this.maxString(cell.dataset.value, this.selectedValue.toISOString());
      this.selectedValue = null;

      cell.classList.add('rangepicker__selected-to');
      this.element.classList.remove('rangepicker_open');
    } else {
      this.selectedValue = new Date(cell.dataset.value);

      prevFrom.classList.remove('rangepicker__selected-from');
      prevTo.classList.remove('rangepicker__selected-to');
      this.clearHighlighting();
      cell.classList.add('rangepicker__selected-from');
    }
    this.updateSelectedDates();
  }

  updateSelectedDates() {
    const inputFrom = this.element.querySelector('[data-element="from"]');
    const inputTo = this.element.querySelector('[data-element="to"]');
    inputFrom.textContent = this.formatDate(this.from);
    inputTo.textContent = this.formatDate(this.to);
  }

  updateMonth(offset) {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + offset);
    this.nextMonth = new Date(this.nextMonth.getFullYear(), this.nextMonth.getMonth() + offset);

    const monthIndicators = this.element.querySelectorAll('.rangepicker__month-indicator time');
    monthIndicators[0].textContent = `${this.monthsNames[this.currentMonth.getMonth()]}`;
    monthIndicators[1].textContent = `${this.monthsNames[this.nextMonth.getMonth()]}`;

    this.updateDateGridsElements();
  }

  updateDateGridsElements() {
    const dateGrids = this.element.querySelectorAll('.rangepicker__date-grid');
    this.updateDateGridElement(dateGrids[0], this.currentMonth);
    this.updateDateGridElement(dateGrids[1], this.nextMonth);
  }

  updateDateGridElement(dateGrid, date) {
    dateGrid.innerHTML = '';

    const daysInMonth = this.getDaysInMonth(date.getFullYear(), date.getMonth());
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
      const dayCell = this.createRangePickerCellElement(dayDate);

      if (i === 1) {
        dayCell.style.setProperty('--start-from', dayDate.getDay() || 7);
      }

      dateGrid.appendChild(dayCell);
    }
  }

  createRangePickerCellElement(date) {
    const day = date.getDate();
    const stringDate = date.toISOString();

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rangepicker__cell';
    button.dataset.value = stringDate;
    button.textContent = day;

    if (stringDate === this.from.toISOString()) {
      button.classList.add('rangepicker__selected-from');
    } else if (stringDate === this.to.toISOString()) {
      button.classList.add('rangepicker__selected-to');
    } else if (stringDate > this.from.toISOString() && stringDate < this.to.toISOString()) {
      button.classList.add('rangepicker__selected-between');
    }

    return button;
  }

  createRangePickerTemplate() {
    return (`
    <div class="rangepicker">
        <div class="rangepicker__input" data-element="input">
            <span data-element="from">${this.formatDate(this.from)}</span> -
            <span data-element="to">${this.formatDate(this.to)}</span>
        </div>
    <div class="rangepicker__selector" data-element="selector"></div>
  </div>
    `);
  }

  createRangePickerSelectorTemplate() {
    return (`
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      ${this.createRangePickerCalendarTemplate(this.currentMonth)}
      ${this.createRangePickerCalendarTemplate(this.nextMonth)}
    `);
  }

  createRangePickerCalendarTemplate(date) {
    const monthName = this.monthsNames[date.getMonth()];

    return (`
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${monthName}">${monthName}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid"></div>
      </div>
    `);
  }

  formatDate(date) {
    return date.toLocaleDateString(this.lang, { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  getMonthsNames(lang, options) {
    const mockYear = 2000;
    const numberOfMonths = 12;

    return [...Array(numberOfMonths).keys()].reduce((acc, i) => {
      acc[i] = new Date(mockYear, i).toLocaleString(lang, options);
      return acc;
    }, {});
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  checkIsOneDayBefore(dateSelected, dateCompared) {
    const targetDate = new Date(dateSelected);
    const givenDate = new Date(dateCompared);
    const oneDayMs = 24 * 60 * 60 * 1000;
    return givenDate.getTime() === targetDate.getTime() - oneDayMs;
  }

  clearHighlighting() {
    const selectedBetweenCells = this.element.querySelectorAll('.rangepicker__selected-between');
    selectedBetweenCells.forEach((cell) => {
      cell.classList.remove('rangepicker__selected-between');
    });
  }

  maxString(...strings) {
    return new Date(strings.reduce((a, b) => (a > b ? a : b)));
  }

  mixString(...strings) {
    return new Date(strings.reduce((a, b) => (a > b ? b : a)));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
