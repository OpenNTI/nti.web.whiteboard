import draw from './draw';

export default {
	after (...args) {
		debugger;
		return draw.after(...args);
	}
};
