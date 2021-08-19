import draw from './draw';
import fixFormatting from './fix-formatting';
import { handlers } from './handlers';
import output from './output';

export default {
	draw,
	fixFormatting,
	output,
	...handlers,
};
