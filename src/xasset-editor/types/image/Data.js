import * as  ImageEditor from '../../../image-editor';

import {Name as NameConst} from './Constants';

export const Name = NameConst;
export const getAssetState = (url) => {
	return {
		original: url,
		updated: null
	};
};

export const getPayload = async ({updated}) => {
	return ImageEditor.getDataURLForEditorState(updated);
};
