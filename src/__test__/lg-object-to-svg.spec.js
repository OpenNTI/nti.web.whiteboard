/* eslint-env jest */
import lgObjectToSvg from '../image-editor/utils/lg-object-to-svg';

describe('Show Tests Working', () => {

	test('json object to svg string', () => {

		const svgString = "<!-- nti-linear-gradient --><svg xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"Gradient\" gradientTransform=\"rotate(0)\" viewBox=\"0 0 10 1\"><stop offset=\"0%\" stopColor=\"#ff8e2a\"/><stop offset=\"100%\" stopColor=\"rbg(0, 0, 0)\"/></linearGradient></defs><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\"  fill=\"url(#Gradient)\" /></svg>";
		const lgObject = {"rotation":"rotate(0)","stops":[{"offset":"0%","stopcolor":"#ff8e2a"},{"offset":"100%","stopcolor":"rbg(0, 0, 0)"}]};

		expect(lgObjectToSvg(lgObject) === svgString).toBeTruthy();

	});

});

