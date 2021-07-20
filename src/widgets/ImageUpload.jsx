import './ImageUpload.scss';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { RemoveButton, useReducerState } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { ImageEditor } from '../';

import EditImage from './EditImage';

const t = scoped('whiteboard.widgets.ImageUpload', {
	addAnImage: 'Add an Image',
});

ImageUpload.propTypes = {
	onChange: PropTypes.func.isRequired,
	img: PropTypes.object,
};

export default function ImageUpload({ className, onChange, img }) {
	const [state, setState, reset] = useReducerState({
		img: null,
		editorState: null,
	});

	useEffect(() => {
		setState({ img });
	}, [img]);

	const onImageUpload = async editorState => {
		const img = await ImageEditor.getImageForEditorState(editorState);
		setState({ editorState: img });
		try {
			// match aspectRatio to the dimensions of the image in event overview list items
			const newEditorState = await EditImage.show(
				ImageEditor.getEditorState(img, {
					crop: {
						aspectRatio: 208 / 117,
						width: img.naturalWidth,
						height: img.naturalHeight,
					},
				})
			);

			const newImage = await ImageEditor.getImageForEditorState(
				newEditorState
			);

			setState({ img: newImage, croppedImageState: newEditorState });
			onChange(await getBlobForImage(newImage, newEditorState));
		} catch {
			setState({ editorState: null });
		}
	};

	return (
		<div className={cx('nti-image-upload', className)}>
			{!state.img && !state.editorState ? (
				<div className="image-upload-container">
					<ImageEditor.Editor onChange={onImageUpload} />
					<div className="content">
						<i className="icon-upload" />
						<div className="text">{t('addAnImage')}</div>
					</div>
				</div>
			) : state.img ? (
				<div className="image-preview">
					<img src={state.img.src} />
					<div className="remove-image">
						<RemoveButton
							onRemove={() => {
								reset();

								onChange(null);
							}}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}

async function getBlobForImage(img, croppedImageState) {
	const dataBlob = await (croppedImageState
		? ImageEditor.getBlobForEditorState(croppedImageState)
		: null);

	return img && !dataBlob
		? undefined // an image was provided, but no changes were made
		: dataBlob || null;
}
