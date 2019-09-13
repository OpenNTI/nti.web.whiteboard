import {Color} from '@nti/lib-commons';

import {SVG_IDENTIFIER} from '../Constants';

export default function getSVGFromSolidColorState (editorState) {
	const color = (editorState && editorState.color) || Color.fromRGB(255, 255, 255);
	const fill = color.rgb.toString();

	return `
		${SVG_IDENTIFIER}
		<?xml version="1.0" encoding="UTF-8"?>
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
		 <rect width="100%" height="100%" fill="${fill}"/>
		</svg>
	`;
}