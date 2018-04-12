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

		viewUI.uiView={"type":"View","props":{"y":0,"x":0,"width":414,"oy":0,"ox":0,"height":736},"child":[{"type":"Image","props":{"y":141,"x":43,"width":328,"visible":true,"var":"play_background","skin":"view/play_background.png","oy":122,"ox":41,"ownType":"Image","name":"background","height":454,"alpha":1}}]};
		return viewUI;
	})(View);