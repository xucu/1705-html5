function Ajax(options){
	this.init(options);
}
Ajax.prototype = {
	init:function(options){
		var self = this;

		// 默认值
		var defaults = {
			type:'get',//post,put,delete,jsonp...
			async:true,
			callbackName:'callback'
		}

		// 扩展参数
		var opt;
		try{
			opt = Object.assign({},defaults,options);
		}catch(err){
			for(var attr in options){
				defaults[attr] = options[attr];
			}
			opt = defaults;
		}
		// 兼容大小写
		opt.type = opt.type.toLowerCase();


		// 处理参数
		// data:{pageNo:1,qty:10} => 'pageNo=1&qty=10'
		if(opt.data){
			var params = '';
			for(var attr in opt.data){
				params += attr + '=' + opt.data[attr] + '&'
			}

			// 去除多余的&
			params = params.slice(0,-1);
		}


		// 根据请求类型定义url
		if(opt.type === 'get' || opt.type === 'jsonp'){
			var fuhao = opt.url.indexOf('?')>=0 ? '&' : '?';

			opt.url += fuhao + params;


			// opt.url += '?' + params; => ../api/football.php?name=laoxie?pageNo=1&qty=10
			params = null;
		}


		// jsonp
		// 当同时发起多个jsonp请求时
		if(opt.type === 'jsonp'){
			// var fnName = 'getData' + parseInt(Math.random()*10000000);
			var fnName = 'getData' + new Date().getTime();

			// 1.预设全局函数
			window[fnName] = function(data){
				self.data = data;

				// 处理数据
				if(typeof opt.success === 'function'){
					opt.success(data);
				}

				// 删除script节点
				script.parentNode.removeChild(script);

				// 删除全局函数
				delete window[fnName];
			}

			// 2.生成script标签,并写入页面
			var script = document.createElement('script');
			script.src = opt.url + '&'+opt.callbackName + '='+fnName;
			document.head.appendChild(script);

			return;
		}


		// ajax请求
		var xhr;

		// 兼容xhr异步请求对象
		try{
			xhr = new XMLHttpRequest();
		}catch(error){
			try{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(err){
				try{
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					alert('你的浏览器太Low了，赶紧升级谷歌浏览器');
				}
				
			}
		}


		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)){
				var res;
				try{
					res = JSON.parse(xhr.responseText);
				}catch(err){
					res = xhr.responseText;
				}

				// 传递数据
				self.data = res;

				if(typeof opt.success === 'function'){

					opt.success(res);
				}
			}
		}


		xhr.open(opt.type,opt.url,opt.async);

		// 如果post请求，必须设定请求头
		if(opt.type != 'get'){
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}

		xhr.send(params);
	},

	// success
	then:function(callback){
		var self = this;
		setTimeout(function(){
			callback(self.data)
		},500);
	},
	catch:function(callback){

	}

}

// 设置constructor属性
Object.defineProperty(Ajax.prototype,'constructor',{
	value:Ajax
});

// new Ajax({})

function xajax(options){
	return new Ajax(options);
}

// post请求
xajax.post = function(url,data,callback){
	// 重点理解
	if(typeof data === 'function'){
		callback = data;
		data = undefined;
	}

	var opt = {
		type:'post',
		url:url,
		data:data,
		success:callback
	}
	return new Ajax(opt);
}

// get请求
xajax.get = function(url,data,callback){
	// 重点理解
	if(typeof data === 'function'){
		callback = data;
		data = undefined;
	}

	var opt = {
		type:'get',
		url:url,
		data:data,
		success:callback
	}
	return new Ajax(opt);
}

xajax.jsonp = function(){

}