'use strict';

import 'styles/main.scss';
import prerender from './DOMPrerendering';
import DOMElement from './DOMElement';
import * as appUtils from './utils';

(function(window) {
  const CANVAS_DRAWING_BUFFER_WIDTH = 1680;
  const CANVAS_DRAWING_BUFFER_HEIGHT = 1050;
  const getElementById = document.getElementById.bind(document);
  const CANVAS = new DOMElement(getElementById('field'));
  setupCanvasSettings(CANVAS.self);
  const CTX = CANVAS.self.getContext('2d');
  const objects = [];
  const configs = {
    mouse: {
      isDown: false,
      pos: {
        x: 0,
        y: 0
      }
    }
  };
  const customEvents = {
    onMouseCoordinatesChange: new CustomEvent('onMousePosChange', {
      detail: configs.mouse.pos
    })
  };

  const BODY = new DOMElement(document.body);
  const DOMToolsBox = new DOMElement(getElementById('tools-box'));
  const DOMWorkspace = new DOMElement(getElementById('workspace'));
  const DOMStatusBar = new DOMElement(getElementById('status-bar'));

  const mousePosBox = new DOMElement(getElementById('mouse-position-box'));
  mousePosBox.addChild('mouse-x', new DOMElement(getElementById('mouse-x')))
    .addChild('mouse-y', new DOMElement(getElementById('mouse-y')));
  DOMStatusBar.addChild('mousePosBox', mousePosBox);

  window.onload = function() {
    const brushPreviewBox = new DOMElement(getElementById('brush-preview-box'));
    const brushPreviewChildren = prerender();
    const previewBrushScaleRange = new DOMElement(getElementById('preview-brush-scale'));
    const canvasSettings = new DOMElement(getElementById('canvas-settings'));

    brushPreviewBox.addChildren(brushPreviewChildren)
      .addChild('previewBrushScaleRange', previewBrushScaleRange);

    BODY.addChild('DOMToolsBox', DOMToolsBox)
      .addChild('DOMWorkspace', DOMWorkspace)
      .addChild('DOMStatusBar', DOMStatusBar);

    DOMToolsBox.addChild(brushPreviewChildren);

    DOMWorkspace.addChild('canvas', CANVAS);

    const brushPreview = DOMToolsBox.getChild('brushPreview');
    const brushes = DOMToolsBox.getChild('brushesBox').childrenToArray();
    setBrushesEventHandlers(brushes, brushPreview);
    setCanvasListeners(DOMWorkspace.getChild('canvas'));

    mousePosBox.addListeners([{
      name: 'onMousePosChange',
      callback(customEvent) {
        const { detail } = customEvent;

        mousePosBox.getChild('mouse-x').setProp('textContent', detail.x);
        mousePosBox.getChild('mouse-y').setProp('textContent', detail.y);
      }
    }]);

    CANVAS.register('clear', clearCanvas);
    CTX.fillStyle = "rgb(200,0,0)"; // sets the color to fill in the rectangle with
    CTX.fillRect(10, 10, 55, 50);
    // CANVAS.run('clear', {ctx: CTX});

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

  function clearCanvas(options) {
    const ctx = options.ctx;
    // this.setProp('width', this.getProp('width'));
    ctx.clearRect(0, 0, this.getProp('width'), this.getProp('height'));
  }

  function setBrushesEventHandlers(brushes, brushPreview) {
    brushes.forEach(brush => {
      brush.addListeners([{
        name: 'click',
        callback: setBrushListener(brushes, brushPreview)
      }]);
    });

    return brushes;
  }

  function setBrushListener(brushes, brushPreview) {
    return (event) => {
      const currentBrush = event.target;
      const currentBrushSource = currentBrush.src;

      brushes.forEach(brush => brush.removeClass('selected'));
      currentBrush.classList.add('selected');

      brushPreview.setAttr('src', currentBrushSource);
    }
  }

  function setCanvasListeners(canvas) {
    canvas.addListeners([
      { name: 'mousemove', callback: onCanvasMouseCoordinatesUpdateHandler },
      { name: 'mouseleave', callback: onCanvasMouseLeaveHandler }
    ]);
  }

  function onCanvasMouseCoordinatesUpdateHandler(event) {
    updateMouseCoordinates(configs.mouse.pos, event);
  }

  function onCanvasMouseLeaveHandler(event) {
    updateMouseCoordinates(configs.mouse.pos, event, { x: 0, y: 0 });
  }

  function updateMouseCoordinates(mousePos, event, value) {
    let X, Y;

    if (!value) {
      const canvas = event.target;
      const boundingRect = canvas.getBoundingClientRect();
      const boundX = boundingRect.left;
      const boundY = boundingRect.top;
      X = event.clientX - Math.round(boundX);
      Y = event.clientY - Math.round(boundY);
    } else {
      X = value.x;
      Y = value.y;
    }

    mousePos.x = X;
    mousePos.y = Y;

    mousePosBox.fireEvent(customEvents.onMouseCoordinatesChange);
  }

  function setupCanvasSettings(canvas) {
    canvas.width = CANVAS_DRAWING_BUFFER_WIDTH;
    canvas.height = CANVAS_DRAWING_BUFFER_HEIGHT;
  }
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
})(window);