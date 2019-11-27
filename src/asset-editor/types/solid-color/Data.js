import {getSVGDataURL} from '../../utils';
import * as SolidColorImage from '../../../solid-color-image';

import {Name as NameConst} from './Constant';

export const Name = NameConst;
export const getAssetState = (url, raw) => {

	const original = SolidColorImage.getSolidColorStateFromSVG(raw);

	if (!original) { return null;}

	return {
		original,
		updated: null
	};
};

export const getPayload = async ({updated}, aspectRatio) => {
	const svg = SolidColorImage.getSVGFromSolidColorState(updated, aspectRatio);
	const dataURL = await getSVGDataURL(svg);

	return dataURL;
};
