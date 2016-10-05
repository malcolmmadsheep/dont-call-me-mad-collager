'use strict';

import 'styles/main.scss';
import prerender from './DOMPrerendering';
import DOMElement from './DOMElement';
import * as appUtils from './utils';

(function(window) {
  const CANVAS = document.getElementById('field');
  const CTX = CANVAS.getContext('2d');
  const objects = [];
  const configs = {
    canvasMousePosition: {
      x: 0,
      y: 0
    }
  };
  // const statusBoxElements = {
  //   xValueCoordinate: document.getElementById('mouse-x'),
  //   yValueCoordinate: document.getElementById('mouse-y')
  // }
  const customEvents = {
    onMouseCoordinatesChange: new CustomEvent('onMouseCoordinatesChange', {
      detail: configs.canvasMousePosition
    })
  };
  const DOMElements = {
    toolsBox: new DOMElement(document.getElementById('tools-box')),
    workspace: new DOMElement(document.getElementById('workspace')),
    statusBar: new DOMElement(document.getElementById('status-bar'))
  }

  window.onload = function() {
    const toolBoxElements = prerender();
    const {
      brushesBox,
      previewBox
    } = toolBoxElements;
    const DOMToolsBox = DOMElements.toolsBox;
    const DOMWorkspace = DOMElements.toolsBox;
    const DOMStatusBar = DOMElements.statusBar;

    DOMToolsBox.addChild('previewBox', previewBox);

    console.log(DOMToolsBox.getChild('previewBox'));

    const { previewBrush } = previewBox;
    const brushes = appUtils.toArray(brushesBox.children);
    setBrushesEventHandlers(brushes, previewBrush);
    setCanvasListeners(CANVAS);

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
  }

  function setBrushesEventHandlers(brushes, previewBrush) {
    brushes.forEach(brush => {
      brush.addEventListener('click', (event) => {
        const currentBrush = event.target;
        const currentBrushSource = currentBrush.src;

        brushes.forEach(brush => brush.classList.remove('selected'));
        currentBrush.classList.add('selected');

        previewBrush.src = currentBrushSource;
      }, false);
    });

    return brushes;
  }

  function setCanvasListeners(canvas) {
    canvas.addEventListener('mousemove', onCanvasMouseCoordinatesUpdateHandler, false);
    canvas.addEventListener('mouseleave', onCanvasMouseLeaveHandler, false);
  }

  function onCanvasMouseCoordinatesUpdateHandler(event) {
    const mousePos = configs.canvasMousePosition;

    // statusBoxElements.xValueCoordinate.textContent = X;
    // statusBoxElements.yValueCoordinate.textContent = Y;

    // console.log(`X: ${X}; Y: ${Y}`);
    // console.log(`bX: ${boundingRect.x}; bY: ${boundingRect.y};`);

  }

  function updateMouseCoordinates(mousePos, event) {
    const canvas = event.target;
    const boundingRect = canvas.getBoundingClientRect();
    const boundX = boundingRect.x;
    const boundY = boundingRect.y;
    const X = event.clientX - Math.round(boundX);
    const Y = event.clientY - Math.round(boundY);

    mousePos.x = X;
    mousePos.y = Y;


  }

  function onCanvasMouseLeaveHandler(event) {
    statusBoxElements.xValueCoordinate.textContent = 0;
    statusBoxElements.yValueCoordinate.textContent = 0;
  }

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
  //     brush. (brushImg);
  //     brushes.appendChild(brush);
  //   }
  // }
})(window);