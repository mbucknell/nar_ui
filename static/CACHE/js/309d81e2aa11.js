(function($){$.color={};$.color.make=function(r,g,b,a){var o={};o.r=r||0;o.g=g||0;o.b=b||0;o.a=a!=null?a:1;o.add=function(c,d){for(var i=0;i<c.length;++i)o[c.charAt(i)]+=d;return o.normalize()};o.scale=function(c,f){for(var i=0;i<c.length;++i)o[c.charAt(i)]*=f;return o.normalize()};o.toString=function(){if(o.a>=1){return"rgb("+[o.r,o.g,o.b].join(",")+")"}else{return"rgba("+[o.r,o.g,o.b,o.a].join(",")+")"}};o.normalize=function(){function clamp(min,value,max){return value<min?min:value>max?max:value}o.r=clamp(0,parseInt(o.r),255);o.g=clamp(0,parseInt(o.g),255);o.b=clamp(0,parseInt(o.b),255);o.a=clamp(0,o.a,1);return o};o.clone=function(){return $.color.make(o.r,o.b,o.g,o.a)};return o.normalize()};$.color.extract=function(elem,css){var c;do{c=elem.css(css).toLowerCase();if(c!=""&&c!="transparent")break;elem=elem.parent()}while(elem.length&&!$.nodeName(elem.get(0),"body"));if(c=="rgba(0, 0, 0, 0)")c="transparent";return $.color.parse(c)};$.color.parse=function(str){var res,m=$.color.make;if(res=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10));if(res=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10),parseFloat(res[4]));if(res=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55);if(res=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55,parseFloat(res[4]));if(res=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))return m(parseInt(res[1],16),parseInt(res[2],16),parseInt(res[3],16));if(res=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))return m(parseInt(res[1]+res[1],16),parseInt(res[2]+res[2],16),parseInt(res[3]+res[3],16));var name=$.trim(str).toLowerCase();if(name=="transparent")return m(255,255,255,0);else{res=lookupColors[name]||[0,0,0];return m(res[0],res[1],res[2])}};var lookupColors={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);(function($){var hasOwnProperty=Object.prototype.hasOwnProperty;function Canvas(cls,container){var element=container.children("."+cls)[0];if(element==null){element=document.createElement("canvas");element.className=cls;$(element).css({direction:"ltr",position:"absolute",left:0,top:0}).appendTo(container);if(!element.getContext){if(window.G_vmlCanvasManager){element=window.G_vmlCanvasManager.initElement(element);}else{throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");}}}
this.element=element;var context=this.context=element.getContext("2d");var devicePixelRatio=window.devicePixelRatio||1,backingStoreRatio=context.webkitBackingStorePixelRatio||context.mozBackingStorePixelRatio||context.msBackingStorePixelRatio||context.oBackingStorePixelRatio||context.backingStorePixelRatio||1;this.pixelRatio=devicePixelRatio/backingStoreRatio;this.resize(container.width(),container.height());this.textContainer=null;this.text={};this._textCache={};}
Canvas.prototype.resize=function(width,height){if(width<=0||height<=0){throw new Error("Invalid dimensions for plot, width = "+width+", height = "+height);}
var element=this.element,context=this.context,pixelRatio=this.pixelRatio;if(this.width!=width){element.width=width*pixelRatio;element.style.width=width+"px";this.width=width;}
if(this.height!=height){element.height=height*pixelRatio;element.style.height=height+"px";this.height=height;}
context.restore();context.save();context.scale(pixelRatio,pixelRatio);};Canvas.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height);};Canvas.prototype.render=function(){var cache=this._textCache;for(var layerKey in cache){if(hasOwnProperty.call(cache,layerKey)){var layer=this.getTextLayer(layerKey),layerCache=cache[layerKey];layer.hide();for(var styleKey in layerCache){if(hasOwnProperty.call(layerCache,styleKey)){var styleCache=layerCache[styleKey];for(var key in styleCache){if(hasOwnProperty.call(styleCache,key)){var positions=styleCache[key].positions;for(var i=0,position;position=positions[i];i++){if(position.active){if(!position.rendered){layer.append(position.element);position.rendered=true;}}else{positions.splice(i--,1);if(position.rendered){position.element.detach();}}}
if(positions.length==0){delete styleCache[key];}}}}}
layer.show();}}};Canvas.prototype.getTextLayer=function(classes){var layer=this.text[classes];if(layer==null){if(this.textContainer==null){this.textContainer=$("<div class='flot-text'></div>").css({position:"absolute",top:0,left:0,bottom:0,right:0,'font-size':"smaller",color:"#545454"}).insertAfter(this.element);}
layer=this.text[classes]=$("<div></div>").addClass(classes).css({position:"absolute",top:0,left:0,bottom:0,right:0}).appendTo(this.textContainer);}
return layer;};Canvas.prototype.getTextInfo=function(layer,text,font,angle,width){var textStyle,layerCache,styleCache,info;text=""+text;if(typeof font==="object"){textStyle=font.style+" "+font.variant+" "+font.weight+" "+font.size+"px/"+font.lineHeight+"px "+font.family;}else{textStyle=font;}
layerCache=this._textCache[layer];if(layerCache==null){layerCache=this._textCache[layer]={};}
styleCache=layerCache[textStyle];if(styleCache==null){styleCache=layerCache[textStyle]={};}
info=styleCache[text];if(info==null){var element=$("<div></div>").html(text).css({position:"absolute",'max-width':width,top:-9999}).appendTo(this.getTextLayer(layer));if(typeof font==="object"){element.css({font:textStyle,color:font.color});}else if(typeof font==="string"){element.addClass(font);}
info=styleCache[text]={width:element.outerWidth(true),height:element.outerHeight(true),element:element,positions:[]};element.detach();}
return info;};Canvas.prototype.addText=function(layer,x,y,text,font,angle,width,halign,valign){var info=this.getTextInfo(layer,text,font,angle,width),positions=info.positions;if(halign=="center"){x-=info.width/2;}else if(halign=="right"){x-=info.width;}
if(valign=="middle"){y-=info.height/2;}else if(valign=="bottom"){y-=info.height;}
for(var i=0,position;position=positions[i];i++){if(position.x==x&&position.y==y){position.active=true;return;}}
position={active:true,rendered:false,element:positions.length?info.element.clone():info.element,x:x,y:y};positions.push(position);position.element.css({top:Math.round(y),left:Math.round(x),'text-align':halign});};Canvas.prototype.removeText=function(layer,x,y,text,font,angle){if(text==null){var layerCache=this._textCache[layer];if(layerCache!=null){for(var styleKey in layerCache){if(hasOwnProperty.call(layerCache,styleKey)){var styleCache=layerCache[styleKey];for(var key in styleCache){if(hasOwnProperty.call(styleCache,key)){var positions=styleCache[key].positions;for(var i=0,position;position=positions[i];i++){position.active=false;}}}}}}}else{var positions=this.getTextInfo(layer,text,font,angle).positions;for(var i=0,position;position=positions[i];i++){if(position.x==x&&position.y==y){position.active=false;}}}};function Plot(placeholder,data_,options_,plugins){var series=[],options={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],legend:{show:true,noColumns:1,labelFormatter:null,labelBoxBorderColor:"#ccc",container:null,position:"ne",margin:5,backgroundColor:null,backgroundOpacity:0.85,sorted:null},xaxis:{show:null,position:"bottom",mode:null,font:null,color:null,tickColor:null,transform:null,inverseTransform:null,min:null,max:null,autoscaleMargin:null,ticks:null,tickFormatter:null,labelWidth:null,labelHeight:null,reserveSpace:null,tickLength:null,alignTicksWithAxis:null,tickDecimals:null,tickSize:null,minTickSize:null},yaxis:{autoscaleMargin:0.02,position:"left"},xaxes:[],yaxes:[],series:{points:{show:false,radius:3,lineWidth:2,fill:true,fillColor:"#ffffff",symbol:"circle"},lines:{lineWidth:2,fill:false,fillColor:null,steps:false},bars:{show:false,lineWidth:2,barWidth:1,fill:true,fillColor:null,align:"left",horizontal:false,zero:true},shadowSize:3,highlightColor:null},grid:{show:true,aboveData:false,color:"#545454",backgroundColor:null,borderColor:null,tickColor:null,margin:0,labelMargin:5,axisMargin:8,borderWidth:2,minBorderMargin:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:false,hoverable:false,autoHighlight:true,mouseActiveRadius:10},interaction:{redrawOverlayInterval:1000/60},hooks:{}},surface=null,overlay=null,eventHolder=null,ctx=null,octx=null,xaxes=[],yaxes=[],plotOffset={left:0,right:0,top:0,bottom:0},plotWidth=0,plotHeight=0,hooks={processOptions:[],processRawData:[],processDatapoints:[],processOffset:[],drawBackground:[],drawSeries:[],draw:[],bindEvents:[],drawOverlay:[],shutdown:[]},plot=this;plot.setData=setData;plot.setupGrid=setupGrid;plot.draw=draw;plot.getPlaceholder=function(){return placeholder;};plot.getCanvas=function(){return surface.element;};plot.getPlotOffset=function(){return plotOffset;};plot.width=function(){return plotWidth;};plot.height=function(){return plotHeight;};plot.offset=function(){var o=eventHolder.offset();o.left+=plotOffset.left;o.top+=plotOffset.top;return o;};plot.getData=function(){return series;};plot.getAxes=function(){var res={},i;$.each(xaxes.concat(yaxes),function(_,axis){if(axis)
res[axis.direction+(axis.n!=1?axis.n:"")+"axis"]=axis;});return res;};plot.getXAxes=function(){return xaxes;};plot.getYAxes=function(){return yaxes;};plot.c2p=canvasToAxisCoords;plot.p2c=axisToCanvasCoords;plot.getOptions=function(){return options;};plot.highlight=highlight;plot.unhighlight=unhighlight;plot.triggerRedrawOverlay=triggerRedrawOverlay;plot.pointOffset=function(point){return{left:parseInt(xaxes[axisNumber(point,"x")-1].p2c(+point.x)+plotOffset.left,10),top:parseInt(yaxes[axisNumber(point,"y")-1].p2c(+point.y)+plotOffset.top,10)};};plot.shutdown=shutdown;plot.destroy=function(){shutdown();placeholder.removeData("plot").empty();series=[];options=null;surface=null;overlay=null;eventHolder=null;ctx=null;octx=null;xaxes=[];yaxes=[];hooks=null;highlights=[];plot=null;};plot.resize=function(){var width=placeholder.width(),height=placeholder.height();surface.resize(width,height);overlay.resize(width,height);};plot.hooks=hooks;initPlugins(plot);parseOptions(options_);setupCanvases();setData(data_);setupGrid();draw();bindEvents();function executeHooks(hook,args){args=[plot].concat(args);for(var i=0;i<hook.length;++i)
hook[i].apply(this,args);}
function initPlugins(){var classes={Canvas:Canvas};for(var i=0;i<plugins.length;++i){var p=plugins[i];p.init(plot,classes);if(p.options)
$.extend(true,options,p.options);}}
function parseOptions(opts){$.extend(true,options,opts);if(opts&&opts.colors){options.colors=opts.colors;}
if(options.xaxis.color==null)
options.xaxis.color=$.color.parse(options.grid.color).scale('a',0.22).toString();if(options.yaxis.color==null)
options.yaxis.color=$.color.parse(options.grid.color).scale('a',0.22).toString();if(options.xaxis.tickColor==null)
options.xaxis.tickColor=options.grid.tickColor||options.xaxis.color;if(options.yaxis.tickColor==null)
options.yaxis.tickColor=options.grid.tickColor||options.yaxis.color;if(options.grid.borderColor==null)
options.grid.borderColor=options.grid.color;if(options.grid.tickColor==null)
options.grid.tickColor=$.color.parse(options.grid.color).scale('a',0.22).toString();var i,axisOptions,axisCount,fontSize=placeholder.css("font-size"),fontSizeDefault=fontSize?+fontSize.replace("px",""):13,fontDefaults={style:placeholder.css("font-style"),size:Math.round(0.8*fontSizeDefault),variant:placeholder.css("font-variant"),weight:placeholder.css("font-weight"),family:placeholder.css("font-family")};axisCount=options.xaxes.length||1;for(i=0;i<axisCount;++i){axisOptions=options.xaxes[i];if(axisOptions&&!axisOptions.tickColor){axisOptions.tickColor=axisOptions.color;}
axisOptions=$.extend(true,{},options.xaxis,axisOptions);options.xaxes[i]=axisOptions;if(axisOptions.font){axisOptions.font=$.extend({},fontDefaults,axisOptions.font);if(!axisOptions.font.color){axisOptions.font.color=axisOptions.color;}
if(!axisOptions.font.lineHeight){axisOptions.font.lineHeight=Math.round(axisOptions.font.size*1.15);}}}
axisCount=options.yaxes.length||1;for(i=0;i<axisCount;++i){axisOptions=options.yaxes[i];if(axisOptions&&!axisOptions.tickColor){axisOptions.tickColor=axisOptions.color;}
axisOptions=$.extend(true,{},options.yaxis,axisOptions);options.yaxes[i]=axisOptions;if(axisOptions.font){axisOptions.font=$.extend({},fontDefaults,axisOptions.font);if(!axisOptions.font.color){axisOptions.font.color=axisOptions.color;}
if(!axisOptions.font.lineHeight){axisOptions.font.lineHeight=Math.round(axisOptions.font.size*1.15);}}}
if(options.xaxis.noTicks&&options.xaxis.ticks==null)
options.xaxis.ticks=options.xaxis.noTicks;if(options.yaxis.noTicks&&options.yaxis.ticks==null)
options.yaxis.ticks=options.yaxis.noTicks;if(options.x2axis){options.xaxes[1]=$.extend(true,{},options.xaxis,options.x2axis);options.xaxes[1].position="top";}
if(options.y2axis){options.yaxes[1]=$.extend(true,{},options.yaxis,options.y2axis);options.yaxes[1].position="right";}
if(options.grid.coloredAreas)
options.grid.markings=options.grid.coloredAreas;if(options.grid.coloredAreasColor)
options.grid.markingsColor=options.grid.coloredAreasColor;if(options.lines)
$.extend(true,options.series.lines,options.lines);if(options.points)
$.extend(true,options.series.points,options.points);if(options.bars)
$.extend(true,options.series.bars,options.bars);if(options.shadowSize!=null)
options.series.shadowSize=options.shadowSize;if(options.highlightColor!=null)
options.series.highlightColor=options.highlightColor;for(i=0;i<options.xaxes.length;++i)
getOrCreateAxis(xaxes,i+1).options=options.xaxes[i];for(i=0;i<options.yaxes.length;++i)
getOrCreateAxis(yaxes,i+1).options=options.yaxes[i];for(var n in hooks)
if(options.hooks[n]&&options.hooks[n].length)
hooks[n]=hooks[n].concat(options.hooks[n]);executeHooks(hooks.processOptions,[options]);}
function setData(d){series=parseData(d);fillInSeriesOptions();processData();}
function parseData(d){var res=[];for(var i=0;i<d.length;++i){var s=$.extend(true,{},options.series);if(d[i].data!=null){s.data=d[i].data;delete d[i].data;$.extend(true,s,d[i]);d[i].data=s.data;}
else
s.data=d[i];res.push(s);}
return res;}
function axisNumber(obj,coord){var a=obj[coord+"axis"];if(typeof a=="object")
a=a.n;if(typeof a!="number")
a=1;return a;}
function allAxes(){return $.grep(xaxes.concat(yaxes),function(a){return a;});}
function canvasToAxisCoords(pos){var res={},i,axis;for(i=0;i<xaxes.length;++i){axis=xaxes[i];if(axis&&axis.used)
res["x"+axis.n]=axis.c2p(pos.left);}
for(i=0;i<yaxes.length;++i){axis=yaxes[i];if(axis&&axis.used)
res["y"+axis.n]=axis.c2p(pos.top);}
if(res.x1!==undefined)
res.x=res.x1;if(res.y1!==undefined)
res.y=res.y1;return res;}
function axisToCanvasCoords(pos){var res={},i,axis,key;for(i=0;i<xaxes.length;++i){axis=xaxes[i];if(axis&&axis.used){key="x"+axis.n;if(pos[key]==null&&axis.n==1)
key="x";if(pos[key]!=null){res.left=axis.p2c(pos[key]);break;}}}
for(i=0;i<yaxes.length;++i){axis=yaxes[i];if(axis&&axis.used){key="y"+axis.n;if(pos[key]==null&&axis.n==1)
key="y";if(pos[key]!=null){res.top=axis.p2c(pos[key]);break;}}}
return res;}
function getOrCreateAxis(axes,number){if(!axes[number-1])
axes[number-1]={n:number,direction:axes==xaxes?"x":"y",options:$.extend(true,{},axes==xaxes?options.xaxis:options.yaxis)};return axes[number-1];}
function fillInSeriesOptions(){var neededColors=series.length,maxIndex=-1,i;for(i=0;i<series.length;++i){var sc=series[i].color;if(sc!=null){neededColors--;if(typeof sc=="number"&&sc>maxIndex){maxIndex=sc;}}}
if(neededColors<=maxIndex){neededColors=maxIndex+1;}
var c,colors=[],colorPool=options.colors,colorPoolSize=colorPool.length,variation=0;for(i=0;i<neededColors;i++){c=$.color.parse(colorPool[i%colorPoolSize]||"#666");if(i%colorPoolSize==0&&i){if(variation>=0){if(variation<0.5){variation=-variation-0.2;}else variation=0;}else variation=-variation;}
colors[i]=c.scale('rgb',1+variation);}
var colori=0,s;for(i=0;i<series.length;++i){s=series[i];if(s.color==null){s.color=colors[colori].toString();++colori;}
else if(typeof s.color=="number")
s.color=colors[s.color].toString();if(s.lines.show==null){var v,show=true;for(v in s)
if(s[v]&&s[v].show){show=false;break;}
if(show)
s.lines.show=true;}
if(s.lines.zero==null){s.lines.zero=!!s.lines.fill;}
s.xaxis=getOrCreateAxis(xaxes,axisNumber(s,"x"));s.yaxis=getOrCreateAxis(yaxes,axisNumber(s,"y"));}}
function processData(){var topSentry=Number.POSITIVE_INFINITY,bottomSentry=Number.NEGATIVE_INFINITY,fakeInfinity=Number.MAX_VALUE,i,j,k,m,length,s,points,ps,x,y,axis,val,f,p,data,format;function updateAxis(axis,min,max){if(min<axis.datamin&&min!=-fakeInfinity)
axis.datamin=min;if(max>axis.datamax&&max!=fakeInfinity)
axis.datamax=max;}
$.each(allAxes(),function(_,axis){axis.datamin=topSentry;axis.datamax=bottomSentry;axis.used=false;});for(i=0;i<series.length;++i){s=series[i];s.datapoints={points:[]};executeHooks(hooks.processRawData,[s,s.data,s.datapoints]);}
for(i=0;i<series.length;++i){s=series[i];data=s.data;format=s.datapoints.format;if(!format){format=[];format.push({x:true,number:true,required:true});format.push({y:true,number:true,required:true});if(s.bars.show||(s.lines.show&&s.lines.fill)){var autoscale=!!((s.bars.show&&s.bars.zero)||(s.lines.show&&s.lines.zero));format.push({y:true,number:true,required:false,defaultValue:0,autoscale:autoscale});if(s.bars.horizontal){delete format[format.length-1].y;format[format.length-1].x=true;}}
s.datapoints.format=format;}
if(s.datapoints.pointsize!=null)
continue;s.datapoints.pointsize=format.length;ps=s.datapoints.pointsize;points=s.datapoints.points;var insertSteps=s.lines.show&&s.lines.steps;s.xaxis.used=s.yaxis.used=true;for(j=k=0;j<data.length;++j,k+=ps){p=data[j];var nullify=p==null;if(!nullify){for(m=0;m<ps;++m){val=p[m];f=format[m];if(f){if(f.number&&val!=null){val=+val;if(isNaN(val))
val=null;else if(val==Infinity)
val=fakeInfinity;else if(val==-Infinity)
val=-fakeInfinity;}
if(val==null){if(f.required)
nullify=true;if(f.defaultValue!=null)
val=f.defaultValue;}}
points[k+m]=val;}}
if(nullify){for(m=0;m<ps;++m){val=points[k+m];if(val!=null){f=format[m];if(f.autoscale!==false){if(f.x){updateAxis(s.xaxis,val,val);}
if(f.y){updateAxis(s.yaxis,val,val);}}}
points[k+m]=null;}}
else{if(insertSteps&&k>0&&points[k-ps]!=null&&points[k-ps]!=points[k]&&points[k-ps+1]!=points[k+1]){for(m=0;m<ps;++m)
points[k+ps+m]=points[k+m];points[k+1]=points[k-ps+1];k+=ps;}}}}
for(i=0;i<series.length;++i){s=series[i];executeHooks(hooks.processDatapoints,[s,s.datapoints]);}
for(i=0;i<series.length;++i){s=series[i];points=s.datapoints.points;ps=s.datapoints.pointsize;format=s.datapoints.format;var xmin=topSentry,ymin=topSentry,xmax=bottomSentry,ymax=bottomSentry;for(j=0;j<points.length;j+=ps){if(points[j]==null)
continue;for(m=0;m<ps;++m){val=points[j+m];f=format[m];if(!f||f.autoscale===false||val==fakeInfinity||val==-fakeInfinity)
continue;if(f.x){if(val<xmin)
xmin=val;if(val>xmax)
xmax=val;}
if(f.y){if(val<ymin)
ymin=val;if(val>ymax)
ymax=val;}}}
if(s.bars.show){var delta;switch(s.bars.align){case"left":delta=0;break;case"right":delta=-s.bars.barWidth;break;default:delta=-s.bars.barWidth/2;}
if(s.bars.horizontal){ymin+=delta;ymax+=delta+s.bars.barWidth;}
else{xmin+=delta;xmax+=delta+s.bars.barWidth;}}
updateAxis(s.xaxis,xmin,xmax);updateAxis(s.yaxis,ymin,ymax);}
$.each(allAxes(),function(_,axis){if(axis.datamin==topSentry)
axis.datamin=null;if(axis.datamax==bottomSentry)
axis.datamax=null;});}
function setupCanvases(){placeholder.css("padding",0).children().filter(function(){return!$(this).hasClass("flot-overlay")&&!$(this).hasClass('flot-base');}).remove();if(placeholder.css("position")=='static')
placeholder.css("position","relative");surface=new Canvas("flot-base",placeholder);overlay=new Canvas("flot-overlay",placeholder);ctx=surface.context;octx=overlay.context;eventHolder=$(overlay.element).unbind();var existing=placeholder.data("plot");if(existing){existing.shutdown();overlay.clear();}
placeholder.data("plot",plot);}
function bindEvents(){if(options.grid.hoverable){eventHolder.mousemove(onMouseMove);eventHolder.bind("mouseleave",onMouseLeave);}
if(options.grid.clickable)
eventHolder.click(onClick);executeHooks(hooks.bindEvents,[eventHolder]);}
function shutdown(){if(redrawTimeout)
clearTimeout(redrawTimeout);eventHolder.unbind("mousemove",onMouseMove);eventHolder.unbind("mouseleave",onMouseLeave);eventHolder.unbind("click",onClick);executeHooks(hooks.shutdown,[eventHolder]);}
function setTransformationHelpers(axis){function identity(x){return x;}
var s,m,t=axis.options.transform||identity,it=axis.options.inverseTransform;if(axis.direction=="x"){s=axis.scale=plotWidth/Math.abs(t(axis.max)-t(axis.min));m=Math.min(t(axis.max),t(axis.min));}
else{s=axis.scale=plotHeight/Math.abs(t(axis.max)-t(axis.min));s=-s;m=Math.max(t(axis.max),t(axis.min));}
if(t==identity)
axis.p2c=function(p){return(p-m)*s;};else
axis.p2c=function(p){return(t(p)-m)*s;};if(!it)
axis.c2p=function(c){return m+c/s;};else
axis.c2p=function(c){return it(m+c/s);};}
function measureTickLabels(axis){var opts=axis.options,ticks=axis.ticks||[],labelWidth=opts.labelWidth||0,labelHeight=opts.labelHeight||0,maxWidth=labelWidth||(axis.direction=="x"?Math.floor(surface.width/(ticks.length||1)):null),legacyStyles=axis.direction+"Axis "+axis.direction+axis.n+"Axis",layer="flot-"+axis.direction+"-axis flot-"+axis.direction+axis.n+"-axis "+legacyStyles,font=opts.font||"flot-tick-label tickLabel";for(var i=0;i<ticks.length;++i){var t=ticks[i];if(!t.label)
continue;var info=surface.getTextInfo(layer,t.label,font,null,maxWidth);labelWidth=Math.max(labelWidth,info.width);labelHeight=Math.max(labelHeight,info.height);}
axis.labelWidth=opts.labelWidth||labelWidth;axis.labelHeight=opts.labelHeight||labelHeight;}
function allocateAxisBoxFirstPhase(axis){var lw=axis.labelWidth,lh=axis.labelHeight,pos=axis.options.position,isXAxis=axis.direction==="x",tickLength=axis.options.tickLength,axisMargin=options.grid.axisMargin,padding=options.grid.labelMargin,innermost=true,outermost=true,first=true,found=false;$.each(isXAxis?xaxes:yaxes,function(i,a){if(a&&a.reserveSpace){if(a===axis){found=true;}else if(a.options.position===pos){if(found){outermost=false;}else{innermost=false;}}
if(!found){first=false;}}});if(outermost){axisMargin=0;}
if(tickLength==null){tickLength=first?"full":5;}
if(!isNaN(+tickLength))
padding+=+tickLength;if(isXAxis){lh+=padding;if(pos=="bottom"){plotOffset.bottom+=lh+axisMargin;axis.box={top:surface.height-plotOffset.bottom,height:lh};}
else{axis.box={top:plotOffset.top+axisMargin,height:lh};plotOffset.top+=lh+axisMargin;}}
else{lw+=padding;if(pos=="left"){axis.box={left:plotOffset.left+axisMargin,width:lw};plotOffset.left+=lw+axisMargin;}
else{plotOffset.right+=lw+axisMargin;axis.box={left:surface.width-plotOffset.right,width:lw};}}
axis.position=pos;axis.tickLength=tickLength;axis.box.padding=padding;axis.innermost=innermost;}
function allocateAxisBoxSecondPhase(axis){if(axis.direction=="x"){axis.box.left=plotOffset.left-axis.labelWidth/2;axis.box.width=surface.width-plotOffset.left-plotOffset.right+axis.labelWidth;}
else{axis.box.top=plotOffset.top-axis.labelHeight/2;axis.box.height=surface.height-plotOffset.bottom-plotOffset.top+axis.labelHeight;}}
function adjustLayoutForThingsStickingOut(){var minMargin=options.grid.minBorderMargin,axis,i;if(minMargin==null){minMargin=0;for(i=0;i<series.length;++i)
minMargin=Math.max(minMargin,2*(series[i].points.radius+series[i].points.lineWidth/2));}
var margins={left:minMargin,right:minMargin,top:minMargin,bottom:minMargin};$.each(allAxes(),function(_,axis){if(axis.reserveSpace&&axis.ticks&&axis.ticks.length){var lastTick=axis.ticks[axis.ticks.length-1];if(axis.direction==="x"){margins.left=Math.max(margins.left,axis.labelWidth/2);if(lastTick.v<=axis.max){margins.right=Math.max(margins.right,axis.labelWidth/2);}}else{margins.bottom=Math.max(margins.bottom,axis.labelHeight/2);if(lastTick.v<=axis.max){margins.top=Math.max(margins.top,axis.labelHeight/2);}}}});plotOffset.left=Math.ceil(Math.max(margins.left,plotOffset.left));plotOffset.right=Math.ceil(Math.max(margins.right,plotOffset.right));plotOffset.top=Math.ceil(Math.max(margins.top,plotOffset.top));plotOffset.bottom=Math.ceil(Math.max(margins.bottom,plotOffset.bottom));}
function setupGrid(){var i,axes=allAxes(),showGrid=options.grid.show;for(var a in plotOffset){var margin=options.grid.margin||0;plotOffset[a]=typeof margin=="number"?margin:margin[a]||0;}
executeHooks(hooks.processOffset,[plotOffset]);for(var a in plotOffset){if(typeof(options.grid.borderWidth)=="object"){plotOffset[a]+=showGrid?options.grid.borderWidth[a]:0;}
else{plotOffset[a]+=showGrid?options.grid.borderWidth:0;}}
$.each(axes,function(_,axis){axis.show=axis.options.show;if(axis.show==null)
axis.show=axis.used;axis.reserveSpace=axis.show||axis.options.reserveSpace;setRange(axis);});if(showGrid){var allocatedAxes=$.grep(axes,function(axis){return axis.reserveSpace;});$.each(allocatedAxes,function(_,axis){setupTickGeneration(axis);setTicks(axis);snapRangeToTicks(axis,axis.ticks);measureTickLabels(axis);});for(i=allocatedAxes.length-1;i>=0;--i)
allocateAxisBoxFirstPhase(allocatedAxes[i]);adjustLayoutForThingsStickingOut();$.each(allocatedAxes,function(_,axis){allocateAxisBoxSecondPhase(axis);});}
plotWidth=surface.width-plotOffset.left-plotOffset.right;plotHeight=surface.height-plotOffset.bottom-plotOffset.top;$.each(axes,function(_,axis){setTransformationHelpers(axis);});if(showGrid){drawAxisLabels();}
insertLegend();}
function setRange(axis){var opts=axis.options,min=+(opts.min!=null?opts.min:axis.datamin),max=+(opts.max!=null?opts.max:axis.datamax),delta=max-min;if(delta==0.0){var widen=max==0?1:0.01;if(opts.min==null)
min-=widen;if(opts.max==null||opts.min!=null)
max+=widen;}
else{var margin=opts.autoscaleMargin;if(margin!=null){if(opts.min==null){min-=delta*margin;if(min<0&&axis.datamin!=null&&axis.datamin>=0)
min=0;}
if(opts.max==null){max+=delta*margin;if(max>0&&axis.datamax!=null&&axis.datamax<=0)
max=0;}}}
axis.min=min;axis.max=max;}
function setupTickGeneration(axis){var opts=axis.options;var noTicks;if(typeof opts.ticks=="number"&&opts.ticks>0)
noTicks=opts.ticks;else
noTicks=0.3*Math.sqrt(axis.direction=="x"?surface.width:surface.height);var delta=(axis.max-axis.min)/noTicks,dec=-Math.floor(Math.log(delta)/Math.LN10),maxDec=opts.tickDecimals;if(maxDec!=null&&dec>maxDec){dec=maxDec;}
var magn=Math.pow(10,-dec),norm=delta/magn,size;if(norm<1.5){size=1;}else if(norm<3){size=2;if(norm>2.25&&(maxDec==null||dec+1<=maxDec)){size=2.5;++dec;}}else if(norm<7.5){size=5;}else{size=10;}
size*=magn;if(opts.minTickSize!=null&&size<opts.minTickSize){size=opts.minTickSize;}
axis.delta=delta;axis.tickDecimals=Math.max(0,maxDec!=null?maxDec:dec);axis.tickSize=opts.tickSize||size;if(opts.mode=="time"&&!axis.tickGenerator){throw new Error("Time mode requires the flot.time plugin.");}
if(!axis.tickGenerator){axis.tickGenerator=function(axis){var ticks=[],start=floorInBase(axis.min,axis.tickSize),i=0,v=Number.NaN,prev;do{prev=v;v=start+i*axis.tickSize;ticks.push(v);++i;}while(v<axis.max&&v!=prev);return ticks;};axis.tickFormatter=function(value,axis){var factor=axis.tickDecimals?Math.pow(10,axis.tickDecimals):1;var formatted=""+Math.round(value*factor)/factor;if(axis.tickDecimals!=null){var decimal=formatted.indexOf(".");var precision=decimal==-1?0:formatted.length-decimal-1;if(precision<axis.tickDecimals){return(precision?formatted:formatted+".")+(""+factor).substr(1,axis.tickDecimals-precision);}}
return formatted;};}
if($.isFunction(opts.tickFormatter))
axis.tickFormatter=function(v,axis){return""+opts.tickFormatter(v,axis);};if(opts.alignTicksWithAxis!=null){var otherAxis=(axis.direction=="x"?xaxes:yaxes)[opts.alignTicksWithAxis-1];if(otherAxis&&otherAxis.used&&otherAxis!=axis){var niceTicks=axis.tickGenerator(axis);if(niceTicks.length>0){if(opts.min==null)
axis.min=Math.min(axis.min,niceTicks[0]);if(opts.max==null&&niceTicks.length>1)
axis.max=Math.max(axis.max,niceTicks[niceTicks.length-1]);}
axis.tickGenerator=function(axis){var ticks=[],v,i;for(i=0;i<otherAxis.ticks.length;++i){v=(otherAxis.ticks[i].v-otherAxis.min)/(otherAxis.max-otherAxis.min);v=axis.min+v*(axis.max-axis.min);ticks.push(v);}
return ticks;};if(!axis.mode&&opts.tickDecimals==null){var extraDec=Math.max(0,-Math.floor(Math.log(axis.delta)/Math.LN10)+1),ts=axis.tickGenerator(axis);if(!(ts.length>1&&/\..*0$/.test((ts[1]-ts[0]).toFixed(extraDec))))
axis.tickDecimals=extraDec;}}}}
function setTicks(axis){var oticks=axis.options.ticks,ticks=[];if(oticks==null||(typeof oticks=="number"&&oticks>0))
ticks=axis.tickGenerator(axis);else if(oticks){if($.isFunction(oticks))
ticks=oticks(axis);else
ticks=oticks;}
var i,v;axis.ticks=[];for(i=0;i<ticks.length;++i){var label=null;var t=ticks[i];if(typeof t=="object"){v=+t[0];if(t.length>1)
label=t[1];}
else
v=+t;if(label==null)
label=axis.tickFormatter(v,axis);if(!isNaN(v))
axis.ticks.push({v:v,label:label});}}
function snapRangeToTicks(axis,ticks){if(axis.options.autoscaleMargin&&ticks.length>0){if(axis.options.min==null)
axis.min=Math.min(axis.min,ticks[0].v);if(axis.options.max==null&&ticks.length>1)
axis.max=Math.max(axis.max,ticks[ticks.length-1].v);}}
function draw(){surface.clear();executeHooks(hooks.drawBackground,[ctx]);var grid=options.grid;if(grid.show&&grid.backgroundColor)
drawBackground();if(grid.show&&!grid.aboveData){drawGrid();}
for(var i=0;i<series.length;++i){executeHooks(hooks.drawSeries,[ctx,series[i]]);drawSeries(series[i]);}
executeHooks(hooks.draw,[ctx]);if(grid.show&&grid.aboveData){drawGrid();}
surface.render();triggerRedrawOverlay();}
function extractRange(ranges,coord){var axis,from,to,key,axes=allAxes();for(var i=0;i<axes.length;++i){axis=axes[i];if(axis.direction==coord){key=coord+axis.n+"axis";if(!ranges[key]&&axis.n==1)
key=coord+"axis";if(ranges[key]){from=ranges[key].from;to=ranges[key].to;break;}}}
if(!ranges[key]){axis=coord=="x"?xaxes[0]:yaxes[0];from=ranges[coord+"1"];to=ranges[coord+"2"];}
if(from!=null&&to!=null&&from>to){var tmp=from;from=to;to=tmp;}
return{from:from,to:to,axis:axis};}
function drawBackground(){ctx.save();ctx.translate(plotOffset.left,plotOffset.top);ctx.fillStyle=getColorOrGradient(options.grid.backgroundColor,plotHeight,0,"rgba(255, 255, 255, 0)");ctx.fillRect(0,0,plotWidth,plotHeight);ctx.restore();}
function drawGrid(){var i,axes,bw,bc;ctx.save();ctx.translate(plotOffset.left,plotOffset.top);var markings=options.grid.markings;if(markings){if($.isFunction(markings)){axes=plot.getAxes();axes.xmin=axes.xaxis.min;axes.xmax=axes.xaxis.max;axes.ymin=axes.yaxis.min;axes.ymax=axes.yaxis.max;markings=markings(axes);}
for(i=0;i<markings.length;++i){var m=markings[i],xrange=extractRange(m,"x"),yrange=extractRange(m,"y");if(xrange.from==null)
xrange.from=xrange.axis.min;if(xrange.to==null)
xrange.to=xrange.axis.max;if(yrange.from==null)
yrange.from=yrange.axis.min;if(yrange.to==null)
yrange.to=yrange.axis.max;if(xrange.to<xrange.axis.min||xrange.from>xrange.axis.max||yrange.to<yrange.axis.min||yrange.from>yrange.axis.max)
continue;xrange.from=Math.max(xrange.from,xrange.axis.min);xrange.to=Math.min(xrange.to,xrange.axis.max);yrange.from=Math.max(yrange.from,yrange.axis.min);yrange.to=Math.min(yrange.to,yrange.axis.max);if(xrange.from==xrange.to&&yrange.from==yrange.to)
continue;xrange.from=xrange.axis.p2c(xrange.from);xrange.to=xrange.axis.p2c(xrange.to);yrange.from=yrange.axis.p2c(yrange.from);yrange.to=yrange.axis.p2c(yrange.to);if(xrange.from==xrange.to||yrange.from==yrange.to){ctx.beginPath();ctx.strokeStyle=m.color||options.grid.markingsColor;ctx.lineWidth=m.lineWidth||options.grid.markingsLineWidth;ctx.moveTo(xrange.from,yrange.from);ctx.lineTo(xrange.to,yrange.to);ctx.stroke();}
else{ctx.fillStyle=m.color||options.grid.markingsColor;ctx.fillRect(xrange.from,yrange.to,xrange.to-xrange.from,yrange.from-yrange.to);}}}
axes=allAxes();bw=options.grid.borderWidth;for(var j=0;j<axes.length;++j){var axis=axes[j],box=axis.box,t=axis.tickLength,x,y,xoff,yoff;if(!axis.show||axis.ticks.length==0)
continue;ctx.lineWidth=1;if(axis.direction=="x"){x=0;if(t=="full")
y=(axis.position=="top"?0:plotHeight);else
y=box.top-plotOffset.top+(axis.position=="top"?box.height:0);}
else{y=0;if(t=="full")
x=(axis.position=="left"?0:plotWidth);else
x=box.left-plotOffset.left+(axis.position=="left"?box.width:0);}
if(!axis.innermost){ctx.strokeStyle=axis.options.color;ctx.beginPath();xoff=yoff=0;if(axis.direction=="x")
xoff=plotWidth+1;else
yoff=plotHeight+1;if(ctx.lineWidth==1){if(axis.direction=="x"){y=Math.floor(y)+0.5;}else{x=Math.floor(x)+0.5;}}
ctx.moveTo(x,y);ctx.lineTo(x+xoff,y+yoff);ctx.stroke();}
ctx.strokeStyle=axis.options.tickColor;ctx.beginPath();for(i=0;i<axis.ticks.length;++i){var v=axis.ticks[i].v;xoff=yoff=0;if(isNaN(v)||v<axis.min||v>axis.max||(t=="full"&&((typeof bw=="object"&&bw[axis.position]>0)||bw>0)&&(v==axis.min||v==axis.max)))
continue;if(axis.direction=="x"){x=axis.p2c(v);yoff=t=="full"?-plotHeight:t;if(axis.position=="top")
yoff=-yoff;}
else{y=axis.p2c(v);xoff=t=="full"?-plotWidth:t;if(axis.position=="left")
xoff=-xoff;}
if(ctx.lineWidth==1){if(axis.direction=="x")
x=Math.floor(x)+0.5;else
y=Math.floor(y)+0.5;}
ctx.moveTo(x,y);ctx.lineTo(x+xoff,y+yoff);}
ctx.stroke();}
if(bw){bc=options.grid.borderColor;if(typeof bw=="object"||typeof bc=="object"){if(typeof bw!=="object"){bw={top:bw,right:bw,bottom:bw,left:bw};}
if(typeof bc!=="object"){bc={top:bc,right:bc,bottom:bc,left:bc};}
if(bw.top>0){ctx.strokeStyle=bc.top;ctx.lineWidth=bw.top;ctx.beginPath();ctx.moveTo(0-bw.left,0-bw.top/2);ctx.lineTo(plotWidth,0-bw.top/2);ctx.stroke();}
if(bw.right>0){ctx.strokeStyle=bc.right;ctx.lineWidth=bw.right;ctx.beginPath();ctx.moveTo(plotWidth+bw.right/2,0-bw.top);ctx.lineTo(plotWidth+bw.right/2,plotHeight);ctx.stroke();}
if(bw.bottom>0){ctx.strokeStyle=bc.bottom;ctx.lineWidth=bw.bottom;ctx.beginPath();ctx.moveTo(plotWidth+bw.right,plotHeight+bw.bottom/2);ctx.lineTo(0,plotHeight+bw.bottom/2);ctx.stroke();}
if(bw.left>0){ctx.strokeStyle=bc.left;ctx.lineWidth=bw.left;ctx.beginPath();ctx.moveTo(0-bw.left/2,plotHeight+bw.bottom);ctx.lineTo(0-bw.left/2,0);ctx.stroke();}}
else{ctx.lineWidth=bw;ctx.strokeStyle=options.grid.borderColor;ctx.strokeRect(-bw/2,-bw/2,plotWidth+bw,plotHeight+bw);}}
ctx.restore();}
function drawAxisLabels(){$.each(allAxes(),function(_,axis){var box=axis.box,legacyStyles=axis.direction+"Axis "+axis.direction+axis.n+"Axis",layer="flot-"+axis.direction+"-axis flot-"+axis.direction+axis.n+"-axis "+legacyStyles,font=axis.options.font||"flot-tick-label tickLabel",tick,x,y,halign,valign;surface.removeText(layer);if(!axis.show||axis.ticks.length==0)
return;for(var i=0;i<axis.ticks.length;++i){tick=axis.ticks[i];if(!tick.label||tick.v<axis.min||tick.v>axis.max)
continue;if(axis.direction=="x"){halign="center";x=plotOffset.left+axis.p2c(tick.v);if(axis.position=="bottom"){y=box.top+box.padding;}else{y=box.top+box.height-box.padding;valign="bottom";}}else{valign="middle";y=plotOffset.top+axis.p2c(tick.v);if(axis.position=="left"){x=box.left+box.width-box.padding;halign="right";}else{x=box.left+box.padding;}}
surface.addText(layer,x,y,tick.label,font,null,null,halign,valign);}});}
function drawSeries(series){if(series.lines.show)
drawSeriesLines(series);if(series.bars.show)
drawSeriesBars(series);if(series.points.show)
drawSeriesPoints(series);}
function drawSeriesLines(series){function plotLine(datapoints,xoffset,yoffset,axisx,axisy){var points=datapoints.points,ps=datapoints.pointsize,prevx=null,prevy=null;ctx.beginPath();for(var i=ps;i<points.length;i+=ps){var x1=points[i-ps],y1=points[i-ps+1],x2=points[i],y2=points[i+1];if(x1==null||x2==null)
continue;if(y1<=y2&&y1<axisy.min){if(y2<axisy.min)
continue;x1=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.min;}
else if(y2<=y1&&y2<axisy.min){if(y1<axisy.min)
continue;x2=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.min;}
if(y1>=y2&&y1>axisy.max){if(y2>axisy.max)
continue;x1=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.max;}
else if(y2>=y1&&y2>axisy.max){if(y1>axisy.max)
continue;x2=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.max;}
if(x1<=x2&&x1<axisx.min){if(x2<axisx.min)
continue;y1=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.min;}
else if(x2<=x1&&x2<axisx.min){if(x1<axisx.min)
continue;y2=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.min;}
if(x1>=x2&&x1>axisx.max){if(x2>axisx.max)
continue;y1=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.max;}
else if(x2>=x1&&x2>axisx.max){if(x1>axisx.max)
continue;y2=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.max;}
if(x1!=prevx||y1!=prevy)
ctx.moveTo(axisx.p2c(x1)+xoffset,axisy.p2c(y1)+yoffset);prevx=x2;prevy=y2;ctx.lineTo(axisx.p2c(x2)+xoffset,axisy.p2c(y2)+yoffset);}
ctx.stroke();}
function plotLineArea(datapoints,axisx,axisy){var points=datapoints.points,ps=datapoints.pointsize,bottom=Math.min(Math.max(0,axisy.min),axisy.max),i=0,top,areaOpen=false,ypos=1,segmentStart=0,segmentEnd=0;while(true){if(ps>0&&i>points.length+ps)
break;i+=ps;var x1=points[i-ps],y1=points[i-ps+ypos],x2=points[i],y2=points[i+ypos];if(areaOpen){if(ps>0&&x1!=null&&x2==null){segmentEnd=i;ps=-ps;ypos=2;continue;}
if(ps<0&&i==segmentStart+ps){ctx.fill();areaOpen=false;ps=-ps;ypos=1;i=segmentStart=segmentEnd+ps;continue;}}
if(x1==null||x2==null)
continue;if(x1<=x2&&x1<axisx.min){if(x2<axisx.min)
continue;y1=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.min;}
else if(x2<=x1&&x2<axisx.min){if(x1<axisx.min)
continue;y2=(axisx.min-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.min;}
if(x1>=x2&&x1>axisx.max){if(x2>axisx.max)
continue;y1=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x1=axisx.max;}
else if(x2>=x1&&x2>axisx.max){if(x1>axisx.max)
continue;y2=(axisx.max-x1)/(x2-x1)*(y2-y1)+y1;x2=axisx.max;}
if(!areaOpen){ctx.beginPath();ctx.moveTo(axisx.p2c(x1),axisy.p2c(bottom));areaOpen=true;}
if(y1>=axisy.max&&y2>=axisy.max){ctx.lineTo(axisx.p2c(x1),axisy.p2c(axisy.max));ctx.lineTo(axisx.p2c(x2),axisy.p2c(axisy.max));continue;}
else if(y1<=axisy.min&&y2<=axisy.min){ctx.lineTo(axisx.p2c(x1),axisy.p2c(axisy.min));ctx.lineTo(axisx.p2c(x2),axisy.p2c(axisy.min));continue;}
var x1old=x1,x2old=x2;if(y1<=y2&&y1<axisy.min&&y2>=axisy.min){x1=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.min;}
else if(y2<=y1&&y2<axisy.min&&y1>=axisy.min){x2=(axisy.min-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.min;}
if(y1>=y2&&y1>axisy.max&&y2<=axisy.max){x1=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y1=axisy.max;}
else if(y2>=y1&&y2>axisy.max&&y1<=axisy.max){x2=(axisy.max-y1)/(y2-y1)*(x2-x1)+x1;y2=axisy.max;}
if(x1!=x1old){ctx.lineTo(axisx.p2c(x1old),axisy.p2c(y1));}
ctx.lineTo(axisx.p2c(x1),axisy.p2c(y1));ctx.lineTo(axisx.p2c(x2),axisy.p2c(y2));if(x2!=x2old){ctx.lineTo(axisx.p2c(x2),axisy.p2c(y2));ctx.lineTo(axisx.p2c(x2old),axisy.p2c(y2));}}}
ctx.save();ctx.translate(plotOffset.left,plotOffset.top);ctx.lineJoin="round";var lw=series.lines.lineWidth,sw=series.shadowSize;if(lw>0&&sw>0){ctx.lineWidth=sw;ctx.strokeStyle="rgba(0,0,0,0.1)";var angle=Math.PI/18;plotLine(series.datapoints,Math.sin(angle)*(lw/2+sw/2),Math.cos(angle)*(lw/2+sw/2),series.xaxis,series.yaxis);ctx.lineWidth=sw/2;plotLine(series.datapoints,Math.sin(angle)*(lw/2+sw/4),Math.cos(angle)*(lw/2+sw/4),series.xaxis,series.yaxis);}
ctx.lineWidth=lw;ctx.strokeStyle=series.color;var fillStyle=getFillStyle(series.lines,series.color,0,plotHeight);if(fillStyle){ctx.fillStyle=fillStyle;plotLineArea(series.datapoints,series.xaxis,series.yaxis);}
if(lw>0)
plotLine(series.datapoints,0,0,series.xaxis,series.yaxis);ctx.restore();}
function drawSeriesPoints(series){function plotPoints(datapoints,radius,fillStyle,offset,shadow,axisx,axisy,symbol){var points=datapoints.points,ps=datapoints.pointsize;for(var i=0;i<points.length;i+=ps){var x=points[i],y=points[i+1];if(x==null||x<axisx.min||x>axisx.max||y<axisy.min||y>axisy.max)
continue;ctx.beginPath();x=axisx.p2c(x);y=axisy.p2c(y)+offset;if(symbol=="circle")
ctx.arc(x,y,radius,0,shadow?Math.PI:Math.PI*2,false);else
symbol(ctx,x,y,radius,shadow);ctx.closePath();if(fillStyle){ctx.fillStyle=fillStyle;ctx.fill();}
ctx.stroke();}}
ctx.save();ctx.translate(plotOffset.left,plotOffset.top);var lw=series.points.lineWidth,sw=series.shadowSize,radius=series.points.radius,symbol=series.points.symbol;if(lw==0)
lw=0.0001;if(lw>0&&sw>0){var w=sw/2;ctx.lineWidth=w;ctx.strokeStyle="rgba(0,0,0,0.1)";plotPoints(series.datapoints,radius,null,w+w/2,true,series.xaxis,series.yaxis,symbol);ctx.strokeStyle="rgba(0,0,0,0.2)";plotPoints(series.datapoints,radius,null,w/2,true,series.xaxis,series.yaxis,symbol);}
ctx.lineWidth=lw;ctx.strokeStyle=series.color;plotPoints(series.datapoints,radius,getFillStyle(series.points,series.color),0,false,series.xaxis,series.yaxis,symbol);ctx.restore();}
function drawBar(x,y,b,barLeft,barRight,fillStyleCallback,axisx,axisy,c,horizontal,lineWidth){var left,right,bottom,top,drawLeft,drawRight,drawTop,drawBottom,tmp;if(horizontal){drawBottom=drawRight=drawTop=true;drawLeft=false;left=b;right=x;top=y+barLeft;bottom=y+barRight;if(right<left){tmp=right;right=left;left=tmp;drawLeft=true;drawRight=false;}}
else{drawLeft=drawRight=drawTop=true;drawBottom=false;left=x+barLeft;right=x+barRight;bottom=b;top=y;if(top<bottom){tmp=top;top=bottom;bottom=tmp;drawBottom=true;drawTop=false;}}
if(right<axisx.min||left>axisx.max||top<axisy.min||bottom>axisy.max)
return;if(left<axisx.min){left=axisx.min;drawLeft=false;}
if(right>axisx.max){right=axisx.max;drawRight=false;}
if(bottom<axisy.min){bottom=axisy.min;drawBottom=false;}
if(top>axisy.max){top=axisy.max;drawTop=false;}
left=axisx.p2c(left);bottom=axisy.p2c(bottom);right=axisx.p2c(right);top=axisy.p2c(top);if(fillStyleCallback){c.fillStyle=fillStyleCallback(bottom,top);c.fillRect(left,top,right-left,bottom-top)}
if(lineWidth>0&&(drawLeft||drawRight||drawTop||drawBottom)){c.beginPath();c.moveTo(left,bottom);if(drawLeft)
c.lineTo(left,top);else
c.moveTo(left,top);if(drawTop)
c.lineTo(right,top);else
c.moveTo(right,top);if(drawRight)
c.lineTo(right,bottom);else
c.moveTo(right,bottom);if(drawBottom)
c.lineTo(left,bottom);else
c.moveTo(left,bottom);c.stroke();}}
function drawSeriesBars(series){function plotBars(datapoints,barLeft,barRight,fillStyleCallback,axisx,axisy){var points=datapoints.points,ps=datapoints.pointsize;for(var i=0;i<points.length;i+=ps){if(points[i]==null)
continue;drawBar(points[i],points[i+1],points[i+2],barLeft,barRight,fillStyleCallback,axisx,axisy,ctx,series.bars.horizontal,series.bars.lineWidth);}}
ctx.save();ctx.translate(plotOffset.left,plotOffset.top);ctx.lineWidth=series.bars.lineWidth;ctx.strokeStyle=series.color;var barLeft;switch(series.bars.align){case"left":barLeft=0;break;case"right":barLeft=-series.bars.barWidth;break;default:barLeft=-series.bars.barWidth/2;}
var fillStyleCallback=series.bars.fill?function(bottom,top){return getFillStyle(series.bars,series.color,bottom,top);}:null;plotBars(series.datapoints,barLeft,barLeft+series.bars.barWidth,fillStyleCallback,series.xaxis,series.yaxis);ctx.restore();}
function getFillStyle(filloptions,seriesColor,bottom,top){var fill=filloptions.fill;if(!fill)
return null;if(filloptions.fillColor)
return getColorOrGradient(filloptions.fillColor,bottom,top,seriesColor);var c=$.color.parse(seriesColor);c.a=typeof fill=="number"?fill:0.4;c.normalize();return c.toString();}
function insertLegend(){if(options.legend.container!=null){$(options.legend.container).html("");}else{placeholder.find(".legend").remove();}
if(!options.legend.show){return;}
var fragments=[],entries=[],rowStarted=false,lf=options.legend.labelFormatter,s,label;for(var i=0;i<series.length;++i){s=series[i];if(s.label){label=lf?lf(s.label,s):s.label;if(label){entries.push({label:label,color:s.color});}}}
if(options.legend.sorted){if($.isFunction(options.legend.sorted)){entries.sort(options.legend.sorted);}else if(options.legend.sorted=="reverse"){entries.reverse();}else{var ascending=options.legend.sorted!="descending";entries.sort(function(a,b){return a.label==b.label?0:((a.label<b.label)!=ascending?1:-1);});}}
for(var i=0;i<entries.length;++i){var entry=entries[i];if(i%options.legend.noColumns==0){if(rowStarted)
fragments.push('</tr>');fragments.push('<tr>');rowStarted=true;}
fragments.push('<td class="legendColorBox"><div style="border:1px solid '+options.legend.labelBoxBorderColor+';padding:1px"><div style="width:4px;height:0;border:5px solid '+entry.color+';overflow:hidden"></div></div></td>'+'<td class="legendLabel">'+entry.label+'</td>');}
if(rowStarted)
fragments.push('</tr>');if(fragments.length==0)
return;var table='<table style="font-size:smaller;color:'+options.grid.color+'">'+fragments.join("")+'</table>';if(options.legend.container!=null)
$(options.legend.container).html(table);else{var pos="",p=options.legend.position,m=options.legend.margin;if(m[0]==null)
m=[m,m];if(p.charAt(0)=="n")
pos+='top:'+(m[1]+plotOffset.top)+'px;';else if(p.charAt(0)=="s")
pos+='bottom:'+(m[1]+plotOffset.bottom)+'px;';if(p.charAt(1)=="e")
pos+='right:'+(m[0]+plotOffset.right)+'px;';else if(p.charAt(1)=="w")
pos+='left:'+(m[0]+plotOffset.left)+'px;';var legend=$('<div class="legend">'+table.replace('style="','style="position:absolute;'+pos+';')+'</div>').appendTo(placeholder);if(options.legend.backgroundOpacity!=0.0){var c=options.legend.backgroundColor;if(c==null){c=options.grid.backgroundColor;if(c&&typeof c=="string")
c=$.color.parse(c);else
c=$.color.extract(legend,'background-color');c.a=1;c=c.toString();}
var div=legend.children();$('<div style="position:absolute;width:'+div.width()+'px;height:'+div.height()+'px;'+pos+'background-color:'+c+';"> </div>').prependTo(legend).css('opacity',options.legend.backgroundOpacity);}}}
var highlights=[],redrawTimeout=null;function findNearbyItem(mouseX,mouseY,seriesFilter){var maxDistance=options.grid.mouseActiveRadius,smallestDistance=maxDistance*maxDistance+1,item=null,foundPoint=false,i,j,ps;for(i=series.length-1;i>=0;--i){if(!seriesFilter(series[i]))
continue;var s=series[i],axisx=s.xaxis,axisy=s.yaxis,points=s.datapoints.points,mx=axisx.c2p(mouseX),my=axisy.c2p(mouseY),maxx=maxDistance/axisx.scale,maxy=maxDistance/axisy.scale;ps=s.datapoints.pointsize;if(axisx.options.inverseTransform)
maxx=Number.MAX_VALUE;if(axisy.options.inverseTransform)
maxy=Number.MAX_VALUE;if(s.lines.show||s.points.show){for(j=0;j<points.length;j+=ps){var x=points[j],y=points[j+1];if(x==null)
continue;if(x-mx>maxx||x-mx<-maxx||y-my>maxy||y-my<-maxy)
continue;var dx=Math.abs(axisx.p2c(x)-mouseX),dy=Math.abs(axisy.p2c(y)-mouseY),dist=dx*dx+dy*dy;if(dist<smallestDistance){smallestDistance=dist;item=[i,j/ps];}}}
if(s.bars.show&&!item){var barLeft,barRight;switch(s.bars.align){case"left":barLeft=0;break;case"right":barLeft=-s.bars.barWidth;break;default:barLeft=-s.bars.barWidth/2;}
barRight=barLeft+s.bars.barWidth;for(j=0;j<points.length;j+=ps){var x=points[j],y=points[j+1],b=points[j+2];if(x==null)
continue;if(series[i].bars.horizontal?(mx<=Math.max(b,x)&&mx>=Math.min(b,x)&&my>=y+barLeft&&my<=y+barRight):(mx>=x+barLeft&&mx<=x+barRight&&my>=Math.min(b,y)&&my<=Math.max(b,y)))
item=[i,j/ps];}}}
if(item){i=item[0];j=item[1];ps=series[i].datapoints.pointsize;return{datapoint:series[i].datapoints.points.slice(j*ps,(j+1)*ps),dataIndex:j,series:series[i],seriesIndex:i};}
return null;}
function onMouseMove(e){if(options.grid.hoverable)
triggerClickHoverEvent("plothover",e,function(s){return s["hoverable"]!=false;});}
function onMouseLeave(e){if(options.grid.hoverable)
triggerClickHoverEvent("plothover",e,function(s){return false;});}
function onClick(e){triggerClickHoverEvent("plotclick",e,function(s){return s["clickable"]!=false;});}
function triggerClickHoverEvent(eventname,event,seriesFilter){var offset=eventHolder.offset(),canvasX=event.pageX-offset.left-plotOffset.left,canvasY=event.pageY-offset.top-plotOffset.top,pos=canvasToAxisCoords({left:canvasX,top:canvasY});pos.pageX=event.pageX;pos.pageY=event.pageY;var item=findNearbyItem(canvasX,canvasY,seriesFilter);if(item){item.pageX=parseInt(item.series.xaxis.p2c(item.datapoint[0])+offset.left+plotOffset.left,10);item.pageY=parseInt(item.series.yaxis.p2c(item.datapoint[1])+offset.top+plotOffset.top,10);}
if(options.grid.autoHighlight){for(var i=0;i<highlights.length;++i){var h=highlights[i];if(h.auto==eventname&&!(item&&h.series==item.series&&h.point[0]==item.datapoint[0]&&h.point[1]==item.datapoint[1]))
unhighlight(h.series,h.point);}
if(item)
highlight(item.series,item.datapoint,eventname);}
placeholder.trigger(eventname,[pos,item]);}
function triggerRedrawOverlay(){var t=options.interaction.redrawOverlayInterval;if(t==-1){drawOverlay();return;}
if(!redrawTimeout)
redrawTimeout=setTimeout(drawOverlay,t);}
function drawOverlay(){redrawTimeout=null;octx.save();overlay.clear();octx.translate(plotOffset.left,plotOffset.top);var i,hi;for(i=0;i<highlights.length;++i){hi=highlights[i];if(hi.series.bars.show)
drawBarHighlight(hi.series,hi.point);else
drawPointHighlight(hi.series,hi.point);}
octx.restore();executeHooks(hooks.drawOverlay,[octx]);}
function highlight(s,point,auto){if(typeof s=="number")
s=series[s];if(typeof point=="number"){var ps=s.datapoints.pointsize;point=s.datapoints.points.slice(ps*point,ps*(point+1));}
var i=indexOfHighlight(s,point);if(i==-1){highlights.push({series:s,point:point,auto:auto});triggerRedrawOverlay();}
else if(!auto)
highlights[i].auto=false;}
function unhighlight(s,point){if(s==null&&point==null){highlights=[];triggerRedrawOverlay();return;}
if(typeof s=="number")
s=series[s];if(typeof point=="number"){var ps=s.datapoints.pointsize;point=s.datapoints.points.slice(ps*point,ps*(point+1));}
var i=indexOfHighlight(s,point);if(i!=-1){highlights.splice(i,1);triggerRedrawOverlay();}}
function indexOfHighlight(s,p){for(var i=0;i<highlights.length;++i){var h=highlights[i];if(h.series==s&&h.point[0]==p[0]&&h.point[1]==p[1])
return i;}
return-1;}
function drawPointHighlight(series,point){var x=point[0],y=point[1],axisx=series.xaxis,axisy=series.yaxis,highlightColor=(typeof series.highlightColor==="string")?series.highlightColor:$.color.parse(series.color).scale('a',0.5).toString();if(x<axisx.min||x>axisx.max||y<axisy.min||y>axisy.max)
return;var pointRadius=series.points.radius+series.points.lineWidth/2;octx.lineWidth=pointRadius;octx.strokeStyle=highlightColor;var radius=1.5*pointRadius;x=axisx.p2c(x);y=axisy.p2c(y);octx.beginPath();if(series.points.symbol=="circle")
octx.arc(x,y,radius,0,2*Math.PI,false);else
series.points.symbol(octx,x,y,radius,false);octx.closePath();octx.stroke();}
function drawBarHighlight(series,point){var highlightColor=(typeof series.highlightColor==="string")?series.highlightColor:$.color.parse(series.color).scale('a',0.5).toString(),fillStyle=highlightColor,barLeft;switch(series.bars.align){case"left":barLeft=0;break;case"right":barLeft=-series.bars.barWidth;break;default:barLeft=-series.bars.barWidth/2;}
octx.lineWidth=series.bars.lineWidth;octx.strokeStyle=highlightColor;drawBar(point[0],point[1],point[2]||0,barLeft,barLeft+series.bars.barWidth,function(){return fillStyle;},series.xaxis,series.yaxis,octx,series.bars.horizontal,series.bars.lineWidth);}
function getColorOrGradient(spec,bottom,top,defaultColor){if(typeof spec=="string")
return spec;else{var gradient=ctx.createLinearGradient(0,top,0,bottom);for(var i=0,l=spec.colors.length;i<l;++i){var c=spec.colors[i];if(typeof c!="string"){var co=$.color.parse(defaultColor);if(c.brightness!=null)
co=co.scale('rgb',c.brightness);if(c.opacity!=null)
co.a*=c.opacity;c=co.toString();}
gradient.addColorStop(i/(l-1),c);}
return gradient;}}}
$.plot=function(placeholder,data,options){var plot=new Plot($(placeholder),data,options,$.plot.plugins);return plot;};$.plot.version="0.8.2";$.plot.plugins=[];$.fn.plot=function(data,options){return this.each(function(){$.plot(this,data,options);});};function floorInBase(n,base){return base*Math.floor(n/base);}})(jQuery);(function($,t,n){function p(){for(var n=r.length-1;n>=0;n--){var o=$(r[n]);if(o[0]==t||o.is(":visible")){var h=o.width(),d=o.height(),v=o.data(a);!v||h===v.w&&d===v.h?i[f]=i[l]:(i[f]=i[c],o.trigger(u,[v.w=h,v.h=d]))}else v=o.data(a),v.w=0,v.h=0}s!==null&&(s=t.requestAnimationFrame(p))}var r=[],i=$.resize=$.extend($.resize,{}),s,o="setTimeout",u="resize",a=u+"-special-event",f="delay",l="pendingDelay",c="activeDelay",h="throttleWindow";i[l]=250,i[c]=20,i[f]=i[l],i[h]=!0,$.event.special[u]={setup:function(){if(!i[h]&&this[o])return!1;var t=$(this);r.push(this),t.data(a,{w:t.width(),h:t.height()}),r.length===1&&(s=n,p())},teardown:function(){if(!i[h]&&this[o])return!1;var t=$(this);for(var n=r.length-1;n>=0;n--)if(r[n]==this){r.splice(n,1);break}t.removeData(a),r.length||(cancelAnimationFrame(s),s=null)},add:function(t){function s(t,i,s){var o=$(this),u=o.data(a);u.w=i!==n?i:o.width(),u.h=s!==n?s:o.height(),r.apply(this,arguments)}if(!i[h]&&this[o])return!1;var r;if($.isFunction(t))return r=t,s;r=t.handler,t.handler=s}},t.requestAnimationFrame||(t.requestAnimationFrame=function(){return t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(e,n){return t.setTimeout(e,i[f])}}()),t.cancelAnimationFrame||(t.cancelAnimationFrame=function(){return t.webkitCancelRequestAnimationFrame||t.mozCancelRequestAnimationFrame||t.oCancelRequestAnimationFrame||t.msCancelRequestAnimationFrame||clearTimeout}())})(jQuery,this);(function($){var options={};function init(plot){function onResize(){var placeholder=plot.getPlaceholder();if(placeholder.width()==0||placeholder.height()==0)
return;plot.resize();plot.setupGrid();plot.draw();}
function bindEvents(plot,eventHolder){plot.getPlaceholder().resize(onResize);}
function shutdown(plot,eventHolder){plot.getPlaceholder().unbind("resize",onResize);}
plot.hooks.bindEvents.push(bindEvents);plot.hooks.shutdown.push(shutdown);}
$.plot.plugins.push({init:init,options:options,name:'resize',version:'1.0'});})(jQuery);(function($){var options={xaxis:{categories:null},yaxis:{categories:null}};function processRawData(plot,series,data,datapoints){var xCategories=series.xaxis.options.mode=="categories",yCategories=series.yaxis.options.mode=="categories";if(!(xCategories||yCategories))
return;var format=datapoints.format;if(!format){var s=series;format=[];format.push({x:true,number:true,required:true});format.push({y:true,number:true,required:true});if(s.bars.show||(s.lines.show&&s.lines.fill)){var autoscale=!!((s.bars.show&&s.bars.zero)||(s.lines.show&&s.lines.zero));format.push({y:true,number:true,required:false,defaultValue:0,autoscale:autoscale});if(s.bars.horizontal){delete format[format.length-1].y;format[format.length-1].x=true;}}
datapoints.format=format;}
for(var m=0;m<format.length;++m){if(format[m].x&&xCategories)
format[m].number=false;if(format[m].y&&yCategories)
format[m].number=false;}}
function getNextIndex(categories){var index=-1;for(var v in categories)
if(categories[v]>index)
index=categories[v];return index+1;}
function categoriesTickGenerator(axis){var res=[];for(var label in axis.categories){var v=axis.categories[label];if(v>=axis.min&&v<=axis.max)
res.push([v,label]);}
res.sort(function(a,b){return a[0]-b[0];});return res;}
function setupCategoriesForAxis(series,axis,datapoints){if(series[axis].options.mode!="categories")
return;if(!series[axis].categories){var c={},o=series[axis].options.categories||{};if($.isArray(o)){for(var i=0;i<o.length;++i)
c[o[i]]=i;}
else{for(var v in o)
c[v]=o[v];}
series[axis].categories=c;}
if(!series[axis].options.ticks)
series[axis].options.ticks=categoriesTickGenerator;transformPointsOnAxis(datapoints,axis,series[axis].categories);}
function transformPointsOnAxis(datapoints,axis,categories){var points=datapoints.points,ps=datapoints.pointsize,format=datapoints.format,formatColumn=axis.charAt(0),index=getNextIndex(categories);for(var i=0;i<points.length;i+=ps){if(points[i]==null)
continue;for(var m=0;m<ps;++m){var val=points[i+m];if(val==null||!format[m][formatColumn])
continue;if(!(val in categories)){categories[val]=index;++index;}
points[i+m]=categories[val];}}}
function processDatapoints(plot,series,datapoints){setupCategoriesForAxis(series,"xaxis",datapoints);setupCategoriesForAxis(series,"yaxis",datapoints);}
function init(plot){plot.hooks.processRawData.push(processRawData);plot.hooks.processDatapoints.push(processDatapoints);}
$.plot.plugins.push({init:init,options:options,name:'categories',version:'1.0'});})(jQuery);(function($){var options={};function canvasSupported(){return!!document.createElement('canvas').getContext;}
function canvasTextSupported(){if(!canvasSupported()){return false;}
var dummy_canvas=document.createElement('canvas');var context=dummy_canvas.getContext('2d');return typeof context.fillText=='function';}
function css3TransitionSupported(){var div=document.createElement('div');return typeof div.style.MozTransition!='undefined'||typeof div.style.OTransition!='undefined'||typeof div.style.webkitTransition!='undefined'||typeof div.style.transition!='undefined';}
function AxisLabel(axisName,position,padding,plot,opts){this.axisName=axisName;this.position=position;this.padding=padding;this.plot=plot;this.opts=opts;this.width=0;this.height=0;}
CanvasAxisLabel.prototype=new AxisLabel();CanvasAxisLabel.prototype.constructor=CanvasAxisLabel;function CanvasAxisLabel(axisName,position,padding,plot,opts){AxisLabel.prototype.constructor.call(this,axisName,position,padding,plot,opts);}
CanvasAxisLabel.prototype.calculateSize=function(){if(!this.opts.axisLabelFontSizePixels)
this.opts.axisLabelFontSizePixels=14;if(!this.opts.axisLabelFontFamily)
this.opts.axisLabelFontFamily='sans-serif';var textWidth=this.opts.axisLabelFontSizePixels+this.padding;var textHeight=this.opts.axisLabelFontSizePixels+this.padding;if(this.position=='left'||this.position=='right'){this.width=this.opts.axisLabelFontSizePixels+this.padding;this.height=0;}else{this.width=0;this.height=this.opts.axisLabelFontSizePixels+this.padding;}};CanvasAxisLabel.prototype.draw=function(box){var ctx=this.plot.getCanvas().getContext('2d');ctx.save();ctx.font=this.opts.axisLabelFontSizePixels+'px '+
this.opts.axisLabelFontFamily;var width=ctx.measureText(this.opts.axisLabel).width;var height=this.opts.axisLabelFontSizePixels;var x,y,angle=0;if(this.position=='top'){x=box.left+box.width/2-width/2;y=box.top+height*0.72;}else if(this.position=='bottom'){x=box.left+box.width/2-width/2;y=box.top+box.height-height*0.72;}else if(this.position=='left'){x=box.left+height*0.72;y=box.height/2+box.top+width/2;angle=-Math.PI/2;}else if(this.position=='right'){x=box.left+box.width-height*0.72;y=box.height/2+box.top-width/2;angle=Math.PI/2;}
ctx.translate(x,y);ctx.rotate(angle);ctx.fillText(this.opts.axisLabel,0,0);ctx.restore();};HtmlAxisLabel.prototype=new AxisLabel();HtmlAxisLabel.prototype.constructor=HtmlAxisLabel;function HtmlAxisLabel(axisName,position,padding,plot,opts){AxisLabel.prototype.constructor.call(this,axisName,position,padding,plot,opts);}
HtmlAxisLabel.prototype.calculateSize=function(){var elem=$('<div class="axisLabels" style="position:absolute;">'+
this.opts.axisLabel+'</div>');this.plot.getPlaceholder().append(elem);this.labelWidth=elem.outerWidth(true);this.labelHeight=elem.outerHeight(true);elem.remove();this.width=this.height=0;if(this.position=='left'||this.position=='right'){this.width=this.labelWidth+this.padding;}else{this.height=this.labelHeight+this.padding;}};HtmlAxisLabel.prototype.draw=function(box){this.plot.getPlaceholder().find('#'+this.axisName+'Label').remove();var elem=$('<div id="'+this.axisName+'Label" " class="axisLabels" style="position:absolute;">'
+this.opts.axisLabel+'</div>');this.plot.getPlaceholder().append(elem);if(this.position=='top'){elem.css('left',box.left+box.width/2-this.labelWidth/2+'px');elem.css('top',box.top+'px');}else if(this.position=='bottom'){elem.css('left',box.left+box.width/2-this.labelWidth/2+'px');elem.css('top',box.top+box.height-this.labelHeight+'px');}else if(this.position=='left'){elem.css('top',box.top+box.height/2-this.labelHeight/2+'px');elem.css('left',box.left+'px');}else if(this.position=='right'){elem.css('top',box.top+box.height/2-this.labelHeight/2+'px');elem.css('left',box.left+box.width-this.labelWidth+'px');}};CssTransformAxisLabel.prototype=new HtmlAxisLabel();CssTransformAxisLabel.prototype.constructor=CssTransformAxisLabel;function CssTransformAxisLabel(axisName,position,padding,plot,opts){HtmlAxisLabel.prototype.constructor.call(this,axisName,position,padding,plot,opts);}
CssTransformAxisLabel.prototype.calculateSize=function(){HtmlAxisLabel.prototype.calculateSize.call(this);this.width=this.height=0;if(this.position=='left'||this.position=='right'){this.width=this.labelHeight+this.padding;}else{this.height=this.labelHeight+this.padding;}};CssTransformAxisLabel.prototype.transforms=function(degrees,x,y){var stransforms={'-moz-transform':'','-webkit-transform':'','-o-transform':'','-ms-transform':''};if(x!=0||y!=0){var stdTranslate=' translate('+x+'px, '+y+'px)';stransforms['-moz-transform']+=stdTranslate;stransforms['-webkit-transform']+=stdTranslate;stransforms['-o-transform']+=stdTranslate;stransforms['-ms-transform']+=stdTranslate;}
if(degrees!=0){var rotation=degrees/90;var stdRotate=' rotate('+degrees+'deg)';stransforms['-moz-transform']+=stdRotate;stransforms['-webkit-transform']+=stdRotate;stransforms['-o-transform']+=stdRotate;stransforms['-ms-transform']+=stdRotate;}
var s='top: 0; left: 0; ';for(var prop in stransforms){if(stransforms[prop]){s+=prop+':'+stransforms[prop]+';';}}
s+=';';return s;};CssTransformAxisLabel.prototype.calculateOffsets=function(box){var offsets={x:0,y:0,degrees:0};if(this.position=='bottom'){offsets.x=box.left+box.width/2-this.labelWidth/2;offsets.y=box.top+box.height-this.labelHeight;}else if(this.position=='top'){offsets.x=box.left+box.width/2-this.labelWidth/2;offsets.y=box.top;}else if(this.position=='left'){offsets.degrees=-90;offsets.x=box.left-this.labelWidth/2+this.labelHeight/2;offsets.y=box.height/2+box.top;}else if(this.position=='right'){offsets.degrees=90;offsets.x=box.left+box.width-this.labelWidth/2
-this.labelHeight/2;offsets.y=box.height/2+box.top;}
return offsets;};CssTransformAxisLabel.prototype.draw=function(box){this.plot.getPlaceholder().find("."+this.axisName+"Label").remove();var offsets=this.calculateOffsets(box);var elem=$('<div class="axisLabels '+this.axisName+'Label" style="position:absolute; '+
this.transforms(offsets.degrees,offsets.x,offsets.y)+'">'+this.opts.axisLabel+'</div>');this.plot.getPlaceholder().append(elem);};IeTransformAxisLabel.prototype=new CssTransformAxisLabel();IeTransformAxisLabel.prototype.constructor=IeTransformAxisLabel;function IeTransformAxisLabel(axisName,position,padding,plot,opts){CssTransformAxisLabel.prototype.constructor.call(this,axisName,position,padding,plot,opts);this.requiresResize=false;}
IeTransformAxisLabel.prototype.transforms=function(degrees,x,y){var s='';if(degrees!=0){var rotation=degrees/90;while(rotation<0){rotation+=4;}
s+=' filter: progid:DXImageTransform.Microsoft.BasicImage(rotation='+rotation+'); ';this.requiresResize=(this.position=='right');}
if(x!=0){s+='left: '+x+'px; ';}
if(y!=0){s+='top: '+y+'px; ';}
return s;};IeTransformAxisLabel.prototype.calculateOffsets=function(box){var offsets=CssTransformAxisLabel.prototype.calculateOffsets.call(this,box);if(this.position=='top'){offsets.y=box.top+1;}else if(this.position=='left'){offsets.x=box.left;offsets.y=box.height/2+box.top-this.labelWidth/2;}else if(this.position=='right'){offsets.x=box.left+box.width-this.labelHeight;offsets.y=box.height/2+box.top-this.labelWidth/2;}
return offsets;};IeTransformAxisLabel.prototype.draw=function(box){CssTransformAxisLabel.prototype.draw.call(this,box);if(this.requiresResize){var elem=this.plot.getPlaceholder().find("."+this.axisName+"Label");elem.css('width',this.labelWidth);elem.css('height',this.labelHeight);}};function init(plot){var secondPass=false;var axisLabels={};var axisOffsetCounts={left:0,right:0,top:0,bottom:0};var defaultPadding=2;plot.hooks.draw.push(function(plot,ctx){if(!secondPass){$.each(plot.getAxes(),function(axisName,axis){var opts=axis.options||plot.getOptions()[axisName];if(!opts||!opts.axisLabel)
return;var renderer=null;if(!opts.axisLabelUseHtml&&navigator.appName=='Microsoft Internet Explorer'){var ua=navigator.userAgent;var re=new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");if(re.exec(ua)!=null){rv=parseFloat(RegExp.$1);}
if(rv>=9&&!opts.axisLabelUseCanvas&&!opts.axisLabelUseHtml){renderer=CssTransformAxisLabel;}else if(!opts.axisLabelUseCanvas&&!opts.axisLabelUseHtml){renderer=IeTransformAxisLabel;}else if(opts.axisLabelUseCanvas){renderer=CanvasAxisLabel;}else{renderer=HtmlAxisLabel;}}else{if(opts.axisLabelUseHtml||(!css3TransitionSupported()&&!canvasTextSupported())&&!opts.axisLabelUseCanvas){renderer=HtmlAxisLabel;}else if(opts.axisLabelUseCanvas||!css3TransitionSupported()){renderer=CanvasAxisLabel;}else{renderer=CssTransformAxisLabel;}}
var padding=opts.axisLabelPadding===undefined?defaultPadding:opts.axisLabelPadding;axisLabels[axisName]=new renderer(axisName,axis.position,padding,plot,opts);axisLabels[axisName].calculateSize();axis.labelHeight+=axisLabels[axisName].height;axis.labelWidth+=axisLabels[axisName].width;opts.labelHeight=axis.labelHeight;opts.labelWidth=axis.labelWidth;});secondPass=true;plot.setupGrid();plot.draw();}else{$.each(plot.getAxes(),function(axisName,axis){var opts=axis.options||plot.getOptions()[axisName];if(!opts||!opts.axisLabel)
return;axisLabels[axisName].draw(axis.box);});}});}
$.plot.plugins.push({init:init,options:options,name:'axisLabels',version:'2.0b0'});})(jQuery);(function($){var defaultOptions={tooltip:false,tooltipOpts:{content:"%s | X: %x | Y: %y",xDateFormat:null,yDateFormat:null,monthNames:null,dayNames:null,shifts:{x:10,y:20},defaultTheme:true,onHover:function(flotItem,$tooltipEl){}}};var FlotTooltip=function(plot){this.tipPosition={x:0,y:0};this.init(plot);};FlotTooltip.prototype.init=function(plot){var that=this;plot.hooks.bindEvents.push(function(plot,eventHolder){that.plotOptions=plot.getOptions();if(that.plotOptions.tooltip===false||typeof that.plotOptions.tooltip==='undefined')return;that.tooltipOptions=that.plotOptions.tooltipOpts;var $tip=that.getDomElement();$(plot.getPlaceholder()).bind("plothover",plothover);$(eventHolder).bind('mousemove',mouseMove);});plot.hooks.shutdown.push(function(plot,eventHolder){$(plot.getPlaceholder()).unbind("plothover",plothover);$(eventHolder).unbind("mousemove",mouseMove);});function mouseMove(e){var pos={};pos.x=e.pageX;pos.y=e.pageY;that.updateTooltipPosition(pos);}
function plothover(event,pos,item){var $tip=that.getDomElement();if(item){var tipText;tipText=that.stringFormat(that.tooltipOptions.content,item);$tip.html(tipText);that.updateTooltipPosition({x:pos.pageX,y:pos.pageY});$tip.css({left:that.tipPosition.x+that.tooltipOptions.shifts.x,top:that.tipPosition.y+that.tooltipOptions.shifts.y}).show();if(typeof that.tooltipOptions.onHover==='function'){that.tooltipOptions.onHover(item,$tip);}}
else{$tip.hide().html('');}}};FlotTooltip.prototype.getDomElement=function(){var $tip;if($('#flotTip').length>0){$tip=$('#flotTip');}
else{$tip=$('<div />').attr('id','flotTip');$tip.appendTo('body').hide().css({position:'absolute'});if(this.tooltipOptions.defaultTheme){$tip.css({'background':'#fff','z-index':'100','padding':'0.4em 0.6em','border-radius':'0.5em','font-size':'0.8em','border':'1px solid #111','display':'none','white-space':'nowrap'});}}
return $tip;};FlotTooltip.prototype.updateTooltipPosition=function(pos){var totalTipWidth=$("#flotTip").outerWidth()+this.tooltipOptions.shifts.x;var totalTipHeight=$("#flotTip").outerHeight()+this.tooltipOptions.shifts.y;if((pos.x-$(window).scrollLeft())>($(window).innerWidth()-totalTipWidth)){pos.x-=totalTipWidth;}
if((pos.y-$(window).scrollTop())>($(window).innerHeight()-totalTipHeight)){pos.y-=totalTipHeight;}
this.tipPosition.x=pos.x;this.tipPosition.y=pos.y;};FlotTooltip.prototype.stringFormat=function(content,item){var percentPattern=/%p\.{0,1}(\d{0,})/;var seriesPattern=/%s/;var xPattern=/%x\.{0,1}(\d{0,})/;var yPattern=/%y\.{0,1}(\d{0,})/;var xPatternWithoutPrecision="%x";var yPatternWithoutPrecision="%y";var x=item.datapoint[0];var y=item.datapoint[1];if(typeof(content)==='function'){content=content(item.series.label,x,y,item);}
if(typeof(item.series.percent)!=='undefined'){content=this.adjustValPrecision(percentPattern,content,item.series.percent);}
if(typeof(item.series.label)!=='undefined'){content=content.replace(seriesPattern,item.series.label);}
else{content=content.replace(seriesPattern,"");}
if(this.isTimeMode('xaxis',item)&&this.isXDateFormat(item)){content=content.replace(xPattern,this.timestampToDate(x,this.tooltipOptions.xDateFormat));}
if(this.isTimeMode('yaxis',item)&&this.isYDateFormat(item)){content=content.replace(yPattern,this.timestampToDate(y,this.tooltipOptions.yDateFormat));}
if(typeof x==='number'){content=this.adjustValPrecision(xPattern,content,x);}
if(typeof y==='number'){content=this.adjustValPrecision(yPattern,content,y);}
if(typeof item.series.xaxis.ticks!=='undefined'){if(item.series.xaxis.ticks.length>item.dataIndex&&!this.isTimeMode('xaxis',item))
content=content.replace(xPattern,item.series.xaxis.ticks[item.dataIndex].label);}
if(typeof item.series.xaxis.tickFormatter!=='undefined'){content=content.replace(xPatternWithoutPrecision,item.series.xaxis.tickFormatter(x,item.series.xaxis).replace(/\$/g,'$$'));}
if(typeof item.series.yaxis.tickFormatter!=='undefined'){content=content.replace(yPatternWithoutPrecision,item.series.yaxis.tickFormatter(y,item.series.yaxis).replace(/\$/g,'$$'));}
return content;};FlotTooltip.prototype.isTimeMode=function(axisName,item){return(typeof item.series[axisName].options.mode!=='undefined'&&item.series[axisName].options.mode==='time');};FlotTooltip.prototype.isXDateFormat=function(item){return(typeof this.tooltipOptions.xDateFormat!=='undefined'&&this.tooltipOptions.xDateFormat!==null);};FlotTooltip.prototype.isYDateFormat=function(item){return(typeof this.tooltipOptions.yDateFormat!=='undefined'&&this.tooltipOptions.yDateFormat!==null);};FlotTooltip.prototype.timestampToDate=function(tmst,dateFormat){var theDate=new Date(tmst*1);return $.plot.formatDate(theDate,dateFormat,this.tooltipOptions.monthNames,this.tooltipOptions.dayNames);};FlotTooltip.prototype.adjustValPrecision=function(pattern,content,value){var precision;var matchResult=content.match(pattern);if(matchResult!==null){if(RegExp.$1!==''){precision=RegExp.$1;value=value.toFixed(precision);content=content.replace(pattern,value);}}
return content;};var init=function(plot){new FlotTooltip(plot);};$.plot.plugins.push({init:init,options:defaultOptions,name:'tooltip',version:'0.6.1'});})(jQuery);(function(){var getRootNode=function(){if(this["document"]&&this["document"]["getElementsByTagName"]){var scripts=document.getElementsByTagName("script");var pat=/jquery\.jqplot\.js/i;for(var i=0;i<scripts.length;i++){var src=scripts[i].getAttribute("src");if(!src){continue;}
var m=src.match(pat);if(m){return{node:scripts[i],root:src.substring(0,m.index)};}}}};var files=['jqplot.core.js','jqplot.linearTickGenerator.js','jqplot.linearAxisRenderer.js','jqplot.axisTickRenderer.js','jqplot.axisLabelRenderer.js','jqplot.tableLegendRenderer.js','jqplot.lineRenderer.js','jqplot.markerRenderer.js','jqplot.divTitleRenderer.js','jqplot.canvasGridRenderer.js','jqplot.linePattern.js','jqplot.shadowRenderer.js','jqplot.shapeRenderer.js','jqplot.sprintf.js','jsdate.js','jqplot.themeEngine.js','jqplot.toImage.js','jqplot.effects.core.js','jqplot.effects.blind.js'];var rn=getRootNode().root;for(var i=0;i<files.length;i++){var pp=rn+files[i];try{document.write("<scr"+"ipt type='text/javascript' src='"+pp+"'></scr"+"ipt>\n");}catch(e){var script=document.createElement("script");script.src=pp;document.getElementsByTagName("head")[0].appendChild(script);script=null;}}})();(function($){$.jqplot.BarRenderer=function(){$.jqplot.LineRenderer.call(this);};$.jqplot.BarRenderer.prototype=new $.jqplot.LineRenderer();$.jqplot.BarRenderer.prototype.constructor=$.jqplot.BarRenderer;$.jqplot.BarRenderer.prototype.init=function(options,plot){this.barPadding=8;this.barMargin=10;this.barDirection='vertical';this.barWidth=null;this.shadowOffset=2;this.shadowDepth=5;this.shadowAlpha=0.08;this.waterfall=false;this.groups=1;this.varyBarColor=false;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.transposedData=true;this.renderer.animation={show:false,direction:'down',speed:3000,_supported:true};this._type='bar';if(options.highlightMouseDown&&options.highlightMouseOver==null){options.highlightMouseOver=false;}
$.extend(true,this,options);$.extend(true,this.renderer,options);this.fill=true;if(this.barDirection==='horizontal'&&this.rendererOptions.animation&&this.rendererOptions.animation.direction==null){this.renderer.animation.direction='left';}
if(this.waterfall){this.fillToZero=false;this.disableStack=true;}
if(this.barDirection=='vertical'){this._primaryAxis='_xaxis';this._stackAxis='y';this.fillAxis='y';}
else{this._primaryAxis='_yaxis';this._stackAxis='x';this.fillAxis='x';}
this._highlightedPoint=null;this._plotSeriesInfo=null;this._dataColors=[];this._barPoints=[];var opts={lineJoin:'miter',lineCap:'round',fill:true,isarc:false,strokeStyle:this.color,fillStyle:this.color,closePath:this.fill};this.renderer.shapeRenderer.init(opts);var sopts={lineJoin:'miter',lineCap:'round',fill:true,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,closePath:this.fill};this.renderer.shadowRenderer.init(sopts);plot.postInitHooks.addOnce(postInit);plot.postDrawHooks.addOnce(postPlotDraw);plot.eventListenerHooks.addOnce('jqplotMouseMove',handleMove);plot.eventListenerHooks.addOnce('jqplotMouseDown',handleMouseDown);plot.eventListenerHooks.addOnce('jqplotMouseUp',handleMouseUp);plot.eventListenerHooks.addOnce('jqplotClick',handleClick);plot.eventListenerHooks.addOnce('jqplotRightClick',handleRightClick);};function barPreInit(target,data,seriesDefaults,options){if(this.rendererOptions.barDirection=='horizontal'){this._stackAxis='x';this._primaryAxis='_yaxis';}
if(this.rendererOptions.waterfall==true){this._data=$.extend(true,[],this.data);var sum=0;var pos=(!this.rendererOptions.barDirection||this.rendererOptions.barDirection==='vertical'||this.transposedData===false)?1:0;for(var i=0;i<this.data.length;i++){sum+=this.data[i][pos];if(i>0){this.data[i][pos]+=this.data[i-1][pos];}}
this.data[this.data.length]=(pos==1)?[this.data.length+1,sum]:[sum,this.data.length+1];this._data[this._data.length]=(pos==1)?[this._data.length+1,sum]:[sum,this._data.length+1];}
if(this.rendererOptions.groups>1){this.breakOnNull=true;var l=this.data.length;var skip=parseInt(l/this.rendererOptions.groups,10);var count=0;for(var i=skip;i<l;i+=skip){this.data.splice(i+count,0,[null,null]);this._plotData.splice(i+count,0,[null,null]);this._stackData.splice(i+count,0,[null,null]);count++;}
for(i=0;i<this.data.length;i++){if(this._primaryAxis=='_xaxis'){this.data[i][0]=i+1;this._plotData[i][0]=i+1;this._stackData[i][0]=i+1;}
else{this.data[i][1]=i+1;this._plotData[i][1]=i+1;this._stackData[i][1]=i+1;}}}}
$.jqplot.preSeriesInitHooks.push(barPreInit);$.jqplot.BarRenderer.prototype.calcSeriesNumbers=function(){var nvals=0;var nseries=0;var paxis=this[this._primaryAxis];var s,series,pos;for(var i=0;i<paxis._series.length;i++){series=paxis._series[i];if(series===this){pos=i;}
if(series.renderer.constructor==$.jqplot.BarRenderer){nvals+=series.data.length;nseries+=1;}}
return[nvals,nseries,pos];};$.jqplot.BarRenderer.prototype.setBarWidth=function(){var i;var nvals=0;var nseries=0;var paxis=this[this._primaryAxis];var s,series,pos;var temp=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);nvals=temp[0];nseries=temp[1];var nticks=paxis.numberTicks;var nbins=(nticks-1)/2;if(paxis.name=='xaxis'||paxis.name=='x2axis'){if(this._stack){this.barWidth=(paxis._offsets.max-paxis._offsets.min)/nvals*nseries-this.barMargin;}
else{this.barWidth=((paxis._offsets.max-paxis._offsets.min)/nbins-this.barPadding*(nseries-1)-this.barMargin*2)/nseries;}}
else{if(this._stack){this.barWidth=(paxis._offsets.min-paxis._offsets.max)/nvals*nseries-this.barMargin;}
else{this.barWidth=((paxis._offsets.min-paxis._offsets.max)/nbins-this.barPadding*(nseries-1)-this.barMargin*2)/nseries;}}
return[nvals,nseries];};function computeHighlightColors(colors){var ret=[];for(var i=0;i<colors.length;i++){var rgba=$.jqplot.getColorComponents(colors[i]);var newrgb=[rgba[0],rgba[1],rgba[2]];var sum=newrgb[0]+newrgb[1]+newrgb[2];for(var j=0;j<3;j++){newrgb[j]=(sum>570)?newrgb[j]*0.8:newrgb[j]+0.3*(255-newrgb[j]);newrgb[j]=parseInt(newrgb[j],10);}
ret.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');}
return ret;}
function getStart(sidx,didx,comp,plot,axis){var seriesIndex=sidx,prevSeriesIndex=sidx-1,start,prevVal,aidx=(axis==='x')?0:1;if(seriesIndex>0){prevVal=plot.series[prevSeriesIndex]._plotData[didx][aidx];if((comp*prevVal)<0){start=getStart(prevSeriesIndex,didx,comp,plot,axis);}
else{start=plot.series[prevSeriesIndex].gridData[didx][aidx];}}
else{start=(aidx===0)?plot.series[seriesIndex]._xaxis.series_u2p(0):plot.series[seriesIndex]._yaxis.series_u2p(0);}
return start;}
$.jqplot.BarRenderer.prototype.draw=function(ctx,gridData,options,plot){var i;var opts=$.extend({},options);var shadow=(opts.shadow!=undefined)?opts.shadow:this.shadow;var showLine=(opts.showLine!=undefined)?opts.showLine:this.showLine;var fill=(opts.fill!=undefined)?opts.fill:this.fill;var xaxis=this.xaxis;var yaxis=this.yaxis;var xp=this._xaxis.series_u2p;var yp=this._yaxis.series_u2p;var pointx,pointy;this._dataColors=[];this._barPoints=[];if(this.barWidth==null){this.renderer.setBarWidth.call(this);}
var temp=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);var nvals=temp[0];var nseries=temp[1];var pos=temp[2];var points=[];if(this._stack){this._barNudge=0;}
else{this._barNudge=(-Math.abs(nseries/2-0.5)+pos)*(this.barWidth+this.barPadding);}
if(showLine){var negativeColors=new $.jqplot.ColorGenerator(this.negativeSeriesColors);var positiveColors=new $.jqplot.ColorGenerator(this.seriesColors);var negativeColor=negativeColors.get(this.index);if(!this.useNegativeColors){negativeColor=opts.fillStyle;}
var positiveColor=opts.fillStyle;var base;var xstart;var ystart;if(this.barDirection=='vertical'){for(var i=0;i<gridData.length;i++){if(!this._stack&&this.data[i][1]==null){continue;}
points=[];base=gridData[i][0]+this._barNudge;if(this._stack&&this._prevGridData.length){ystart=getStart(this.index,i,this._plotData[i][1],plot,'y');}
else{if(this.fillToZero){ystart=this._yaxis.series_u2p(0);}
else if(this.waterfall&&i>0&&i<this.gridData.length-1){ystart=this.gridData[i-1][1];}
else if(this.waterfall&&i==0&&i<this.gridData.length-1){if(this._yaxis.min<=0&&this._yaxis.max>=0){ystart=this._yaxis.series_u2p(0);}
else if(this._yaxis.min>0){ystart=ctx.canvas.height;}
else{ystart=0;}}
else if(this.waterfall&&i==this.gridData.length-1){if(this._yaxis.min<=0&&this._yaxis.max>=0){ystart=this._yaxis.series_u2p(0);}
else if(this._yaxis.min>0){ystart=ctx.canvas.height;}
else{ystart=0;}}
else{ystart=ctx.canvas.height;}}
if((this.fillToZero&&this._plotData[i][1]<0)||(this.waterfall&&this._data[i][1]<0)){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){opts.fillStyle=negativeColors.next();}
else{opts.fillStyle=positiveColors.next();}}
else{opts.fillStyle=negativeColor;}}
else{if(this.varyBarColor&&!this._stack){opts.fillStyle=positiveColors.next();}
else{opts.fillStyle=positiveColor;}}
if(!this.fillToZero||this._plotData[i][1]>=0){points.push([base-this.barWidth/2,ystart]);points.push([base-this.barWidth/2,gridData[i][1]]);points.push([base+this.barWidth/2,gridData[i][1]]);points.push([base+this.barWidth/2,ystart]);}
else{points.push([base-this.barWidth/2,gridData[i][1]]);points.push([base-this.barWidth/2,ystart]);points.push([base+this.barWidth/2,ystart]);points.push([base+this.barWidth/2,gridData[i][1]]);}
this._barPoints.push(points);if(shadow&&!this._stack){var sopts=$.extend(true,{},opts);delete sopts.fillStyle;this.renderer.shadowRenderer.draw(ctx,points,sopts);}
var clr=opts.fillStyle||this.color;this._dataColors.push(clr);this.renderer.shapeRenderer.draw(ctx,points,opts);}}
else if(this.barDirection=='horizontal'){for(var i=0;i<gridData.length;i++){if(!this._stack&&this.data[i][0]==null){continue;}
points=[];base=gridData[i][1]-this._barNudge;xstart;if(this._stack&&this._prevGridData.length){xstart=getStart(this.index,i,this._plotData[i][0],plot,'x');}
else{if(this.fillToZero){xstart=this._xaxis.series_u2p(0);}
else if(this.waterfall&&i>0&&i<this.gridData.length-1){xstart=this.gridData[i-1][0];}
else if(this.waterfall&&i==0&&i<this.gridData.length-1){if(this._xaxis.min<=0&&this._xaxis.max>=0){xstart=this._xaxis.series_u2p(0);}
else if(this._xaxis.min>0){xstart=0;}
else{xstart=0;}}
else if(this.waterfall&&i==this.gridData.length-1){if(this._xaxis.min<=0&&this._xaxis.max>=0){xstart=this._xaxis.series_u2p(0);}
else if(this._xaxis.min>0){xstart=0;}
else{xstart=ctx.canvas.width;}}
else{xstart=0;}}
if((this.fillToZero&&this._plotData[i][0]<0)||(this.waterfall&&this._data[i][0]<0)){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){opts.fillStyle=negativeColors.next();}
else{opts.fillStyle=positiveColors.next();}}
else{opts.fillStyle=negativeColor;}}
else{if(this.varyBarColor&&!this._stack){opts.fillStyle=positiveColors.next();}
else{opts.fillStyle=positiveColor;}}
if(!this.fillToZero||this._plotData[i][0]>=0){points.push([xstart,base+this.barWidth/2]);points.push([xstart,base-this.barWidth/2]);points.push([gridData[i][0],base-this.barWidth/2]);points.push([gridData[i][0],base+this.barWidth/2]);}
else{points.push([gridData[i][0],base+this.barWidth/2]);points.push([gridData[i][0],base-this.barWidth/2]);points.push([xstart,base-this.barWidth/2]);points.push([xstart,base+this.barWidth/2]);}
this._barPoints.push(points);if(shadow&&!this._stack){var sopts=$.extend(true,{},opts);delete sopts.fillStyle;this.renderer.shadowRenderer.draw(ctx,points,sopts);}
var clr=opts.fillStyle||this.color;this._dataColors.push(clr);this.renderer.shapeRenderer.draw(ctx,points,opts);}}}
if(this.highlightColors.length==0){this.highlightColors=$.jqplot.computeHighlightColors(this._dataColors);}
else if(typeof(this.highlightColors)=='string'){var temp=this.highlightColors;this.highlightColors=[];for(var i=0;i<this._dataColors.length;i++){this.highlightColors.push(temp);}}};$.jqplot.BarRenderer.prototype.drawShadow=function(ctx,gridData,options,plot){var i;var opts=(options!=undefined)?options:{};var shadow=(opts.shadow!=undefined)?opts.shadow:this.shadow;var showLine=(opts.showLine!=undefined)?opts.showLine:this.showLine;var fill=(opts.fill!=undefined)?opts.fill:this.fill;var xaxis=this.xaxis;var yaxis=this.yaxis;var xp=this._xaxis.series_u2p;var yp=this._yaxis.series_u2p;var pointx,points,pointy,nvals,nseries,pos;if(this._stack&&this.shadow){if(this.barWidth==null){this.renderer.setBarWidth.call(this);}
var temp=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);nvals=temp[0];nseries=temp[1];pos=temp[2];if(this._stack){this._barNudge=0;}
else{this._barNudge=(-Math.abs(nseries/2-0.5)+pos)*(this.barWidth+this.barPadding);}
if(showLine){if(this.barDirection=='vertical'){for(var i=0;i<gridData.length;i++){if(this.data[i][1]==null){continue;}
points=[];var base=gridData[i][0]+this._barNudge;var ystart;if(this._stack&&this._prevGridData.length){ystart=getStart(this.index,i,this._plotData[i][1],plot,'y');}
else{if(this.fillToZero){ystart=this._yaxis.series_u2p(0);}
else{ystart=ctx.canvas.height;}}
points.push([base-this.barWidth/2,ystart]);points.push([base-this.barWidth/2,gridData[i][1]]);points.push([base+this.barWidth/2,gridData[i][1]]);points.push([base+this.barWidth/2,ystart]);this.renderer.shadowRenderer.draw(ctx,points,opts);}}
else if(this.barDirection=='horizontal'){for(var i=0;i<gridData.length;i++){if(this.data[i][0]==null){continue;}
points=[];var base=gridData[i][1]-this._barNudge;var xstart;if(this._stack&&this._prevGridData.length){xstart=getStart(this.index,i,this._plotData[i][0],plot,'x');}
else{if(this.fillToZero){xstart=this._xaxis.series_u2p(0);}
else{xstart=0;}}
points.push([xstart,base+this.barWidth/2]);points.push([gridData[i][0],base+this.barWidth/2]);points.push([gridData[i][0],base-this.barWidth/2]);points.push([xstart,base-this.barWidth/2]);this.renderer.shadowRenderer.draw(ctx,points,opts);}}}}};function postInit(target,data,options){for(var i=0;i<this.series.length;i++){if(this.series[i].renderer.constructor==$.jqplot.BarRenderer){if(this.series[i].highlightMouseOver){this.series[i].highlightMouseDown=false;}}}}
function postPlotDraw(){if(this.plugins.barRenderer&&this.plugins.barRenderer.highlightCanvas){this.plugins.barRenderer.highlightCanvas.resetCanvas();this.plugins.barRenderer.highlightCanvas=null;}
this.plugins.barRenderer={highlightedSeriesIndex:null};this.plugins.barRenderer.highlightCanvas=new $.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding,'jqplot-barRenderer-highlight-canvas',this._plotDimensions,this));this.plugins.barRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind('mouseleave',{plot:this},function(ev){unhighlight(ev.data.plot);});}
function highlight(plot,sidx,pidx,points){var s=plot.series[sidx];var canvas=plot.plugins.barRenderer.highlightCanvas;canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width,canvas._ctx.canvas.height);s._highlightedPoint=pidx;plot.plugins.barRenderer.highlightedSeriesIndex=sidx;var opts={fillStyle:s.highlightColors[pidx]};s.renderer.shapeRenderer.draw(canvas._ctx,points,opts);canvas=null;}
function unhighlight(plot){var canvas=plot.plugins.barRenderer.highlightCanvas;canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width,canvas._ctx.canvas.height);for(var i=0;i<plot.series.length;i++){plot.series[i]._highlightedPoint=null;}
plot.plugins.barRenderer.highlightedSeriesIndex=null;plot.target.trigger('jqplotDataUnhighlight');canvas=null;}
function handleMove(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data];var evt1=jQuery.Event('jqplotDataMouseOver');evt1.pageX=ev.pageX;evt1.pageY=ev.pageY;plot.target.trigger(evt1,ins);if(plot.series[ins[0]].show&&plot.series[ins[0]].highlightMouseOver&&!(ins[0]==plot.plugins.barRenderer.highlightedSeriesIndex&&ins[1]==plot.series[ins[0]]._highlightedPoint)){var evt=jQuery.Event('jqplotDataHighlight');evt.which=ev.which;evt.pageX=ev.pageX;evt.pageY=ev.pageY;plot.target.trigger(evt,ins);highlight(plot,neighbor.seriesIndex,neighbor.pointIndex,neighbor.points);}}
else if(neighbor==null){unhighlight(plot);}}
function handleMouseDown(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data];if(plot.series[ins[0]].highlightMouseDown&&!(ins[0]==plot.plugins.barRenderer.highlightedSeriesIndex&&ins[1]==plot.series[ins[0]]._highlightedPoint)){var evt=jQuery.Event('jqplotDataHighlight');evt.which=ev.which;evt.pageX=ev.pageX;evt.pageY=ev.pageY;plot.target.trigger(evt,ins);highlight(plot,neighbor.seriesIndex,neighbor.pointIndex,neighbor.points);}}
else if(neighbor==null){unhighlight(plot);}}
function handleMouseUp(ev,gridpos,datapos,neighbor,plot){var idx=plot.plugins.barRenderer.highlightedSeriesIndex;if(idx!=null&&plot.series[idx].highlightMouseDown){unhighlight(plot);}}
function handleClick(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data];var evt=jQuery.Event('jqplotDataClick');evt.which=ev.which;evt.pageX=ev.pageX;evt.pageY=ev.pageY;plot.target.trigger(evt,ins);}}
function handleRightClick(ev,gridpos,datapos,neighbor,plot){if(neighbor){var ins=[neighbor.seriesIndex,neighbor.pointIndex,neighbor.data];var idx=plot.plugins.barRenderer.highlightedSeriesIndex;if(idx!=null&&plot.series[idx].highlightMouseDown){unhighlight(plot);}
var evt=jQuery.Event('jqplotDataRightClick');evt.which=ev.which;evt.pageX=ev.pageX;evt.pageY=ev.pageY;plot.target.trigger(evt,ins);}}})(jQuery);(function($){$.jqplot.CategoryAxisRenderer=function(options){$.jqplot.LinearAxisRenderer.call(this);this.sortMergedLabels=false;};$.jqplot.CategoryAxisRenderer.prototype=new $.jqplot.LinearAxisRenderer();$.jqplot.CategoryAxisRenderer.prototype.constructor=$.jqplot.CategoryAxisRenderer;$.jqplot.CategoryAxisRenderer.prototype.init=function(options){this.groups=1;this.groupLabels=[];this._groupLabels=[];this._grouped=false;this._barsPerGroup=null;this.reverse=false;$.extend(true,this,{tickOptions:{formatString:'%d'}},options);var db=this._dataBounds;for(var i=0;i<this._series.length;i++){var s=this._series[i];if(s.groups){this.groups=s.groups;}
var d=s.data;for(var j=0;j<d.length;j++){if(this.name=='xaxis'||this.name=='x2axis'){if(d[j][0]<db.min||db.min==null){db.min=d[j][0];}
if(d[j][0]>db.max||db.max==null){db.max=d[j][0];}}
else{if(d[j][1]<db.min||db.min==null){db.min=d[j][1];}
if(d[j][1]>db.max||db.max==null){db.max=d[j][1];}}}}
if(this.groupLabels.length){this.groups=this.groupLabels.length;}};$.jqplot.CategoryAxisRenderer.prototype.createTicks=function(){var ticks=this._ticks;var userTicks=this.ticks;var name=this.name;var db=this._dataBounds;var dim,interval;var min,max;var pos1,pos2;var tt,i;if(userTicks.length){if(this.groups>1&&!this._grouped){var l=userTicks.length;var skip=parseInt(l/this.groups,10);var count=0;for(var i=skip;i<l;i+=skip){userTicks.splice(i+count,0,' ');count++;}
this._grouped=true;}
this.min=0.5;this.max=userTicks.length+0.5;var range=this.max-this.min;this.numberTicks=2*userTicks.length+1;for(i=0;i<userTicks.length;i++){tt=this.min+2*i*range/(this.numberTicks-1);var t=new this.tickRenderer(this.tickOptions);t.showLabel=false;t.setTick(tt,this.name);this._ticks.push(t);var t=new this.tickRenderer(this.tickOptions);t.label=userTicks[i];t.showMark=false;t.showGridline=false;t.setTick(tt+0.5,this.name);this._ticks.push(t);}
var t=new this.tickRenderer(this.tickOptions);t.showLabel=false;t.setTick(tt+1,this.name);this._ticks.push(t);}
else{if(name=='xaxis'||name=='x2axis'){dim=this._plotDimensions.width;}
else{dim=this._plotDimensions.height;}
if(this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null;}
if(this.min!=null&&this.max!=null&&this.tickInterval!=null){if(parseInt((this.max-this.min)/this.tickInterval,10)!=(this.max-this.min)/this.tickInterval){this.tickInterval=null;}}
var labels=[];var numcats=0;var min=0.5;var max,val;var isMerged=false;for(var i=0;i<this._series.length;i++){var s=this._series[i];for(var j=0;j<s.data.length;j++){if(this.name=='xaxis'||this.name=='x2axis'){val=s.data[j][0];}
else{val=s.data[j][1];}
if($.inArray(val,labels)==-1){isMerged=true;numcats+=1;labels.push(val);}}}
if(isMerged&&this.sortMergedLabels){if(typeof labels[0]=="string"){labels.sort();}else{labels.sort(function(a,b){return a-b;});}}
this.ticks=labels;for(var i=0;i<this._series.length;i++){var s=this._series[i];for(var j=0;j<s.data.length;j++){if(this.name=='xaxis'||this.name=='x2axis'){val=s.data[j][0];}
else{val=s.data[j][1];}
var idx=$.inArray(val,labels)+1;if(this.name=='xaxis'||this.name=='x2axis'){s.data[j][0]=idx;}
else{s.data[j][1]=idx;}}}
if(this.groups>1&&!this._grouped){var l=labels.length;var skip=parseInt(l/this.groups,10);var count=0;for(var i=skip;i<l;i+=skip+1){labels[i]=' ';}
this._grouped=true;}
max=numcats+0.5;if(this.numberTicks==null){this.numberTicks=2*numcats+1;}
var range=max-min;this.min=min;this.max=max;var track=0;var maxVisibleTicks=parseInt(3+dim/10,10);var skip=parseInt(numcats/maxVisibleTicks,10);if(this.tickInterval==null){this.tickInterval=range/(this.numberTicks-1);}
for(var i=0;i<this.numberTicks;i++){tt=this.min+i*this.tickInterval;var t=new this.tickRenderer(this.tickOptions);if(i/2==parseInt(i/2,10)){t.showLabel=false;t.showMark=true;}
else{if(skip>0&&track<skip){t.showLabel=false;track+=1;}
else{t.showLabel=true;track=0;}
t.label=t.formatter(t.formatString,labels[(i-1)/2]);t.showMark=false;t.showGridline=false;}
t.setTick(tt,this.name);this._ticks.push(t);}}};$.jqplot.CategoryAxisRenderer.prototype.draw=function(ctx,plot){if(this.show){this.renderer.createTicks.call(this);var dim=0;var temp;if(this._elem){this._elem.emptyForce();}
this._elem=this._elem||$('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');if(this.name=='xaxis'||this.name=='x2axis'){this._elem.width(this._plotDimensions.width);}
else{this._elem.height(this._plotDimensions.height);}
this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var elem=this._label.draw(ctx,plot);elem.appendTo(this._elem);}
var t=this._ticks;for(var i=0;i<t.length;i++){var tick=t[i];if(tick.showLabel&&(!tick.isMinorTick||this.showMinorTicks)){var elem=tick.draw(ctx,plot);elem.appendTo(this._elem);}}
this._groupLabels=[];for(var i=0;i<this.groupLabels.length;i++)
{var elem=$('<div style="position:absolute;" class="jqplot-'+this.name+'-groupLabel"></div>');elem.html(this.groupLabels[i]);this._groupLabels.push(elem);elem.appendTo(this._elem);}}
return this._elem;};$.jqplot.CategoryAxisRenderer.prototype.set=function(){var dim=0;var temp;var w=0;var h=0;var lshow=(this._label==null)?false:this._label.show;if(this.show){var t=this._ticks;for(var i=0;i<t.length;i++){var tick=t[i];if(tick.showLabel&&(!tick.isMinorTick||this.showMinorTicks)){if(this.name=='xaxis'||this.name=='x2axis'){temp=tick._elem.outerHeight(true);}
else{temp=tick._elem.outerWidth(true);}
if(temp>dim){dim=temp;}}}
var dim2=0;for(var i=0;i<this._groupLabels.length;i++){var l=this._groupLabels[i];if(this.name=='xaxis'||this.name=='x2axis'){temp=l.outerHeight(true);}
else{temp=l.outerWidth(true);}
if(temp>dim2){dim2=temp;}}
if(lshow){w=this._label._elem.outerWidth(true);h=this._label._elem.outerHeight(true);}
if(this.name=='xaxis'){dim+=dim2+h;this._elem.css({'height':dim+'px',left:'0px',bottom:'0px'});}
else if(this.name=='x2axis'){dim+=dim2+h;this._elem.css({'height':dim+'px',left:'0px',top:'0px'});}
else if(this.name=='yaxis'){dim+=dim2+w;this._elem.css({'width':dim+'px',left:'0px',top:'0px'});if(lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer){this._label._elem.css('width',w+'px');}}
else{dim+=dim2+w;this._elem.css({'width':dim+'px',right:'0px',top:'0px'});if(lshow&&this._label.constructor==$.jqplot.AxisLabelRenderer){this._label._elem.css('width',w+'px');}}}};$.jqplot.CategoryAxisRenderer.prototype.pack=function(pos,offsets){var ticks=this._ticks;var max=this.max;var min=this.min;var offmax=offsets.max;var offmin=offsets.min;var lshow=(this._label==null)?false:this._label.show;var i;for(var p in pos){this._elem.css(p,pos[p]);}
this._offsets=offsets;var pixellength=offmax-offmin;var unitlength=max-min;if(!this.reverse){this.u2p=function(u){return(u-min)*pixellength/unitlength+offmin;};this.p2u=function(p){return(p-offmin)*unitlength/pixellength+min;};if(this.name=='xaxis'||this.name=='x2axis'){this.series_u2p=function(u){return(u-min)*pixellength/unitlength;};this.series_p2u=function(p){return p*unitlength/pixellength+min;};}
else{this.series_u2p=function(u){return(u-max)*pixellength/unitlength;};this.series_p2u=function(p){return p*unitlength/pixellength+max;};}}
else{this.u2p=function(u){return offmin+(max-u)*pixellength/unitlength;};this.p2u=function(p){return min+(p-offmin)*unitlength/pixellength;};if(this.name=='xaxis'||this.name=='x2axis'){this.series_u2p=function(u){return(max-u)*pixellength/unitlength;};this.series_p2u=function(p){return p*unitlength/pixellength+max;};}
else{this.series_u2p=function(u){return(min-u)*pixellength/unitlength;};this.series_p2u=function(p){return p*unitlength/pixellength+min;};}}
if(this.show){if(this.name=='xaxis'||this.name=='x2axis'){for(i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){var temp=(this.name=='xaxis')?1:-1;switch(t.labelPosition){case'auto':if(temp*t.angle<0){shim=-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;}
else{shim=-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;}
break;case'end':shim=-t.getWidth()+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;case'start':shim=-t._textRenderer.height*Math.sin(t._textRenderer.angle)/2;break;case'middle':shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;default:shim=-t.getWidth()/2+t._textRenderer.height*Math.sin(-t._textRenderer.angle)/2;break;}}
else{shim=-t.getWidth()/2;}
var val=this.u2p(t.value)+shim+'px';t._elem.css('left',val);t.pack();}}
var labeledge=['bottom',0];if(lshow){var w=this._label._elem.outerWidth(true);this._label._elem.css('left',offmin+pixellength/2-w/2+'px');if(this.name=='xaxis'){this._label._elem.css('bottom','0px');labeledge=['bottom',this._label._elem.outerHeight(true)];}
else{this._label._elem.css('top','0px');labeledge=['top',this._label._elem.outerHeight(true)];}
this._label.pack();}
var step=parseInt(this._ticks.length/this.groups,10)+1;for(i=0;i<this._groupLabels.length;i++){var mid=0;var count=0;for(var j=i*step;j<(i+1)*step;j++){if(j>=this._ticks.length-1)continue;if(this._ticks[j]._elem&&this._ticks[j].label!=" "){var t=this._ticks[j]._elem;var p=t.position();mid+=p.left+t.outerWidth(true)/2;count++;}}
mid=mid/count;this._groupLabels[i].css({'left':(mid-this._groupLabels[i].outerWidth(true)/2)});this._groupLabels[i].css(labeledge[0],labeledge[1]);}}
else{for(i=0;i<ticks.length;i++){var t=ticks[i];if(t.show&&t.showLabel){var shim;if(t.constructor==$.jqplot.CanvasAxisTickRenderer&&t.angle){var temp=(this.name=='yaxis')?1:-1;switch(t.labelPosition){case'auto':case'end':if(temp*t.angle<0){shim=-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2;}
else{shim=-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2;}
break;case'start':if(t.angle>0){shim=-t._textRenderer.height*Math.cos(-t._textRenderer.angle)/2;}
else{shim=-t.getHeight()+t._textRenderer.height*Math.cos(t._textRenderer.angle)/2;}
break;case'middle':shim=-t.getHeight()/2;break;default:shim=-t.getHeight()/2;break;}}
else{shim=-t.getHeight()/2;}
var val=this.u2p(t.value)+shim+'px';t._elem.css('top',val);t.pack();}}
var labeledge=['left',0];if(lshow){var h=this._label._elem.outerHeight(true);this._label._elem.css('top',offmax-pixellength/2-h/2+'px');if(this.name=='yaxis'){this._label._elem.css('left','0px');labeledge=['left',this._label._elem.outerWidth(true)];}
else{this._label._elem.css('right','0px');labeledge=['right',this._label._elem.outerWidth(true)];}
this._label.pack();}
var step=parseInt(this._ticks.length/this.groups,10)+1;for(i=0;i<this._groupLabels.length;i++){var mid=0;var count=0;for(var j=i*step;j<(i+1)*step;j++){if(j>=this._ticks.length-1)continue;if(this._ticks[j]._elem&&this._ticks[j].label!=" "){var t=this._ticks[j]._elem;var p=t.position();mid+=p.top+t.outerHeight()/2;count++;}}
mid=mid/count;this._groupLabels[i].css({'top':mid-this._groupLabels[i].outerHeight()/2});this._groupLabels[i].css(labeledge[0],labeledge[1]);}}}};})(jQuery);(function($){$.jqplot.PointLabels=function(options){this.show=$.jqplot.config.enablePlugins;this.location='n';this.labelsFromSeries=false;this.seriesLabelIndex=null;this.labels=[];this._labels=[];this.stackedValue=false;this.ypadding=6;this.xpadding=6;this.escapeHTML=true;this.edgeTolerance=-5;this.formatter=$.jqplot.DefaultTickFormatter;this.formatString='';this.hideZeros=false;this._elems=[];$.extend(true,this,options);};var locations=['nw','n','ne','e','se','s','sw','w'];var locationIndicies={'nw':0,'n':1,'ne':2,'e':3,'se':4,'s':5,'sw':6,'w':7};var oppositeLocations=['se','s','sw','w','nw','n','ne','e'];$.jqplot.PointLabels.init=function(target,data,seriesDefaults,opts,plot){var options=$.extend(true,{},seriesDefaults,opts);options.pointLabels=options.pointLabels||{};if(this.renderer.constructor===$.jqplot.BarRenderer&&this.barDirection==='horizontal'&&!options.pointLabels.location){options.pointLabels.location='e';}
this.plugins.pointLabels=new $.jqplot.PointLabels(options.pointLabels);this.plugins.pointLabels.setLabels.call(this);};$.jqplot.PointLabels.prototype.setLabels=function(){var p=this.plugins.pointLabels;var labelIdx;if(p.seriesLabelIndex!=null){labelIdx=p.seriesLabelIndex;}
else if(this.renderer.constructor===$.jqplot.BarRenderer&&this.barDirection==='horizontal'){labelIdx=(this._plotData[0].length<3)?0:this._plotData[0].length-1;}
else{labelIdx=(this._plotData.length===0)?0:this._plotData[0].length-1;}
p._labels=[];if(p.labels.length===0||p.labelsFromSeries){if(p.stackedValue){if(this._plotData.length&&this._plotData[0].length){for(var i=0;i<this._plotData.length;i++){p._labels.push(this._plotData[i][labelIdx]);}}}
else{var d=this.data;if(this.renderer.constructor===$.jqplot.BarRenderer&&this.waterfall){d=this._data;}
if(d.length&&d[0].length){for(var i=0;i<d.length;i++){p._labels.push(d[i][labelIdx]);}}
d=null;}}
else if(p.labels.length){p._labels=p.labels;}};$.jqplot.PointLabels.prototype.xOffset=function(elem,location,padding){location=location||this.location;padding=padding||this.xpadding;var offset;switch(location){case'nw':offset=-elem.outerWidth(true)-this.xpadding;break;case'n':offset=-elem.outerWidth(true)/2;break;case'ne':offset=this.xpadding;break;case'e':offset=this.xpadding;break;case'se':offset=this.xpadding;break;case's':offset=-elem.outerWidth(true)/2;break;case'sw':offset=-elem.outerWidth(true)-this.xpadding;break;case'w':offset=-elem.outerWidth(true)-this.xpadding;break;default:offset=-elem.outerWidth(true)-this.xpadding;break;}
return offset;};$.jqplot.PointLabels.prototype.yOffset=function(elem,location,padding){location=location||this.location;padding=padding||this.xpadding;var offset;switch(location){case'nw':offset=-elem.outerHeight(true)-this.ypadding;break;case'n':offset=-elem.outerHeight(true)-this.ypadding;break;case'ne':offset=-elem.outerHeight(true)-this.ypadding;break;case'e':offset=-elem.outerHeight(true)/2;break;case'se':offset=this.ypadding;break;case's':offset=this.ypadding;break;case'sw':offset=this.ypadding;break;case'w':offset=-elem.outerHeight(true)/2;break;default:offset=-elem.outerHeight(true)-this.ypadding;break;}
return offset;};$.jqplot.PointLabels.draw=function(sctx,options,plot){var p=this.plugins.pointLabels;p.setLabels.call(this);for(var i=0;i<p._elems.length;i++){p._elems[i].emptyForce();}
p._elems.splice(0,p._elems.length);if(p.show){var ax='_'+this._stackAxis+'axis';if(!p.formatString){p.formatString=this[ax]._ticks[0].formatString;p.formatter=this[ax]._ticks[0].formatter;}
var pd=this._plotData;var ppd=this._prevPlotData;var xax=this._xaxis;var yax=this._yaxis;var elem,helem;for(var i=0,l=p._labels.length;i<l;i++){var label=p._labels[i];if(label==null||(p.hideZeros&&parseInt(label,10)==0)){continue;}
label=p.formatter(p.formatString,label);helem=document.createElement('div');p._elems[i]=$(helem);elem=p._elems[i];elem.addClass('jqplot-point-label jqplot-series-'+this.index+' jqplot-point-'+i);elem.css('position','absolute');elem.insertAfter(sctx.canvas);if(p.escapeHTML){elem.text(label);}
else{elem.html(label);}
var location=p.location;if((this.fillToZero&&pd[i][1]<0)||(this.fillToZero&&this._type==='bar'&&this.barDirection==='horizontal'&&pd[i][0]<0)||(this.waterfall&&parseInt(label,10))<0){location=oppositeLocations[locationIndicies[location]];}
var ell=xax.u2p(pd[i][0])+p.xOffset(elem,location);var elt=yax.u2p(pd[i][1])+p.yOffset(elem,location);if(this._stack&&!p.stackedValue){if(this.barDirection==="vertical"){elt=(this._barPoints[i][0][1]+this._barPoints[i][1][1])/2+plot._gridPadding.top-0.5*elem.outerHeight(true);}
else{ell=(this._barPoints[i][2][0]+this._barPoints[i][0][0])/2+plot._gridPadding.left-0.5*elem.outerWidth(true);}}
if(this.renderer.constructor==$.jqplot.BarRenderer){if(this.barDirection=="vertical"){ell+=this._barNudge;}
else{elt-=this._barNudge;}}
elem.css('left',ell);elem.css('top',elt);var elr=ell+elem.width();var elb=elt+elem.height();var et=p.edgeTolerance;var scl=$(sctx.canvas).position().left;var sct=$(sctx.canvas).position().top;var scr=sctx.canvas.width+scl;var scb=sctx.canvas.height+sct;if(ell-et<scl||elt-et<sct||elr+et>scr||elb+et>scb){elem.remove();}
elem=null;helem=null;}}};$.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);$.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);})(jQuery);(function($){$.jqplot.CanvasTextRenderer=function(options){this.fontStyle='normal';this.fontVariant='normal';this.fontWeight='normal';this.fontSize='10px';this.fontFamily='sans-serif';this.fontStretch=1.0;this.fillStyle='#666666';this.angle=0;this.textAlign='start';this.textBaseline='alphabetic';this.text;this.width;this.height;this.pt2px=1.28;$.extend(true,this,options);this.normalizedFontSize=this.normalizeFontSize(this.fontSize);this.setHeight();};$.jqplot.CanvasTextRenderer.prototype.init=function(options){$.extend(true,this,options);this.normalizedFontSize=this.normalizeFontSize(this.fontSize);this.setHeight();};$.jqplot.CanvasTextRenderer.prototype.normalizeFontSize=function(sz){sz=String(sz);var n=parseFloat(sz);if(sz.indexOf('px')>-1){return n/this.pt2px;}
else if(sz.indexOf('pt')>-1){return n;}
else if(sz.indexOf('em')>-1){return n*12;}
else if(sz.indexOf('%')>-1){return n*12/100;}
else{return n/this.pt2px;}};$.jqplot.CanvasTextRenderer.prototype.fontWeight2Float=function(w){if(Number(w)){return w/400;}
else{switch(w){case'normal':return 1;break;case'bold':return 1.75;break;case'bolder':return 2.25;break;case'lighter':return 0.75;break;default:return 1;break;}}};$.jqplot.CanvasTextRenderer.prototype.getText=function(){return this.text;};$.jqplot.CanvasTextRenderer.prototype.setText=function(t,ctx){this.text=t;this.setWidth(ctx);return this;};$.jqplot.CanvasTextRenderer.prototype.getWidth=function(ctx){return this.width;};$.jqplot.CanvasTextRenderer.prototype.setWidth=function(ctx,w){if(!w){this.width=this.measure(ctx,this.text);}
else{this.width=w;}
return this;};$.jqplot.CanvasTextRenderer.prototype.getHeight=function(ctx){return this.height;};$.jqplot.CanvasTextRenderer.prototype.setHeight=function(w){if(!w){this.height=this.normalizedFontSize*this.pt2px;}
else{this.height=w;}
return this;};$.jqplot.CanvasTextRenderer.prototype.letter=function(ch)
{return this.letters[ch];};$.jqplot.CanvasTextRenderer.prototype.ascent=function()
{return this.normalizedFontSize;};$.jqplot.CanvasTextRenderer.prototype.descent=function()
{return 7.0*this.normalizedFontSize/25.0;};$.jqplot.CanvasTextRenderer.prototype.measure=function(ctx,str)
{var total=0;var len=str.length;for(var i=0;i<len;i++){var c=this.letter(str.charAt(i));if(c){total+=c.width*this.normalizedFontSize/25.0*this.fontStretch;}}
return total;};$.jqplot.CanvasTextRenderer.prototype.draw=function(ctx,str)
{var x=0;var y=this.height*0.72;var total=0;var len=str.length;var mag=this.normalizedFontSize/25.0;ctx.save();var tx,ty;if((-Math.PI/2<=this.angle&&this.angle<=0)||(Math.PI*3/2<=this.angle&&this.angle<=Math.PI*2)){tx=0;ty=-Math.sin(this.angle)*this.width;}
else if((0<this.angle&&this.angle<=Math.PI/2)||(-Math.PI*2<=this.angle&&this.angle<=-Math.PI*3/2)){tx=Math.sin(this.angle)*this.height;ty=0;}
else if((-Math.PI<this.angle&&this.angle<-Math.PI/2)||(Math.PI<=this.angle&&this.angle<=Math.PI*3/2)){tx=-Math.cos(this.angle)*this.width;ty=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height;}
else if((-Math.PI*3/2<this.angle&&this.angle<Math.PI)||(Math.PI/2<this.angle&&this.angle<Math.PI)){tx=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width;ty=-Math.cos(this.angle)*this.height;}
ctx.strokeStyle=this.fillStyle;ctx.fillStyle=this.fillStyle;ctx.translate(tx,ty);ctx.rotate(this.angle);ctx.lineCap="round";var fact=(this.normalizedFontSize>30)?2.0:2+(30-this.normalizedFontSize)/20;ctx.lineWidth=fact*mag*this.fontWeight2Float(this.fontWeight);for(var i=0;i<len;i++){var c=this.letter(str.charAt(i));if(!c){continue;}
ctx.beginPath();var penUp=1;var needStroke=0;for(var j=0;j<c.points.length;j++){var a=c.points[j];if(a[0]==-1&&a[1]==-1){penUp=1;continue;}
if(penUp){ctx.moveTo(x+a[0]*mag*this.fontStretch,y-a[1]*mag);penUp=false;}else{ctx.lineTo(x+a[0]*mag*this.fontStretch,y-a[1]*mag);}}
ctx.stroke();x+=c.width*mag*this.fontStretch;}
ctx.restore();return total;};$.jqplot.CanvasTextRenderer.prototype.letters={' ':{width:16,points:[]},'!':{width:10,points:[[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},'"':{width:16,points:[[4,21],[4,14],[-1,-1],[12,21],[12,14]]},'#':{width:21,points:[[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]]},'$':{width:20,points:[[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},'%':{width:24,points:[[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]]},'&':{width:26,points:[[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]]},'\'':{width:10,points:[[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]]},'(':{width:14,points:[[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]]},')':{width:14,points:[[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]]},'*':{width:16,points:[[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]]},'+':{width:26,points:[[13,18],[13,0],[-1,-1],[4,9],[22,9]]},',':{width:10,points:[[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},'-':{width:18,points:[[6,9],[12,9]]},'.':{width:10,points:[[5,2],[4,1],[5,0],[6,1],[5,2]]},'/':{width:22,points:[[20,25],[2,-7]]},'0':{width:20,points:[[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]]},'1':{width:20,points:[[6,17],[8,18],[11,21],[11,0]]},'2':{width:20,points:[[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]]},'3':{width:20,points:[[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},'4':{width:20,points:[[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]]},'5':{width:20,points:[[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},'6':{width:20,points:[[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]]},'7':{width:20,points:[[17,21],[7,0],[-1,-1],[3,21],[17,21]]},'8':{width:20,points:[[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]]},'9':{width:20,points:[[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]]},':':{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},';':{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},'<':{width:24,points:[[20,18],[4,9],[20,0]]},'=':{width:26,points:[[4,12],[22,12],[-1,-1],[4,6],[22,6]]},'>':{width:24,points:[[4,18],[20,9],[4,0]]},'?':{width:18,points:[[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]]},'@':{width:27,points:[[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]]},'A':{width:18,points:[[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]]},'B':{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]]},'C':{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]]},'D':{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]]},'E':{width:19,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]]},'F':{width:18,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]]},'G':{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]]},'H':{width:22,points:[[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]]},'I':{width:8,points:[[4,21],[4,0]]},'J':{width:16,points:[[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]]},'K':{width:21,points:[[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]]},'L':{width:17,points:[[4,21],[4,0],[-1,-1],[4,0],[16,0]]},'M':{width:24,points:[[4,21],[4,0],[-1,-1],[4,21],[12,0],[-1,-1],[20,21],[12,0],[-1,-1],[20,21],[20,0]]},'N':{width:22,points:[[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]]},'O':{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]]},'P':{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]]},'Q':{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]]},'R':{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]]},'S':{width:20,points:[[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},'T':{width:16,points:[[8,21],[8,0],[-1,-1],[1,21],[15,21]]},'U':{width:22,points:[[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]]},'V':{width:18,points:[[1,21],[9,0],[-1,-1],[17,21],[9,0]]},'W':{width:24,points:[[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]]},'X':{width:20,points:[[3,21],[17,0],[-1,-1],[17,21],[3,0]]},'Y':{width:18,points:[[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]]},'Z':{width:20,points:[[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]]},'[':{width:14,points:[[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]]},'\\':{width:14,points:[[0,21],[14,-3]]},']':{width:14,points:[[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]]},'^':{width:16,points:[[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]]},'_':{width:16,points:[[0,-2],[16,-2]]},'`':{width:10,points:[[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]]},'a':{width:19,points:[[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},'b':{width:19,points:[[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},'c':{width:18,points:[[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},'d':{width:19,points:[[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},'e':{width:18,points:[[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},'f':{width:12,points:[[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]]},'g':{width:19,points:[[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},'h':{width:19,points:[[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},'i':{width:8,points:[[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]]},'j':{width:10,points:[[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]]},'k':{width:17,points:[[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]]},'l':{width:8,points:[[4,21],[4,0]]},'m':{width:30,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]]},'n':{width:19,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},'o':{width:19,points:[[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]]},'p':{width:19,points:[[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},'q':{width:19,points:[[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},'r':{width:13,points:[[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]]},'s':{width:17,points:[[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]]},'t':{width:12,points:[[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]]},'u':{width:19,points:[[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]]},'v':{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0]]},'w':{width:22,points:[[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]]},'x':{width:17,points:[[3,14],[14,0],[-1,-1],[14,14],[3,0]]},'y':{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]]},'z':{width:17,points:[[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]]},'{':{width:14,points:[[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]]},'|':{width:8,points:[[4,25],[4,-7]]},'}':{width:14,points:[[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]]},'~':{width:24,points:[[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]]}};$.jqplot.CanvasFontRenderer=function(options){options=options||{};if(!options.pt2px){options.pt2px=1.5;}
$.jqplot.CanvasTextRenderer.call(this,options);};$.jqplot.CanvasFontRenderer.prototype=new $.jqplot.CanvasTextRenderer({});$.jqplot.CanvasFontRenderer.prototype.constructor=$.jqplot.CanvasFontRenderer;$.jqplot.CanvasFontRenderer.prototype.measure=function(ctx,str)
{var fstyle=this.fontSize+' '+this.fontFamily;ctx.save();ctx.font=fstyle;var w=ctx.measureText(str).width;ctx.restore();return w;};$.jqplot.CanvasFontRenderer.prototype.draw=function(ctx,str)
{var x=0;var y=this.height*0.72;ctx.save();var tx,ty;if((-Math.PI/2<=this.angle&&this.angle<=0)||(Math.PI*3/2<=this.angle&&this.angle<=Math.PI*2)){tx=0;ty=-Math.sin(this.angle)*this.width;}
else if((0<this.angle&&this.angle<=Math.PI/2)||(-Math.PI*2<=this.angle&&this.angle<=-Math.PI*3/2)){tx=Math.sin(this.angle)*this.height;ty=0;}
else if((-Math.PI<this.angle&&this.angle<-Math.PI/2)||(Math.PI<=this.angle&&this.angle<=Math.PI*3/2)){tx=-Math.cos(this.angle)*this.width;ty=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height;}
else if((-Math.PI*3/2<this.angle&&this.angle<Math.PI)||(Math.PI/2<this.angle&&this.angle<Math.PI)){tx=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width;ty=-Math.cos(this.angle)*this.height;}
ctx.strokeStyle=this.fillStyle;ctx.fillStyle=this.fillStyle;var fstyle=this.fontSize+' '+this.fontFamily;ctx.font=fstyle;ctx.translate(tx,ty);ctx.rotate(this.angle);ctx.fillText(str,x,y);ctx.restore();};})(jQuery);(function($){$.jqplot.CanvasAxisTickRenderer=function(options){this.mark='outside';this.showMark=true;this.showGridline=true;this.isMinorTick=false;this.angle=0;this.markSize=4;this.show=true;this.showLabel=true;this.labelPosition='auto';this.label='';this.value=null;this._styles={};this.formatter=$.jqplot.DefaultTickFormatter;this.formatString='';this.prefix='';this.fontFamily='"Trebuchet MS", Arial, Helvetica, sans-serif';this.fontSize='10pt';this.fontWeight='normal';this.fontStretch=1.0;this.textColor='#666666';this.enableFontSupport=true;this.pt2px=null;this._elem;this._ctx;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null};$.extend(true,this,options);var ropts={fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily};if(this.pt2px){ropts.pt2px=this.pt2px;}
if(this.enableFontSupport){if($.jqplot.support_canvas_text()){this._textRenderer=new $.jqplot.CanvasFontRenderer(ropts);}
else{this._textRenderer=new $.jqplot.CanvasTextRenderer(ropts);}}
else{this._textRenderer=new $.jqplot.CanvasTextRenderer(ropts);}};$.jqplot.CanvasAxisTickRenderer.prototype.init=function(options){$.extend(true,this,options);this._textRenderer.init({fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily});};$.jqplot.CanvasAxisTickRenderer.prototype.getWidth=function(ctx){if(this._elem){return this._elem.outerWidth(true);}
else{var tr=this._textRenderer;var l=tr.getWidth(ctx);var h=tr.getHeight(ctx);var w=Math.abs(Math.sin(tr.angle)*h)+Math.abs(Math.cos(tr.angle)*l);return w;}};$.jqplot.CanvasAxisTickRenderer.prototype.getHeight=function(ctx){if(this._elem){return this._elem.outerHeight(true);}
else{var tr=this._textRenderer;var l=tr.getWidth(ctx);var h=tr.getHeight(ctx);var w=Math.abs(Math.cos(tr.angle)*h)+Math.abs(Math.sin(tr.angle)*l);return w;}};$.jqplot.CanvasAxisTickRenderer.prototype.getTop=function(ctx){if(this._elem){return this._elem.position().top;}
else{return null;}};$.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad=function(){var a=this.angle*Math.PI/180;return a;};$.jqplot.CanvasAxisTickRenderer.prototype.setTick=function(value,axisName,isMinor){this.value=value;if(isMinor){this.isMinorTick=true;}
return this;};$.jqplot.CanvasAxisTickRenderer.prototype.draw=function(ctx,plot){if(!this.label){this.label=this.prefix+this.formatter(this.formatString,this.value);}
if(this._elem){if($.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined){window.G_vmlCanvasManager.uninitElement(this._elem.get(0));}
this._elem.emptyForce();this._elem=null;}
var elem=plot.canvasManager.getCanvas();this._textRenderer.setText(this.label,ctx);var w=this.getWidth(ctx);var h=this.getHeight(ctx);elem.width=w;elem.height=h;elem.style.width=w;elem.style.height=h;elem.style.textAlign='left';elem.style.position='absolute';elem=plot.canvasManager.initCanvas(elem);this._elem=$(elem);this._elem.css(this._styles);this._elem.addClass('jqplot-'+this.axis+'-tick');elem=null;return this._elem;};$.jqplot.CanvasAxisTickRenderer.prototype.pack=function(){this._textRenderer.draw(this._elem.get(0).getContext("2d"),this.label);};})(jQuery);var nar=nar||{};(function(){nar.Constituents={ammonia:{color:'#CAFF70',name:'Ammonia'},orthoP:{color:'#C1FFC1',name:'Ortho Phosphate'},nitrogen:{color:'#6E8B3D',name:'Total Nitrogen'},pesticides:{color:'#008080',name:'Pesticides'},ecology:{color:'#808000',name:'Ecology'},nitrate:{color:'#7FFF00',name:'Nitrate'},phosphorus:{color:'#698B69',name:'Total Phosphorus'},sediment:{color:'#8B0000',name:'Suspended Sediment'},streamflow:{color:'#0000CD',name:'Streamflow'}};})();var nar=nar||{};nar.loadSiteHelpInfo=function(url){nar.siteHelpInfo={};nar.siteHelpInfoPromise=$.ajax({url:url,type:'GET',data:{site_id:PARAMS.siteId},success:function(data){nar.siteHelpInfo=data;},error:function(jqXHR,textStatus,errorThrown){throw Error('Unable to contact the site info URL service: '&textStatus);}});};var nar=nar||{};nar.fullReport=nar.fullReport||{};(function(){var ConstituentCurrentYearComparisonPlot=function(plotContainerSelector,series,legendSelector){nar.util.assert_selector_present(plotContainerSelector);if(legendSelector){nar.util.assert_selector_present(legendSelector);}
var averageColor=series.averageColor||ConstituentCurrentYearComparisonPlot.defaultAverageColor;var plotContainer=$(plotContainerSelector);var plotClass=ConstituentCurrentYearComparisonPlot.plotClass;var plotDiv=$('<div/>',{'class':plotClass});var plotDivSelector=plotContainerSelector+' .'+plotClass;plotContainer.append(plotDiv);var legendElt=$('<div/>',{'class':ConstituentCurrentYearComparisonPlot.legendClass});var yearLegendClass=ConstituentCurrentYearComparisonPlot.yearLegendClass;var yearLegendElt=$('<span/>',{'class':yearLegendClass});yearLegendElt.html('2014');var yearLegendEltSelector=plotContainerSelector+' .'+yearLegendClass;var averageLegendClass=ConstituentCurrentYearComparisonPlot.averageLegendClass;var averageLegendElt=$('<span/>',{'class':averageLegendClass});averageLegendElt.html('Avg');legendElt.append(averageLegendElt);legendElt.append(yearLegendElt);plotContainer.append(legendElt);var titleClass=ConstituentCurrentYearComparisonPlot.titleClass;var titleDiv=$('<div/>',{'class':titleClass});titleDiv.html(series.constituentName);var titleDivSelector=plotContainerSelector+' .'+titleClass;plotContainer.append(titleDiv);var yearSeries={data:[['',series.yearValue]],label:'2014',bars:{show:true,barWidth:4,align:"left",fillColor:series.yearColor}};var averageSeries={data:[['',series.averageValue]],label:series.averageName,bars:{show:true,barWidth:4,align:"right",fillColor:averageColor}};var flotSeries=[averageSeries,yearSeries];var plot=$.plot(plotDivSelector,flotSeries,{xaxis:{mode:"categories",tickLength:0},yaxis:{axisLabel:series.displayUnitOnYAxis?series.constituentUnit:null,axisLabelUseCanvas:true,axisLabelPadding:3,tickLength:3,tickColor:'#000000'},grid:{hoverable:true,clickable:true},colors:[averageColor,series.yearColor],tooltip:true,tooltipOpts:{content:'%s: %y '+series.constituentUnit},legend:{show:false}});return plot;};ConstituentCurrentYearComparisonPlot.defaultAverageColor='#D8DCDC';ConstituentCurrentYearComparisonPlot.titleClass='currentYearComparisonTitle';ConstituentCurrentYearComparisonPlot.yearLegendClass='currentYearComparisonYearLegend';ConstituentCurrentYearComparisonPlot.averageLegendClass='currentYearComparisonAverageLegend';ConstituentCurrentYearComparisonPlot.legendClass='comparisonLegend';ConstituentCurrentYearComparisonPlot.plotClass='currentYearComparisonPlot';nar.fullReport.ConstituentCurrentYearComparisonPlot=ConstituentCurrentYearComparisonPlot;}());var nar=nar||{};nar.fullReport=nar.fullReport||{};(function(){var ExceedancePlot=function(plotEltId,seriesSpecifications,axisLabel){nar.util.assert_selector_present('#'+plotEltId);$.jqplot.config.enablePlugins=true;var data=seriesSpecifications.map(function(seriesSpec){return[seriesSpec.data,seriesSpec.constituent.name];});var seriesOptions=seriesSpecifications.map(function(seriesSpec){return seriesSpec.constituent.color;});var plot=$.jqplot(plotEltId,[data],{seriesDefaults:{renderer:$.jqplot.BarRenderer,rendererOptions:{barDirection:'horizontal',varyBarColor:true,barWidth:40},pointLabels:{show:true,location:'e',edgeTolerance:-30}},seriesColors:seriesOptions,axes:{yaxis:{renderer:$.jqplot.CategoryAxisRenderer,tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickOptions:{angle:-90,labelPosition:'middle',showGridline:false}},xaxis:{max:100,min:0,label:axisLabel}},grid:{drawGridLine:false}});$(window).resize(function(){plot.replot();});var plotSelector='#'+plotEltId;var plotExportButtonContainer=$(plotSelector).after('<div></div>').next();plotExportButtonContainer.addClass('plotExportButtonContainer').append('<button>Download Plot</button>',{'class':'plotExportButton'}).click(function(){$(plotSelector).jqplotSaveImage();});return plot;};nar.fullReport.ExceedancePlot=ExceedancePlot;}());$(document).ready(function(){$.when(nar.siteHelpInfoPromise).done(function(){var ConstituentCurrentYearComparisonPlot=nar.fullReport.ConstituentCurrentYearComparisonPlot;var ExceedancePlot=nar.fullReport.ExceedancePlot;var nitrateSeries={constituentName:nar.Constituents.nitrate.name,constituentUnit:'Million Tons',yearValue:12,yearColor:nar.Constituents.nitrate.color,averageName:'Average 1991-2013',averageValue:10};var nitrateGraph=ConstituentCurrentYearComparisonPlot('#barChart2',nitrateSeries);var phosphorusSeries={constituentName:nar.Constituents.phosphorus.name,constituentUnit:'Million Tons',yearValue:100,yearColor:nar.Constituents.phosphorus.color,averageName:'Average 1985-2013',averageValue:153};var phosphorusGraph=ConstituentCurrentYearComparisonPlot('#barChart3',phosphorusSeries);var streamflowSeries={constituentName:nar.Constituents.streamflow.name,constituentUnit:'Million acre-feet',yearValue:1.7,yearColor:nar.Constituents.streamflow.color,averageName:'Average 1999-2013',averageValue:2.4};var streamflowGraph=ConstituentCurrentYearComparisonPlot('#barChart1',streamflowSeries);var sedimentSeries={constituentName:nar.Constituents.sediment.name,constituentUnit:'Million Tons',yearValue:300,yearColor:nar.Constituents.sediment.color,averageName:'Average 1990-2013',averageValue:100};var sedimentGraph=ConstituentCurrentYearComparisonPlot('#barChart4',sedimentSeries);var exceedancesTitle='Percentage of samples with concentrations greater than benchmarks';var humanHealthExceedancePlot=ExceedancePlot('humanHealthExceedances',[{constituent:nar.Constituents.nitrate,data:[73]},{constituent:{color:'',name:' '},data:[' ']}],exceedancesTitle);var aquaticHealthExceedancePlot=ExceedancePlot('aquaticHealthExceedances',[{constituent:nar.Constituents.nitrogen,data:[13]},{constituent:nar.Constituents.phosphorus,data:[73]},],exceedancesTitle);});});