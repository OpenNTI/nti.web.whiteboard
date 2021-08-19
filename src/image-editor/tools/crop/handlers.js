import { CORNER_RADIUS } from './constants';
import { getPointRelative, getNewCrop, constrainBox } from './utils';

function getPointForEvent(e, canvas, padding) {
	const { clientX, clientY } = e;
	const canvasRect = canvas.getBoundingClientRect();

	return [
		clientX - canvasRect.left - padding,
		clientY - canvasRect.top - padding,
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

function getSizingConstraints(crop, frame) {
	return {
		minSize: {
			width: Math.max(crop.minSize?.width ?? -Infinity, 14),
			height: Math.max(crop.minSize?.height ?? -Infinity, 14),
		},
		maxSize: {
			width: Math.min(crop.maxSize?.width ?? Infinity, frame.width),
			height: Math.min(crop.maxSize?.height ?? Infinity, frame.height),
		},
	};
}

function constrainCrop(crop, layout) {
	const deriveHeight = () => (crop.height = crop.width / crop.aspectRatio);

	const deriveWidth = () => (crop.width = crop.height * crop.aspectRatio);

	if (crop.x < 0) {
		crop.width = crop.width - crop.x;
		crop.x = 0;
		deriveHeight();
	}

	if (crop.y < 0) {
		crop.height = crop.height - crop.y;
		crop.y = 0;
		deriveWidth();
	}

	if (crop.x + crop.width > layout.canvas.width) {
		crop.width = layout.canvas.width - crop.x;
		deriveHeight();
	}

	if (crop.y + crop.height > layout.canvas.height) {
		crop.height = layout.canvas.height - crop.y;
		deriveWidth();
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
		const { anchorPoint } = action; //anchor is the se corner
		const { minSize, maxSize } = getSizingConstraints(
			crop,
			{ width: anchorPoint[0], height: anchorPoint[1] } //we can't get wider or taller than the distance from the origin to the anchor point
		);

		//if we've moved past the anchor, move the point we're computing from to inline with the anchor to avoid having the crop grow in the other direction
		const fixedPoint = [
			Math.min(point[0], anchorPoint[0]),
			Math.min(point[1], anchorPoint[1]),
		];

		const relativePoint = getPointRelative(fixedPoint, anchorPoint);

		const newSize = constrainBox(
			getNewCrop(relativePoint, [0, 0], crop),
			minSize,
			maxSize
		);

		const newOrigin = [
			anchorPoint[0] - newSize.width,
			anchorPoint[1] - newSize.height,
		];

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					x: newOrigin[0],
					y: newOrigin[1],
					width: newSize.width,
					height: newSize.height,
					aspectRatio: newSize.width / newSize.height,
				},
			},
		});
	},

	seResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action; //anchor is the nw corner
		const { minSize, maxSize } = getSizingConstraints(crop, {
			width: layout.image.width - anchorPoint[0], //we can't get any wider than the distance from the anchor point to the right side of the image
			height: layout.image.height - anchorPoint[1], //we can't get any taller than the distance from the anchor point to the bottom of the image
		});

		//if we've moved past the anchor, move the point we're computing to be inline with the anchor to avoid having the crop grow in the other direction
		const fixedPoint = [
			Math.max(point[0], anchorPoint[0]),
			Math.max(point[1], anchorPoint[1]),
		];

		const relativePoint = getPointRelative(fixedPoint, anchorPoint);

		const newSize = constrainBox(
			getNewCrop(relativePoint, [0, 0], crop),
			minSize,
			maxSize
		);

		const newOrigin = [anchorPoint[0], anchorPoint[1]];

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					x: newOrigin[0],
					y: newOrigin[1],
					width: newSize.width,
					height: newSize.height,
					aspectRatio: newSize.width / newSize.height,
				},
			},
		});
	},

	neResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action; // anchor is the sw corner
		const { minSize, maxSize } = getSizingConstraints(crop, {
			width: layout.image.width - anchorPoint[0], // we can't get any wider than the distance from the anchor point to the right side of the image
			height: anchorPoint[1], // we can't get taller than the distance from the origin to the anchor point
		});

		//if we've moved past the anchor point, move the point we're computing to be inline with the anchor to avoid having the crop grow in the other direction
		const fixedPoint = [
			Math.max(point[0], anchorPoint[0]),
			Math.min(point[1], anchorPoint[1]),
		];

		const relativePoint = getPointRelative(fixedPoint, anchorPoint);

		const newSize = constrainBox(
			getNewCrop(relativePoint, [0, 0], crop),
			minSize,
			maxSize
		);

		const newOrigin = [anchorPoint[0], anchorPoint[1] - newSize.height];

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					x: newOrigin[0],
					y: newOrigin[1],
					width: newSize.width,
					height: newSize.height,
					aspectRatio: newSize.width / newSize.height,
				},
			},
		});
	},

	swResize(point, crop, action, formatting, layout, setEditorState) {
		const { anchorPoint } = action; // anchor is the ne corner
		const { minSize, maxSize } = getSizingConstraints(crop, {
			width: anchorPoint[0], // we can't get any wider than the distance from origin to the anchor point
			height: layout.image.height - anchorPoint[1], // we can't get any taller than the distance from anchor point to the bottom of the image
		});

		//if we've moved past the anchor point, move the point we're computing to be inline with the anchor to avoid having the crop grow in the other direction
		const fixedPoint = [
			Math.min(point[0], anchorPoint[0]),
			Math.max(point[1], anchorPoint[1]),
		];

		const relativePoint = getPointRelative(fixedPoint, anchorPoint);

		const newSize = constrainBox(
			getNewCrop(relativePoint, [0, 0], crop),
			minSize,
			maxSize
		);

		const newOrigin = [anchorPoint[0] - newSize.width, anchorPoint[1]];

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					x: newOrigin[0],
					y: newOrigin[1],
					width: newSize.width,
					height: newSize.height,
					aspectRatio: newSize.width / newSize.height,
				},
			},
		});
	},
};

//NOTE: to get this working on touch devices for now we are just switching mouse events for pointer events
// I think the crop interaction could be improved upon for touch devices (ie. pinch to scale up/down), this is just a bandaid to keep us moving
export const handlers = {
	initial(formatting, layout) {
		const { crop } = formatting;

		if (!crop) {
			return formatting;
		}

		const { minSize, maxSize } = getSizingConstraints(crop, {
			width: layout.image.width,
			height: layout.image.height,
		});

		const anchorPoint =
			crop.x != null && crop.y != null ? [crop.x, crop.y] : [0, 0];
		const focusPoint = [layout.canvas.width, layout.canvas.height];

		const newSize = constrainBox(
			getNewCrop(anchorPoint, focusPoint, crop),
			minSize,
			maxSize
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

	listeners: [
		'onPointerMove',
		'onPointerDown',
		'onPointerUp',
		'onPointerOut',
	],

	onPointerMove(e, { canvas, padding, formatting, layout, setEditorState }) {
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

	onPointerDown(e, { canvas, padding, formatting, layout, setEditorState }) {
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

	onPointerUp(e, { formatting, layout, setEditorState }) {
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

	onPointerOut(e, { formatting, layout, setEditorState }) {
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
