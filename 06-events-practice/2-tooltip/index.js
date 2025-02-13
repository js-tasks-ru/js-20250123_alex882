class Tooltip {
  element;
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    this.element = this.createElement();
  }

  initialize() {
    this.createListeners();
  }

  render(targetElement = document.body) {
    const isHTMLElement = targetElement instanceof HTMLElement;

    if (!isHTMLElement) {
      document.body.append(this.element);
    } else {
      targetElement.append(this.element);
    }
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('tooltip');

    return element;
  }

  createListeners() {
    document.body.addEventListener('pointerover', this.handleBodyPointerover);
    document.body.addEventListener('pointermove', this.handleBodyPointermove);
    document.body.addEventListener('pointerout', this.handleBodyPointerout);
  }

  destroyListeners() {
    document.body.removeEventListener('pointerover', this.handleBodyPointerover);
    document.body.removeEventListener('pointermove', this.handleBodyPointermove);
    document.body.removeEventListener('pointerout', this.handleBodyPointerout);
  }

  handleBodyPointerover = (e) => {
    const elem = e.target.closest('[data-tooltip]');
    if (!elem) {
      return;
    }

    this.update(e, elem.dataset.tooltip);
    this.render();
  }

  handleBodyPointermove = (e) => {
    const elem = e.target.closest('[data-tooltip]');
    if (!elem) {
      return;
    }
    this.update(e);
  }

  handleBodyPointerout = (e) => {
    const elem = e.target.closest('[data-tooltip]');
    if (!elem) {
      return;
    }
    this.remove();
  }

  update(e, newTooltipText) {
    this.element.style.left = (e.pageX + 10) + 'px';
    this.element.style.top = (e.pageY + 10) + 'px';
    if (newTooltipText) {
      this.element.innerHTML = newTooltipText;
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }

}

export default Tooltip;
