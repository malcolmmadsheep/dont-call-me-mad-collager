﻿'use strict';

export function toArray(list) {
  const array = [];

  for (let i = 0, listLength = list.length; i < listLength; i += 1) {
    array.push(list[i]);
  }

  return array;
}

export function toPx(value) {
  return `${value}px`;
}

export function checkNum(numStr) {
  const checkedNum = numStr.trim().split('')
    .filter(figure => '0123456789'.contains(figure))
    .join('');

  return (checkedNum.length === numStr.length) ? parseInt(checkedNum) : null;
}   canvas: {
      filling: {
        previousColor: '#fff',
        currentColor: '#fff'
      },
      width: {
        default: {
          client: DEFAULT_CANVAS_CLIENT_WIDTH,
          drawingBuffer: DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH
        },
        client: DEFAULT_CANVAS_CLIENT_WIDTH,
        drawingBuffer: DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH,
        ratio: DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH / DEFAULT_CANVAS_CLIENT_WIDTH
      },
      height: {
        default: {
          client: DEFAULT_CANVAS_CLIENT_HEIGHT,
          drawingBuffer: DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT
        },
        client: DEFAULT_CANVAS_CLIENT_HEIGHT,
        drawingBuffer: DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT,
        ratio: DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT / DEFAULT_CANVAS_CLIENT_HEIGHT
      },
      backgroundColor: '#fff'
    },
    brush: {
      width: 0,
      height: 0
    },
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

    // CANVAS.register('clear', clearCanvas);
    clearCanvas();
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

  function redraw() {

  }

  function setToolsBoxItems(toolsBox) {
    const canvasSettingsBox = new DOMElement(getElementById('canvas-settings-box'));
    const brushPreviewChildren = prerender();
    const brushSettingsBox = new DOMElement(getElementById('brush-settings-box'), brushPreviewChildren);
    const previewBrushScaleRange = new DOMElement(getElementById('preview-brush-scale'));
    const canvasWidthField = new DOMElement(getElementById('canvas-width'));
    const canvasHeightField = new DOMElement(getElementById('canvas-height'));
    const canvasTBgRadio = new DOMElement(getElementById('transparent-background-color-radio'));
    const canvasColorBgRadio = new DOMElement(getElementById('color-background-color-radio'));
    const canvasBgColorInput = new DOMElement(getElementById('background-color-input'));
    const canvasConfigs = configs.canvas;
    const dbw = canvasConfigs.width.drawingBuffer;
    const dbh = canvasConfigs.height.drawingBuffer;

    canvasWidthField.addListeners([{
      name: 'blur',
      callback(event) {
        updateCanvasResolution(event, 'width', dbw);
      }
    }, {
      name: 'keypress',
      callback(event) {
        updateCanvasResolutionWithKeypress(event, 'width', dbw);
      }
    }]);
    canvasHeightField.addListeners([{
      name: 'blur',
      callback(event) {
        updateCanvasResolution(event, 'height', dbh);
      }
    }, {
      name: 'keypress',
      callback(event) {
        updateCanvasResolutionWithKeypress(event, 'height', dbh);
      }
    }]);
    [canvasColorBgRadio, canvasTBgRadio].forEach(radio => {
      radio.addListeners([{
        name: 'click',
        callback(event) {
          const newBackgroundColor = event.target.value;
          console.log(newBackgroundColor);

          setCanvasBackgroundColor(newBackgroundColor);
        }
      }]);
    });
    canvasBgColorInput.addListeners([{
      name: 'change',
      callback(event) {
        const newBackgroundColor = event.target.value;

        canvasColorBgRadio.setProp('value', newBackgroundColor);
        if (canvasColorBgRadio.getProp('checked')) {
          setCanvasBackgroundColor(newBackgroundColor);
        }
      }
    }]);

    brushSettingsBox.addChild('previewBrushScaleRange', previewBrushScaleRange);
    canvasSettingsBox.addChildren({
      canvasWidthField,
      canvasHeightField,
      canvasColorBgRadio,
      canvasTBgRadio,
      canvasBgColorInput
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

  function updateCanvasResolutionWithKeypress(event, propertyName, previousValue) {
    const { keyCode } = event;

    if (keyCode === 13) {
      updateCanvasResolution(event, propertyName, previousValue);
    }
  }

  function updateCanvasResolution(event, propertyName, previousValue) {
    const target = event.target;
    const value = utils.checkNum(target.value);

    if (value && value > 0) {
      const canvasPropertyConfigs = configs.canvas[propertyName];
      if (canvasPropertyConfigs.drawingBuffer === value) {
        return;
      }
      const defaultConfigs = canvasPropertyConfigs.default;
      const newCanvasClientTypeValue = (value > defaultConfigs.client) ? defaultConfigs.client : value;
      canvasPropertyConfigs.drawingBuffer = value;
      canvasPropertyConfigs.client = newCanvasClientTypeValue;
      canvasPropertyConfigs.ratio = value / newCanvasClientTypeValue;

      const resolutionChangeCustomEvent = new CustomEvent('resolutionChange', {
        detail: {
          propName: propertyName,
          drawingBuffer: canvasPropertyConfigs.drawingBuffer,
          client: canvasPropertyConfigs.client
        }
      });
      CANVAS.fireEvent(resolutionChangeCustomEvent);
    } else {
      target.value = previousValue;
    }
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
      { name: 'resolutionChange', callback: onCanvasResolutionChange }, // custom
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

  function clearCanvas() {
    const canvasConfigs = configs.canvas;
    const { backgroundColor, width, height, filling } = canvasConfigs;

    if (backgroundColor === 'transparent') {
      CANVAS.setStyle('background', 'url("public/images/transparent-bg.gif") repeat');
      CTX.clearRect(0, 0, width.drawingBuffer, height.drawingBuffer);
    } else {
      CANVAS.setStyle('background', '');
      CTX.fillStyle = backgroundColor;
      CTX.fillRect(0, 0, canvasConfigs.width.drawingBuffer, canvasConfigs.height.drawingBuffer);
      CTX.fillStyle = filling.previousColor;
    }
  }

  function setCanvasBackgroundColor(color) {
    configs.canvas.backgroundColor = color;

    clearCanvas();
    redraw();
  }

  function setBrushesEventHandlers(brushes, brushPreview) {
    brushes.forEach(brush => {
      brush.addListeners([{
        name: 'click',
        callback: createBrushHandler(brushes, brushPreview)
      }]);
    });

    return brushes;
  }

  function createBrushHandler(brushes, brushPreview) {
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

  function onCanvasResolutionChange(customEvent) {
    const { propName, drawingBuffer, client } = customEvent.detail;
    const { canvas } = configs;

    const imageData = CTX.getImageData(0, 0, canvas.width.drawingBuffer, canvas.height.drawingBuffer);
    this.setProp(propName, drawingBuffer);
    this.setStyle(propName, utils.toPx(client));
    console.log(canvas);
    clearCanvas();
    CTX.putImageData(imageData, 0, 0);
  }

  function updateMouseCoordinates(mousePos, event, value) {
    let X, Y;
    const canvasConfigs = configs.canvas;

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

    mousePos.x = Math.round(X * canvasConfigs.width.ratio);
    mousePos.y = Math.round(Y * canvasConfigs.height.ratio);

    mousePosBox.fireEvent(customEvents.onMouseCoordinatesChange);
  }

  function setupCanvasSettings(canvas) {
    const canvasConfigs = configs.canvas;
    const dbw = canvasConfigs.width.drawingBuffer;
    const dbh = canvasConfigs.height.drawingBuffer;

    canvas.setProp('width', dbw)
      .setProp('height', dbh);

    DOMToolsBox.getChild('canvasWidthField').setAttr('value', dbw);
    DOMToolsBox.getChild('canvasHeightField').setAttr('value', dbh);
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