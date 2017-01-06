namespace Custombox {
  interface OptionsSchema {
    overlay: OverlaySchema;
    content: ContentSchema;
    loader: LoaderSchema;
  }

  interface OverlaySchema extends Speed, Callback {
    color: string;
    opacity: number;
    close: boolean;
    escKey: boolean;
    active: boolean;
  }

  interface ContentSchema extends Speed, Callback {
    target: string;
    animateFrom: string;
    animateTo: string;
    positionX: string;
    positionY: string;
    width: string;
    effect: string;
    fullscreen: boolean;
    delay: number;
    id: string;
    container: string;
  }

  interface LoaderSchema {
    active: boolean;
    color: string;
    background: string;
    speed: number;
  }

  interface Speed {
    speedIn: number;
    speedOut: number;
  }

  interface Callback {
    onOpen: Function;
    onComplete: Function;
    onClose: Function;
  }

  // Values
  const CB: string = 'custombox';
  const OPEN: string = `${CB}-open`;
  const CLOSE: string = `${CB}-close`;
  const FROM: string = 'animateFrom';
  const positionValues: Array<string> = ['top', 'right', 'bottom', 'left'];

  // Effects
  const animationValues: Array<string> = ['slide', 'blur', 'flip', 'rotate', 'letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'push', 'contentscale'];
  const containerValues: Array<string> = ['blur', 'makeway', 'slip', 'push', 'contentscale'];
  const overlayValues: Array<string> = ['letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'door', 'push', 'contentscale'];
  const together: Array<string> = ['corner', 'slidetogether', 'scale', 'door', 'push', 'contentscale'];
  const perspective: Array<string> = ['fall', 'sidefall', 'flip', 'sign', 'slit', 'letmein', 'makeway', 'slip'];

  class Snippet {
    static check(values: Array<string>, match: string): boolean {
      return values.indexOf(match) > -1;
    }
  }

  class Scroll {
    private position: number;

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

  class DefaultSchema implements OptionsSchema {
    overlay = {
      color: '#000',
      opacity: .48,
      close: true,
      escKey: true,
      speedIn: 300,
      speedOut: 300,
      onOpen: null,
      onComplete: null,
      onClose: null,
      active: true,
    };
    content = {
      id: null,
      target: null,
      container: null,
      animateFrom: 'top',
      animateTo: 'top',
      positionX: 'center',
      positionY: 'center',
      width: null,
      effect: 'fadein',
      speedIn: 300,
      speedOut: 300,
      delay: 150,
      fullscreen: false,
      onOpen: null,
      onComplete: null,
      onClose: null,
    };
    loader = {
      active: true,
      color: '#FFF',
      background: '#999',
      speed: 1000,
    };
  }

  class Options extends DefaultSchema {
    constructor(options: OptionsSchema) {
      super();

      Object.keys(this).forEach((key: string) => {
        if (options[key]) {
          Object.assign(this[key], options[key]);
        }
      });
    }
  }

  class Loader {
    element: HTMLElement;

    constructor(private options: OptionsSchema) {
      this.element = document.createElement('div');
      this.element.classList.add(`${CB}-loader`);
      this.element.style.borderColor = this.options.loader.background;
      this.element.style.borderTopColor = this.options.loader.color;
      this.element.style.animationDuration = `${this.options.loader.speed}ms`;
      document.body.appendChild(this.element);
    }

    // Public methods
    destroy(): void {
      this.element.parentElement.removeChild(this.element);
    }
  }

  class Container {
    element: HTMLElement;

    constructor(private options: OptionsSchema) {
      if (document.readyState === 'loading') {
        throw new Error(`You need to instantiate Custombox when the document is fully loaded.`);
      }

      const selector: any = document.querySelector(this.options.content.container);
      if (selector) {
        this.element = selector;
        this.addSimpleClass();
      } else if (!document.querySelector(`${CB}-container`)) {
        this.element = document.createElement('div');
        this.addSimpleClass();

        while (document.body.firstChild) {
          this.element.appendChild(document.body.firstChild);
        }
        document.body.appendChild(this.element);
      }

      this.element.style.animationDuration = `${this.options.content.speedIn}ms`;

      if (Snippet.check(animationValues, this.options.content.effect)) {
        this.setAnimation();
      }
    }

    // Public methods
    bind(method: string): Promise<Event> {
      if (method === 'close') {
        if (Snippet.check(animationValues, this.options.content.effect)) {
          this.setAnimation('animateTo');
        }
        this.element.classList.remove(OPEN);
      }

      this.element.classList.add(method);
      return new Promise((resolve: Function) => this.listener().then(() => resolve()));
    }

    remove(): void {
      this.element.classList.remove(CLOSE, `${CB}-${this.options.content.effect}`);
      this.element.style.removeProperty('animation-duration');
    }

    // Private methods
    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => this.element.addEventListener('animationend', () => resolve(), true));
    }

    private addSimpleClass(): void {
      this.element.classList.add(`${CB}-container`, `${CB}-${this.options.content.effect}`);
    }

    private setAnimation(action: string = FROM): void {
      for (let i = 0, t = positionValues.length; i < t; i++) {
        if (this.element.classList.contains(`${CB}-${positionValues[i]}`)) {
          this.element.classList.remove(`${CB}-${positionValues[i]}`);
        }
      }

      this.element.classList.add(`${CB}-${this.options.content[action]}`);
    }
  }

  class Overlay {
    element: HTMLElement;

    private style: HTMLStyleElement;

    constructor(private options: OptionsSchema) {
      this.element = document.createElement('div');
      this.element.style.backgroundColor = this.options.overlay.color;
      this.element.classList.add(`${CB}-overlay`);
      this.setAnimation();
    }

    // Public methods
    bind(method: string): Promise<Event> {
      switch (method) {
        case CLOSE:
          if (Snippet.check(overlayValues, this.options.content.effect)) {
            this.toggleAnimation('animateTo');
          }
          this.element.classList.add(CLOSE);
          this.element.classList.remove(OPEN);
          break;
        default:
          // Append
          document.body.appendChild(this.element);

          // Initialization
          this.element.classList.add(`${CB}-${this.options.content.effect}`, OPEN);
          break;
      }

      return new Promise((resolve: Function) => this.listener().then(() => resolve()));
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
      if (Snippet.check(overlayValues, this.options.content.effect)) {
        this.element.style.opacity = this.options.overlay.opacity.toString();
        this.element.style.animationDuration = `${this.options.overlay.speedIn}ms`;
        this.toggleAnimation();
      } else {
        sheet.insertRule(`.${CB}-overlay { animation: CloseFade ${this.options.overlay.speedOut}ms; }`, 0);
        sheet.insertRule(`.${OPEN}.${CB}-overlay { animation: OpenFade ${this.options.overlay.speedIn}ms; opacity: ${this.options.overlay.opacity} }`, 0);
        sheet.insertRule(`@keyframes OpenFade { from {opacity: 0} to {opacity: ${this.options.overlay.opacity}} }`, 0);
        sheet.insertRule(`@keyframes CloseFade { from {opacity: ${this.options.overlay.opacity}} to {opacity: 0} }`, 0);
      }

      if (Snippet.check(together, this.options.content.effect)) {
        let duration: number = this.options.overlay.speedIn;
        if (Snippet.check(together, this.options.content.effect)) {
          duration = this.options.content.speedIn;
        }

        this.element.style.animationDuration = `${duration}ms`;
      }
    }

    private toggleAnimation(action: string = FROM): void {
      for (let i = 0, t = positionValues.length; i < t; i++) {
        if (this.element.classList.contains(`${CB}-${positionValues[i]}`)) {
          this.element.classList.remove(`${CB}-${positionValues[i]}`);
        }
      }
      this.element.classList.add(`${CB}-${this.options.content[action]}`);
    }
  }

  class Content {
    element: HTMLElement;

    constructor(private options: OptionsSchema) {
      this.element = document.createElement('div');
      this.element.style.animationDuration = `${this.options.content.speedIn}ms`;

      if (this.options.content.id) {
        this.element.setAttribute('id', `${CB}-${this.options.content.id}`);
      }

      if (!Snippet.check(together, this.options.content.effect)) {
        this.element.style.animationDelay = `${this.options.content.delay}ms`;
      }

      this.element.classList.add(`${CB}-content`);

      // Check fullscreen
      if (this.options.content.fullscreen) {
        this.element.classList.add(`${CB}-fullscreen`);
      } else {
        this.element.classList.add(`${CB}-x-${this.options.content.positionX}`, `${CB}-y-${this.options.content.positionY}`);
      }

      if (Snippet.check(animationValues, this.options.content.effect)) {
        this.setAnimation();
      }
    }

    // Public methods
    fetch(target: string, width: string): Promise<any> {
      return new Promise((resolve: Function, reject: Function) => {
        // Youtube
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = target.match(regExp);

        if (match && match[2].length == 11) {
          let frame = document.createElement('iframe');
          frame.setAttribute('src', `https://www.youtube.com/embed/${match[2]}`);
          frame.setAttribute('frameborder', '0');
          frame.setAttribute('allowfullscreen', '');
          this.element.appendChild(frame);

          resolve();
        } else if (target.charAt(0) !== '#' && target.charAt(0) !== '.') {
          const req: XMLHttpRequest = new XMLHttpRequest();

          req.open('GET', target);
          req.onload = () => {
            if (req.status === 200) {
              this.element.insertAdjacentHTML('beforeend', req.response);
              let child: any = this.element.firstChild;

              // Set visible
              try {
                child.style.display = 'block';
              } catch (e) {
                reject(new Error('The ajax response need a wrapper element'));
              }

              if (width) {
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
          // Selector
          const selector: Element = document.querySelector(target);
          if (selector) {
            let element: HTMLElement = <HTMLElement>selector.cloneNode(true);
            element.removeAttribute('id');

            // Set visible
            element.style.display = 'block';

            // Set width
            if (width) {
              element.style.flexBasis = width;
            }

            this.element.appendChild(element);

            resolve();
          } else {
            reject(new Error(`The element doesn't exist`));
          }
        }
      });
    }

    bind(method: string): Promise<Event> {
      switch (method) {
        case CLOSE:
          this.element.style.animationDelay = '0ms';
          this.element.style.animationDuration = `${this.options.content.speedOut}ms`;
          this.element.classList.remove(OPEN);
          this.element.classList.add(CLOSE);
          this.setAnimation('animateTo');
          break;
        default:
          // Append
          document.body.appendChild(this.element);

          // Initialization
          this.element.classList.add(`${CB}-${this.options.content.effect}`, OPEN);
          break;
      }

      return new Promise((resolve: Function) => this.listener().then(()=> resolve()));
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

    private setAnimation(action: string = FROM): void {
      for (let i = 0, t = positionValues.length; i < t; i++) {
        if (this.element.classList.contains(`${CB}-${positionValues[i]}`)) {
          this.element.classList.remove(`${CB}-${positionValues[i]}`);
        }
      }

      this.element.classList.add(`${CB}-${this.options.content[action]}`);
    }
  }

  export class modal {
    private options: OptionsSchema;
    private container: Container;
    private content: Content;
    private overlay: Overlay;
    private scroll: Scroll;
    private loader: Loader;
    private action: EventListenerOrEventListenerObject = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        Custombox.modal.close();
      }
    }

    constructor(options: OptionsSchema) {
      this.options = new Options(options);

      // Create loader
      if (this.options.loader.active) {
        this.loader = new Loader(this.options);
      }

      // Create container
      if (Snippet.check(containerValues, this.options.content.effect)) {
        this.container = new Container(this.options);
      }

      // Create overlay
      if (this.options.overlay.active) {
        this.overlay = new Overlay(this.options);
      }

      // Create content
      this.content = new Content(this.options);
    }

    // Public methods
    open(): void {
      this.content
        .fetch(this.options.content.target, this.options.content.width)
        .then(() => {
          // Scroll
          if (Snippet.check(perspective, this.options.content.effect)) {
            this.scroll = new Scroll();
          }

          // Overlay
          if (this.options.overlay.active) {
            this.dispatchEvent('overlay.onOpen');
            this.overlay
              .bind(OPEN)
              .then(() => {
                this.dispatchEvent('overlay.onComplete');
                if (this.options.loader.active) {
                  this.loader.destroy();
                }
              }
            );
          } else if (this.options.loader.active) {
            this.loader.destroy();
          }

          // Container
          if (this.container) {
            this.container.bind(OPEN);
          }

          // Content
          this.content.bind(OPEN).then(() => this.dispatchEvent('content.onComplete'));

          // Dispatch event
          this.dispatchEvent('content.onOpen');

          // Listeners
          this.listeners();
        })
        .catch((error: Error) => {
          if (this.options.loader.active) {
            this.loader.destroy();
          }
          throw error;
        });
    }

    static close(id?: string): void {
      const event: Event = new Event(`${CB}:close`);
      let elements: NodeListOf<Element> = document.querySelectorAll(`.${CB}-content`);

      if (id) {
        elements = document.querySelectorAll(`#${CB}-${id}`);
      }

      elements[elements.length - 1].dispatchEvent(event);
    }

    static closeAll(): void {
      const event: Event = new Event(`${CB}:close`);
      const elements: NodeListOf<Element> = document.querySelectorAll(`.${CB}-content`);
      const t = elements.length;

      for (let i = 0; i < t; i++) {
        elements[i].dispatchEvent(event);
      }
    }

    private _close(): void {
      let close: Promise<void>[] = [
        this.content.bind(CLOSE).then(() => this.content.remove()),
      ];

      if (this.options.overlay.active) {
        close.push(
          this.overlay
            .bind(CLOSE)
            .then(() => {
              if (this.scroll) {
                this.scroll.remove();
              }

              this.overlay.remove();
              this.dispatchEvent('overlay.onClose');
            })
        );
      }

      if (this.container) {
        close.push(
          this.container
            .bind(CLOSE)
            .then(() => this.container.remove())
        );
      }

      Promise
        .all(close)
        .then(() => {
          if (this.options.overlay.escKey) {
            document.removeEventListener('keydown', this.action, true);
          }

          this.dispatchEvent('content.onClose');
        });
    }

    // Private methods
    private dispatchEvent(type: string): void {
      const event: Event = new Event(`${CB}:${type}`);
      const action: any = Object.create(this.options);

      document.dispatchEvent(event);

      try {
        type.split('.').reduce((a, b) => a[b], action).call();
      } catch (e) {}
    }

    private listeners(): void {
      if (this.options.overlay.escKey) {
        document.addEventListener('keydown', this.action, true);
      }

      this.content.element.addEventListener('click', (event: Event) => {
        if (event.target === this.content.element) {
          this._close();
        }
      }, true);

      this.content.element.addEventListener(`${CB}:close`, () => {
        this._close();
      }, true);
    }
  }
}