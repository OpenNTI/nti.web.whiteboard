import {Color} from '@nti/lib-commons';

import {SVG_IDENTIFIER} from '../Constants';

const RotateRegex = /^rotate\((.*)\)$/;

function getRotationFromTransform (transform) {
	const matches = transform.match(RotateRegex);

	return matches[0];
}

function getColorSafe (value) {
	try {
		return Color(value);
	} catch (e) {
		return Color.fromRGB(255, 255, 255);
	}
}

export default function SvgToGradientObject (svg) {
	if (!svg) { return null; }
	if (svg.indexOf(SVG_IDENTIFIER) === -1) { return null; }

	const temp = document.createElement('div');
	temp.innerHTML = svg;

	//get the rotation
	const gradient = temp.querySelector('linearGradient');
	const transform = gradient.getAttribute('gradientTransform');
	const rotation = getRotationFromTransform(transform);

	//make list of stops and add to json
	const nodelist = temp.querySelectorAll('stop');
	const stops = Array.from(nodelist).map((stop) => {
		return {
			offset: stop.getAttribute('offset'),
			color: getColorSafe(stop.getAttribute('stop-color'))
		};
	});

	return {
		rotation,
		stops
	};
}
