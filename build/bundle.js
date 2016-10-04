/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/collager/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _DOMPrerendering = __webpack_require__(5);

	var _DOMPrerendering2 = _interopRequireDefault(_DOMPrerendering);

	var _utils = __webpack_require__(6);

	var appUtils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function (window) {
	  var CANVAS = document.getElementById('field');
	  var CTX = CANVAS.getContext('2d');
	  var objects = [];

	  window.onload = function () {
	    var toolBoxElements = (0, _DOMPrerendering2.default)();

	    var brushesBox = toolBoxElements.brushesBox;
	    var previewBox = toolBoxElements.previewBox;
	    var previewBrush = previewBox.previewBrush;

	    var brushes = appUtils.toArray(brushesBox.children);
	    setBrushesEventHandlers(brushes, previewBrush);

	    // var imgSrc = '';
	    // var isDefault = true;
	    // var brushes = document.getElementById('brushes');
	    // var randBtn = document.getElementById('rand');
	    // var mouseIsDown = false;
	    // var dontStop = false;
	    // canvasCreation();
	    // brushesSetUp(brushes);
	    // canvas = document.getElementById('myCanvas');
	    // ctx = canvas.getContext('2d');
	    // var CHBshouldIStop = document.getElementById('shouldIStop');
	    // var sizeRange = document.getElementById('size');
	    // var sizeExamp = document.getElementById('examplePic');
	    // var exampHeight = sizeExamp.height;
	    // sizeExamp.height = window.innerHeight * sizeRange.value / 100;

	    // canvas.addEventListener('click', function(evt) {
	    //   var size = sizeRange.value / 100;
	    //   var pos = getMousePos(canvas, evt);
	    //   if (isDefault) {
	    //     var n = (Math.random().toFixed(1) * 10) % 10 + 1;
	    //     imgSrc = 'img/' + String(n) + '.png';
	    //   }
	    //   createObject(pos, imgSrc, size);
	    // }, false);

	    // canvas.addEventListener('mousemove', function(evt) {
	    //   if (mouseIsDown && dontStop) {
	    //     var size = sizeRange.value / 100;
	    //     var pos = getMousePos(canvas, evt);
	    //     if (isDefault) {
	    //       var n = (Math.random().toFixed(1) * 10) % 10 + 1;
	    //       imgSrc = 'img/' + String(n) + '.png';
	    //     }
	    //     createObject(pos, imgSrc, size);
	    //   }
	    //   evt.target.style.cursor = 'initial';
	    // }, false);

	    // canvas.addEventListener('mousedown', function() {
	    //   mouseIsDown = true;
	    // }, false);

	    // canvas.addEventListener('mouseup', function() {
	    //   mouseIsDown = false;
	    // }, false);

	    // randBtn.addEventListener('click', function() {
	    //   isDefault = true;
	    //   lastTarget = null;
	    //   $('.brush').removeClass('selected');
	    // }, false);

	    // var cleCan = document.getElementById('clearCanvas');
	    // cleCan.addEventListener('click', function() {
	    //   clearCanvas(ctx, canvas);
	    // }, false);

	    // var lastTarget = null;
	    // $('#brushes').on('click', function(e) {
	    //   var target;
	    //   if ($(e.target).is('div')) {
	    //     target = $(e.target);
	    //   } else {
	    //     target = $(e.target).parent('div');
	    //   }

	    //   var lastSrc = lastTarget ? lastTarget.children('img').attr('src') : '';
	    //   var currSrc = target.children('img').attr('src');

	    //   if (!lastTarget) {
	    //     lastTarget = target;
	    //     target.addClass('selected');
	    //     target.css('border-right', '3px solid red');
	    //   } else if (lastSrc !== currSrc) {
	    //     lastTarget.removeClass('selected');
	    //     lastTarget.css('border-right', '1px solid navy');
	    //     lastTarget = target;
	    //     target.addClass('selected');
	    //     target.css('border-right', '3px solid red');
	    //   }

	    //   imgSrc = target.children('img').attr('src');
	    //   $('#examplePic').attr('src', imgSrc);
	    //   isDefault = false;
	    // });

	    // $('#size').on('mousemove change', function() {
	    //   sizeExamp.height = window.innerHeight * $(this).val() / 100;
	    //   $('#tools').height(window.innerHeight);
	    // });

	    // CHBshouldIStop.addEventListener('click', function(e) {
	    //   if (e.target.checked) {
	    //     dontStop = true;
	    //   } else {
	    //     dontStop = false;
	    //   }
	    // }, false);
	  };

	  function setBrushesEventHandlers(brushes, previewBrush) {
	    brushes.forEach(function (brush) {
	      brush.addEventListener('click', function (event) {
	        var currentBrush = event.target;
	        var currentBrushSource = currentBrush.src;

	        brushes.forEach(function (brush) {
	          return brush.classList.remove('selected');
	        });
	        currentBrush.classList.add('selected');

	        previewBrush.src = currentBrushSource;
	      }, false);
	    });

	    return brushes;
	  }

	  // window.onresize = function() {
	  //   canvasResizing(canvas);
	  // }

	  // function canvasCreation() {
	  //   $canvas = document.createElement('canvas');
	  //   $canvas.width = window.innerWidth - window.innerWidth / 20 * 3;
	  //   $canvas.height = window.innerHeight;
	  //   $canvas.id = 'myCanvas';
	  //   document.body.appendChild($canvas);
	  // }

	  // function canvasResizing(can) {
	  //   can.width = window.innerWidth;
	  //   can.height = window.innerHeight;
	  // }

	  // function getMousePos(c, evt) {
	  //   var rect = c.getBoundingClientRect();
	  //   return {
	  //     x: evt.clientX - rect.left,
	  //     y: evt.clientY - rect.top
	  //   };
	  // }

	  // function createObject(pos, imgSrc, size) {
	  //   var length = objects.length;
	  //   objects[length] = {};
	  //   objects[length].image = new Image();
	  //   objects[length].options = {};
	  //   objects[length].options.height = Math.round(window.innerHeight * size);
	  //   objects[length].options.width = Math.round(objects[length].options.height * 0.7);
	  //   objects[length].image.src = imgSrc;

	  //   objects[length].image.onload = function() {
	  //     ctx.drawImage(objects[length].image,
	  //       pos.x - objects[length].options.width / 2,
	  //       pos.y - objects[length].options.height / 2,
	  //       objects[length].options.width,
	  //       objects[length].options.height);
	  //   }
	  // }

	  // function clearCanvas(ctx, canv) {
	  //   // ctx.clearRect(0, 0, canv.width, canv.height);
	  //   canv.width = canv.width;
	  // }

	  // function brushesSetUp(brushes) {
	  //   for (var i = 1; i < 11; i++) {
	  //     var brush = document.createElement('div');
	  //     brush.className = 'brush';
	  //     if (i % 2 === 0) {
	  //       brush.style.borderRight = '1px solid navy';
	  //     }
	  //     var brushImg = document.createElement('img');
	  //     brushImg.src = 'img/' + i + '.png';
	  //     brush.appendChild(brushImg);
	  //     brushes.appendChild(brush);
	  //   }
	  // }
	})(window);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0; }\n\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  font-size: 100%;\n  font-family: Arial; }\n\n.work-block {\n  height: 95%; }\n\n#tools-box {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 15%;\n  text-align: center;\n  background-color: #72b7ff; }\n  #tools-box #brush-preview-box h3 {\n    margin: 10px 0 5px 0; }\n  #tools-box #brush-preview-box #preview-brush {\n    width: 50%; }\n  #tools-box #brush-preview-box input[type=\"range\"] {\n    width: 80%; }\n    #tools-box #brush-preview-box input[type=\"range\"]::-moz-focus-outer {\n      border: 0; }\n  #tools-box #brushes {\n    display: flex;\n    flex-wrap: wrap;\n    flex-direction: row;\n    width: 80%;\n    height: 35%;\n    overflow-y: auto;\n    margin: 10px 10% 0 10%; }\n    #tools-box #brushes .brush-item {\n      width: 50%; }\n      #tools-box #brushes .brush-item.selected {\n        border: 1px solid #160480; }\n\n#workspace {\n  position: absolute;\n  top: 0;\n  left: 15%;\n  width: 85%;\n  background-color: #8c8c8c;\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n  #workspace #field {\n    width: 90%;\n    height: 90%;\n    background-color: #fff; }\n\n#status-bar {\n  position: fixed;\n  left: 0;\n  bottom: 0;\n  height: 5%;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  background-color: #deaaff; }\n  #status-bar .properties {\n    width: 95%;\n    margin-left: 2.5%; }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;
	var picturesDirectory = './public/images';
	var picturesSources = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png'].map(function (filename) {
	  return picturesDirectory + '/' + filename;
	});

	function render() {
	  var previewBox = renderPreviewBox(picturesSources);
	  var previewBrush = previewBox.previewBrush;

	  var brushesBox = renderBrushplate(picturesSources, previewBrush.src);

	  return {
	    previewBox: previewBox,
	    brushesBox: brushesBox
	  };
	}

	function createElement(tagName, options) {
	  var element = document.createElement(tagName);

	  for (var option in options) {
	    if (options.hasOwnProperty(option)) {
	      element[option] = options[option];
	    }
	  }

	  return element;
	}

	function appendChildren(children, to) {
	  children.forEach(function (child) {
	    return to.append(child);
	  });
	}

	function renderPreviewBox(sources) {
	  var previewBrush = setPreviewBrush(document.getElementById('preview-brush'), sources);

	  return {
	    previewBrush: previewBrush
	  };
	}

	function setPreviewBrush(previewBrush, sources) {
	  var src = sources[0];

	  previewBrush.src = src;

	  return previewBrush;
	}

	function renderBrushplate(sources, selectedItemSource) {
	  var brushes = sources.map(function (source) {
	    return createElement('img', {
	      src: source,
	      className: 'brush-item'
	    });
	  });
	  brushes[0].classList.add('selected');
	  var brushesContainer = document.getElementById('brushes');

	  appendChildren(brushes, brushesContainer);

	  return brushesContainer;
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toArray = toArray;
	function toArray(list) {
	  var array = [];

	  for (var i = 0, listLength = list.length; i < listLength; i += 1) {
	    array.push(list[i]);
	  }

	  return array;
	}

/***/ }
/******/ ]);