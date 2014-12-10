import {Aurelia} from '../lib/index';
import {Loader} from 'aurelia-loader';

describe('aurelia', () => {
  it('should have some tests', () => {
    var aurelia = new Aurelia(new Loader());
    expect(aurelia).not.toBe(null);
  });
});