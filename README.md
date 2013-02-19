
##css.js

css.js简化自[jquery](http://www.jquery.com)的css方法。jQuery本身的css方法兼顾到了各种浏览器，所以代码比较复杂。我从中提取并进行简化，就有了现在的css.js。虽然功能不如jquery的强大，但是满足平常使用是绝对没问题的。

###如何使用  
1.获取样式  
css.get(elem,name)  
2.设置样式  
css.set(elem,name,value) 

##animate.js

animate.js同样提取自jquery。

###如何使用
1.Animate(elem).animate(properties,[duration],[easing],[callback])   
中括号内的参数表示可选
