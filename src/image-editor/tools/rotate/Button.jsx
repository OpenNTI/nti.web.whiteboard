import React from 'react';
import PropTypes from 'prop-types';

import control from './control';

export default class RotateButton extends React.Component {
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
			<div className="nti-image-editor-rotate-button" onClick={this.onClick}>
				Rotate
			</div>
		);
	}
}
