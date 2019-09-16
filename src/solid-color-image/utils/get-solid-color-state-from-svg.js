import {Color} from '@nti/lib-commons';

import {SVG_IDENTIFIER} from '../Constants';

export default function getSolidColorStateFromSVG (svg) {
	if (!svg) { return null; }
	if (svg.indexOf(SVG_IDENTIFIER) === -1) { return null; }

	const scratch = document.createElement('div');

	scratch.innerHTML = svg;
	
	const rect = scratch.querySelector('rect');
	const fill = rect && rect.getAttribute('fill');

	return fill ? {color: Color(fill)} : null;
}