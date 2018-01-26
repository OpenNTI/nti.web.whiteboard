import React from 'react';
import PropTypes from 'prop-types';

export default class RotateControl extends React.Component {
	static propTypes = {
		setEditorState: PropTypes.func,
		formatting: PropTypes.object,
		setActiveControl: PropTypes.func,
		onImgChange: PropTypes.func,
		image: PropTypes.object
	}

	onDone = () => {
		const { setActiveControl } = this.props;

		setActiveControl && setActiveControl(null);
	}

	doRotation (clockwise) {
		const { onImgChange, image } = this.props;

		const c = document.createElement('canvas'),
			ctx = c.getContext('2d');

		c.width = image.height;
		c.height = image.width;

		ctx.rotate((clockwise ? 1 : -1) * Math.PI / 2);
		ctx.drawImage(image, clockwise ? 0 : -(image.width), clockwise ? -(image.height) : 0);
		const src = c.toDataURL('image/png');

		const img = new Image();

		img.onload = () => {
			onImgChange && onImgChange(img);
		};

		img.src = src;
	}

	onRotateClockwise = (e) => {
		this.doRotation(true);
	}

	onRotateCounterclockwise = (e) => {
		this.doRotation(false);
	}

	render () {
		return (
			<div>
				<div className="rotate-button" onClick={this.onRotateClockwise}>Rotate clockwise 90 degrees</div>
				<div className="rotate-button" onClick={this.onRotateCounterclockwise}>Rotate counter-clockwise 90 degrees</div>
				<div className="rotate-done" onClick={this.onDone}>Done</div>
			</div>
		);
	}
}
