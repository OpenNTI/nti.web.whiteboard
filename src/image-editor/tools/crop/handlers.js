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

function isWithInDistance (a, b, distance) {
	const diffX = a[0] - b[0];
	const diffY = a[1] - b[1];

	const dist = Math.sqrt((diffX * diffX) + (diffY * diffY));

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
	}
};



export default {
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

		if (isInCrop(point, crop)) {
			setEditorState({
				formatting: {
					...formatting,
					crop: {
						...crop,
						action: {
							name: 'move',
							lastPoint: point
						}
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
