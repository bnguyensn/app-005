(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"7Dga":function(module,__webpack_exports__,__webpack_require__){"use strict";(function(module){__webpack_require__.d(__webpack_exports__,"a",function(){return App});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("q1tI"),react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__),react_loadable__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("CnBM"),react_loadable__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_1__),_components_Loading__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("TLZj"),_components_Intro__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("J6oj"),_lib_utils_dataMutation__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("GVv6"),_app_css__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("BgPi"),_app_css__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_app_css__WEBPACK_IMPORTED_MODULE_5__),_json_sample_01__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("eRK0"),_json_sample_01__WEBPACK_IMPORTED_MODULE_6___namespace=__webpack_require__.t("eRK0",1),_json_sample_colors_01__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("HetZ"),_json_sample_colors_01__WEBPACK_IMPORTED_MODULE_7___namespace=__webpack_require__.t("HetZ",1),a;function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),n.forEach(function(e){_defineProperty(t,e,a[e])})}return t}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,a=new Array(e.length);t<e.length;t++)a[t]=e[t];return a}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}a=__webpack_require__("0cfB").enterModule,a&&a(module);var chartMargin={top:50,right:50,bottom:50,left:50},chartSize={width:640-chartMargin.left-chartMargin.right,height:640-chartMargin.top-chartMargin.bottom,marginTop:50,marginRight:50,marginBottom:50,marginLeft:50},LoadableControlPanel=react_loadable__WEBPACK_IMPORTED_MODULE_1___default()({loader:function(){return Promise.all([__webpack_require__.e(0),__webpack_require__.e(2)]).then(__webpack_require__.bind(null,"yGOb"))},loading:_components_Loading__WEBPACK_IMPORTED_MODULE_2__.a}),LoadableChart=react_loadable__WEBPACK_IMPORTED_MODULE_1___default()({loader:function(){return Promise.all([__webpack_require__.e(0),__webpack_require__.e(3)]).then(__webpack_require__.bind(null,"CRdM"))},loading:_components_Loading__WEBPACK_IMPORTED_MODULE_2__.a}),App=function(_React$PureComponent){function App(e){var i;return _classCallCheck(this,App),_defineProperty(_assertThisInitialized(_assertThisInitialized(i=_possibleConstructorReturn(this,_getPrototypeOf(App).call(this,e)))),"setNewData",function(t,a){i.setState(function(e){return{chartKey:!e.chartKey,data:_toConsumableArray(t),mutatedData:_toConsumableArray(t),colorData:_objectSpread({},a),filterRange:{min:0,max:1}}})}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"filterData",function(e,t){var a=i.state,n=a.data,r=a.mutatedData,o=Object(_lib_utils_dataMutation__WEBPACK_IMPORTED_MODULE_4__.a)(n,r,e,t);o&&i.setState({mutatedData:_toConsumableArray(o),filterRange:{min:e,max:t}})}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"sortData",function(e){var t=i.state,a=t.data,n=t.mutatedData,r=t.filterRange,o=Object(_lib_utils_dataMutation__WEBPACK_IMPORTED_MODULE_4__.b)(a,e);if(o){var _=Object(_lib_utils_dataMutation__WEBPACK_IMPORTED_MODULE_4__.a)(o,n,r.min,r.max,!0);i.setState(function(e){return{data:_toConsumableArray(o),mutatedData:_||e.mutatedData}})}}),i.state={chartKey:!1,data:_toConsumableArray(_json_sample_01__WEBPACK_IMPORTED_MODULE_6__),mutatedData:_toConsumableArray(_json_sample_01__WEBPACK_IMPORTED_MODULE_6__),colorData:_json_sample_colors_01__WEBPACK_IMPORTED_MODULE_7__,filterRange:{min:0,max:1}},i}return _inherits(App,_React$PureComponent),_createClass(App,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.state,t=e.chartKey,a=e.mutatedData,n=e.colorData;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:"app"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Intro__WEBPACK_IMPORTED_MODULE_3__.a,null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(LoadableControlPanel,{key:"CP-".concat(t.toString()),setNewData:this.setNewData,filterData:this.filterData,sortData:this.sortData}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(LoadableChart,{key:"Ch-".concat(t.toString()),chartSize:chartSize,data:a,colorData:n}))}},{key:"__reactstandin__regenerateByEval",value:function __reactstandin__regenerateByEval(key,code){this[key]=eval(code)}}]),App}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent),pa,qa;pa=__webpack_require__("0cfB").default,qa=__webpack_require__("0cfB").leaveModule,pa&&(pa.register(chartMargin,"chartMargin","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/App.js"),pa.register(chartSize,"chartSize","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/App.js"),pa.register(LoadableControlPanel,"LoadableControlPanel","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/App.js"),pa.register(LoadableChart,"LoadableChart","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/App.js"),pa.register(App,"App","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/App.js"),qa(module))}).call(this,__webpack_require__("3UD+")(module))},BgPi:function(e,t,a){},GVv6:function(e,s,l){"use strict";(function(e){l.d(s,"a",function(){return r}),l.d(s,"b",function(){return i});var t,a,n,o=l("rLeL");function _(e){return function(e){if(Array.isArray(e)){for(var t=0,a=new Array(e.length);t<e.length;t++)a[t]=e[t];return a}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function r(e,t,a,n){var r=4<arguments.length&&void 0!==arguments[4]&&arguments[4],o=e.length,_=e.filter(function(e,t){return t+1>=Math.ceil(a*o)&&t+1<=Math.ceil(n*o)});return t.length!==_.length||r?_:null}function i(e,r){var t=e[0];if(Object(o.a)(t,r)){var a=_(e);return"string"==typeof t[r]?a.sort(function(e,t){var a=e[r].toUpperCase(),n=t[r].toUpperCase();return a<n?-1:n<a?1:0}):"number"!=typeof t[r]||Number.isNaN(t[r])?null:a.sort(function(e,t){return e[r]-t[r]})}return null}(t=l("0cfB").enterModule)&&t(e),a=l("0cfB").default,n=l("0cfB").leaveModule,a&&(a.register(r,"filterData","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/lib/utils/dataMutation.js"),a.register(i,"sortData","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/lib/utils/dataMutation.js"),n(e))}).call(this,l("3UD+")(e))},HetZ:function(e){e.exports={"Avg. annual investment distributions":"#4c6f71",Cash:"#59637d",Debtors:"#798193","Uncalled investors' capital":"#9ca0ab"}},J6oj:function(e,_,i){"use strict";(function(e){i.d(_,"a",function(){return o});var t,a,n,r=i("q1tI");i("guWW");function o(){return r.createElement("div",{id:"intro"},r.createElement("div",{className:"title"},"INVESTMENT FUND OVERCOMMITMENT CHARTING TOOL"),r.createElement("div",{className:"subtitle"},"by Binh Nguyen"),r.createElement("div",{className:"description"},"A common assessment of an investment fund's going concern involves looking at its remaining investment commitments and check whether they can be fulfilled using the fund's current assets."),r.createElement("div",{className:"description"},"With adequate data, this tool can graph the overcommitment situation of investment funds and help speed up going concern decisions."))}(t=i("0cfB").enterModule)&&t(e),a=i("0cfB").default,n=i("0cfB").leaveModule,a&&(a.register(o,"Intro","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/components/Intro.js"),n(e))}).call(this,i("3UD+")(e))},TLZj:function(e,i,s){"use strict";(function(e){s.d(i,"a",function(){return _});var t,a,n,r=s("q1tI"),o=s.n(r);s("sy5C");function _(){return o.a.createElement("div",{className:"loading"},o.a.createElement("div",{className:"loader"}))}(t=s("0cfB").enterModule)&&t(e),a=s("0cfB").default,n=s("0cfB").leaveModule,a&&(a.register(_,"Loading","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/components/Loading.js"),n(e))}).call(this,s("3UD+")(e))},eRK0:function(e){e.exports=[{id:0,name:"Fund 1",dispName:"Fund 1",iCom:5e3,iCal:2500,fCom:1e4,fCal:2500,assets:[{name:"Cash",lvl:1,amt:3e3},{name:"Uncalled investors' capital",lvl:2,amt:2500},{name:"Debtors",lvl:2,amt:1500},{name:"Avg. annual investment distributions",lvl:3,amt:1500}],totalAssets:8500,remFCom:7500,goingConcern:.8823529411764706},{id:1,name:"Fund 2",dispName:"Fund 2",iCom:1e4,iCal:4e3,fCom:5e3,fCal:2500,assets:[{name:"Cash",lvl:1,amt:4500},{name:"Uncalled investors' capital",lvl:2,amt:1e3},{name:"Debtors",lvl:2,amt:3e3},{name:"Avg. annual investment distributions",lvl:3,amt:2e3}],totalAssets:10500,remFCom:2500,goingConcern:.23809523809523808},{id:2,name:"Fund 3",dispName:"Fund 3",iCom:7500,iCal:3500,fCom:6e3,fCal:1500,assets:[{name:"Cash",lvl:1,amt:2500},{name:"Uncalled investors' capital",lvl:2,amt:2500},{name:"Debtors",lvl:2,amt:2500},{name:"Avg. annual investment distributions",lvl:3,amt:2500}],totalAssets:1e4,remFCom:4500,goingConcern:.45},{id:3,name:"Fund A",dispName:"Fund A",iCom:6e3,iCal:2e3,fCom:7500,fCal:6500,assets:[{name:"Cash",lvl:1,amt:3e3},{name:"Uncalled investors' capital",lvl:2,amt:3e3},{name:"Debtors",lvl:2,amt:2500},{name:"Avg. annual investment distributions",lvl:3,amt:1e3}],totalAssets:9500,remFCom:1e3,goingConcern:.10526315789473684},{id:4,name:"Fund B",dispName:"Fund B",iCom:4e3,iCal:4e3,fCom:1e4,fCal:9e3,assets:[{name:"Cash",lvl:1,amt:1500},{name:"Uncalled investors' capital",lvl:2,amt:3500},{name:"Debtors",lvl:2,amt:500},{name:"Avg. annual investment distributions",lvl:3,amt:500}],totalAssets:6e3,remFCom:1e3,goingConcern:.16666666666666666},{id:5,name:"Long name",dispName:"Long ..",iCom:5e3,iCal:4e3,fCom:12e3,fCal:1500,assets:[{name:"Cash",lvl:1,amt:2e3},{name:"Uncalled investors' capital",lvl:2,amt:3500},{name:"Debtors",lvl:2,amt:6e3},{name:"Avg. annual investment distributions",lvl:3,amt:1500}],totalAssets:13e3,remFCom:10500,goingConcern:.8076923076923077},{id:6,name:"Another one",dispName:"Anoth..",iCom:6500,iCal:6e3,fCom:13e3,fCal:3e3,assets:[{name:"Cash",lvl:1,amt:3e3},{name:"Uncalled investors' capital",lvl:2,amt:4e3},{name:"Debtors",lvl:2,amt:7e3},{name:"Avg. annual investment distributions",lvl:3,amt:1500}],totalAssets:15500,remFCom:1e4,goingConcern:.6451612903225806},{id:7,name:"Fund 8",dispName:"Fund 8",iCom:7e3,iCal:6500,fCom:11e3,fCal:3500,assets:[{name:"Cash",lvl:1,amt:4e3},{name:"Uncalled investors' capital",lvl:2,amt:2e3},{name:"Debtors",lvl:2,amt:8e3},{name:"Avg. annual investment distributions",lvl:3,amt:1500}],totalAssets:15500,remFCom:7500,goingConcern:.4838709677419355},{id:8,name:"Fund 9",dispName:"Fund 9",iCom:7500,iCal:5e3,fCom:9e3,fCal:4e3,assets:[{name:"Cash",lvl:1,amt:5e3},{name:"Uncalled investors' capital",lvl:2,amt:1e3},{name:"Debtors",lvl:2,amt:9e3},{name:"Avg. annual investment distributions",lvl:3,amt:500}],totalAssets:15500,remFCom:5e3,goingConcern:.3225806451612903},{id:9,name:"Fund 10",dispName:"Fund 10",iCom:8e3,iCal:5e3,fCom:10500,fCal:5e3,assets:[{name:"Cash",lvl:1,amt:5500},{name:"Uncalled investors' capital",lvl:2,amt:1500},{name:"Debtors",lvl:2,amt:1e4},{name:"Avg. annual investment distributions",lvl:3,amt:500}],totalAssets:17500,remFCom:5500,goingConcern:.3142857142857143}]},guWW:function(e,t,a){},khKc:function(e,t,a){},lbFz:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),r=a.n(n),o=a("i8i4"),_=a.n(o),i=a("7Dga");a("khKc");_.a.render(r.a.createElement(i.a,null),document.getElementById("root"))},rLeL:function(e,o,_){"use strict";(function(e){var t,a,n;function r(e,t){return Object.prototype.hasOwnProperty.call(e,t)}_.d(o,"a",function(){return r}),(t=_("0cfB").enterModule)&&t(e),a=_("0cfB").default,n=_("0cfB").leaveModule,a&&(a.register(r,"objHasKey","/Users/bnguyensn/PhpstormProjects/app-003/src/homepage/lib/utils/objHasKey.js"),n(e))}).call(this,_("3UD+")(e))},sy5C:function(e,t,a){}},[["lbFz",4,0]]]);