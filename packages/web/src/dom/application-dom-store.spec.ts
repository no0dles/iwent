import {ApplicationDomStore} from './application-dom-store';
import {Defer} from '@iwent/core';

describe('application-dom-store', () => {
  describe('addEventListener', () => {
    it('should add click event', async () => {
      const root = document.implementation.createHTMLDocument('test');
      root.body.innerHTML = '<div id="board"></div>';
      const store = new ApplicationDomStore(root, []);
      const element = store.getElement('board');
      const completeDefer = new Defer();
      element.addEventListener('click', () => {
        completeDefer.resolve();
      });
      root.getElementById('board')?.click();
      await completeDefer.promise;
    });

    it('should return false when element does not exist', async () => {
      const root = document.implementation.createHTMLDocument('test');
      root.body.innerHTML = '<div></div>';
      const store = new ApplicationDomStore(root, []);
      const element = store.getElement('board');
      const result = element.addEventListener('click', () => {
      });
      expect(result).toBe(false);
    });
  });
});