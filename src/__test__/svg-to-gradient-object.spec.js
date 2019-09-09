/* eslint-env jest */
import svgToGradientObject from '../image-editor/utils/svg-to-gradient-object';

describe('Show Tests Working', () => {

	test('svg string to json object', () => {

		const svgString = "<!-- nti-linear-gradient --><svg xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"Gradient\" gradientTransform=\"rotate(0)\" viewBox=\"0 0 10 1\"><stop offset=\"0%\" stopColor=\"#ff8e2a\"/><stop offset=\"100%\" stopColor=\"rbg(0, 0, 0)\"/></linearGradient></defs><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\"  fill=\"url(#Gradient)\" /></svg>";
		const gradientObject = {"rotation":"rotate(0)","stops":[{"offset":"0%","stopcolor":"#ff8e2a"},{"offset":"100%","stopcolor":"rbg(0, 0, 0)"}]};

		expect(svgToGradientObject(svgString)).toMatchObject(gradientObject);

	});


});
