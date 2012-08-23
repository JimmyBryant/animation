/******************
这是一个js动画类

目的当然是为了更加方便的实现js动画

自己也可以借此机会练手☺



Animate方法的作用就是产生FX对象，并且将FX对象（每一个FX对象就是一个动画过程）push到timers队列中。

timers队列会定时遍历队列中所有的FX对象，执行FX.step()方法。如果fx对象的动画执行完毕，它将会从timers队列中清除出去，并立即

调用callback.

当前日期: 2012-08-22 星期三

***********************/

(function(window,undefined){
   
   
    var timers=[],       //用于存放Fx对象
		timerId;         //全局计时器
   
	var Func={             //常用静态方法集合
	
	   isEmptyObject:function(obj){            //判断对象是否为空
	   
			for ( var name in obj ) {
				return false;
			}
			return true;
	   
	   },
	   camelize:function(str){               //将margin-left变成marginLeft
	   
			return str.replace(/\-(\w)/ig, 
			function(B, A) {
				return A.toUpperCase();
			});
			
		}
	   
	
	},
	$=function(id){
		return document.getElementById(id);
	};
    
	var Css={                                //css对象，用于设置样式或者获取样式
	   
		   get:function(elem,style){
		   
			   var value;
			   if(style == "float"){
				 document.defaultView ? style = 'cssFloat': style='styleFloat';
			   }
			   if(style=="opacity"){
				 document.defaultView ? style = 'opacity': style='filter';
			   }
					  
			   if (document.defaultView && document.defaultView.getComputedStyle) {
				 var value=document.defaultView.getComputedStyle(elem, null)[style];

			   }else if (elem.currentStyle){

					value = elem.currentStyle[style];
					if(style=="filter"){
					
						if(value.match("alpha")){
						
							value=parseFloat(value.match(/\d+/)[0])/100;
						
						}else if(!value){
						
							value=1;
						}
					}
				 
			   }

			typeof value=="string"&&value.match("px")?value=parseInt(value.replace("px","")):value;          //如果value包含px则转换成num
			style=="opacity"?value=parseInt(value):value;
			return value;
								   
		   },
		   set:function(elem,style,value){
		   
			  if(style=="float"){
				document.defaultView ? style = 'cssFloat': style='styleFloat';
			  }
			  if(style=="opacity"){
				elem.style.filter="alpha(opacity="+value*100+")";
				elem.style.zoom=1;
			  }
				elem.style[style]=value;
		   }
	  
	
	
	};
	
    var Animate=function(elem,property, duration, easing, callback){               //js动画入口API
	   
	   var options=Animate.getOpt(duration, easing, callback);                     //修正参数
	   
	   if(elem&&elem.nodeType==1){
	       
		    var start,to;
		    if(property&&typeof property=="object"){
				
				if(Func.isEmptyObject(property)){             //如果property为空直接执行callback
					
				    callback.call(elem);
				
				}else{
				
				   for(var name in property){
				   
				      var fx=new FX(elem,options,name);
					  start=Css.get(elem,name);
					  end=parseFloat(property[name]);
				      fx.custom(start, end);  
					  
				   }
				
				
				}
			
			}
	   
	   }
	
	};
	Animate.getOpt=function(duration, easing, callback){
	
		 var options ={duration:duration||200,easing:easing||"linear"};
		 options.callback=function(){callback&&callback();};
		 return options;
	
	};


	var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象 
	
		this.elem=elem;
		this.options=options;
		this.name=name;
		
	}
	FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

		this.startTime = new Date().getTime();  
		this.start = from;  
		this.end = end; 
		
		timers.push(this);  
		FX.tick();  
		
	};
	FX.prototype.step=function(){
	    var now=new Date().getTime(),
			nowPos;

		if(now>this.options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
		   nowPos=this.end;
		   this.options.callback.call(this.elem);  
		   this.stop();		
		}else{
		    var n = now - this.startTime;  
            var state = n / this.options.duration;  
            var pos =Easing[this.options.easing](state, 0, 1, this.options.duration);  
            nowPos = this.start + ((this.end - this.start) * pos);  
        }  
		if(this.name!="opacity")
		{
			nowPos+="px";
		}
        this.update(this.name,nowPos);  
	};
	
	FX.prototype.stop=function(){

		for(var i=timers.length;i--;){
		
			if(timers[i]===this){
				timers.splice(i,1);
			}
		}
	
	};
	
	FX.prototype.update=function(name,value){
	
		Css.set(this.elem,name,value);
	
	};
	
	
	FX.tick = function(){  
        if (timerId) return;                                   //如果计时器已经在走则退出
   
        timerId = setInterval(function(){  
            for (var i = 0,len=timers.length;i<len;i++){  
                timers[i].step();  
            }  
            if (!timers.length){  
                FX.stop();  
            }  
        }, 13);  
    };  
     
	FX.stop = function(){                                  //清除全局计时器 停止动画 
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
	
	
   window["Animate"]=Animate;
})(window);











