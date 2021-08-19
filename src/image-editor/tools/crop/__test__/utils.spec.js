/* eslint-env jest */
import {
	getBoxBetween,
	getPointRelative,
	getRatioSlope,
	getOrthogonalPointProjection,
	constrainBox,
} from '../utils.js';

describe('Crop Utility Tests', () => {
	describe('getPointRelative', () => {
		test('maintains relative distances', () => {
			expect(getPointRelative([1, 2], [0, 0])).toEqual([1, 2]);
			expect(getPointRelative([0, 0], [1, 2])).toEqual([1, 2]);
		});
	});

	describe('getBoxBetween', () => {
		test('computes correct width', () => {
			expect(getBoxBetween([1, 0], [2, 0]).width).toEqual(1);
			expect(getBoxBetween([2, 0], [1, 0]).width).toEqual(1);
		});

		test('computes correct height', () => {
			expect(getBoxBetween([0, 1], [0, 2]).height).toEqual(1);
			expect(getBoxBetween([0, 2], [0, 1]).height).toEqual(1);
		});
	});

	describe('getRatioSlope', () => {
		const point = [4, 2];
		const anchor = [0, 0];
		const desiredRatio = 2;

		test('returns slope for desired ratio when it matches constraints', () => {
			const crops = [
				{ aspectRatio: 3 },
				{ aspectRatio: 3, minAspectRatio: 1 },
				{ aspectRatio: 3, maxAspectRatio: 3 },
				{ aspectRatio: 3, minAspectRatio: 1, maxAspectRatio: 3 },
			];

			for (let crop of crops) {
				expect(getRatioSlope(point, anchor, crop)).toEqual(
					1 / desiredRatio
				);
			}
		});

		test('returns slope for current aspectRatio when locked', () => {
			const crop = {
				aspectRatio: 3,
				aspectRatioLocked: true,
			};

			expect(getRatioSlope(point, anchor, crop)).toEqual(1 / 3);
		});

		test('returns slope for minAspectRatio when desired is too low', () => {
			const crop = {
				aspectRatio: 4,
				minAspectRatio: 3,
			};

			expect(getRatioSlope(point, anchor, crop)).toEqual(1 / 3);
		});

		test('returns slope for maxAspectRatio when desired is too hight', () => {
			const crop = {
				aspectRatio: 0.5,
				maxAspectRatio: 1,
			};

			expect(getRatioSlope(point, anchor, crop)).toEqual(1);
		});
	});

	describe('getOrthogonalPointProjection', () => {
		test('returns original point if it is on the line', () => {
			expect(
				getOrthogonalPointProjection([2, 2], {
					slope: 1,
					yIntercept: 0,
				})
			).toEqual([2, 2]);
		});

		test('returns point on the line', () => {
			expect(
				getOrthogonalPointProjection([2, 0], {
					slope: 1,
					yIntercept: 0,
				})
			).toEqual([1, 1]);
		});
	});

	describe('constrainBox', () => {
		const box = { width: 2, height: 4 };

		test('returns original box if it matches constraints', () => {
			const min = { width: 1, height: 2 };
			const max = { width: 3, height: 5 };

			expect(constrainBox(box, min, max)).toEqual({
				width: 2,
				height: 4,
			});
		});

		test('scales box up if its narrower than the min width', () => {
			const min = { width: 5, height: 4 };
			const max = { width: 10, height: 16 };

			expect(constrainBox(box, min, max)).toEqual({
				width: 5,
				height: 10,
			});
		});

		test('scales box up if its shorter than the min height', () => {
			const min = { width: 1, height: 6 };
			const max = { width: 3, height: 10 };

			expect(constrainBox(box, min, max)).toEqual({
				width: 3,
				height: 6,
			});
		});

		test('scales box down if its wider than the max width', () => {
			const min = { width: 0.5, height: 2 };
			const max = { width: 1, height: 6 };

			expect(constrainBox(box, min, max)).toEqual({
				width: 1,
				height: 2,
			});
		});

		test('scales box down if its taller than the max height', () => {
			const min = { width: 0.5, height: 1 };
			const max = { width: 2, height: 3 };

			expect(constrainBox(box, min, max)).toEqual({
				width: 3 / 2,
				height: 3,
			});
		});
	});
});
