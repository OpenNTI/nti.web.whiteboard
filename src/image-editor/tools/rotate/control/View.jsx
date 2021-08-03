import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Button } from '@nti/web-commons';

import Control from '../../../tool-bar/Control';

const t = scoped('nti-web-whiteboard.image-editor.tools.rotate.control.View', {
	label: 'Rotate',
});

const ClockwiseIcon = styled.span`
	background-image: url('./assets/rotate.png');
	width: 15px;
	height: 15px;
	display: block;
	background-repeat: no-repeat;
	background-position: center;
`;

const AnticlockwiseIcon = styled(ClockwiseIcon)`
	transform: scaleX(-1);
`;

function getRotateDegrees(editorState) {
	return editorState?.formatting?.rotate?.degrees;
}

function setRotateDegrees(editorState, degrees) {
	const vertical = degrees === 90 || degrees === 270;

	const width = editorState?.layout?.image.width;
	const height = editorState?.layout?.image.height;

	return {
		...(editorState || {}),
		layout: {
			...editorState?.layout,
			canvas: {
				...editorState?.layout?.canvas,
				width: vertical ? height : width,
				height: vertical ? width : height,
			},
		},
		formatting: {
			...((editorState && editorState.formatting) || {}),
			rotate: {
				...((editorState &&
					editorState.formatting &&
					editorState.formatting.rotate) ||
					{}),
				degrees,
			},
		},
	};
}

RotateControl.Name = 'Rotate';
RotateControl.propTypes = {
	editorState: PropTypes.object,
	setEditorState: PropTypes.func,
};
export default function RotateControl({ editorState, setEditorState }) {
	const degrees = getRotateDegrees(editorState) || 0;

	const rotateClockwise = () => {
		setEditorState(setRotateDegrees(editorState, (degrees + 90) % 360));
	};

	const rotateAnticlockwise = () => {
		setEditorState(setRotateDegrees(editorState, (degrees + 270) % 360));
	};

	return (
		<Control label={t('label')}>
			<Button onClick={rotateAnticlockwise} secondary>
				<AnticlockwiseIcon />
			</Button>
			<Button onClick={rotateClockwise} secondary>
				<ClockwiseIcon />
			</Button>
		</Control>
	);
}
