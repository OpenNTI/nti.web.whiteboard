import {CORNER_RADIUS} from './Constants';

function getRelativePoint (point, canvas) {
	const rect = canvas.getBoundingClientRect();

	return [
		point[0] - rect.left,
		point[1] - rect.top
	];
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



export default {
	onMouseMove (e, canvas, formatting, setEditorState) {
		const {crop} = formatting;

		if (!crop) { return; }

		const {clientX:eventX, clientY:eventY} = e;
		const point = getRelativePoint([eventX, eventY], canvas);

		if (isInNWCorner(point, crop) || isInSECorner(point, crop)) {
			setEditorState({cursor: 'nwse-resize'});
		} else if (isInNECorner(point, crop) || isInSWCorner(point, crop)) {
			setEditorState({cursor: 'nesw-resize'});
		} else if (isInCrop(point, crop)) {
			setEditorState({cursor: 'move'});
		} else {
			setEditorState({cursor: null});
		}
	}
};
