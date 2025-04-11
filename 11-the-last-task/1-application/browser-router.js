export default class BrowserRouter {

  lastRule;

  constructor(container, rules) {
    this.container = container;
    this.rules = rules;
  }

  extractRouteParams(rule, pathname) {
    if (rule.pathname instanceof RegExp) {
      const result = pathname.match(rule.pathname);
      if (result) {
        return result.slice(1);
      }
    }
    return [];
  }

  async process(pathname) {
    for (const rule of this.rules) {
      const useRule = rule.pathname instanceof RegExp
        ? rule.pathname.test(pathname)
        : rule.pathname === pathname;

      if (useRule) {
        if (this.lastRule) {
          this.lastRule.page.destroy();
        }
        this.lastRule = rule;
        const routeParams = this.extractRouteParams(rule, pathname);
        await rule.page.render(this.container, routeParams);
      }
    }
  }

  handleMainClick = async (e) => {
    const link = e.target.closest('a');

    if (!link) {
      return;
    }

    e.preventDefault();
    const pathname = new URL(link.href).pathname;
    history.pushState(null, undefined, pathname);

    if (this.activeLi) {
      this.activeLi.classList.remove('active');
    }
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.display = 'block';

    this.activeLi = link.parentElement;
    this.activeLi.classList.add('active');

    await this.process(pathname);
    progressBar.style.display = 'none';
  }

  async run() {
    const pathname = window.location.pathname;
    await this.process(pathname);
    document.querySelector('main').addEventListener('click', this.handleMainClick);
  }

  destroy() {
    document.querySelector('main').addEventListener('click', this.handleMainClick);
  }
}
