import React from 'react';

import { useReducerState } from '@nti/web-commons';

import { Editor, getImageForEditorState } from '../index.js';

export default {
	title: 'Image Editor',
	component: Editor,
};

const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	max-width: 100vw;
	margin: 0 auto;
`;

export const ImageEditor = () => {
	const [{ editorState, src }, dispatch] = useReducerState({
		editorState: {
			formatting: {
				crop: {
					width: 70,
					height: 70,
					minSize: {
						height: 70,
						width: 70,
					},
					maxSize: {
						height: 70,
						width: 300,
					},
				},
			},
		},
		src: null,
	});
	const onChange = editorState => {
		dispatch({ editorState, src: null });
		(async () => {
			try {
				const img = getImageForEditorState(editorState);
				dispatch({ src: (await img)?.src });
			} catch (e) {
				// eslint-disable-next-line no-console
				console.debug(e?.stack || e);
			}
		})();
	};

	// const transform = `scale(${1 / editorState?.layout?.image?.scale || 1})`;
	const width = Math.round(editorState?.formatting?.crop?.width);

	return (
		<Column>
			<h1>Editor</h1>
			<div>
				<Editor
					editorState={editorState}
					onChange={onChange}
					allowedControls={['Blur', 'Darken', 'Crop', 'Rotate']}
				/>
			</div>

			<h1>Result</h1>
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: center;
				`}
			>
				{src && (
					<img
						src={src}
						width={width}
						css={css`
							border: 1px solid red;
						`}
					/>
				)}
			</div>
		</Column>
	);
};
