export default {
	onMouseDown () {
		this.active = true;
	},
	onMouseUp () {
		this.active = false;
	},
	onMouseMove (e) {
		if(this.active) {
			// TODO: Use e.clientX and e.clientY to rotate incrementally?
		}
	},
	onMouseOut () {}
};
