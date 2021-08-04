/* eslint-env jest */

import { fireEvent, render } from '@testing-library/react';

import Control from '../control';

test('Rotate Control Test', () => {
	const editorState = {
		layout: {
			canvas: {
				width: 200,
				height: 300,
			},
		},
		formatting: {
			crop: {
				x: 0,
				y: 0,
				height: 50,
				width: 50,
			},
			rotate: {
				degrees: 0,
			},
		},
	};

	let newEditorState = {};

	const setEditorState = jest.fn().mockImplementation(editorStateArg => {
		newEditorState = editorStateArg;
	});

	const component = render(
		<Control editorState={editorState} setEditorState={setEditorState} />
	);

	fireEvent.click(component.getByTestId('rotate-btn'));

	expect(setEditorState).toHaveBeenCalled();
	expect(newEditorState).toEqual({
		layout: {
			canvas: {
				width: 300,
				height: 200,
			},
		},
		formatting: {
			crop: {
				x: 250,
				y: 0,
				height: 50,
				width: 50,
			},
			rotate: {
				degrees: 90,
			},
		},
	});

	fireEvent.click(component.getByTestId('rotate-anti-btn'));

	expect(setEditorState).toHaveBeenCalledTimes(2);
	expect(newEditorState).toEqual({
		layout: {
			canvas: {
				width: 300,
				height: 200,
			},
		},
		formatting: {
			crop: {
				x: 0,
				y: 150,
				height: 50,
				width: 50,
			},
			rotate: {
				degrees: 270,
			},
		},
	});
});
