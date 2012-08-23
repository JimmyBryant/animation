Animation
=========
模仿jquery animate写的一个简单的animation对象
=========

Animate(elem,property,duration,easing,callback)
=========

elem:进行动画的dom元素   *必须
property:动画属性 eg:{left:"100px",top:"10px"}
duration:动画时间  eg:500   num类型  
easing:动画方式 默认 "linear"
callback:动画回调函数

Animate.stop(elem,end)
=========
停止elem元素上的动画，end 为true则会在最后一帧停止，false则在当前帧停止。默认false

