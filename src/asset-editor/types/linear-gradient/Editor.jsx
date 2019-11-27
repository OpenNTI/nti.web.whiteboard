import React from 'react';
import PropTypes from 'prop-types';
import {Color} from '@nti/lib-commons';

import * as LinearGradientImage from '../../../linear-gradient-image';

import {Name} from './Constant';

const DefaultGradient = {
	rotation: '-45',
	stops: [
		{color: Color.fromHex('#3fb3f6'), offset: '0%'},
		{color: Color.fromHex('#fff'), offset: '100%'}
	]
};

export default class CommunityAssetLinearGradientImageEditor extends React.Component {
	static Name = Name;

	static propTypes = {
		value: PropTypes.shape({
			original: PropTypes.string,
			updated: PropTypes.object
		}),
		onChange: PropTypes.func
	}

	onChange = (linearGradientState) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(linearGradientState);
		}
	}

	render () {
		const {value} = this.props;
		const {original, updated} = value || {};

		return (
			<LinearGradientImage.Editor value={updated || original || DefaultGradient} onChange={this.onChange}/>
		);
	}
}
