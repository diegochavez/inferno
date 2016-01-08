import createStaticNode from './shapes/staticNode';
import isArray from '../util/isArray';
import isStringOrNumber from '../util/isStringOrNumber';
import isVoid from '../util/isVoid';

function countChildren(children) {
	if (!isVoid(children)) {
		if (isArray(children)) {
			return children.length;
		} else {
			return 1;
		}
	} else {
		return 0;
	}
}

function createStaticAttributes(node, excludeAttrs) {
 // TODO
	return Object.keys(node.attrs).map(attr => `${ attr }="${ node.attrs[attr] }"`).join(' ');
}

function createStaticTreeChildren(children) {
	let isLastChildNode = false;

	if (isArray(children)) {
		return children.map((child, i) => {
			if (isStringOrNumber(child)) {
				if (isLastChildNode) {
					isLastChildNode = true;
					return '<!---->' + child;
				} else {
					isLastChildNode = true;
					return child;
				}
			}
			isLastChildNode = false;
			return createStaticTreeNode(false, child);
		}).join('');
	} else {
		if (isStringOrNumber(children)) {
			return children;
		} else {
			return createStaticTreeNode(false, children);
		}
	}
}

function createStaticTreeNode(isRoot, node) {
	let staticNode;

	if (isVoid(node)) {
		return '';
	}

	if (node.tag) {
		staticNode = `<${ node.tag }`;
		if (node.attrs) {
			staticNode += ' ' + createStaticAttributes(node, null);
		}
		staticNode += `>`;
		if (!isVoid(node.children)) {
			staticNode += createStaticTreeChildren(node.children);
		} else if (!isVoid(node.text)) {
			staticNode += node.text;
		}
		// check if node is self closing?
		staticNode += `</${ node.tag }>`;
	}

	return staticNode;
}

export default function createHTMLTree(schema, isRoot, dynamicNodeMap) {
	const dynamicFlags = dynamicNodeMap.get(schema);
	let node;

	// static html
	if (!dynamicFlags) {
		return createStaticNode(createStaticTreeNode(isRoot, schema));
	}

	return node;
}