const list1 = { 'title' : 'cube', 'items' : [ [1, 1], [1, 1] ], 'coord' : [] }
const list2 = { 'title' : 'baton', 'items' : [1, 1, 1, 1], 'rotation' : [[1, 1, 1, 1], [1, 1, 1, 1]] ,'coord' : [] }
const list3 = { 'title' : 'te', 'items' :[[1, 1, 1], [0, 1, 0]], 'rotation' : [[[1, 1, 1], [0, 1, 0]], [[1, 0], [1, 1], [1, 0]], [[0, 1, 0], [1, 1, 1]], [[0, 1], [1, 1], [0, 1]]], 'coord' : [] }
const list4 = { 'title' : 'l', 'items' : [[1, 1, 1], [1, 0, 0]], 'rotation' : [[[1, 1, 1], [1, 0, 0]], [[1, 0], [1, 0], [1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 1], [0, 1], [0, 1]]], 'coord' : []}
const list5 = { 'title' : 'inverted l', 'items' : [[1, 1, 1], [0, 0, 1]], 'rotation' : [[[1, 1, 1], [0, 0, 1]], [[1, 1], [1, 0], [1, 0]], [[1, 0, 0], [1, 1, 1]], [[0, 1], [0, 1], [1, 1]]], 'coord' : [] }
const list6 = { 'title' : 'biais', 'items' : [[1, 1, 0], [0, 1, 1]], 'rotation' : [[[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]],'coord' : []}
const list7 = { 'title' : 'inverted biais', 'items' : [[0, 1, 1], [1, 1, 0]], 'rotation' : [[[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]] , 'coord' : []}

function getShape(i) {
	switch (i+1) {
		case 1 : return list1
		case 2 : return list2
		case 3 : return list3
		case 4 : return list4
		case 5 : return list5
        case 6 : return list6
		case 7 : return list7
	}
}