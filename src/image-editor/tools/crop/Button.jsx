import React from 'react';
import PropTypes from 'prop-types';

import control from './control';

export default class CropButton extends React.Component {
	static propTypes = {
		setActiveControl: PropTypes.func
	}

	onClick = () => {
		const {setActiveControl} = this.props;

		if (setActiveControl) {
			setActiveControl(control);
		}
	}


	render () {
		return (
			<div className="nti-image-editor-crop-button" onClick={this.onClick}>
				Crop
			</div>
		);
	}
}
