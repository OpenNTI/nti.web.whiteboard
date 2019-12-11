import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Image, Text, Button} from '@nti/web-commons';

import * as ImageEditor from '../../../image-editor';

import {Name} from './Constants';
import Styles from './Editor.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.image.Editor', {
	change: 'Change'
});


export default class CommunityAssetImageEditor extends React.Component {
	static Name = Name;
	static propTypes = {
		format: PropTypes.object,
		aspectRatio: PropTypes.number,
		value: PropTypes.shape({
			original: PropTypes.string,
			updated: PropTypes.object
		}),
		onChange: PropTypes.func
	}

	startUpdate = () => {
		const {format} = this.props;

		this.onUpdate(ImageEditor.getEditorState(null, format));
	}

	onUpdate = (editorState) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(editorState);
		}
	}


	render () {
		const {value, aspectRatio} = this.props;
		const {original, updated} = value || {};

		return (
			<div className={cx('community-image-editor')}>
				{!updated && (
					<Image.Container aspectRatio={aspectRatio} className={cx('community-image')}>
						<Image src={original} className={cx('community-image')} />
					</Image.Container>
				)}
				{!updated && (
					<Button className={cx('change-asset')} onClick={this.startUpdate}>
						<i className={cx('icon-image')} />
						<Text.Base className={cx('change')}>{t('change')}</Text.Base>
					</Button>
				)}
				{updated && (
					<div className={cx('image-editor-wrapper')}>
						<ImageEditor.Editor
							editorState={updated}
							onChange={this.onUpdate}
							allowedControls={[
								ImageEditor.Editor.Controls.Blur,
								ImageEditor.Editor.Controls.Darken
							]}
						/>
					</div>
				)}
			</div>
		);
	}
}