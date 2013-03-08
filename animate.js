/*
*
* animate动画类
* include css.js
*
*/

var Animate=function(elem){
   
   
    var timers=[],       //用于存放Fx对象
		timerId;         //全局计时器

    var requestAnimationFrame = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame;

	var isEmptyObject=function(obj){            //判断对象是否为空

			for ( var name in obj ) {
				return false;
			}
			return true;

	};
	
	/*
	* css.js
	*/	
	var css = {

		get:function(elem,name){

			var core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,//用于匹配数字
			rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
			rposition = /^(top|right|bottom|left)$/,
			ropacity = /opacity=([^)]*)/,
		    rmargin = /^margin/;

	    	//用于获取elem的width和height
			var getWidthOrHeight=function(elem,name){

				var ret=name==="width"?elem.clientWidth:elem.clientHeight
				,pt=parseFloat(css.get(elem,'paddingTop'))
				,pb=parseFloat(css.get(elem,'paddingBottom'))
				,pl=parseFloat(css.get(elem,'paddingLeft'))
				,pr=parseFloat(css.get(elem,'paddingRight'));
			    
				return ret=(name==="width"?ret-pl-pr:ret-pt-pb)+'px';

			};

			//标准浏览器
			if(window.getComputedStyle){
				var ret, width, minWidth, maxWidth,
					computed = window.getComputedStyle( elem, null ),
					style = elem.style;

				name=name==="float"?"cssFloat":name;  //cssFloat获取float

				if ( computed ) {
					ret = computed[ name ];
					// A tribute to the "awesome hack by Dean Edwards"
					// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
					// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
					// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
					if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
						width = style.width;
						minWidth = style.minWidth;
						maxWidth = style.maxWidth;

						style.minWidth = style.maxWidth = style.width = ret;
						ret = computed.width;

						style.width = width;
						style.minWidth = minWidth;
						style.maxWidth = maxWidth;
					}
				}

				return ret;
			}else if(document.documentElement.currentStyle){       //IE浏览器

				var left, rsLeft,
				ret = elem.currentStyle && elem.currentStyle[ name ],
				style = elem.style;
				name=name==="float"?"styleFloat":name;//styleFloat获取float
				if(name==='opacity'){	

					return ropacity.test( (elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
						( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
						computed ? "1" : "";

				}else if(name==="width"||name==="height"){

					if(elem.currentStyle[name]==="auto"){    //如果未设置width,height默认返回auto

						return ret=getWidthOrHeight(elem,name);

					}

				}

				// Avoid setting ret to empty string here
				// so we don't default to auto
				if ( ret == null && style && style[ name ] ) {
					ret = style[ name ];
				}

				// From the awesome hack by Dean Edwards
				// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

				// If we're not dealing with a regular pixel number
				// but a number that has a weird ending, we need to convert it to pixels
				// but not position css attributes, as those are proportional to the parent element instead
				// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
				if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

					// Remember the original values
					left = style.left;
					rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

					// Put in the new values to get a computed value out
					if ( rsLeft ) {
						elem.runtimeStyle.left = elem.currentStyle.left;
					}
					style.left = name === "fontSize" ? "1em" : ret;
					ret = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					if ( rsLeft ) {
						elem.runtimeStyle.left = rsLeft;
					}
				}

				return ret === "" ? "auto" : ret;

			}else{
				return elem.style[name];
			}
		},
		set:function(elem,name,value){
			// 如果name是对象
			if(typeof name=="object"&&value===undefined){
				for(var pro in name){
					css.set(elem,pro,name[pro]);
				}
				return;
			}
			if(window.getComputedStyle){
				name=name==="float"?"cssFloat":name;
			}else{
				name=name==="float"?"styleFloat":name;
				if(name==="opacity"){
					elem.style["filter"]="alpha(opacity="+100*value+")";
				}
			}
			elem.style[name]=value;

		}
	};

	/*
	* Animate
	*/

	var Animate=function(elem){

		this.elem=elem;
		return this;

	};

    Animate.prototype.animate=function(property, duration, easing, callback){               //js动画入口API

	   var elem=this.elem;
	   var options=Animate.getOpt(duration, easing, callback);                     //修正参数
	   
	   if(elem&&elem.nodeType==1){
	       
		    var start,to;
		    if(property&&typeof property=="object"){
				
				if(isEmptyObject(property)){             //如果property为空直接执行callback
					
				    options.callback.call(elem);
				
				}else{

				   options.animatedProperties={};
				   for(var pro in property){
				   	  options.animatedProperties[pro]=false;    //用于标记该属性的动画是否执行完毕
				   }

				   for(var name in property){
				   
				      var fx=new FX(elem,options,name);
					  start=parseFloat(css.get(elem,name));
					  end=parseFloat(property[name]);
				      fx.custom(start, end);  
					  
				   }
				
				
				}
			
			}
	   
	   }
	
	};

    Animate.stop=function(end){  //停止某个dom元素的动画  end为true则会把动画进行到最后一帧 false则停止到当前帧
    	
    	var elem=this.elem;
	    end=end||false;
		for(var i=0;i<timers.length;i--){

		   var fx=timers[i];
		   if(fx.elem===elem){
		    if(end){
			  fx.update(fx.name,fx.end); 
			}
		    timers.splice(i--,1); //移除fx要将i减1
		   }
		
		}
		return this;	
	};

	Animate.getOpt=function(duration, easing, callback){       // 修正参数
		 var opt={};
		 opt.duration=duration;
		 opt.callback=callback||easing||duration;
		 opt.old=opt.callback;
		 opt.easing=callback&&easing||easing||duration;
		 opt.callback=function(){
		 	if(typeof opt.old=="function"){
		 		opt.old.call(this);
		 	}
		 }


 		 opt.duration=typeof opt.duration=="number"?opt.duration:400;
 		 opt.easing=typeof opt.easing=="string"?opt.easing:"swing";
		 return opt;
	
	};

	var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象 
	
		this.elem=elem;
		this.options=options;
		this.name=name;
		
	};

	FX.interval=13;

	FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

		var t,raf,self=this;
		this.startTime = new Date().getTime();  
		this.start = from;  
		this.end = end; 
		 
		function t( gotoEnd ) {
			return self.step(gotoEnd);
		};

		t.elem = this.elem;

		if ( t() && timers.push(t) && !timerId ) {
			// 如果可以的话使用requestAnimationFrame代替setInterval 
			if ( requestAnimationFrame ) {
				timerId = true;
				raf = function() {
					// 当timerId设为null，动画停止
					if ( timerId ) {
						requestAnimationFrame( raf );
						FX.tick();
					}
				};
				requestAnimationFrame( raf );
			} else {
				timerId = setInterval( FX.tick, FX.interval );
			}
		}
		
	};

	FX.prototype.step=function(){
	    var now=new Date().getTime(),
			nowPos,
			done=true,
			options=this.options;

		if(now>options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
		   nowPos=this.end;
		   options.animatedProperties[ this.name ] = true;
			for ( i in options.animatedProperties ) {
				if ( options.animatedProperties[i] !== true ) {
					done = false;
				}
			}
		   done&&options.callback.call(this.elem);  //所有动画结束执行回调函数
		   this.update(this.name,nowPos);                 
		   return false;	
		}else{
		    var n = now - this.startTime;  
            var state = n / options.duration;  
            var pos =Easing[options.easing](state, 0, 1, options.duration);  
            nowPos = this.start + ((this.end - this.start) * pos);  
        }  

        this.update(this.name,nowPos); 
        return true; 
	};
	
	
	FX.prototype.update=function(name,value){
	
		if(name!="opacity")
		{
			value+="px";
		}
	
		css.set(this.elem,name,value);
	
	};
	
	FX.tick = function(){                //用于计时器中执行动画队列
                                      
		for ( var  i = 0 ; i < timers.length ; ++i ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		} 
        if (!timers.length){  
            FX.stop();  
        }  

    };  
     
	FX.stop = function(){                                  //清除全局计时器 停止所有动画 
        clearInterval(timerId);   
        timerId = null;  
    };
	
    var Easing={                                         //easing对象
 	
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	
	};	

	return new Animate(elem); 
	
};	












