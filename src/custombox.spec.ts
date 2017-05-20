function hasElement(element: string): boolean {
  return document.body.contains(document.querySelector(element));
}

function getAfterEach() {
  for (let i = 1; i < 3; i++) {
    let elem = document.getElementById(`foo-${i}`);
    elem.parentNode.removeChild(elem);
  }

  // custombox-content
  let contents = document.querySelectorAll('.custombox-content');
  for (let i = 0, t = contents.length; i < t; i++) {
    contents[i].parentNode.removeChild(contents[i]);
  }

  // custombox-overlay
  let overlays = document.querySelectorAll('.custombox-overlay');
  for (let i = 0, t = overlays.length; i < t; i++) {
    overlays[i].parentNode.removeChild(overlays[i]);
  }

  // custombox-loader
  let loaders = document.querySelectorAll('.custombox-loader');
  for (let i = 0, t = loaders.length; i < t; i++) {
    loaders[i].parentNode.removeChild(loaders[i]);
  }

  // custombox-reference
  let reference = document.querySelectorAll('.custombox-reference');
  for (let i = 0, t = reference.length; i < t; i++) {
    reference[i].parentNode.removeChild(reference[i]);
  }
}

describe('Custombox', () => {
  describe('Methods', () => {
    let originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeEach(() => {
      for (let i = 1; i < 3; i++) {
        let div = document.createElement('div');
        div.innerHTML = `Lorem ipmsum (${i}) ...`;
        div.setAttribute('id', `foo-${i}`);
        document.body.appendChild(div);
      }
    });

    afterEach(()=> {
      getAfterEach();

      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should have been initialized', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fall',
          target: '#foo-1',
        }
      });

      setTimeout(() => {
        expect(hasElement('.custombox-content')).toBe(false);
        done();
      }, 200);
    });

    it('should have opened', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fall',
          target: '#foo-1',
        },
        overlay: {
          active: false
        }
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-content')).toBe(true);
        expect(hasElement('.custombox-open')).toBe(true);
        expect(hasElement('.custombox-close')).toBe(false);
        done();
      }, 200);
    });

    it('should have closed', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fall',
          target: '#foo-1',
          speedOut: 0,
          speedIn: 0,
        },
        overlay: {
          active: false
        }
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-open')).toBe(true);
        expect(hasElement('.custombox-close')).toBe(false);

        Custombox.modal.close();

        expect(hasElement('.custombox-open')).toBe(false);
        expect(hasElement('.custombox-close')).toBe(true);
        done();
      }, 200);
    });

    it('should have an exception when close', () => {
      expect(() => Custombox.modal.close()).toThrowError('Custombox is not instantiated');
    });

    it('should have closed by ID', (done) => {
      const ID: string = 'my-custom-id';

      new (Custombox as any).modal({
        content: {
          effect: 'fall',
          target: '#foo-1',
          id: ID
        },
        overlay: {
          active: false
        }
      }).open();

      setTimeout(() => {
        expect(hasElement(`#custombox-${ID}`)).toBe(true);
        Custombox.modal.close(ID);
        expect(hasElement('.custombox-close')).toBe(true);
        done();
      }, 200);
    });

    it('should have open two consecutive modals', (done) => {
      for (let i = 1; i < 3; i++) {
        new (Custombox as any).modal({
          content: {
            effect: 'fadein',
            target: `#foo-${i}`,
          },
        }).open();
      }

      setTimeout(() => {
        expect(document.querySelectorAll('.custombox-content').length).toEqual(2);
        done();
      }, 200);
    });

    it('should close all modals', (done) => {
      for (let i = 1; i < 3; i++) {
        new (Custombox as any).modal({
          content: {
            effect: 'fadein',
            target: `#foo-${i}`,
          },
          overlay: {
            active: false
          }
        }).open();
      }

      setTimeout(() => {
        expect(document.querySelectorAll('.custombox-close').length).toEqual(0);
        Custombox.modal.closeAll();
        expect(document.querySelectorAll('.custombox-close').length).toEqual(2);
        done();
      }, 200);
    });

    it('should close a modal with a click', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          active: false
        }
      }).open();

      setTimeout(() => {
        const event: Event = new Event('click');
        document.querySelector('.custombox-content').dispatchEvent(event);

        expect(hasElement('.custombox-close')).toBe(true);
        done();
      }, 200);
    });
  });

  describe('Overlay', () => {
    let originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeEach(() => {
      for (let i = 1; i < 3; i++) {
        let div = document.createElement('div');
        div.innerHTML = `Lorem ipmsum (${i}) ...`;
        div.setAttribute('id', `foo-${i}`);
        document.body.appendChild(div);
      }
    });

    afterEach(()=> {
      getAfterEach();

      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should have put overlay color', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          color: '#F00',
        }
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-overlay')).toBe(true);

        let overlay: any = document.querySelector('.custombox-overlay');
        expect(overlay.style.backgroundColor).toEqual('rgb(255, 0, 0)');
        done();
      }, 200);
    });

    it('should have put overlay opacity', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          opacity: 1,
        }
      }).open();

      setTimeout(() => {
        let overlay: any = document.querySelector('.custombox-overlay');
        let opacity = window.getComputedStyle(overlay, null).getPropertyValue('opacity');

        opacity = opacity.replace(/,/g, '.');
        expect(Math.ceil(+opacity)).toEqual(1);
        done();
      }, 200);
    });

    it(`should have prevented don't close`, (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          close: false
        }
      }).open();

      setTimeout(() => {
        const event: Event = new Event('click');
        document.querySelector('.custombox-overlay').dispatchEvent(event);

        expect(hasElement('.custombox-close')).toBe(false);
        done();
      }, 200);
    });

    it('should have close it with esc key', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        }
      }).open();

      setTimeout(() => {
        let event: any = new Event('keydown');
        event.which = event.keyCode = 27;
        document.dispatchEvent(event);

        expect(hasElement('.custombox-close')).toBe(true);
        done();
      }, 200);
    });

    it('should have not close it with esc key', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          close: false,
          clone: true
        },
      }).open();

      setTimeout(() => {
        let event: any = new Event('keydown');
        event.which = event.keyCode = 27;
        document.dispatchEvent(event);

        setTimeout(() => {
          expect(hasElement('.custombox-close')).toBe(false);
          done();
        }, 500);
      }, 200);
    });

    it('should not close on clicking the background', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          close: false
        },
        overlay: {
          close: false
        }
      }).open();

      setTimeout(() => {
        let overlay: any = document.querySelector('.custombox-overlay');
        overlay.click();

        setTimeout(() => {
          expect(hasElement('.custombox-close')).toBe(false);
          done();
        }, 500);
      }, 200);
    });

    it('should have run the onOpen function', (done) => {
      let state: boolean = false;
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          onOpen: () => state = true
        }
      }).open();

      setTimeout(() => {
        expect(state).toBe(true);
        done();
      }, 200);
    });

    it('should have run the onComplete function', (done) => {
      let state: boolean = false;
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          onComplete: () => state = true
        }
      }).open();

      setTimeout(() => {
        expect(state).toBe(true);
        done();
      }, 500);
    });

    it('should have run the onClose function', (done) => {
      let state: boolean = false;
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          onClose: () => state = true
        }
      }).open();

      setTimeout(() => {
        Custombox.modal.close();
      }, 500);

      setTimeout(() => {
        expect(state).toBe(true);
        done();
      }, 1000);
    });

    it('should have opened without overlay', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        overlay: {
          active: false
        }
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-overlay')).toBe(false);
        done();
      }, 200);
    });

    it('should be called a open listener', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      let eventSpy = jasmine.createSpy('event');
      document.addEventListener('custombox:overlay:open', eventSpy);

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalled();
        done();
      }, 200);
    });

    it('should be called a complete listener', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      let eventSpy = jasmine.createSpy('event');
      document.addEventListener('custombox:overlay:complete', eventSpy);

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalled();
        done();
      }, 400);
    });

    it('should be called a close listener', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      let eventSpy = jasmine.createSpy('event');
      document.addEventListener('custombox:overlay:close', eventSpy);

      setTimeout(() => {
        Custombox.modal.close();
      }, 500);

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalled();
        done();
      }, 1000);
    });
  });

  describe('Content', () => {
    let originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeEach(() => {
      for (let i = 1; i < 3; i++) {
        let div = document.createElement('div');
        div.innerHTML = `Lorem ipmsum (${i}) ...`;
        div.setAttribute('id', `foo-${i}`);
        div.style.display = 'none';
        document.body.appendChild(div);
      }
    });

    beforeEach(() => {
      (jasmine as any).Ajax.install();
    });

    afterEach(()=> {
      getAfterEach();

      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

      (jasmine as any).Ajax.uninstall();
    });

    it('should have put content ID', (done) => {
      const ID: string = 'my-custom-id';

      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          id: ID
        },
      }).open();

      setTimeout(() => {
        expect(hasElement(`#custombox-${ID}`)).toBe(true);
        done();
      }, 200);
    });

    it('should open from AJAX', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: 'foo.html',
        },
      }).open();

      setTimeout(() => {
        (jasmine as any).Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/html',
          response: '<div>awesome content</div>'
        });

        setTimeout(() => {
          expect(hasElement('.custombox-content')).toBe(true);

          let text = document.querySelector('.custombox-content').textContent;
          expect(text).toEqual('awesome content');
          done();
        }, 400);
      }, 200);
    });

    it('should open from youtube', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: 'https://youtu.be/clW7aV0vVAY',
        },
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-content iframe')).toBe(true);
        let frame = document.querySelector('.custombox-content iframe');
        expect(frame.getAttribute('src')).toEqual('https://www.youtube.com/embed/clW7aV0vVAY');
        done();
      }, 200);
    });

    it('should open from youtube with a specific size', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          width: '600px',
          target: 'https://youtu.be/clW7aV0vVAY',
        },
      }).open();

      setTimeout(() => {
        let frame: any = document.querySelector('.custombox-content > div');
        expect(frame.offsetWidth).toEqual(600);
        expect(frame.offsetHeight).toEqual(342);
        done();
      }, 200);
    });

    it('should have animateFrom', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'slide',
          target: '#foo-1',
          animateFrom: 'left',
        },
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-left')).toBe(true);
        done();
      }, 200);
    });

    it('should have animate animateTo', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'slide',
          target: '#foo-1',
          animateTo: 'right'
        },
      }).open();

      setTimeout(() => {
        Custombox.modal.close();
        expect(hasElement('.custombox-right')).toBe(true);
        done();
      }, 200);
    });

    it('should have put width', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'slide',
          target: '#foo-1',
          width: '600px',
        },
      }).open();

      setTimeout(() => {
        let content = document.querySelector('.custombox-content > div');
        expect(content.clientWidth).toEqual(600);
        done();
      }, 200);
    });

    it('should have positionX and positionY', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'slide',
          target: '#foo-1',
          positionY: 'center',
          positionX: 'top'
        },
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-y-center')).toBe(true);
        expect(hasElement('.custombox-x-top')).toBe(true);
        done();
      }, 200);
    });

    it('should have fullscreen', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'slide',
          target: '#foo-1',
          fullscreen: true,
        },
      }).open();

      setTimeout(() => {
        const fullscreen = document.querySelector('.custombox-content').children[0];
        expect(hasElement('.custombox-fullscreen')).toBe(true);
        expect(fullscreen.clientWidth).toEqual(window.innerWidth - 16);
        expect(fullscreen.clientHeight).toEqual(window.innerHeight);
        done();
      }, 200);
    });

    it('should have run the onOpen function', (done) => {
      let state: boolean = false;
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          onOpen: () => state = true
        },
      }).open();

      setTimeout(() => {
        expect(state).toBe(true);
        done();
      }, 200);
    });

    it('should have run the onComplete function', (done) => {
      let state: boolean = false;
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          onComplete: () => state = true
        },
        overlay: {
          active: false
        }
      }).open();

      setTimeout(() => {
        expect(state).toBe(true);
        done();
      }, 500);
    });

    it('should have run the onClose function', (done) => {
      let state: boolean = false;
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          onClose: () => state = true
        },
      }).open();

      setTimeout(() => {
        Custombox.modal.close();
      }, 500);

      setTimeout(() => {
        expect(state).toBe(true);
        done();
      }, 1000);
    });

    it('should remove the property of display:none', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1'
        },
      }).open();

      setTimeout(() => {
        let custom: any = document.querySelector('.custombox-content > div');
        expect(custom.getAttribute('style')).toEqual('display: block;');
        done();
      }, 200);
    });

    it('should be called a open listener', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      let eventSpy = jasmine.createSpy('event');
      document.addEventListener('custombox:content:open', eventSpy);

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalled();
        done();
      }, 400);
    });

    it('should be called a complete listener', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      let eventSpy = jasmine.createSpy('event');
      document.addEventListener('custombox:content:complete', eventSpy);

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should be called a close listener', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      let eventSpy = jasmine.createSpy('event');
      document.addEventListener('custombox:content:close', eventSpy);

      setTimeout(() => {
        Custombox.modal.close();
      }, 500);

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalled();
        done();
      }, 1000);
    });

    it('should remove perspective class', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fall',
          target: '#foo-1',
        }
      }).open();

      setTimeout(() => {
        expect(document.documentElement.classList.contains('custombox-perspective')).toBe(true);
        Custombox.modal.close();

        setTimeout(() => {
          expect(document.documentElement.classList.contains('custombox-perspective')).toBe(false);
          done();
        }, 750);
      }, 500);
    });
  });

  describe('Container', () => {
    let originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeEach(() => {
      for (let i = 1; i < 3; i++) {
        let div = document.createElement('div');
        div.innerHTML = `Lorem ipmsum (${i}) ...`;
        div.setAttribute('id', `foo-${i}`);
        document.body.appendChild(div);
      }

      let container = document.createElement('div');
      container.setAttribute('id', 'container');
      while (document.body.firstChild) {
        container.appendChild(document.body.firstChild);
      }
      document.body.appendChild(container);
    });

    beforeEach(() => {
      (jasmine as any).Ajax.install();
    });

    afterEach(()=> {
      getAfterEach();

      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

      (jasmine as any).Ajax.uninstall();
    });

    it('should have put a container selector', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'makeway',
          target: '#foo-1',
          container: '#container'
        },
      }).open();

      setTimeout(() => {
        expect(hasElement('#container.custombox-container')).toBe(true);
        done();
      }, 200);
    });

    it('should have put a container automatically', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'makeway',
          target: '#foo-1',
        },
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-container')).toBe(true);
        done();
      }, 200);
    });

    it('should have overwrite an existing container automatically', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'makeway',
          target: '#foo-1',
        },
      }).open();

      setTimeout(()=> {
        new (Custombox as any).modal({
          content: {
            effect: 'blur',
            target: '#foo-2',
          },
        }).open();
      }, 200);

      setTimeout(() => {
        expect(document.querySelectorAll('.custombox-container').length).toBe(1);
        done();
      }, 400);
    });

    it('should clone the element of the DOM', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'makeway',
          target: '#foo-1',
          clone: false,
        },
      }).open();

      setTimeout(() => {
        expect(document.querySelectorAll('.custombox-reference').length).toBe(1);
        done();
      }, 400);
    });
  });

  describe('Loader', () => {
    let originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeEach(() => {
      for (let i = 1; i < 3; i++) {
        let div = document.createElement('div');
        div.innerHTML = `Lorem ipmsum (${i}) ...`;
        div.setAttribute('id', `foo-${i}`);
        document.body.appendChild(div);
      }
    });

    afterEach(()=> {
      getAfterEach();

      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should show loader', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        loader: {
          color: '#F00',
          background: '#FFF',
          speed: 1500,
        }
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-loader')).toBe(true);
        let loader: any = document.querySelector('.custombox-loader');
        expect(loader.style.borderColor).toEqual('rgb(255, 0, 0) rgb(255, 255, 255) rgb(255, 255, 255)');
        expect(loader.style.animationDuration).toEqual('1500ms');
        done();
      }, 200);
    });

    it('should show loader when the overlay is disabled', () => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
          clone: true,
        },
        overlay: {
          active: false
        },
        loader: {
          active: true
        }
      }).open();

      expect(hasElement('.custombox-loader')).toBe(true);
    });

    it(`shouldn't show loader`, (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
        loader: {
          active: false
        }
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-loader')).toBe(false);
        done();
      }, 200);
    });

    it('should remove loader when the overlay is completed', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1',
        },
      }).open();

      setTimeout(() => {
        Custombox.modal.close();
        expect(hasElement('.custombox-loader')).toBe(false);
        done();
      }, 500);
    });

    it('should remove loader when fail the target', (done) => {
      new (Custombox as any).modal({
        content: {
          effect: 'fadein',
          target: '#foo-1-fail',
        },
      }).open();

      setTimeout(() => {
        expect(hasElement('.custombox-loader')).toBe(false);
        done();
      }, 500);
    });
  });
});