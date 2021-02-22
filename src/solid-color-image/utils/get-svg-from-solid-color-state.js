import { Color } from '@nti/lib-commons';

import { SVG_IDENTIFIER } from '../Constants';

export default function getSVGFromSolidColorState(
	editorState,
	aspectRatio = 1
) {
	const color =
		(editorState && editorState.color) || Color.fromRGB(255, 255, 255);
	const fill = color.rgb.toString();
	const width = 100;
	const height = width / aspectRatio;

	return `<?xml version="1.0" encoding="UTF-8"?>
		${SVG_IDENTIFIER}
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" x="0" y="0" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMinYMin slice">
		 <rect width="100%" height="100%" fill="${fill}"/>
		</svg>
	`;
}
