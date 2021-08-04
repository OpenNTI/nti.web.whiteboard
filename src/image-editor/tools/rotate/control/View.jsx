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

function setRotateDegrees(editorState, degrees, anticlockwise) {
	const widthCanvas = editorState?.layout?.canvas.width;
	const heightCanvas = editorState?.layout?.canvas.height;
	const {
		formatting: { crop },
	} = editorState;
	let newX, newY;

	/**
	 * The code below is responsible for making sure that we crop the same area while rotating.
	 * If you want to understand it, I suggest you draw a set of coordinates and test it for
	 * yourself. This breaks the separation of concerns for the tools, but oh well.
	 */
	if (anticlockwise) {
		newX = widthCanvas - (crop.x + crop.width);
		newY = crop.y;
	} else {
		newX = heightCanvas - (crop.y + crop.height);
		newY = crop.x;
	}

	return {
		...(editorState || {}),
		layout: {
			...editorState?.layout,
			canvas: {
				...editorState?.layout?.canvas,
				width: heightCanvas,
				height: widthCanvas,
			},
		},
		formatting: {
			...((editorState && editorState.formatting) || {}),
			crop: {
				...crop,
				x: newX,
				y: newY,
				height: crop.width,
				width: crop.height,
			},
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
		setEditorState(
			setRotateDegrees(editorState, (degrees + 270) % 360, true)
		);
	};

	return (
		<Control label={t('label')}>
			<Button
				onClick={rotateAnticlockwise}
				data-testid="rotate-anti-btn"
				secondary
			>
				<AnticlockwiseIcon />
			</Button>
			<Button
				onClick={rotateClockwise}
				data-testid="rotate-btn"
				secondary
			>
				<ClockwiseIcon />
			</Button>
		</Control>
	);
}
