var game;
var map;
Laya.init(414, 736, Laya.WebGL);
Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
Laya.loader.load('res/atlas/view.atlas', Laya.Handler.create(this,
    function() {
        game = new viewUI();
        Laya.stage.addChild(game);
        map = new Map();
        map.createMap();
        map.createEvent(); 
    },
null, false));