/* eslint-env jest */
import {
	getPointRelative
} from '../utils.js';

describe('Crop Utility Tests', () => {
  describe('getPointRelative', () => {
	test('maintains relative distances', () => {
		expect(getPointRelative([1, 2], [0, 0])).toEqual([1, 2]);
		expect(getPointRelative([0, 0], [1, 2])).toEqual([1, 2]);
	});
  });
});
