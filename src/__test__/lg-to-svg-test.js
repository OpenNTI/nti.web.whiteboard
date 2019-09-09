/* eslint-env jest */
const lgObjectToSvg = require('../image-editor/utils/lg-object-to-svg');

linearGradientUtilTest('Show Tests Working', () => {

	test('json object to svg string', () => {

		const svgString = "\n        <!-- nti-linear-gradient -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n                <linearGradient id=\"Gradient\" gradientTransform=\"rotate(0)\" viewBox=\"0 0 10 1\"><stop offset=\"0%\" stopColor=\"#73352d\"/><stop offset=\"100%\" stopColor=\"#10fe02\"/></linearGradient>\n            </defs>\n            <rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\"  fill=\"url(#Gradient)\" />\n        </svg>";
		const lgObject = {"rotation":"rotate(0)","stops":[{"offset":"0%","stopcolor":"#73352d"},{"offset":"100%","stopcolor":"#10fe02"}]};

		expect(lgObjectToSvg(lgObject) === svgString).toBeTruthy();

	});

});

