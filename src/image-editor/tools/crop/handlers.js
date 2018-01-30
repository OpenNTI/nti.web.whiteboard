import {CORNER_RADIUS} from './Constants';

function getRelativePoint (point, canvas) {
	const rect = canvas.getBoundingClientRect();

	return [
		point[0] - rect.left,
		point[1] - rect.top
	];
}

function getPointForEvent (e, canvas) {
	const {clientX:eventX, clientY:eventY} = e;

	return getRelativePoint([eventX, eventY], canvas);
}

function isInCrop (point, crop) {
	return (
		point[0] >= crop.x &&
		point[0] <= (crop.x + crop.width) &&
		point[1] >= crop.y &&
		point[1] <= (crop.y + crop.height)
	);
}

function getDistance (a, b) {
	const diffX = a[0] - b[0];
	const diffY = a[1] - b[1];

	return Math.sqrt((diffX * diffX) + (diffY * diffY));
}

function isWithInDistance (a, b, distance) {
	const dist = getDistance(a, b);

	return dist <= distance;
}

function isInNWCorner (point, crop) {
	const corner = [crop.x, crop.y];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function isInNECorner (point, crop) {
	const corner = [crop.x + crop.width, crop.y];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function isInSECorner (point, crop) {
	const corner = [crop.x + crop.width, crop.y + crop.height];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function isInSWCorner (point, crop) {
	const corner = [crop.x , crop.y + crop.height];

	return isWithInDistance(point, corner, CORNER_RADIUS);
}

function fitHeightToRatio (size, ratio, minSize, maxSize) {
	const getHeight = width => Math.ceil(width / ratio);

	let fixedSize = {width: size.width, height: getHeight(size.width)};

	while (fixedSize.height > maxSize.heigth) {
		fixedSize.width -= 1;
		fixedSize.height = getHeight(fixedSize.width);
	}

	return fixedSize;
}

function fitWidthToRatio (size, ratio, minSize, maxSize) {
	const getWidth = height => Math.ceil(height * ratio);

	let fixedSize = {width: getWidth(size.height), height: size.height};

	while (fixedSize.width > maxSize.width) {
		fixedSize.height -= 1;
		fixedSize.width = getWidth(fixedSize.height);
	}

	return fixedSize;
}

function fitSizeToRatio (size, ratio, minSize, maxSize) {
	//if the size already fits the ratio don't do anything
	if (size.width / size.height === ratio) { return size; }

	const desiredLength = getDistance([0, 0], [size.width, size.height]);

	const fixedForHeight = fitHeightToRatio(size, ratio, minSize, maxSize);
	const fixedForWidth = fitWidthToRatio(size, ratio, minSize, maxSize);

	const heightDistance = getDistance([0, 0], [fixedForHeight.width, fixedForHeight.height]);
	const widthDistance = getDistance([0, 0], [fixedForWidth.width, fixedForWidth.height]);

	const heightDiff = Math.abs(desiredLength - heightDistance);
	const widthDiff = Math.abs(desiredLength - widthDistance);

	return heightDiff > widthDiff ? fixedForWidth : fixedForHeight;
}

function getSizeFromPointToAnchor (point, anchor, minSize, maxSize, aspectRatio) {
	const diffX = Math.abs(point[0] - anchor[0]);
	const diffY = Math.abs(point[1] - anchor[1]);

	const clamp = (d, min, max) => Math.min(Math.max(d, min), max);

	const size = {
		width: clamp(diffX, minSize.width, maxSize.width),
		height: clamp(diffY, minSize.height, maxSize.height)
	};

	return aspectRatio ? fitSizeToRatio(size, aspectRatio, minSize, maxSize) : size;
}


function getSizingConstraints (crop, layout) {
	return {
		minSize: crop.minSize || {width: 14, height: 14},
		maxSize: crop.maxSize || {width: layout.image.width, height: layout.image.height}
	};
}

function constrainCrop (crop, layout) {
	if (crop.x < layout.canvas.padding) {
		crop.width = crop.width - (layout.canvas.padding - crop.x);
		crop.x = layout.canvas.padding;
	}

	if (crop.y < layout.canvas.padding) {
		crop.height = crop.height - (layout.canvas.padding - crop.y);
		crop.y = layout.canvas.padding;
	}

	if (crop.x + crop.width > layout.canvas.width - layout.canvas.padding) {
		crop.width = (layout.canvas.width - layout.canvas.padding) - crop.x;
	}

	if (crop.y + crop.height > layout.canvas.height - layout.canvas.padding) {
		crop.height = (layout.canvas.height - layout.canvas.padding) - crop.y;
	}

	return crop;
}



const ACTIONS = {
	move (point, crop, action, formatting, layout, setEditorState) {
		const {lastPoint} = action;
		const xDiff = point[0] - lastPoint[0];
		const yDiff = point[1] - lastPoint[1];

		let newX = crop.x + xDiff;

		if (newX < layout.canvas.padding) {
			newX = layout.canvas.padding;
		}

		if (newX + crop.width > layout.canvas.width - layout.canvas.padding) {
			newX = layout.canvas.width - layout.canvas.padding - crop.width;
		}

		let newY = crop.y + yDiff;

		if (newY < layout.canvas.padding) {
			newY = layout.canvas.padding;
		}

		if (newY + crop.height > layout.canvas.height - layout.canvas.padding) {
			newY = layout.canvas.height - layout.canvas.padding - crop.height;
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
						lastPoint: point
					}
				}
			}
		});
	},


	nwResize (point, crop, action, formatting, layout, setEditorState) {
		const {anchorPoint} = action;

		const {minSize, maxSize} = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(point, anchorPoint, minSize, maxSize, crop.aspectRatio);
		const newOrigin = [anchorPoint[0] - newSize.width, anchorPoint[1] - newSize.height];

		//If we've dragged pass the anchor don't start getting bigger
		if (point[0] > anchorPoint[0]) {
			newSize.width = minSize.width;
			newOrigin[0] = anchorPoint[0] - minSize.width;
		}

		if (point[1] > anchorPoint[1]) {
			newSize.height = minSize.height;
			newOrigin[1] = anchorPoint[1] - minSize.height;
		}

		const newCrop = constrainCrop({
			x: newOrigin[0],
			y: newOrigin[1],
			width: newSize.width,
			height: newSize.height
		}, layout);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop
				}
			}
		});
	},


	seResize (point, crop, action, formatting, layout, setEditorState) {
		const {anchorPoint} = action;

		const {minSize, maxSize} = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(point, anchorPoint, minSize, maxSize, crop.aspectRatio);
		const newOrigin = [anchorPoint[0], anchorPoint[1]];

		if (point[0] < anchorPoint[0]) {
			newSize.width = minSize.width;
		}

		if (point[1] < anchorPoint[1]) {
			newSize.height = minSize.height;
		}

		const newCrop = constrainCrop({
			x: newOrigin[0],
			y: newOrigin[1],
			width: newSize.width,
			height: newSize.height
		}, layout);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop
				}
			}
		});
	},


	neResize (point, crop, action, formatting, layout, setEditorState) {
		const {anchorPoint} = action;

		const {minSize, maxSize} = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(point, anchorPoint, minSize, maxSize, crop.aspectRatio);
		const newOrigin = [anchorPoint[0], anchorPoint[1] - newSize.height];

		if (point[0] < anchorPoint[0]) {
			newSize.width = minSize.width;
		}

		if (point[1] > anchorPoint[1]) {
			newSize.height = minSize.height;
			newOrigin[1] = anchorPoint[1] - minSize.height;
		}

		const newCrop = constrainCrop({
			x: newOrigin[0],
			y: newOrigin[1],
			width: newSize.width,
			height: newSize.height
		}, layout);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop
				}
			}
		});
	},


	swResize (point, crop, action, formatting, layout, setEditorState) {
		const {anchorPoint} = action;

		const {minSize, maxSize} = getSizingConstraints(crop, layout);

		const newSize = getSizeFromPointToAnchor(point, anchorPoint, minSize, maxSize, crop.aspectRatio);
		const newOrigin = [anchorPoint[0] - newSize.width, anchorPoint[1]];

		if (point[0] > anchorPoint[0]) {
			newSize.width = minSize.width;
			newOrigin[0] = anchorPoint - minSize.width;
		}

		if (point[1] < anchorPoint[1]) {
			newSize.height = minSize.height;
		}

		const newCrop = constrainCrop({
			x: newOrigin[0],
			y: newOrigin[1],
			width: newSize.width,
			height: newSize.height
		}, layout);

		setEditorState({
			formatting: {
				...formatting,
				crop: {
					...crop,
					...newCrop
				}
			}
		});
	}
};



export default {
	initial (formatting, layout) {
		const {crop} = formatting;

		if (!crop) { return formatting; }

		const {minSize, maxSize} = getSizingConstraints(crop, layout);

		const anchorPoint = crop.x != null && crop.y != null ? [crop.x, crop.y] : [0, 0];
		const focusPoint = [layout.canvas.width, layout.canvas.height];

		const newSize = getSizeFromPointToAnchor(focusPoint, anchorPoint, minSize, maxSize, crop.aspectRatio);

		const newCrop = constrainCrop({
			width: newSize.width,
			height: newSize.height,
			x: crop.x != null ? crop.x : (layout.canvas.width / 2) - (newSize.width / 2),
			y: crop.y != null ? crop.y : (layout.canvas.height / 2)  - (newSize.height / 2)
		}, layout);

		return {
			...formatting,
			crop: newCrop
		};
	},

	onMouseMove (e, canvas, formatting, layout, setEditorState) {
		const {crop} = formatting;

		if (!crop) { return; }

		const point = getPointForEvent(e, canvas);

		if (crop.action && ACTIONS[crop.action.name]) {
			return ACTIONS[crop.action.name](point, crop, crop.action, formatting, layout, setEditorState);
		}

		if (isInNWCorner(point, crop) || isInSECorner(point, crop)) {
			setEditorState({cursor: 'nwse-resize'});
		} else if (isInNECorner(point, crop) || isInSWCorner(point, crop)) {
			setEditorState({cursor: 'nesw-resize'});
		} else if (isInCrop(point, crop)) {
			setEditorState({cursor: 'move'});
		} else {
			setEditorState({cursor: null});
		}
	},


	onMouseDown (e, canvas, formatting, layout, setEditorState) {
		const {crop} = formatting;

		if (!crop) { return; }

		const point = getPointForEvent(e, canvas);

		let action;

		if (isInNWCorner(point, crop)) {
			action = {
				name: 'nwResize',
				anchorPoint: [crop.x + crop.width, crop.y + crop.height]
			};

		} else if (isInSECorner(point, crop)) {
			action = {
				name: 'seResize',
				anchorPoint: [crop.x, crop.y]
			};
		} else if (isInNECorner(point, crop)) {
			action = {
				name: 'neResize',
				anchorPoint: [crop.x, crop.y + crop.height]
			};
		} else if (isInSWCorner(point, crop)) {
			action = {
				name: 'swResize',
				anchorPoint: [crop.x + crop.width, crop.y]
			};
		} else if (isInCrop(point, crop)) {
			action = {
				name: 'move',
				lastPoint: point
			};
		}


		if (action) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action
					}
				}
			});
		}
	},


	onMouseUp (e, canvas, formatting, layout, setEditorState) {
		const {crop} = formatting;

		if (!crop) { return; }

		if (crop.action) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action: null
					}
				}
			});
		}
	},


	onMouseOut (e, canvas, formatting, layout, setEditorState) {
		const {crop} = formatting;

		if (!crop) { return; }

		if (crop.action) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action: null
					}
				}
			});
		}
	}
};
