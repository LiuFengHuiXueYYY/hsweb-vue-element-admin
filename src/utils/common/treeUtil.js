export function buildTree(list) {
	let temp = {};
	let tree = {};
	for (let i in list) {
		let id
		if (list[i].menu) {
			id = list[i].menu.id
		} else {
			id = list[i].id
			if (!id) {
				id = list[i].menuId
			}
		}
		temp[id] = list[i];
	}
	for (let i in temp) {
		let parentId
		if (temp[i].menu) {
			parentId = temp[i].menu.parentId
		} else {
			parentId = temp[i].parentId
		}
		if (parentId && temp[parentId]) {
			if (!temp[parentId].children) {
				temp[parentId].children = [];
			}
			if (temp[parentId].children.indexOf(temp[i]) == -1) {
				temp[parentId].children.push(temp[i]);
			} else {
				temp[i] = null
			}
		} else {
			let id
			if (temp[i].menu) {
				id = temp[i].menu.id
			} else {
				id = temp[i].id
				if (!id) {
					id = temp[i].menuId
				}
			}
			tree[id] = temp[i];
		}
	}
	let treeList = []
	for (let value of Object.keys(tree)) {
		treeList.push(tree[value])
	}
	return treeList;
}
