import React from 'react';
import PropTypes from 'prop-types';
import {Color} from '@nti/lib-commons';

import * as SolidColorImage from '../../../solid-color-image';

import {Name} from './Constant';

const DefaultColor = {
	color: Color.fromHex('#3fb3f6')
};

export default class CommunityAssetSolidColorImageEditor extends React.Component {
	static Name = Name;
	static propTypes = {
		value: PropTypes.shape({
			original: PropTypes.string,
			updated: PropTypes.object
		}),
		onChange: PropTypes.func
	}


	onChange = (solidColorState) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(solidColorState);
		}
	}

	render () {
		const {value} = this.props;
		const {original, updated} = value || {};

		return (
			<SolidColorImage.Editor value={updated || original || DefaultColor} onChange={this.onChange} />
		);
	}
}
