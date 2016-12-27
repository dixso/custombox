function hasElement(element: string): boolean {
  return document.body.contains(document.querySelector(element));
}

describe('Custombox #methods', () => {
  let originalTimeout;
  beforeEach(function() {
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

    delete Custombox;

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

describe('Custombox #options', () => {
  let originalTimeout;
  beforeEach(function() {
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

    delete Custombox;

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
      },
      overlay: {
        escKey: false
      }
    }).open();

    setTimeout(() => {
      let event: any = new Event('keydown');
      event.which = event.keyCode = 27;
      document.dispatchEvent(event);

      expect(hasElement('.custombox-close')).toBe(false);
      done();
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
        onOpen: function () {
          state = true;
        }
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
        onComplete: function () {
          state = true;
        }
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
        onClose: function () {
          state = true;
        }
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
});