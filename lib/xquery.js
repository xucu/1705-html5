/*
	简化DOM节点操作
 */

function Xquery(selector){
	this._init(selector);
}

Xquery.prototype = {
	_init:function(selector){
		this.ele = document.querySelectorAll(selector);
	},

	// 显示
	show:function(){
		for(var i=0;i<this.ele.length;i++){
			this.ele[i].style.display = 'block';
		}

		return this;
	},

	hide:function(){
		for(var i=0;i<this.ele.length;i++){
			this.ele[i].style.display = 'none';
		}
		return this;
	},

	// 事件绑定
	on:function(type,handler){
		for(var i=0;i<this.ele.length;i++){
			this.ele[i]['on' + type] = handler;
		}
		return this;
	},

	// 样式操作：一个方法多个功能
	// * 获取
	// * 设置
	css:function(attr,val){
		// 获取
		if(val === undefined){
			return getComputedStyle(this.ele[0])[attr];
		}


		// 设置
		// 提取单位
		if(!isNaN(val)){
			var unit = getComputedStyle(this.ele[0])[attr];
			unit = unit.match(/[a-z]+$/);
			unit = unit ? unit[0] : '';

			val = val + unit;
		}

		for(var i=0;i<this.ele.length;i++){
			this.ele[i].style[attr] = val;
		}

		return this;
	},

	// 获取/设置
	attr:function(attr,val){

	},
	addClass:function(){},
	removeClass:function(){}


}

Object.defineProperty(Xquery.prototype,'constructor',{
	value:Xquery
});


function xquery(selector){
	return new Xquery(selector);
}

var $ = xquery;

// $('.box').show()
// $('.box').attr('title','content')
// $('.box').addClass('data').on('click',function(){});
// $('.box').css('opacity');//