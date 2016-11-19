import { Options } from './model';

module Custombox {

  // Values
  const CB: string = 'custombox';
  const O: string = `${CB}-open`;
  const C: string = `${CB}-close`;
  const positionValues: Array<string> = ['top', 'right', 'bottom', 'left'];

  // Effects
  const animationValues: Array<string> = ['slide', 'blur', 'flip', 'rotate', 'letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'push'];
  const containerValues: Array<string> = ['blur', 'makeway', 'slip', 'push'];
  const overlayValues: Array<string> = ['letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'door', 'push'];
  const together: Array<string> = ['corner', 'slidetogether', 'scale', 'door', 'push'];
  const perspective: Array<string> = ['letmein', 'makeway', 'slip'];

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

      // Container
      this.defaults.container = null;

      // Content
      this.defaults.speed = 400;
      this.defaults.width = null;
      this.defaults.animation = {
        from: 'top',
        to: 'top'
      };
      this.defaults.position = {
        x: 'center',
        y: 'center',
      };
    }

    // Public methods
    assign(): Options {
      return Object.assign(this.defaults, this.options);
    }
  }

  class Container {
    element: HTMLElement;

    constructor(private options: Options) {
      if (document.readyState === 'loading') {
        throw new Error(`You need to instantiate Custombox when the document is fully loaded.`);
      }

      let selector: any = document.querySelector(this.options.container);
      if (selector) {
        this.element = selector;
        this.addSimpleClass();
      } else {
        let scopes: NodeListOf<Element> = document.body.querySelectorAll(':scope > *');
        let create: boolean = true;

        for (let i = 0, t = scopes.length; i < t; i++) {
          if (scopes[i].classList.contains(`${CB}-container`)) {
            create = false;
            break;
          }
        }

        if (create) {
          this.element = document.createElement('div');
          this.addSimpleClass();

          while (document.body.firstChild) {
            this.element.appendChild(document.body.firstChild);
          }
          document.body.appendChild(this.element);
        }
      }

      this.element.style.animationDuration = `${this.options.speed}ms`;

      if (animationValues.indexOf(this.options.effect) > -1) {
        this.setAnimation();
      }
    }

    // Public methods
    bind(method: string): Promise<Event> {
      let action: string;

      switch (method) {
        case C:
          action = 'remove';
          if (animationValues.indexOf(this.options.effect) > -1) {
            this.setAnimation('to');
          }
          this.element.classList.add(C);
          break;
        default:
          action = 'add';
          break
      }

      return new Promise((resolve: Function) => {
        this.element.classList[action](O);
        this.listener().then(()=> resolve());
      });
    }

    remove(): void {
      this.element.classList.remove(C, `${CB}-${this.options.effect}`);
      this.element.style.removeProperty('animation-duration');
    }

    // Private methods
    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => this.element.addEventListener('animationend', () => resolve(), true));
    }

    private addSimpleClass(): void {
      this.element.classList.add(`${CB}-container`, `${CB}-${this.options.effect}`);
    }

    private setAnimation(action: string = 'from'): void {
      for (let i = 0, t = positionValues.length; i < t; i++) {
        if (this.element.classList.contains(`${CB}-${positionValues[i]}`)) {
          this.element.classList.remove(`${CB}-${positionValues[i]}`);
        }
      }

      this.element.classList.add(`${CB}-${this.options.animation[action]}`);
    }
  }

  class Scroll {
    position: number;

    constructor() {
      this.position = document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
      document.documentElement.classList.add(`${CB}-perspective`);
    }

    // Public methods
    remove(): void {
      document.documentElement.classList.remove(`${CB}-perspective`);
      window.scrollTo(0, this.position);
    }
  }

  class Overlay {
    element: HTMLElement;

    private style: HTMLStyleElement;

    constructor(private options: Options) {
      this.element = document.createElement('div');
      this.element.style.backgroundColor = this.options.overlayColor;
      this.element.classList.add(`${CB}-overlay`);
      this.setAnimation();
    }

    // Public methods
    bind(method: string): Promise<Event> {
      let action: string;

      switch (method) {
        case C:
          action = 'remove';
          if (overlayValues.indexOf(this.options.effect) > -1) {
            this.toggleAnimation('to');
          }
          this.element.classList.add(C);
          break;
        default:
          // Append
          document.body.appendChild(this.element);

          // Initialization
          this.element.classList.add(`${CB}-${this.options.effect}`);
          action = 'add';
          break
      }

      return new Promise((resolve: Function) => {
        this.element.classList[action](O);
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
    private createSheet(): StyleSheet  {
      this.style = document.createElement('style');
      this.style.setAttribute('id', `${CB}-overlay-${Date.now()}`);
      document.head.appendChild(this.style);

      return this.style.sheet;
    }

    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => this.element.addEventListener('animationend', () => resolve(), true));
    }

    private setAnimation(): void {
      let sheet: any = this.createSheet();
      if (overlayValues.indexOf(this.options.effect) > -1) {
        this.element.style.opacity = this.options.overlayOpacity.toString();
        this.element.style.animationDuration = `${this.options.overlaySpeed}ms`;
        this.toggleAnimation();
      } else {
        sheet.insertRule(`.${CB}-overlay { animation: CloseFade ${this.options.overlaySpeed}ms; }`, 0);
        sheet.insertRule(`.${O}.${CB}-overlay { animation: OpenFade ${this.options.overlaySpeed}ms; opacity: ${this.options.overlayOpacity} }`, 0);
        sheet.insertRule(`@keyframes OpenFade { from {opacity: 0} to {opacity: ${this.options.overlayOpacity}} }`, 0);
        sheet.insertRule(`@keyframes CloseFade { from {opacity: ${this.options.overlayOpacity}} to {opacity: 0} }`, 0);
      }

      if (together.indexOf(this.options.effect) > -1) {
        let duration: number;
        if (together.indexOf(this.options.effect) === -1) {
          duration = this.options.overlaySpeed;
        } else {
          duration = this.options.speed;
        }

        this.element.style.animationDuration = `${duration}ms`;
      }
    }

    private toggleAnimation(action: string = 'from'): void {
      for (let i = 0, t = positionValues.length; i < t; i++) {
        if (this.element.classList.contains(`${CB}-${positionValues[i]}`)) {
          this.element.classList.remove(`${CB}-${positionValues[i]}`);
        }
      }
      this.element.classList.add(`${CB}-${this.options.animation[action]}`);
    }
  }

  class Content {
    element: HTMLElement;

    constructor(private options: Options, delay: number) {
      this.element = document.createElement('div');
      this.element.style.animationDuration = `${this.options.speed}ms`;
      this.element.style.animationDelay = `${delay}ms`;
      this.element.classList.add(`${CB}-content`);

      if (this.options.fullscreen) {
        this.element.classList.add(`${CB}-fullscreen`);
      } else {
        this.setPosition();
      }

      if (animationValues.indexOf(this.options.effect) > -1) {
        this.setAnimation();
      }
    }

    // Public methods
    fetch(target: string, width: string): Promise<any> {
      return new Promise((resolve: Function, reject: Function) => {
        let selector: Element = document.querySelector(target);

        if (selector) {
          let element: HTMLElement = <HTMLElement>selector.cloneNode(true);
          element.removeAttribute('id');

          if (width) {
            element.style.flexBasis = width;
          }

          this.element.appendChild(element);
          resolve();
        } else if (target.charAt(0) !== '#' && target.charAt(0) !== '.') {
          let url: string = target;
          let req: XMLHttpRequest = new XMLHttpRequest();

          req.open('GET', url);
          req.onload = () => {
            if (req.status === 200) {
              this.element.insertAdjacentHTML('beforeend', req.response);

              if (width) {
                let child: any = this.element.firstChild;
                child.style.flexBasis = width;
              }
              resolve();
            } else {
              reject(new Error(req.statusText));
            }
          };
          req.onerror = () => reject(new Error('Network error'));
          req.send();
        } else {
          reject(new Error(`The element doesn't exist`));
        }
      });
    }

    bind(method: string): Promise<Event> {
      switch (method) {
        case C:
          return new Promise((resolve: Function) => {
            this.element.style.animationDelay = '0ms';
            this.element.classList.remove(O);
            this.element.classList.add(C);
            this.setAnimation('to');
            this.listener().then(()=> resolve());
          });
        default:
          // Append
          document.body.appendChild(this.element);

          // Initialization
          this.element.classList.add(`${CB}-${this.options.effect}`);

          return new Promise((resolve: Function) => {
            this.element.classList.add(O);
            this.listener().then(()=> resolve());
          });
      }
    }

    remove(): void {
      try {
        this.element.parentNode.removeChild(this.element);
      } catch (e) {}
    }

    // Private methods
    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => this.element.addEventListener('animationend', () => resolve(), true));
    }

    private setPosition(): void {
      for (let key of Object.keys(this.options.position)) {
        this.element.classList.add(`${CB}-${key}-${this.options.position[key]}`);
      }
    }

    private setAnimation(action: string = 'from'): void {
      for (let i = 0, t = positionValues.length; i < t; i++) {
        if (this.element.classList.contains(`${CB}-${positionValues[i]}`)) {
          this.element.classList.remove(`${CB}-${positionValues[i]}`);
        }
      }

      this.element.classList.add(`${CB}-${this.options.animation[action]}`);
    }
  }

  export class modal {
    private options: Options;
    private container: Container;
    private content: Content;
    private overlay: Overlay;
    private scroll: Scroll;

    constructor(options: Options) {
      let defaults: Defaults = new Defaults(options);
      this.options = defaults.assign();

      // Create container
      if (containerValues.indexOf(this.options.effect) > -1) {
        this.container = new Container(this.options);
      }

      // Create overlay
      let delay: number = 0;
      if (this.options.overlay) {
        this.overlay = new Overlay(this.options);
        if (together.indexOf(this.options.effect) === -1) {
          delay = this.options.overlaySpeed / 2;
        }
      }

      // Create content
      this.content = new Content(this.options, delay);
    }

    // Public methods
    open(): void {
      let win = window.innerHeight;
      let body = document.body.offsetHeight;
      let total = body - win;
      this.content
        .fetch(this.options.target, this.options.width)
        .then(() => {
          // Scroll
          if (perspective.indexOf(this.options.effect) > -1) {
            this.scroll = new Scroll();
          }

          // Overlay
          if (this.options.overlay) {
            this.overlay.bind(O);
          }

          // Container
          if (this.container) {
            this.container.bind(O);
          }

          // Content
          this.content.bind(O).then(() => this.dispatchEvent('complete'));

          // Dispatch event
          this.dispatchEvent(O);

          // Listeners
          this.listeners();
        })
        .catch((error: Error) => {
          throw error;
        });
    }

    close(): void {
      let close: Promise<void>[] = [
        this.content.bind(C).then(() => this.content.remove()),
      ];

      if (this.options.overlay) {
        close.push(this.overlay.bind(C).then(() => {
          if (this.scroll) {
            this.scroll.remove();
          }
          this.overlay.remove()
        }));
      }

      if (this.container) {
        close.push(this.container.bind(C).then(() => this.container.remove()));
      }

      Promise
        .all(close)
        .then(() => this.dispatchEvent(C));
    }

    // Private methods
    private dispatchEvent(type: string): void {
      let event = new Event(`${CB}:${type}`);
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

      if (this.options.overlay) {
        this.overlay.element.addEventListener('click', () => this.close(), true);
      }
    }
  }
}
