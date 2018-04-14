var MapData;
var list;
var deleteList;
var drop = [];
var dropCols;
var clickItem = [];
var newItemLocations = [];
class Map {
	constructor() {
		for (var i = 0; i < 5; i++) {
			drop.push({col: i, num: 0, row: 0});
		}
	}
	createMap() {
		// 创建所有的Item
		MapData = [];
		// 移动、掉落的Item
		list = [];
		// 删除的Item id
		deleteList = [];
		// 生成地图
		for (var i = 0; i < 6; i++) {
			MapData[i] = [];
			for (var j = 0; j < 5; j++) {
				MapData[i][j] = new Item(i * 5 + j, i * 5 + j);
				MapData[i][j].type = this.randomType();
				if (i >= 2 || j >= 2) {
					while ((i >= 2 && MapData[i][j].type == MapData[i - 1][j].type && MapData[i - 2][j].type == MapData[i - 1][j].type) || (j >= 2 && MapData[i][j].type == MapData[i][j - 1].type && MapData[i][j].type == MapData[i][j - 2].type)) {
						MapData[i][j].type = this.randomType();
					}
				}
				MapData[i][j].location = i * 5 + j;
				MapData[i][j].skin = 'view/play_img' + MapData[i][j].type + '.png';
				game.addChild(MapData[i][j]).pos(50 + j * 60, 140 + i * 70);
			}
		}
		// 检测地图
		for (var i = 0; i < MapData.length; i++) {
			for (var j = 0; j < MapData[i].length; j++) {

				if (i - 1 >= 0) {
					var type = MapData[i][j].type;
					MapData[i][j].type = MapData[i - 1][j].type;
					map.canDelete(MapData[i - 1][j], type);
					MapData[i][j].type = type;
					if (deleteList.length >= 3) {
						console.log(i + ',' + j + ',' + 'T');
						return;
					}
				}
				if (i + 1 < 6) {
					var type = MapData[i][j].type;
					MapData[i][j].type = MapData[i + 1][j].type;
					map.canDelete(MapData[i + 1][j], type);
					MapData[i][j].type = type;
					if (deleteList.length >= 3) {
						console.log(i + ',' + j + ',' + 'B');
						return;
					}
				}
				if (j - 1 >= 0) {
					var type = MapData[i][j].type;
					MapData[i][j].type = MapData[i][j - 1].type;
					map.canDelete(MapData[i][j - 1], type);
					MapData[i][j].type = type;
					if (deleteList.length >= 3) {
						console.log(i + ',' + j + ',' + 'L');
						return;
					}
				}
				if (j + 1 < 5) {
					var type = MapData[i][j].type;
					MapData[i][j].type = MapData[i][j + 1].type;
					map.canDelete(MapData[i][j + 1], type);
					MapData[i][j].type = type;
					if (deleteList.length >= 3) {
						console.log(i + ',' + j + ',' + 'R');
						return;
					}
				}
			}
		}
		console.log('need to create new map');
	}
	randomType() {
		return Math.floor(Math.random() * 4);
	}
	createEvent() {
		for (var i = 0; i < MapData.length; i++) {
			for (var j = 0; j < MapData[i].length; j++) {
				MapData[i][j].on(Laya.Event.CLICK, MapData[i][j], map.clickEvent);
			}
		}
	}
    clickEvent() {
        clickItem.push(this);
        if (clickItem.length >= 2) {
            // 尝试交换位置
            var x0 = clickItem[0].x;
            var y0 = clickItem[0].y;
			var x1 = clickItem[1].x;
            var y1 = clickItem[1].y;
            var id0 = clickItem[0].location;
            var id1 = clickItem[1].location;
			
            MapData[Math.floor(id0 / 5)][id0 % 5] = clickItem[1];
            MapData[Math.floor(id1 / 5)][id1 % 5] = clickItem[0];

            clickItem[0].pos(x1, y1);
			clickItem[1].pos(x0, y0);
            clickItem[0].location = id1;
            clickItem[1].location = id0;
            list.push(...clickItem);
            clickItem.splice(0, clickItem.length);
            map.findItems();
        }
    }
	findItems() {
		deleteList.splice(0, deleteList.length);
        if(list.length == 0){
			Laya.stage.mouseEnabled = true;
            return;
        }
		Laya.stage.mouseEnabled = false;
		for (var i = list.length - 1; i >= 0; i--) {
			this.canDelete(list[i]);
		}
		list.splice(0, list.length);
		deleteList = Array.from(new Set(deleteList));
		this.deleteItems();
		this.dropItems();
		this.newItems();
        Laya.timer.once(200,this,function () {
			this.updateMap();
            this.findItems();
        });
		deleteList.splice(0, deleteList.length);
	}
	canDelete(item, type) {
		
		item.deleteList1 = [];
		if (item.location % 5 >= 1) {
			this.canDeleteDirct(item, item.location - 1, typeof type == "number" ? type: item.type, 'left');
		}
		if (item.location % 5 <= 3) {
			this.canDeleteDirct(item, item.location + 1, typeof type == "number" ? type: item.type, 'right');
		}
		item.deleteList1.push(item.location);
		item.deleteList1 = Array.from(new Set(item.deleteList1));
		if (item.deleteList1.length >= 3) {
			deleteList.push(...item.deleteList1);
		}
		item.deleteList1.splice(0,item.deleteList1.length);
		
		item.deleteList2 = [];
		if (Math.floor(item.location / 5) <= 4) {
			this.canDeleteDirct(item, item.location + 5, typeof type == "number" ? type: item.type, 'bottom');
		}
		if (Math.floor(item.location / 5) >= 1) {
			this.canDeleteDirct(item, item.location - 5, typeof type == "number" ? type: item.type, 'top');
		}
		item.deleteList2.push(item.location);
		item.deleteList2 = Array.from(new Set(item.deleteList2));
		if (item.deleteList2.length >= 3) {
			deleteList.push(...item.deleteList2);
		}
		item.deleteList2.splice(0,item.deleteList2.length);
		
	}
	canDeleteDirct(item, id, type, direct) {
		switch (direct) {
			case 'left':
				var thisType = MapData[Math.floor(id / 5)][id % 5].type;
				if (thisType != type) {
					return;
				}
				item.deleteList1.push(id);
				if (id % 5 <= 0) {
					return;
				}
				this.canDeleteDirct(item, id - 1, type, 'left');
				break;

			case 'right':
				var thisType = MapData[Math.floor(id / 5)][id % 5].type;
				if (thisType != type) {
					return;
				}
				item.deleteList1.push(id);
				if (id % 5 >= 4) {
					return;
				}
				this.canDeleteDirct(item, id + 1, type, 'right');
				break;
				
			case 'bottom':
				var thisType = MapData[Math.floor(id / 5)][id % 5].type;
				if (thisType != type) {
					return;
				}
				item.deleteList2.push(id);
				if (Math.floor(id / 5) >= 4) {
					return;
				}
				this.canDeleteDirct(item, id + 5, type, 'bottom');
				break;

			case 'top':
				var thisType = MapData[Math.floor(id / 5)][id % 5].type;
				if (thisType != type) {
					return;
				}
				item.deleteList2.push(id);
				if (Math.floor(id / 5) <= 0) {
					return;
				}
				this.canDeleteDirct(item, id - 5, type, 'top');
				break;
		}

	}
	deleteItems() {
		if (deleteList && deleteList.length >= 3) {
			for (var i = 0; i < deleteList.length; i++) {
				var itemId = deleteList[i];
				MapData[Math.floor(itemId / 5)][itemId % 5].visible = false;
			}
		}
	}
	dropItems() {
		dropCols = [];
		// 过滤 
		for (var index = 0; index < deleteList.length; index++) {
			var element = deleteList[index];
			var col = element % 5;
			var row = Math.floor(element / 5);
			if (dropCols.indexOf(col) == -1) {
				dropCols.push(col);
				drop[col].num = drop[col].num + 1;
				drop[col].row = row;
			} else {
				drop[col].num++;
				if (drop[col].row > row) {
					drop[col].row = row;
				}
			}
		}
		for (var index = 0; index < dropCols.length; index++) {
			var col = dropCols[index];
			var maxRow = drop[col].row;
			var num = drop[col].num;
			for (var i = maxRow - 1; i >= 0; i--) {
				var item = MapData[i][col];
				MapData[i][col].location += num * 5;
				MapData[i + num][col] = item;
                list.push(item);
				var y = 140 + i * 70 + num * 70;
				MapData[i][col].y = y - 40;
				Laya.Tween.to(item, {
					y: y
				},
				100);
			}
		}
	}
	newItems() {
		for (var index = 0; index < dropCols.length; index++) {
			var col = dropCols[index];
			var maxRow = drop[col].row;
			var num = drop[col].num;
			for (var i = num - 1; i >= 0; i--) {
				MapData[i][col] = new Item();
				MapData[i][col].type = map.randomType();
				MapData[i][col].location = i * 5 + col;
                MapData[i][col].on(Laya.Event.CLICK, MapData[i][col], map.clickEvent);
				MapData[i][col].skin = 'view/play_img' + MapData[i][col].type + '.png';
				game.addChild(MapData[i][col].pos(50 + col * 60, 100 + i * 70));
                list.push(MapData[i][col]);
                Laya.Tween.to(MapData[i][col],{y : 140 + i * 70},150);
			}
			drop[col].row = 0;
			drop[col].num = 0;
		}
	}
	updateMap() {
		for (var i = 0; i < MapData.length; i++) {
			for (var j = 0; j < MapData[i].length; j++) {
				MapData[i][j].pos(50 + j * 60, 140 + i * 70);
			}
		}
	}
};