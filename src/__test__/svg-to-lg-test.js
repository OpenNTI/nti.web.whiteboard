/* eslint-env jest */
const svgToLgObject = require('../image-editor/utils/svg-to-lg-object');

linearGradientUtilTest('Show Tests Working', () => {

	test('svg string to json object', () => {

		const svgString = "\n        <!-- nti-linear-gradient -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n                <linearGradient id=\"Gradient\" gradientTransform=\"rotate(0)\" viewBox=\"0 0 10 1\"><stop offset=\"0%\" stopColor=\"#73352d\"/><stop offset=\"100%\" stopColor=\"#10fe02\"/></linearGradient>\n            </defs>\n            <rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\"  fill=\"url(#Gradient)\" />\n        </svg>";
		const lgObject = {"rotation":"rotate(0)","stops":[{"offset":"0%","stopcolor":"#73352d"},{"offset":"100%","stopcolor":"#10fe02"}]};

		expect(JSON.stringify(svgToLgObject(svgString)) === JSON.stringify(lgObject)).toBeTruthy();

	});

});
