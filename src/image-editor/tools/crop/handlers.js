import { CORNER_RADIUS } from './Constants';

function getPointForEvent(e, canvas, padding) {
	const {clientX, clientY} = e;
	const canvasRect = canvas.getBoundingClientRect();

	return [
		clientX - canvasRect.left - padding,
		clientY - canvasRect.top - padding
	];
}

function isInCrop(point, crop) {
	return (
		point[0] >= crop.x &&
		point[0] <= crop.x + crop.width &&
		point[1] >= crop.y &&
		point[1] <= crop.y + crop.height
	);
}

function getDistance(a, b) {
	const diffX = a[0] - b[0];
	const diffY = a[1] - b[1];

	return Math.sqrt(diffX * diffX + diffY * diffY);
}

function isWithInDistance(a, b, distance) {
	const dist = getDistance(a, b);

	return dist <= distance;
}

function isInNWCorner(point, crop) {
	const corner = [crop.x, crop.y];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function isInNECorner(point, crop) {
	const corner = [crop.x + crop.width, crop.y];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function isInSECorner(point, crop) {
	const corner = [crop.x + crop.width, crop.y + crop.height];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function isInSWCorner(point, crop) {
	const corner = [crop.x, crop.y + crop.height];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function fitHeightToRatio(size, ratio, minSize, maxSize) {
	const getHeight = width => Math.ceil(width / ratio);

	let fixedSize = { width: size.width, height: getHeight(size.width) };

	while (fixedSize.height > maxSize.heigth) {
		fixedSize.width -= 1;
		fixedSize.height = getHeight(fixedSize.width);
	}

	return fixedSize;
}

function fitWidthToRatio(size, ratio, minSize, maxSize) {
	const getWidth = height => Math.ceil(height * ratio);

	let fixedSize = { width: getWidth(size.height), height: size.height };

	while (fixedSize.width > maxSize.width) {
		fixedSize.height -= 1;
		fixedSize.width = getWidth(fixedSize.height);
	}

	return fixedSize;
}

function fitSizeToRatio(size, ratio, minSize, maxSize) {
	//if the size already fits the ratio don't do anything
	if (size.width / size.height === ratio) {
		return size;
	}

	const desiredLength = getDistance([0, 0], [size.width, size.height]);

	const fixedForHeight = fitHeightToRatio(size, ratio, minSize, maxSize);
	const fixedForWidth = fitWidthToRatio(size, ratio, minSize, maxSize);

	const heightDistance = getDistance(
		[0, 0],
		[fixedForHeight.width, fixedForHeight.height]
	);
	const widthDistance = getDistance(
		[0, 0],
		[fixedForWidth.width, fixedForWidth.height]
	);

	const heightDiff = Math.abs(desiredLength - heightDistance);
	const widthDiff = Math.abs(desiredLength - widthDistance);

	return heightDiff > widthDiff ? fixedForWidth : fixedForHeight;
}

function getSizeFromPointToAnchor(
	point,
	anchor,
	minSize,
	maxSize,
	aspectRatio,
	minAspectRatio = -Infinity,
	maxAspectRatio = Infinity,
	aspectRatioLocked
) {
	const diffX = Math.abs(point[0] - anchor[0]);
	const diffY = Math.abs(point[1] - anchor[1]);

	const clamp = (d, min, max) => Math.min(Math.max(d, min), max);

	const size = {
		width: clamp(diffX, minSize.width, maxSize.width),
		height: clamp(diffY, minSize.height, maxSize.height),
	};

	const newAspectRatio = size.width / size.height;
	const restrictedAspectRatio = aspectRatioLocked ? aspectRatio : clamp(newAspectRatio, minAspectRatio, maxAspectRatio);

	return newAspectRatio !== restrictedAspectRatio
		? fitSizeToRatio(size, restrictedAspectRatio, minSize, maxSize)
		: size;
}

function getSizingConstraints(crop, layout) {
	return {
		minSize: crop.minSize || { width: 14, height: 14 },
		maxSize: crop.maxSize || {
			width: layout.image.width,
			height: layout.image.height,
		},
	};
}

function constrainCrop(crop, layout) {
	if (crop.x < 0) {
		crop.width = crop.width - crop.x;
		crop.x = 0;
	}

	if (crop.y < 0) {
		crop.height = crop.height - crop.y;
		crop.y = 0;
	}

	if (crop.x + crop.width > layout.canvas.width) {
		crop.width = layout.canvas.width - crop.x;
	}

	if (crop.y + crop.height > layout.canvas.height) {
		crop.height = layout.canvas.height - crop.y;
	}

	return crop;
}

const ACTIONS = {
	move(point, crop, action, formatting, layout, setEditorState) {
		const { lastPoint } = action;
		const xDiff = point[0] - lastPoint[0];
		const yDiff = point[1] - lastPoint[1];

		let newX = crop.x + xDiff;

		if (newX < 0) {
			newX = 0;
		}

		if (newX + crop.width > layout.canvas.width) {
			newX = layout.canvas.width - crop.width;
		}

		let newY = crop.y + yDiff;

		if (newY < 0) {
			newY = 0;
		}

		if (newY + crop.height > layout.canvas.height) {
			newY = layout.canvas.height - crop.height;
		}

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					x: newX,
					y: newY,
					action: {
						name: 'move',
						lastPoint: point,
					},
				},
			},
		});
	},

	nwResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action;

		const { minSize, maxSize } = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(
			point,
			anchorPoint,
			minSize,
			maxSize,
			crop.aspectRatio,
			crop.minAspectRatio,
			crop.maxAspectRatio,
			crop.aspectRatioLocked
		);
		const newOrigin = [
			anchorPoint[0] - newSize.width,
			anchorPoint[1] - newSize.height,
		];

		//If we've dragged pass the anchor don't start getting bigger
		if (point[0] > anchorPoint[0]) {
			newSize.width = minSize.width;
			newOrigin[0] = anchorPoint[0] - minSize.width;
		}

		if (point[1] > anchorPoint[1]) {
			newSize.height = minSize.height;
			newOrigin[1] = anchorPoint[1] - minSize.height;
		}

		const newCrop = constrainCrop(
			{
				x: newOrigin[0],
				y: newOrigin[1],
				width: newSize.width,
				height: newSize.height,
				aspectRatio: newSize.width / newSize.height
			},
			layout
		);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop,
				},
			},
		});
	},

	seResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action;

		const { minSize, maxSize } = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(
			point,
			anchorPoint,
			minSize,
			maxSize,
			crop.aspectRatio,
			crop.minAspectRatio,
			crop.maxAspectRatio,
			crop.aspectRatioLocked
		);
		const newOrigin = [anchorPoint[0], anchorPoint[1]];

		if (point[0] < anchorPoint[0]) {
			newSize.width = minSize.width;
		}

		if (point[1] < anchorPoint[1]) {
			newSize.height = minSize.height;
		}

		const newCrop = constrainCrop(
			{
				x: newOrigin[0],
				y: newOrigin[1],
				width: newSize.width,
				height: newSize.height,
				aspectRatio: newSize.width / newSize.height
			},
			layout
		);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop,
				},
			},
		});
	},

	neResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action;

		const { minSize, maxSize } = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(
			point,
			anchorPoint,
			minSize,
			maxSize,
			crop.aspectRatio,
			crop.minAspectRatio,
			crop.maxAspectRatio,
			crop.aspectRatioLocked
		);
		const newOrigin = [anchorPoint[0], anchorPoint[1] - newSize.height];

		if (point[0] < anchorPoint[0]) {
			newSize.width = minSize.width;
		}

		if (point[1] > anchorPoint[1]) {
			newSize.height = minSize.height;
			newOrigin[1] = anchorPoint[1] - minSize.height;
		}

		const newCrop = constrainCrop(
			{
				x: newOrigin[0],
				y: newOrigin[1],
				width: newSize.width,
				height: newSize.height,
				aspectRatio: newSize.width / newSize.height
			},
			layout
		);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop,
				},
			},
		});
	},

	swResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action;

		const { minSize, maxSize } = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(
			point,
			anchorPoint,
			minSize,
			maxSize,
			crop.aspectRatio,
			crop.minAspectRatio,
			crop.maxAspectRatio,
			crop.aspectRatioLocked
		);
		const newOrigin = [anchorPoint[0] - newSize.width, anchorPoint[1]];

		if (point[0] > anchorPoint[0]) {
			newSize.width = minSize.width;
			newOrigin[0] = anchorPoint[0] - minSize.width;
		}

		if (point[1] < anchorPoint[1]) {
			newSize.height = minSize.height;
		}

		const newCrop = constrainCrop(
			{
				x: newOrigin[0],
				y: newOrigin[1],
				width: newSize.width,
				height: newSize.height,
				aspectRatio: newSize.width / newSize.height
			},
			layout
		);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop,
				},
			},
		});
	},
};

//NOTE: to get this working on touch devices for now we are just switching mouse events for pointer events
// I think the crop interaction could be improved upon for touch devices (ie. pinch to scale up/down), this is just a bandaid to keep us moving
export default {
	initial(formatting, layout) {
		const { crop } = formatting;

		if (!crop) {
			return formatting;
		}

		const { minSize, maxSize } = getSizingConstraints(crop, layout);

		const anchorPoint =
			crop.x != null && crop.y != null ? [crop.x, crop.y] : [0, 0];
		const focusPoint = [layout.canvas.width, layout.canvas.height];

		const newSize = getSizeFromPointToAnchor(
			focusPoint,
			anchorPoint,
			minSize,
			maxSize,
			crop.aspectRatio,
			crop.minAspectRatio,
			crop.maxAspectRatio,
			crop.aspectRatioLocked
		);

		const newCrop = constrainCrop(
			{
				width: newSize.width,
				height: newSize.height,
				aspectRatio: newSize.width / newSize.height,
				x:
					crop.x != null
						? crop.x
						: layout.canvas.width / 2 - newSize.width / 2,
				y:
					crop.y != null
						? crop.y
						: layout.canvas.height / 2 - newSize.height / 2,
			},
			layout
		);

		return {
			...formatting,
			crop: newCrop,
		};
	},

	listeners: ['onPointerMove', 'onPointerDown', 'onPointerUp', 'onPointerOut'],

	onPointerMove(e, {canvas, padding, formatting, layout, setEditorState}) {
		const { crop } = formatting;

		if (!crop) {
			return;
		}

		const point = getPointForEvent(e, canvas, padding);

		if (crop.action && ACTIONS[crop.action.name]) {
			return ACTIONS[crop.action.name](
				point,
				crop,
				crop.action,
				formatting,
				layout,
				setEditorState
			);
		}

		if (isInNWCorner(point, crop) || isInSECorner(point, crop)) {
			setEditorState({ cursor: 'nwse-resize' });
		} else if (isInNECorner(point, crop) || isInSWCorner(point, crop)) {
			setEditorState({ cursor: 'nesw-resize' });
		} else if (isInCrop(point, crop)) {
			setEditorState({ cursor: 'move' });
		} else {
			setEditorState({ cursor: null });
		}
	},

	onPointerDown(e, {canvas, padding, formatting, layout, setEditorState}) {
		const { crop } = formatting;

		if (!crop) {
			return;
		}

		const point = getPointForEvent(e, canvas, padding);

		let action;

		if (isInNWCorner(point, crop)) {
			action = {
				name: 'nwResize',
				anchorPoint: [crop.x + crop.width, crop.y + crop.height],
			};
		} else if (isInSECorner(point, crop)) {
			action = {
				name: 'seResize',
				anchorPoint: [crop.x, crop.y],
			};
		} else if (isInNECorner(point, crop)) {
			action = {
				name: 'neResize',
				anchorPoint: [crop.x, crop.y + crop.height],
			};
		} else if (isInSWCorner(point, crop)) {
			action = {
				name: 'swResize',
				anchorPoint: [crop.x + crop.width, crop.y],
			};
		} else if (isInCrop(point, crop)) {
			action = {
				name: 'move',
				lastPoint: point,
			};
		}

		if (action) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action,
					},
				},
			});
		}
	},

	onPointerUp(e, {formatting, layout, setEditorState}) {
		const { crop } = formatting;

		if (!crop) {
			return;
		}

		if (crop.action) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action: null,
					},
				},
			});
		}
	},

	onPointerOut(e, {formatting, layout, setEditorState}) {
		const { crop } = formatting;

		if (!crop) {
			return;
		}

		if (crop.action) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action: null,
					},
				},
			});
		}
	},
};
