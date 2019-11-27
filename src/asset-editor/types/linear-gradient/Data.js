import {getSVGDataURL} from '../../utils';
import * as LinearGradientImage from '../../../linear-gradient-image';

import {Name as NameConst} from './Constant';

export const Name = NameConst;
export const getAssetState = (url, raw) => {

	const original = LinearGradientImage.getSVGToGradientObject(raw);

	if (!original) { return null;}

	return {
		original,
		updated: null
	};
};

export const getPayload = async ({updated}, aspectRatio) => {
	const svg = LinearGradientImage.getGradientObjectToSVG(updated, aspectRatio);
	const dataURL = await getSVGDataURL(svg);

	return dataURL;
};

