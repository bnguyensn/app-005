(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"3KmD":function(e){e.exports={decimal:".",thousands:",",grouping:[3],currency:["£",""]}},ILUK:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),function(module){__webpack_require__.d(__webpack_exports__,"default",function(){return Chart});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("q1tI"),react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__),d3_selection__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("/TIM"),d3_scale__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("ziQ1"),d3_axis__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("RhHs"),d3_shape__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("8d86"),d3_transition__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("sQjb"),d3_format__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("rWgG"),_ChartTooltip__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("urBT"),_lib_utils_arrayMaths__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("g3YP"),_json_d3_locales_en_UK__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("3KmD"),_json_d3_locales_en_UK__WEBPACK_IMPORTED_MODULE_9___namespace=__webpack_require__.t("3KmD",1),_chart_css__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("uggL"),_chart_css__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(_chart_css__WEBPACK_IMPORTED_MODULE_10__),b;function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},r=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),r.forEach(function(e){_defineProperty(t,e,a[e])})}return t}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}b=__webpack_require__("0cfB").enterModule,b&&b(module);var EN_UK=Object(d3_format__WEBPACK_IMPORTED_MODULE_6__.b)(_json_d3_locales_en_UK__WEBPACK_IMPORTED_MODULE_9__),Chart=function(_React$Component){function Chart(e){var E;return _classCallCheck(this,Chart),_defineProperty(_assertThisInitialized(_assertThisInitialized(E=_possibleConstructorReturn(this,_getPrototypeOf(Chart).call(this,e)))),"chartNodeRef",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"pannableNodeRef",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"nameToDispNameMap",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"pannableSize",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"chartAssetData",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"scaleX",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"scaleY",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"mouseXY",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"mouseDown",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"chartOffset",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"lineGen",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"trans1",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handleNewDataset",function(){var e=E.props,t=e.data,a=(e.chartSize,e.colorData);E.chartAssetData={},t[0].assets.forEach(function(e){E.chartAssetData[e.name]={lvl:0,color:""},E.chartAssetData[e.name].lvl=e.lvl,E.chartAssetData[e.name].color=a.assets[e.name]});var r=E.getChart(),n=E.getPannable();if(r&&n){var i=Object(d3_selection__WEBPACK_IMPORTED_MODULE_1__.d)(r),_=Object(d3_selection__WEBPACK_IMPORTED_MODULE_1__.d)(n);i.selectAll(".clearable").remove(),E.updateChart(i,_)}}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"updateChart",function(e,t){var a=E.props,r=a.data,n=a.colorData,i=a.chartSize;E.pannableSize={width:r.length<=10?i.width:54*r.length,height:i.height};t.insert("rect",":first-child").classed("bkg-rect clearable",!0).attr("width",E.pannableSize.width).attr("height",i.height).attr("fill-opacity",0);E.scaleX=E.createScaleX(),E.scaleY=E.createScaleY();E.createAxisBottom(e.select(".x-axis"),E.scaleX),E.createAxisLeft(e.select(".y-axis"),E.scaleY);var _=E.createStackedSeries(),o=t.select(".vbars").selectAll(".vbar-series").data(_,function(e){return e.key});o.exit().remove();var s=o.enter().append("g").classed("vbar-series clearable",!0).merge(o);s.attr("fill",function(e){return n.assets[e.key]});var c=function(e,t){return E.scaleY(E.scaleY.domain()[1]-(t-e))},l=s.selectAll("rect").data(function(e){return e},function(e){return e.data.name}),u=l.exit();u.transition().duration(500).attr("x",i.width+i.marginRight+i.marginLeft).remove(),u.on("mouseenter",null),u.on("mouseleave",null),u.on("click",null);var p=l.enter().append("rect").classed("asset-bar",!0).merge(l);p.attr("y",function(e){return t=e[0],a=e[1],E.scaleY(t)-c(t,a);var t,a}),p.transition().duration(500).attr("width",E.scaleX.bandwidth()).attr("height",function(e){return c(e[0],e[1])}).attr("x",function(e){return E.scaleX(e.data.name)}),p.on("mouseenter",E.showTooltip),p.on("mouseleave",E.hideTooltip),p.on("click",E.handleChartElClicked);var d=E.createLineData(E.scaleX,E.scaleY),f=t.selectAll(".limit-line").data(d,function(e){return e.name}),h=f.exit();h.transition().duration(500).attr("transform","translate(0, -".concat(E.pannableSize.height,")")).attr("stroke-opacity",0).remove(),h.on("mouseenter",null),h.on("mouseleave",null),h.on("click",null);var m=f.enter().append("path").classed("limit-line",!0).merge(f);m.attr("d",function(e){return e.d}).attr("transform","translate(0, ".concat(E.pannableSize.height,")")).attr("stroke-opacity",0).attr("stroke",n.assets["Remaining investment commitments"]).attr("stroke-width",5),m.transition().duration(500).attr("transform","translate(0, 0)").attr("stroke-opacity",1),m.on("mouseenter",E.showTooltip),m.on("mouseleave",E.hideTooltip),m.on("click",E.handleChartElClicked)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"createScaleX",function(){var e=E.props.data.map(function(e){return e.name});return Object(d3_scale__WEBPACK_IMPORTED_MODULE_2__.a)().domain(e).range([0,E.pannableSize.width]).padding(.05)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"createScaleY",function(){var e=E.props,t=e.chartSize,a=e.data,r=Object(_lib_utils_arrayMaths__WEBPACK_IMPORTED_MODULE_8__.a)(a.map(function(e){return[e.remFCom,e.totalAssets]}));return Object(d3_scale__WEBPACK_IMPORTED_MODULE_2__.b)().domain([0,r]).nice().range([t.height,0])}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"createAxisBottom",function(e,t){var a=Object(d3_axis__WEBPACK_IMPORTED_MODULE_3__.a)(t).tickFormat(function(e){return E.nameToDispNameMap[e]});return e.call(a)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"createAxisLeft",function(e,t){var a=Object(d3_axis__WEBPACK_IMPORTED_MODULE_3__.b)(t).ticks(5).tickFormat(EN_UK.format("$~s"));return e.call(a)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"createStackedSeries",function(){var e=E.props.data,t=e.map(function(e){var t={};return t.name=e.name,e.assets.forEach(function(e){t[e.name]=e.amt}),t.fundData=e,t}),a=e[0].assets;a.sort(function(e,t){return e.lvl===t.lvl?e.name.localeCompare(t.name,"en",{sensitivity:"base",ignorePunctuation:!0,numeric:!0}):e.lvl-t.lvl});var r=a.map(function(e){return e.name});return Object(d3_shape__WEBPACK_IMPORTED_MODULE_4__.c)().keys(r)(t)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"createLineData",function(r,n){return E.props.data.map(function(e){var t=n(e.remFCom),a=[[r(e.name),t],[r(e.name)+r.bandwidth(),t]];return{name:"Remaining investment commitments",amount:e.remFCom,points:a,fundData:e,d:E.lineGen(a)}})}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handlePannableClick",function(e){}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handlePannableMouseDown",function(e){E.mouseDown=!0}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handlePannableMouseUp",function(e){E.mouseDown=!1}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handlePannableMouseEnter",function(e){var t=e.clientX,a=e.clientY;E.mouseXY.x=t,E.mouseXY.y=a}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handlePannableMouseLeave",function(e){E.mouseDown=!1}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handlePannableMouseMove",function(e){var t=e.clientX,a=e.clientY;if(E.mouseDown){var r=E.getPannable();if(r){var n=Object(d3_selection__WEBPACK_IMPORTED_MODULE_1__.d)(r);E.chartOffset.x+=t-E.mouseXY.x,n.attr("transform","translate(".concat(E.chartOffset.x,", 0)"))}}E.mouseXY.x=t,E.mouseXY.y=a}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"handleChartElClicked",function(e,t,a){var r=E.props.handleChartElClicked;e.data&&e.data.fundData?r(e.data.fundData):e.fundData&&r(e.fundData)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"showTooltip",function(e,t,a){var r=E.props.colorData,n=a[t].parentElement,i=a[t].getBoundingClientRect();if(n&&i){var _,o,s,c=a[t].getAttribute("class");s="asset-bar"===c?(_=n.__data__.key,o=e[1]-e[0],r.assets[_]):(_=e.name,o=e.amount,r.assets["Remaining investment commitments"]);var l="".concat(_,": ").concat(EN_UK.format("$,.0f")(o)),u={top:i.top,left:i.left+E.scaleX.bandwidth()+5};E.setState(function(e){return{tooltipChangeFlag:!e.tooltipChangeFlag,tooltip:{show:!0,text:l,pos:u,color:s}}})}}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"hideTooltip",function(){var e=d3_selection__WEBPACK_IMPORTED_MODULE_1__.a.relatedTarget;if(e){var t=e.getAttribute("class");"asset-bar"===t&&"limit-line"===t||E.setState(function(e){return{tooltipChangeFlag:!e.tooltipChangeFlag,tooltip:_objectSpread({},e.tooltip,{show:!1})}})}}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"getChart",function(){return E.chartNodeRef&&E.chartNodeRef.current?E.chartNodeRef.current:null}),_defineProperty(_assertThisInitialized(_assertThisInitialized(E)),"getPannable",function(){return E.pannableNodeRef&&E.pannableNodeRef.current?E.pannableNodeRef.current:null}),E.chartNodeRef=react__WEBPACK_IMPORTED_MODULE_0__.createRef(),E.pannableNodeRef=react__WEBPACK_IMPORTED_MODULE_0__.createRef(),E.nameToDispNameMap={},e.data.forEach(function(e){E.nameToDispNameMap[e.name]=e.dispName}),E.mouseXY={x:0,y:0},E.mouseDown=!1,E.chartOffset={x:0,y:0},E.lineGen=Object(d3_shape__WEBPACK_IMPORTED_MODULE_4__.b)().defined(function(e){return null!==e}),E.trans1=Object(d3_transition__WEBPACK_IMPORTED_MODULE_5__.a)().duration(2e3),E.state={tooltipChangeFlag:!1,tooltip:{show:!1,text:"",pos:{top:0,left:0},color:""}},E}return _inherits(Chart,_React$Component),_createClass(Chart,[{key:"componentDidMount",value:function(){this.handleNewDataset()}},{key:"componentDidUpdate",value:function(e,t,a){var r=e.mainChartElClickedFlag,n=this.props.mainChartElClickedFlag,i=t.tooltipChangeFlag;if(!(this.state.tooltipChangeFlag!==i)&&!(n!==r)){var _=this.getChart(),o=this.getPannable();if(_&&o){var s=Object(d3_selection__WEBPACK_IMPORTED_MODULE_1__.d)(_),c=Object(d3_selection__WEBPACK_IMPORTED_MODULE_1__.d)(o);this.updateChart(s,c)}}}},{key:"render",value:function(){var e=this.props,t=e.chartSize,a=e.children,r=this.state.tooltip;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"chart-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{width:t.width+t.marginRight+t.marginLeft,height:t.height+t.marginTop+t.marginBottom},react__WEBPACK_IMPORTED_MODULE_0__.createElement("g",{ref:this.chartNodeRef,className:"chart",transform:"translate(".concat(t.marginLeft,", ").concat(t.marginTop,")")},react__WEBPACK_IMPORTED_MODULE_0__.createElement("g",{ref:this.pannableNodeRef,className:"pannable-x-only",onClick:this.handlePannableClick,onMouseDown:this.handlePannableMouseDown,onMouseUp:this.handlePannableMouseUp,onMouseEnter:this.handlePannableMouseEnter,onMouseLeave:this.handlePannableMouseLeave,onMouseMove:this.handlePannableMouseMove},react__WEBPACK_IMPORTED_MODULE_0__.createElement("g",{className:"x-axis",transform:"translate(0, ".concat(t.height,")")}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("g",{className:"vbars"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("g",{className:"limit-lines"})),react__WEBPACK_IMPORTED_MODULE_0__.createElement("g",{className:"y-axis"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect",{className:"bkg-rect",width:t.marginLeft,height:t.height+t.marginBottom,transform:"translate(-".concat(t.marginLeft,", 0)"),fill:"#fff1e5"})))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ChartTooltip__WEBPACK_IMPORTED_MODULE_7__.a,{show:r.show,text:r.text,pos:r.pos,color:r.color}),a)}},{key:"__reactstandin__regenerateByEval",value:function __reactstandin__regenerateByEval(key,code){this[key]=eval(code)}}]),Chart}(react__WEBPACK_IMPORTED_MODULE_0__.Component),sc,tc;sc=__webpack_require__("0cfB").default,tc=__webpack_require__("0cfB").leaveModule,sc&&(sc.register(EN_UK,"EN_UK","E:\\Libraries\\Documents\\PhpstormProjects\\app-003\\src\\homepage\\components\\chart\\Chart.js"),sc.register(Chart,"Chart","E:\\Libraries\\Documents\\PhpstormProjects\\app-003\\src\\homepage\\components\\chart\\Chart.js"),tc(module))}.call(this,__webpack_require__("3UD+")(module))},g3YP:function(e,_,o){"use strict";(function(e){var t,a,r;function n(t,e){Array.isArray(e)?e.forEach(function(e){n(t,e)}):t.push(e)}function i(e){var t=[];return n(t,e),Math.max.apply(Math,t)}o.d(_,"a",function(){return i}),(t=o("0cfB").enterModule)&&t(e),a=o("0cfB").default,r=o("0cfB").leaveModule,a&&(a.register(n,"recursiveFlat","E:\\Libraries\\Documents\\PhpstormProjects\\app-003\\src\\homepage\\lib\\utils\\arrayMaths.js"),a.register(i,"findMaxInArray","E:\\Libraries\\Documents\\PhpstormProjects\\app-003\\src\\homepage\\lib\\utils\\arrayMaths.js"),r(e))}).call(this,o("3UD+")(e))},uggL:function(e,t,a){},urBT:function(module,__webpack_exports__,__webpack_require__){"use strict";(function(module){__webpack_require__.d(__webpack_exports__,"a",function(){return ChartTooltip});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("q1tI"),react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__),Lc;function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Lc=__webpack_require__("0cfB").enterModule,Lc&&Lc(module);var ChartTooltip=function(_React$PureComponent){function ChartTooltip(){return _classCallCheck(this,ChartTooltip),_possibleConstructorReturn(this,_getPrototypeOf(ChartTooltip).apply(this,arguments))}return _inherits(ChartTooltip,_React$PureComponent),_createClass(ChartTooltip,[{key:"render",value:function(){var e=this.props,t=e.show,a=e.text,r=e.pos,n=e.color;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"chart-tooltip ".concat(t?"":"hidden"),style:{top:"".concat(r.top,"px"),left:"".concat(r.left,"px"),backgroundColor:"".concat(n),transform:"translate(".concat(r.translateX||0,"px, ").concat(r.translateY||0,"px)")}},a)}},{key:"__reactstandin__regenerateByEval",value:function __reactstandin__regenerateByEval(key,code){this[key]=eval(code)}}]),ChartTooltip}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent),rd,sd;rd=__webpack_require__("0cfB").default,sd=__webpack_require__("0cfB").leaveModule,rd&&(rd.register(ChartTooltip,"ChartTooltip","E:\\Libraries\\Documents\\PhpstormProjects\\app-003\\src\\homepage\\components\\chart\\ChartTooltip.js"),sd(module))}).call(this,__webpack_require__("3UD+")(module))}}]);