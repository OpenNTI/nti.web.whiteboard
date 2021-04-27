export const clamp = (d, min, max) => Math.min(Math.max(d, min), max);

/**
 * Transform a point to the upper right quadrant if the target becomes the origin
 * (
 *  Note: Not quite a rotation, we're doing this to simplify some of the math
 *  SubNote: It might not simplify the math, but it simplifies thinking about the math
 * )
 *
 * @param {Array} target point
 * @param {Array} anchor new origin
 * @returns {Array} target relative to anchor being the new origin
 */
export const getPointRelative = (target, anchor) => target.map((t, i) => Math.abs(t - anchor[i]));

export const getBoxBetween = (pointA, pointB) => ({
	width: Math.abs(pointA[0] - pointB[0]),
	height: Math.abs(pointA[1] - pointB[1])
});

/**
 * Get the slope of the line for the current aspect ratio, from anchor to the point
 * and matching all given constraints.
 *
 * @param {Array} point point to get the slope through
 * @param {Array} anchor second point to get the slop through
 * @param {Object} crop the config passed to the cropping tool
 * @returns {number} the slope of the line all valid aspect ratios will be on
 */
 export function getRatioSlope (point, anchor, crop) {
	const {
		aspectRatio,
		aspectRatioLocked,

		minAspectRatio = -Infinity,
		maxAspectRatio = Infinity
	} = crop;

	const newAspectRatio = (point[0] - anchor[0]) / (point[1] - anchor[1]);
	//if we got NaN for the newAspectRatio, use the current aspect ratio
	const correctedAspectRatio = isNaN(newAspectRatio) || newAspectRatio === 0 ? aspectRatio : newAspectRatio;

	const ratio = aspectRatioLocked ? aspectRatio : clamp(correctedAspectRatio, minAspectRatio, maxAspectRatio);

	return 1 / ratio;
}

/**
 * Given a point and slope + y-intercept of a line, get the point
 * on the line closest to the target point
 *
 * @param {Array} point point to look closest to
 * @param {Object} line line to find point on
 * @param {number} line.slope
 * @param {number} line.yIntercept
 * @returns {Array} the closest point on line to the target point
 */
export function getOrthogonalPointProjection (point, line) {
	const {slope, yIntercept} = line;

	const orthogonalSlope = -1 / slope;
	//compute the y-intercept of the orthogonal line
	//y = m*x + b => b = y - m*x
	const orthogonalYIntercept = point[1] - (orthogonalSlope * point[0]);

	//compute the x point when the ys are equal
	// ratioSlope * x + ratioYIntercept = orthogonalSlope * x + orthogonalYIntercept
	// m*x + b = m`*x + b` => m*x - m`*x = b` - b => (m - m`)*x = b` - b => x = (b` - b) / (r - o)
	const intersectionX = (orthogonalYIntercept - yIntercept) / (slope - orthogonalSlope);
	const intersectionY = slope * intersectionX + yIntercept; //y = mx + b

	return [intersectionX, intersectionY];
}

/**
 * Given two points, find a box that goes through anchor and is as close to point as the crop config allows
 * @param {Array} point the point to try and get the box close to
 * @param {Array} anchor the point the box starts on
 * @param {Object} crop config passed to the crop tool
 * @returns {Object} the {width, height} of the best fitting box
 */
export function getNewCrop (point, anchor, crop) {
	/*
		Outline:

		Assume the box's bottom left corner is (0, 0)

		Find the slope of the line from (0, 0) that matches the aspect ratio constraints
		(ie. for every point on the line will match: x/y === aspect ratio)

		Find the point on the "ratio line" closest to the target point of [box.width, box.height]
	*/
	const ratioLine = {
		slope: getRatioSlope(point, anchor, crop),
		yIntercept: 0
	};

	//if the point is the same as the anchor, return a "unit" box instead
	//of a zero width/height box;
	if (point.every((p, i) => p === anchor[i])) {
		return {
			width: 1,
			height: 1 * ratioLine.slope
		};
	}

	const targetPoint = getOrthogonalPointProjection(point, ratioLine);

	return getBoxBetween(targetPoint, anchor);
}

/**
 * Find the {width, height} that fits in the constraints while maintaining the aspect ratio
 *
 * @param {Object} box box to adjust
 * @param {Object} minSize the min size the box can be
 * @param {Object} maxSize the max size the box can be
 * @returns {Object}
 */
export function constrainBox (box, minSize, maxSize) {
	const ratio = box.width / box.height;
	const getAdjusted = (size) => ({
		width: size.height * ratio,
		height: size.width / ratio
	});

	const constrained = {...box};

	if (constrained.height < minSize.height || constrained.width < minSize.width) {
		const adjusted = getAdjusted(minSize);

		if (adjusted.height >= minSize.height) {
			constrained.height = adjusted.height;
			constrained.width = minSize.width;
		} else {
			constrained.height = minSize.height;
			constrained.width = adjusted.width;
		}
	}

	if (constrained.height > maxSize.height || constrained.width > maxSize.width) {
		const adjusted = getAdjusted(maxSize);

		if (adjusted.height <= maxSize.height) {
			constrained.height = adjusted.height;
			constrained.width = maxSize.width;
		} else {
			constrained.height = maxSize.height;
			constrained.width = adjusted.width;
		}
	}

	return constrained;
}
