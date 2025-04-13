export class BasePage {
  componentMap = {}
  componentElements = {};

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return (`
            <div></div>
        `);
  }

  selectComponentElements() {
    const elements = this.element.querySelectorAll('[data-component]');

    for (const element of elements) {
      const name = element.getAttribute('data-component');
      this.componentElements[name] = element;
    }
  }

  async render(container, routeParams) {
    this.element = this.createElement(this.createTemplate());
    this.selectComponentElements();

    for (const [componentName, componentInstance] of Object.entries(this.componentMap)) {
      await componentInstance.render(
        this.componentElements[componentName],
        routeParams
      );
    }

    container.appendChild(this.element);
  }

  destroy() {
    for (const component of Object.values(this.componentMap)) {
      component.destroy();
    }

    this.element.remove();
  }
}
