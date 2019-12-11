import ImageEditor from './image/Editor';
import LinearGradientEditor from './linear-gradient/Editor';
import SolidColorEditor from './solid-color/Editor';

const Types = {
	[ImageEditor.Name]: ImageEditor,
	[LinearGradientEditor.Name]: LinearGradientEditor,
	[SolidColorEditor.Name]: SolidColorEditor
};

export const getForType = (type) => Types[type];