import {SVG_IDENTIFIER} from '../Constants';


function printStops (gradientObject) {
	return gradientObject.stops
		.map(stop => `<stop offset="${stop.offset}" stop-color="${stop.color.hex.toString()}" />`)
		.join('');
}

export default function GradientObjectToSvg (gradientObject, aspectRatio = 1) {
	const width = 100;
	const height = width / aspectRatio;

	return `<?xml version="1.0" encoding="UTF-8"?>
		${SVG_IDENTIFIER}
		<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" x="0" y="0" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMinYMin slice">
			<defs>
				<linearGradient id="Gradient" gradientTransform="rotate(${gradientObject.rotation || '0'})" viewBox="0 0 10 1">
					${printStops(gradientObject)}
				</linearGradient>
			</defs>
			<rect x="0" y="0" height="100%" width="100%"  fill="url(#Gradient)" />
		</svg>
	`;

}
