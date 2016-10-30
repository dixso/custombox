module Custombox {

  interface Overlay {
    overlay: boolean;
    overlaySpeed: number;
    overlayColor: string;
    overlayOpacity: number;
    overlayClose: boolean;
    speed: number;
    effect: string;
    width: string;
    open: Function;
    complete: Function;
    close: Function;
  }

  interface Options extends Overlay {
    target: string;
    effect: string;
  }

  const cb: string = 'custombox';
  const o: string = 'open';

  class Defaults {
    private defaults: Options;

    constructor(private options: Options) {
      this.defaults = <Options>{};
      this.defaults.target = null;

      // Overlay
      this.defaults.overlay = true;
      this.defaults.overlaySpeed = 300;
      this.defaults.overlayColor = '#000';
      this.defaults.overlayOpacity = .5;
      this.defaults.overlayClose = true;

      // Content
      this.defaults.speed = 500;
      this.defaults.width = null;
    }

    // Public methods
    assign(): Options {
      return Object.assign(this.defaults, this.options);
    }
  }

  class Wrapper {
    element: HTMLElement;

    constructor(effect: string, full: boolean) {
      this.element = document.createElement('div');
      this.element.classList.add(cb, effect);

      if (full) {
        this.element.classList.add(`${cb}-is-full`);
      }
    }

    // Public methods
    remove(): void {
      try {
        this.element.parentNode.removeChild(this.element);
      } catch (e) {}
    }
  }


  class Overlay {
    element: HTMLElement;

    private style: any;

    constructor(private options: Options) {
      this.element = document.createElement('div');
      this.element.style.backgroundColor = this.options.overlayColor;
      this.element.classList.add(`${cb}-overlay`);

      let sheet = this.createSheet();
      sheet.insertRule(`.${cb}-overlay { animation: CloseFade ${this.options.overlaySpeed}ms; }`, 0);
      sheet.insertRule(`.${o}.${cb}-overlay { animation: OpenFade ${this.options.overlaySpeed}ms; opacity: ${this.options.overlayOpacity} }`, 0);
      sheet.insertRule(`@keyframes OpenFade { from {opacity: 0} to {opacity: ${this.options.overlayOpacity}} }`, 0);
      sheet.insertRule(`@keyframes CloseFade { from {opacity: ${this.options.overlayOpacity}} to {opacity: 0} }`, 0);
    }

    // Public methods
    bind(method: string): Promise<Event> {
      let action: string;

      switch (method) {
        case 'close':
          action = 'remove';
          break;
        default:
          action = 'add';
          break
      }

      return new Promise((resolve: Function) => {
        this.element.classList[action](o);
        this.listener().then(()=> resolve());
      });
    }

    remove(): void {
      try {
        this.element.parentNode.removeChild(this.element);
        this.style.parentNode.removeChild(this.style);
      } catch (e) {}
    }

    // Private methods
    private createSheet(): any  {
      this.style = document.createElement('style');
      this.style.setAttribute('id', `${cb}-overlay-${Date.now()}`);
      document.head.appendChild(this.style);

      return this.style.sheet;
    }

    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => this.element.addEventListener('animationend', () => resolve(), true));
    }
  }

  class Content {
    element: HTMLElement;

    constructor(speed: number) {
      this.element = document.createElement('div');
      this.element.style.transitionDuration = `${speed}ms`;
      this.element.classList.add(`${cb}-content`);
    }

    // Public methods
    fetch(target: string): any {
      let selector: Element = document.querySelector(target);
      if (selector) {
        let element: HTMLElement = <HTMLElement>selector.cloneNode(true);
        element.removeAttribute('id');

        this.element.appendChild(element);
      } else {
        throw `The element doesn't exist`;
      }
    }

    bind(method: string): Promise<Event> {
      let action: string;

      switch (method) {
        case 'close':
          action = 'remove';
          break;
        default:
          action = 'add';
          break
      }

      return new Promise((resolve: Function) => {
        this.element.classList[action](o);
        this.listener().then(()=> resolve());
      });
    }

    remove(): void {
      try {
        this.element.parentNode.removeChild(this.element);
      } catch (e) {}
    }

    // Private methods
    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => this.element.addEventListener('transitionend', () => resolve(), true));
    }
  }

  export class modal {
    private options: Options;
    private wrapper: Wrapper;
    private content: Content;
    private overlay: Overlay;

    constructor(options: Options) {
      let defaults: Defaults = new Defaults(options);
      this.options = defaults.assign();

      this.wrapper = new Wrapper(this.options.effect, this.options.width === 'full');
      this.content = new Content(this.options.speed);

      if (this.options.overlay) {
        this.overlay = new Overlay(this.options);
        this.wrapper.element.appendChild(this.overlay.element);
      }

      // Create the structure
      this.build();
    }

    // Public methods
    open(): void {
      // Fetch target
      this.content.fetch(this.options.target);

      // Append into body
      document.body.appendChild(this.wrapper.element);

      if (this.options.overlay) {
        this.overlay.bind('open').then(() => this.content.bind('open').then(() => this.dispatchEvent('complete')));
      } else {
        let ready = window.getComputedStyle(this.content.element).transitionDuration;
        if (ready) {
          this.content.bind('open').then(() => this.dispatchEvent('complete'));
        }
      }

      // Dispatch event
      this.dispatchEvent('open');

      // Listeners
      this.listeners();
    }

    close(): void {
      if (this.options.overlay) {
        Promise.all([
          this.content.bind('close').then(() => this.content.remove()),
          this.overlay.bind('close').then(() => this.overlay.remove())
        ]).then(() => {
          this.wrapper.remove();
          this.dispatchEvent('close');
        });
      } else {
        this.content.bind('close').then(() => {
          this.content.remove();
          this.wrapper.remove();
          this.dispatchEvent('close');
        });
      }
    }

    // Private methods
    private build(): void {
      this.wrapper.element.appendChild(this.content.element);
    }

    private dispatchEvent(type: string): void {
      let event = new Event(`${cb}:${type}`);
      document.dispatchEvent(event);

      try {
        this.options[type].call();
      } catch (e) {}
    }

    private listeners(): void {
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.keyCode === 27) {
          this.close();
        }
      }, true);

      if (this.options.overlayClose) {
        this.overlay.element.addEventListener('click', () => this.close(), true);
      }
    }
  }
}
