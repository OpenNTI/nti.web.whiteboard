import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';
import {Button, Image, Text} from '@nti/web-commons';

import * as ImageEditor from '../../../image-editor';
import TypeButton from '../../components/TypeButton';

import Styles from './View.css';

const ID = 'image';
const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.image.View', {
	name: 'Image',
	change: 'Change'
});

function EditButton (props) {
	return (
		<TypeButton
			{...props}
			id={ID}
			label={t('name')}
			iconClassName={cx('image-icon')}
			activeIconClassName={cx('image-icon-active')}
		/>
	);
}

AssetImageEditor.id = ID;
AssetImageEditor.Button = EditButton;
AssetImageEditor.getStateForAsset = (url) => {
	return {
		original: url,
		updated: null
	};
};
AssetImageEditor.getPayload = async ({updated}) => {
	const blob = await ImageEditor.getBlobForEditorState(updated);

	return blob;
};
AssetImageEditor.propTypes = {
	value: PropTypes.shape({
		original: PropTypes.string,
		updated: PropTypes.object
	}),
	onChange: PropTypes.func,
	format: PropTypes.object
};
export default function AssetImageEditor ({value, onChange, format}) {
	const {original, updated} = value || {};
	const aspectRatio = format?.crop?.aspectRatio;
	const empty = !original;

	const editorState = updated || (empty ? ImageEditor.getEditorState(null, format) : null);

	const startUpdate = () => {
		onChange({
			...value,
			updated: ImageEditor.getEditorState(null, format)
		});
	};

	const onUpdate = (editorState) => {
		onChange({
			...value,
			updated: editorState
		});
	};


	return (
		<div className={cx('image-editor')}>
			{!editorState && (
				<Image.Container aspectRatio={aspectRatio} className={cx('image-container')}>
					<Image src={original} className={cx('image')} />
				</Image.Container>
			)}
			{!editorState && (
				<Button className={cx('change-asset')} onClick={startUpdate}>
					<i className={cx('icon-image')} />
					<Text.Base className={cx('change')}>{t('change')}</Text.Base>
				</Button>
			)}
			{editorState && (
				<div className={cx('image-editor-wrapper')}>
					<ImageEditor.Editor
						editorState={editorState}
						onChange={onUpdate}
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