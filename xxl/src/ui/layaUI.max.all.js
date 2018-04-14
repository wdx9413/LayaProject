var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var viewUI=(function(_super){
		function viewUI(){
			
		    this.play_background=null;

			viewUI.__super.call(this);
		}

		CLASS$(viewUI,'ui.view.viewUI',_super);
		var __proto__=viewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(viewUI.uiView);

		}

		viewUI.uiView={"type":"View","props":{"y":0,"x":0,"width":414,"oy":0,"ox":0,"height":736}};
		return viewUI;
	})(View);