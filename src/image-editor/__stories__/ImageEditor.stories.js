import React, { useCallback, useRef, useState } from 'react';

import { Editor, getImageForEditorState } from '../index.js';

const formatting = {
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
};

export default {
	title: 'Image Editor',
	component: Editor,
	argTypes: {
		// allowedControls: {
		//
		// }
	},
};

stylesheet`
canvas {
	width: 600px;
	height: 500px;
}
`;

export const ImageEditor = props => {
	const ref = useRef();
	const [src, setSrc] = useState(null);
	const onChange = useCallback(editorState => {
		cancelAnimationFrame(ref.current);
		ref.current = requestAnimationFrame(async () => {
			try {
				const img = getImageForEditorState(editorState);
				setSrc((await img)?.src);
			} catch (e) {
				// eslint-disable-next-line no-console
				console.debug(e?.stack || e);
			}
		});
	}, []);

	return (
		<div>
			<div>
				<h1>Editor</h1>
				<Editor
					editorState={{ formatting }}
					onChange={onChange}
					allowedControls={['Blur', 'Darken', 'Crop', 'Rotate']}
					{...props}
				/>
			</div>
			<div>
				<h1>Result</h1>
				{src && (
					<img
						src={src}
						style={{
							margin: '0 auto',
							display: 'block',
							border: '1px solid red',
						}}
					/>
				)}
			</div>
		</div>
	);
};
