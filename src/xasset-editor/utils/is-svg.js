const ExtRegex = /svg$/;

export default function isSVG (url) {
	return Boolean(url.match(ExtRegex));
}