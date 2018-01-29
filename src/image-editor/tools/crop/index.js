import draw from './draw';
import fixFormatting from './fix-formatting';
import fixLayoutForOutput from './fix-layout-for-outpout';
import handlers from './handlers';

export default {
	draw,
	fixFormatting,
	fixLayoutForOutput,
	...handlers
};
