export default class NotificationMessage {
  element;
  static lastShownComponent;

  constructor(
    message = '',
    {
      duration = 0,
      type = '',
    } = {}
  ) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = this.createElement(this.createTemplate());
  }

  show(targetElement) {

    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.remove();
    }

    NotificationMessage.lastShownComponent = this;

    setTimeout(() => this.remove(), this.duration);
    if (!targetElement) {
      document.body.append(this.element);
    } else {
      targetElement.append(this.element);
    }
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTemplate() {
    const animationDurationValue = (this.duration / 1000) + 's';

    return (`
  <div class="notification ${this.type}" style="--value:${animationDurationValue}">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>`);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
