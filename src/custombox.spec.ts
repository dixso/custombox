function haveElement(element: string): boolean {
  return document.body.contains(document.querySelector(element));
}

describe('Custombox', () => {
  let div: HTMLElement;

  beforeEach(() => {
    div = document.createElement('div');
    div.innerHTML = 'Lorem ipmsum...';
    div.setAttribute('id', 'foo');
    document.body.appendChild(div);
  });

  afterEach(()=> {
    div.parentNode.removeChild(div);
    delete Custombox;
  });

  it('should have been initialized', (done) => {
    new (Custombox as any).modal({
      content: {
        effect: 'fall',
        target: '#foo',
      },
      overlay: {
        active: false
      }
    });

    setTimeout(() => {
      expect(haveElement('.custombox-content')).toBe(false);
      done();
    }, 200);
  });

  it('should have been opened', (done) => {
    new (Custombox as any).modal({
      content: {
        effect: 'fall',
        target: '#foo',
      },
      overlay: {
        active: false
      }
    }).open();

    setTimeout(() => {
      expect(haveElement('.custombox-content')).toBe(true);
      expect(haveElement('.custombox-open')).toBe(true);
      expect(haveElement('.custombox-close')).toBe(false);
      done();
    }, 200);
  });

  it('should have been closed', (done) => {
    beforeEach(() => {
      new (Custombox as any).modal({
        content: {
          effect: 'fall',
          target: '#foo',
          speedOut: 0,
          speedIn: 0,
        },
        overlay: {
          active: false
        }
      }).open();
    });

    setTimeout(() => {
      Custombox.modal.close();
      expect(haveElement('.custombox-open')).toBe(false);
      expect(haveElement('.custombox-close')).toBe(true);
      done();
    }, 200);
  });

  it('should have been closed by ID', (done) => {
    const ID: string = 'my-custom-id';

    new (Custombox as any).modal({
      content: {
        effect: 'fall',
        target: '#foo',
        id: ID
      },
      overlay: {
        active: false
      }
    }).open();

    setTimeout(() => {
      expect(haveElement(`#custombox-${ID}`)).toBe(true);
      Custombox.modal.close(ID);
      expect(haveElement('.custombox-close')).toBe(true);
      done();
    }, 200);
  });
});