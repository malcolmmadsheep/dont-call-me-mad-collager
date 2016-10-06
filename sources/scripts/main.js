'use strict';

import 'styles/main.scss';
import prerender from './DOMPrerendering';
import DOMElement from './DOMElement';
import * as utils from './utils';

(function(window) {
  const getElementById = document.getElementById.bind(document);
  const DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH = 1680;
  const DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT = 1050;
  const CANVAS = new DOMElement(getElementById('field'));
  const BODY = new DOMElement(document.body);
  const DEFAULT_CANVAS_CLIENT_WIDTH = CANVAS.getProp('clientWidth');
  const DEFAULT_CANVAS_CLIENT_HEIGHT = CANVAS.getProp('clientHeight');
  let CANVAS_DRAWING_BUFFER_WIDTH = DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH;
  let CANVAS_DRAWING_BUFFER_HEIGHT = DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT;
  let CANVAS_CLIENT_WIDTH = DEFAULT_CANVAS_CLIENT_WIDTH;
  let CANVAS_CLIENT_HEIGHT = DEFAULT_CANVAS_CLIENT_HEIGHT;
  let CANVAS_WIDTH_RATIO = CANVAS_DRAWING_BUFFER_WIDTH / CANVAS_CLIENT_WIDTH;
  let CANVAS_HEIGHT_RATIO = CANVAS_DRAWING_BUFFER_HEIGHT / CANVAS_CLIENT_HEIGHT;

  const DOMToolsBox = new DOMElement(getElementById('tools-box'));
  const DOMWorkspace = new DOMElement(getElementById('workspace'));
  const DOMStatusBar = new DOMElement(getElementById('status-bar'));
  const CTX = CANVAS.self.getContext('2d');
  const objects = [];
  const configs = {
    preview: {},
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
  let mousePosBox;

  window.onload = function() {
    setToolsBoxItems(DOMToolsBox);
    setWorkspaceItems(DOMWorkspace);
    setStatusBarItems(DOMStatusBar);

    BODY.addChildren({
      DOMToolsBox,
      DOMWorkspace,
      DOMStatusBar
    });

    CANVAS.register('clear', clearCanvas);
    CTX.fillStyle = "rgb(200,0,0)"; // sets the color to fill in the rectangle with
    CTX.fillRect(10, 10, 55, 50);
    // CANVAS.run('clear', {ctx: CTX});

    // var imgSrc = '';
    // var isDefault = true;
    // var randBtn = document.getElementById('rand');
    // var mouseIsDown = false;
    // var dontStop = false;
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

  function setToolsBoxItems(toolsBox) {
    const canvasSettingsBox = new DOMElement(getElementById('canvas-settings-box'));
    const brushPreviewChildren = prerender();
    const brushSettingsBox = new DOMElement(getElementById('brush-settings-box'), brushPreviewChildren);
    const previewBrushScaleRange = new DOMElement(getElementById('preview-brush-scale'));
    const canvasWidthField = new DOMElement(getElementById('canvas-width'));
    const canvasHeightField = new DOMElement(getElementById('canvas-height'));

    canvasWidthField.addListeners([{
      name: 'blur',
      callback(event) {
        updateCanvasResolution(event, 'w', CANVAS_DRAWING_BUFFER_WIDTH);
      }
    }]);
    canvasHeightField.addListeners([{
      name: 'blur',
      callback(event) {
        updateCanvasResolution(event, 'h', CANVAS_DRAWING_BUFFER_HEIGHT);
      }
    }]);

    brushSettingsBox.addChild('previewBrushScaleRange', previewBrushScaleRange);
    canvasSettingsBox.addChildren({
      canvasWidthField,
      canvasHeightField
    });

    const brushPreview = brushSettingsBox.getChild('brushPreview');
    const brushes = brushSettingsBox.getChild('brushesBox').childrenToArray();
    setBrushesEventHandlers(brushes, brushPreview);

    toolsBox.addChildren({
      brushSettingsBox,
      canvasSettingsBox
    });

    return toolsBox;
  }

  function updateCanvasResolution(event, type, previousValue) {
    const target = event.target;
    const value = checkNum(target.value);

    if (value && value > 0) {
      if (type === 'w') {
        CANVAS_DRAWING_BUFFER_WIDTH = value;
        CANVAS.setProp('width', value);
        const newCanvasClientWidth = (value > DEFAULT_CANVAS_CLIENT_WIDTH) ? DEFAULT_CANVAS_CLIENT_WIDTH : value;
        CANVAS_CLIENT_WIDTH = newCanvasClientWidth;
        CANVAS_WIDTH_RATIO = value / CANVAS_CLIENT_WIDTH;
        CANVAS.setStyle('width', utils.toPx(newCanvasClientWidth));
      } else if (type === 'h') {
        CANVAS_DRAWING_BUFFER_HEIGHT = value;
        CANVAS.setProp('height', value);
        const newCanvasClientHeight = (value > DEFAULT_CANVAS_CLIENT_HEIGHT) ? DEFAULT_CANVAS_CLIENT_HEIGHT : value;
        CANVAS_CLIENT_HEIGHT = newCanvasClientHeight;
        CANVAS_HEIGHT_RATIO = value / CANVAS_CLIENT_HEIGHT;
        CANVAS.setStyle('height', utils.toPx(newCanvasClientHeight));
      }
    } else {
      target.value = previousValue;
    }
  }

  function checkNum(numStr) {
    const checkedNum = numStr.trim().split('')
      .filter(figure => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(figure))
      .join('');

    return (checkedNum.length === numStr.length) ? parseInt(checkedNum) : null;
  }

  function setWorkspaceItems(workspace) {
    workspace.addChild('canvas', CANVAS);
    mousePosBox = new DOMElement(getElementById('mouse-position-box'));

    mousePosBox.addChildren({
      'mouse-x': new DOMElement(getElementById('mouse-x')),
      'mouse-y': new DOMElement(getElementById('mouse-y'))
    });

    mousePosBox.addListeners([{
      name: 'onMousePosChange',
      callback(customEvent) {
        const { detail } = customEvent;

        this.getChild('mouse-x').setProp('textContent', detail.x);
        this.getChild('mouse-y').setProp('textContent', detail.y);
      }
    }]);

    CANVAS.addListeners([
      { name: 'mousemove', callback: onCanvasMouseCoordinatesUpdateHandler },
      { name: 'mouseleave', callback: onCanvasMouseLeaveHandler }
    ]);
    setupCanvasSettings(CANVAS);

    return workspace;
  }

  function setStatusBarItems(statusBar) {
    statusBar.addChild('mousePosBox', mousePosBox);

    return statusBar;
  }

  function clearCanvas(options) {
    const ctx = options.ctx;

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

    mousePos.x = Math.round(X * CANVAS_WIDTH_RATIO);
    mousePos.y = Math.round(Y * CANVAS_HEIGHT_RATIO);

    mousePosBox.fireEvent(customEvents.onMouseCoordinatesChange);
  }

  function setupCanvasSettings(canvas) {
    canvas.setProp('width', CANVAS_DRAWING_BUFFER_WIDTH)
      .setProp('height', CANVAS_DRAWING_BUFFER_HEIGHT);

    DOMToolsBox.getChild('canvasWidthField').setAttr('value', CANVAS_DRAWING_BUFFER_WIDTH);
    DOMToolsBox.getChild('canvasHeightField').setAttr('value', CANVAS_DRAWING_BUFFER_HEIGHT);
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