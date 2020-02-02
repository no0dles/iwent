import {ApplicationDomStore} from './application-dom-store';
import {Defer} from '@iwent/core';

describe('application-dom-store', () => {
  describe('addEventListener', () => {
    it('should add click event', async () => {
      document.body.innerHTML = '<div id="board"></div>';
      const store = new ApplicationDomStore([]);
      const element = store.getElement('board');
      const completeDefer = new Defer();
      element.addEventListener('click', () => {
        completeDefer.resolve();
      });
      document.getElementById('board')?.click();
      await completeDefer.promise;
    });

    it('should return false when element does not exist', async () => {
      document.body.innerHTML = '<div></div>';
      const store = new ApplicationDomStore([]);
      const element = store.getElement('board');
      const result = element.addEventListener('click', () => {
      });
      expect(result).toBe(false);
    });
  });
});