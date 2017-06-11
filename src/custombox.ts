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
    clone: boolean;
    delay: number;
    id: string;
    container: string;
    close: boolean;
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
  const LOCK: string = `${CB}-lock`;
  const FROM: string = 'animateFrom';
  const BLOCK: string = 'block';
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
    
    static isIE(): boolean {
      const ua = window.navigator.userAgent;

      const msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return !isNaN(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
      }

      const trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        const rv = ua.indexOf('rv:');
        return !isNaN(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
      }

      const edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return !isNaN(parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10));
      }

      // other browser
      return false;
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
      clone: false,
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
      close: true,
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
    show(): void {
      this.element.style.display = BLOCK;
    }

    destroy(): void {
      this.element.parentElement.removeChild(this.element);
    }
  }

  class Container {
    element: any;

    constructor(private options: OptionsSchema) {
      if (document.readyState === 'loading') {
        throw new Error('You need to instantiate Custombox when the document is fully loaded');
      }

      const selector: Element = document.querySelector(this.options.content.container);
      if (selector) {
        this.element = selector;
      } else if (!document.querySelector(`.${CB}-container`)) {
        this.element = document.createElement('div');

        while (document.body.firstChild) {
          this.element.appendChild(document.body.firstChild);
        }
        document.body.appendChild(this.element);
      } else if (document.querySelector(`.${CB}-container`)) {
        this.element = document.querySelector(`.${CB}-container`);
      }

      this.element.classList.add(`${CB}-container`);
      this.element.classList.add(`${CB}-${this.options.content.effect}`);
      this.element.style.animationDuration = `${this.options.content.speedIn}ms`;

      if (Snippet.check(animationValues, this.options.content.effect)) {
        this.setAnimation();
      }
    }

    // Public methods
    bind(method: string): Promise<Event> {
      if (method === CLOSE) {
        if (Snippet.check(animationValues, this.options.content.effect)) {
          this.setAnimation('animateTo');
        }
        this.element.classList.remove(OPEN);
      }

      this.element.classList.add(method);
      return new Promise((resolve: Function) => this.listener().then(() => resolve()));
    }

    remove(): void {
      this.element.classList.remove(CLOSE);
      this.element.classList.remove(`${CB}-${this.options.content.effect}`);
      this.element.style.removeProperty('animation-duration');

      const elements: NodeListOf<Element> = document.querySelectorAll(`.${CB}-content`);
      const container: Element = document.querySelector(this.options.content.container);
      if (!elements.length) {
        if (container) {
          const classes = this.element.className.split(' ');
          for (let i = 0, t = classes.length; i < t; i++) {
            if (classes[i].startsWith(`${CB}-`)) {
              this.element.classList.remove(classes[i]);
            }
          }
        } else {
          const container = document.querySelector(`.${CB}-container`);

          while (container.firstChild) container.parentNode.insertBefore(container.firstChild, container);
          container.parentNode.removeChild(container);
        }
      }
    }

    // Private methods
    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => {
        if (!Snippet.isIE()) {
          this.element.addEventListener('animationend', () => resolve(), true);
        } else {
          setTimeout(resolve, this.options.content.speedIn);
        }
      });
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
          this.element.classList.add(`${CB}-${this.options.content.effect}`);
          this.element.classList.add(OPEN);
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
      return new Promise((resolve: Function) => {
        if (!Snippet.isIE()) {
          this.element.addEventListener('animationend', () => resolve(), true);
        } else {
          setTimeout(resolve, this.options.overlay.speedIn);
        }
      });
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
    reference: HTMLElement;

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
        this.element.classList.add(`${CB}-x-${this.options.content.positionX}`);
        this.element.classList.add(`${CB}-y-${this.options.content.positionY}`);
      }

      if (Snippet.check(animationValues, this.options.content.effect)) {
        this.setAnimation();
      }
    }

    // Public methods
    fetch(): Promise<any> {
      return new Promise((resolve: Function, reject: Function) => {
        // Youtube
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = this.options.content.target.match(regExp);

        if (match && match[2].length == 11) {
          const element: any = document.createElement('div');
          let frame = document.createElement('iframe');

          frame.setAttribute('src', `https://www.youtube.com/embed/${match[2]}`);
          frame.setAttribute('frameborder', '0');
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('width', '100%');
          frame.setAttribute('height', '100%');
          element.appendChild(frame);

          if (!this.options.content.fullscreen) {
            let w = window.innerWidth > 560 ? 560 : window.innerWidth;
            let h = window.innerHeight > 315 ? 315 : window.innerHeight;

            const natural: number = parseInt(this.options.content.width, 10);
            if (this.options.content.width && window.innerWidth > natural) {
              h = Math.round(h * natural / w);
              w = natural;
            }

            frame.setAttribute('width', `${w}px`);
            frame.setAttribute('height', `${h}px`);
          }

          this.element.appendChild(element);

          resolve();
        } else if (this.options.content.target.charAt(0) !== '#' && this.options.content.target.charAt(0) !== '.') {
          const req: XMLHttpRequest = new XMLHttpRequest();

          req.open('GET', this.options.content.target);
          req.onload = () => {
            if (req.status === 200) {
              this.element.insertAdjacentHTML('beforeend', req.response);
              let child: any = this.element.firstChild;

              // Set visible
              try {
                child.style.display = BLOCK;
              } catch (e) {
                reject(new Error('The ajax response need a wrapper element'));
              }

              if (this.options.content.width) {
                child.style.flexBasis = this.options.content.width;
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
          let selector = <HTMLElement>document.querySelector(this.options.content.target);
          if (selector) {
            if (this.options.content.clone) {
              selector = <HTMLElement>selector.cloneNode(true);
              selector.removeAttribute('id');
            } else {
              this.reference = document.createElement('div');
              this.reference.classList.add(`${CB}-reference`);
              this.reference.setAttribute('style', selector.getAttribute('style'));
              selector.parentNode.insertBefore(this.reference, selector.nextSibling);
            }

            // Set visible
            selector.style.display = BLOCK;

            // Set width
            if (this.options.content.width) {
              selector.style.flexBasis = this.options.content.width;
            }

            this.element.appendChild(selector);

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
          this.element.classList.add(`${CB}-${this.options.content.effect}`);
          this.element.classList.add(OPEN);
          break;
      }

      return new Promise((resolve: Function) => this.listener().then(()=> resolve()));
    }

    remove(): void {
      const match = new RegExp('^[#|.]');
      if (!this.options.content.clone && match.test(this.options.content.target)) {
        const element = <HTMLElement>this.element.childNodes[0];
        element.setAttribute('style', this.reference.getAttribute('style'));
        this.reference.parentNode.insertBefore(this.element.childNodes[0], this.reference.nextSibling);
        this.reference.parentNode.removeChild(this.reference);
      }
      
      try {
        this.element.parentNode.removeChild(this.element);
      } catch (e) {}
    }

    // Private methods
    private listener(): Promise<Event> {
      return new Promise((resolve: Function) => {
        if (!Snippet.isIE()) {
          this.element.addEventListener('animationend', () => resolve(), true);
        } else {
          setTimeout(resolve, this.options.content.speedIn);
        }
      });
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
    }

    // Public methods
    open(): void {
      this.build();

      if (this.options.loader.active) {
        this.loader.show();
      }

      this.content
        .fetch()
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
          document.body.classList.add(LOCK);
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

    // Private methods
    build(): void {
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

    static close(id?: string): void {
      const event: Event = new CustomEvent(`${CB}:close`);
      let elements: NodeListOf<Element> = document.querySelectorAll(`.${CB}-content`);

      if (id) {
        elements = document.querySelectorAll(`#${CB}-${id}`);
      }

      try {
        elements[elements.length - 1].dispatchEvent(event);
      } catch (e) {
        throw new Error('Custombox is not instantiated');
      }
    }

    static closeAll(): void {
      const event: Event = new CustomEvent(`${CB}:close`);
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
          if (this.options.content.close) {
            document.removeEventListener('keydown', this.action, true);
          }

          this.dispatchEvent('content.onClose');

          // Remove lock
          document.body.classList.remove(LOCK);
        });
    }

    // Private methods
    private dispatchEvent(type: string): void {
      const element: string = type.replace('.on', ':').toLowerCase();
      const event: Event = new CustomEvent(`${CB}:${element}`);
      const action: any = Object.create(this.options);

      document.dispatchEvent(event);

      try {
        type.split('.').reduce((a, b) => a[b], action).call();
      } catch (e) {}
    }

    private listeners(): void {
      const AFM = window.getComputedStyle(this.content.element).getPropertyValue('animation-fill-mode');

      document.addEventListener('fullscreenchange', () => {
        const style = window.getComputedStyle(this.content.element);
        if (style.getPropertyValue('animation-fill-mode') === AFM) {
          this.content.element.style.animationFillMode = 'backwards';
        } else {
          this.content.element.style.animationFillMode = AFM;
        }
      }, true);

      if (this.options.content.close) {
        document.addEventListener('keydown', this.action, true);
      }

      if (this.options.overlay.close) {
        this.content.element.addEventListener('click', (event: Event) => {
          if (event.target === this.content.element) {
            this._close();
          }
        }, true);
      }

      this.content.element.addEventListener(`${CB}:close`, () => {
        this._close();
      }, true);
    }
  }
}