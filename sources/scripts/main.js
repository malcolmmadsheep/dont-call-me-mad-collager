'use strict';

import 'styles/main.scss';
import prerender from './DOMPrerendering';
import DOMElement from './DOMElement';
import * as utils from './utils';

(function(window) {
  const getElementById = document.getElementById.bind(document);
  const DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH = 1680;
  const DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT = 1050;
  const DEFAULT_CANVAS_WIDTH_HEIGHT_RATIO = DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH / DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT;
  const CANVAS = new DOMElement(getElementById('field'));
  const BODY = new DOMElement(document.body);
  CANVAS.setStyle('background', 'url("public/images/transparent-bg.gif") repeat');
  const DEFAULT_CANVAS_CLIENT_WIDTH = CANVAS.getProp('clientWidth');
  const DEFAULT_CANVAS_CLIENT_HEIGHT = CANVAS.getProp('clientHeight');

  const DOMToolsBox = new DOMElement(getElementById('tools-box'));
  const DOMWorkspace = new DOMElement(getElementById('workspace'));
  const DOMStatusBar = new DOMElement(getElementById('status-bar'));
  const CTX = CANVAS.self.getContext('2d');
  const objects = [];
  const configs = {
    canvas: {
      filling: {
        previousColor: '#fff',
        currentColor: '#fff'
      },
      dim: {
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
          client: Math.round(DEFAULT_CANVAS_CLIENT_WIDTH / DEFAULT_CANVAS_WIDTH_HEIGHT_RATIO),
          drawingBuffer: DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT,
          ratio: DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT / DEFAULT_CANVAS_CLIENT_HEIGHT
        },
        widthHeightRatio: DEFAULT_CANVAS_WIDTH_HEIGHT_RATIO
      },
      backgroundColor: '#fff'
    },
    brush: {
      src: '',
      dim: {
        width: {
          default: {},
          scale: 1
        },
        height: {
          default: {},
          scale: 1
        }
      }
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
  let mousePosBox, scalingCoef;

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
    const { previewBox, brushesBox } = brushPreviewChildren; //brushSettingsBox.getChild('brushPreview');
    // console.log(brushPreviewChildren);
    // const brushes = brushSettingsBox.getChild('brushesBox').childrenToArray();
    const brushes = brushesBox.childrenToArray();
    const brushPreview = previewBox.getChild('brushPreview');
    const brushSettingsBox = new DOMElement(getElementById('brush-settings-box'), brushPreviewChildren);
    const canvasWidthField = new DOMElement(getElementById('canvas-width'));
    const canvasHeightField = new DOMElement(getElementById('canvas-height'));
    const canvasTBgRadio = new DOMElement(getElementById('transparent-background-color-radio'));
    const canvasColorBgRadio = new DOMElement(getElementById('color-background-color-radio'));
    const canvasBgColorInput = new DOMElement(getElementById('background-color-input'));
    const previewBrushWidthScale = new DOMElement(getElementById('preview-brush-width-scale'));
    const previewBrushHeightScale = new DOMElement(getElementById('preview-brush-height-scale'));
    const canvasDimConfigs = configs.canvas.dim;
    const dbw = canvasDimConfigs.width.drawingBuffer;
    const dbh = canvasDimConfigs.height.drawingBuffer;

    scalingCoef = Math.round(toPreviewBrushScale(previewBrushWidthScale.getAttr('max')));

    const brushConfigs = configs.brush;
    brushConfigs.src = brushPreview.getProp('src');
    const brushDimConfigs = brushConfigs.dim;
    brushDimConfigs.width.default.client = brushPreview.getProp('clientWidth');
    brushDimConfigs.height.default.client = brushPreview.getProp('clientHeight');
    brushPreview.setStyle('width', utils.toPx(calculatePreviewClientSize('width')));
    brushPreview.setStyle('height', utils.toPx(calculatePreviewClientSize('height')));

    brushPreview.addListeners([{
      name: 'sizeChange',
      callback(customEvent) {
        const type = customEvent.detail;

        this.setStyle(type, utils.toPx(calculatePreviewClientSize(type)));
      }
    }]);
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
    previewBrushWidthScale.addListeners([{
      name: 'change,mousemove',
      callback(event) {
        changePreviewBrushSize(this, 'width');
      }
    }]);
    previewBrushHeightScale.addListeners([{
      name: 'change,mousemove',
      callback(event) {
        changePreviewBrushSize(this, 'height');
      }
    }]);

    // brushSettingsBox.addChild('previewBrushScaleRange', previewBrushScaleRange);
    canvasSettingsBox.addChildren({
      canvasWidthField,
      canvasHeightField,
      canvasColorBgRadio,
      canvasTBgRadio,
      canvasBgColorInput
    });

    setBrushesEventHandlers(brushes, brushPreview);

    toolsBox.addChildren({
      brushSettingsBox,
      canvasSettingsBox
    });

    return toolsBox;
  }

  function calculatePreviewClientSize(type) {
    const previewBrushConfigsDimType = configs.brush.dim[type];
    const defaultClientValue = previewBrushConfigsDimType.default.client;
    const scale = previewBrushConfigsDimType.scale;

    return Math.round((defaultClientValue * scale / scalingCoef));
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
      const canvasDimConfigs = configs.canvas.dim;
      const canvasPropertyConfigs = canvasDimConfigs[propertyName];
      if (canvasPropertyConfigs.drawingBuffer === value) {
        return;
      }
      const defaultConfigs = canvasPropertyConfigs.default;
      const newCanvasClientTypeValue = Math.min(defaultConfigs.client, value);
      canvasPropertyConfigs.drawingBuffer = value;
      canvasPropertyConfigs.client = newCanvasClientTypeValue;

      const { width, height } = canvasDimConfigs;
      const drawingBufferRatio = width.drawingBuffer / height.drawingBuffer;
      let newClientHeight, newClientWidth, tempClientValue;

      if (drawingBufferRatio > 1) {
        const widthDef = width.default
        tempClientValue = widthDef.client * drawingBufferRatio;
        newClientWidth = Math.min(widthDef.client, tempClientValue);
        tempClientValue = widthDef.client / drawingBufferRatio;
        newClientHeight = Math.min(height.default.client, tempClientValue);
      } else if (drawingBufferRatio < 1) {
        const heightDef = height.default;
        tempClientValue = heightDef.client / drawingBufferRatio;
        newClientHeight = Math.min(heightDef.client, tempClientValue);
        tempClientValue = heightDef.client * drawingBufferRatio;
        newClientWidth = Math.min(width.default.client, tempClientValue);
      } else {
        tempClientValue = Math.min(height.default.client, width.default.client);
        newClientHeight = newClientWidth = Math.min(value, tempClientValue)
      }

      width.client = newClientWith;
      height.client = newClientHeight;
      width.ratio = width.drawingBuffer / width.client;
      height.ratio = height.drawingBuffer / height.client;

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

  function changePreviewBrushSize(target, type) {
    const newScale = toPreviewBrushScale(target.getProp('value'));
    const brushTypeConfig = configs.brush.dim[type];
    const dbtc = brushTypeConfig.default.client;

    brushTypeConfig.scale = newScale;
    const onSizeChangeEvent = new CustomEvent('sizeChange', {
      detail: type
    });
    DOMToolsBox.getChild('brushPreview').fireEvent(onSizeChangeEvent);
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
    const { backgroundColor, dim, filling } = canvasConfigs;
    const { width, height } = dim;

    if (backgroundColor === 'transparent') {
      CTX.clearRect(0, 0, width.drawingBuffer, height.drawingBuffer);
    } else {
      CTX.fillStyle = backgroundColor;
      CTX.fillRect(0, 0, width.drawingBuffer, height.drawingBuffer);
      CTX.fillStyle = filling.previousColor;
    }
  }

  function setCanvasBackgroundColor(color) {
    configs.canvas.backgroundColor = color;

    clearCanvas();
    redraw();
  }

  function setBrushesEventHandlers(brushesBoxes, brushPreview) {
    brushesBoxes.forEach(brush => {
      brush.addListeners([{
        name: 'click',
        callback: createBrushHandler(brushesBoxes, brushPreview)
      }]);
    });

    return brushesBoxes;
  }

  function createBrushHandler(brushes, brushPreview) {
    return function(event) {
      const currentBrushBox = this;
      const currentBrush = this.getChild('brush-example');
      const currentBrushSource = currentBrush.getProp('src');

      brushes.forEach(brush => brush.removeClass('selected'));
      currentBrushBox.addClass('selected');

      brushPreview.setAttr('src', currentBrushSource);
      const newDefaultWidth = currentBrush.naturalWidth;
      const newDefaultHeight = currentBrush.naturalHeight;

      const brushConfigs = configs.brush;
      brushConfigs.width.default.image = newDefaultWidth;
      brushConfigs.height.default.image = newDefaultHeight;
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
    const canvasDim = canvas.dim;
    const { width, height } = canvasDim;

    this.setProp('width', width.drawingBuffer)
      .setStyle('width', utils.toPx(width.client))
      .setProp('height', height.drawingBuffer)
      .setStyle('height', utils.toPx(height.client));

    clearCanvas();
    redraw();
  }

  function updateMouseCoordinates(mousePos, event, value) {
    let X, Y;
    const canvasConfigs = configs.canvas;
    const canvasDim = canvasConfigs.dim;

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

    mousePos.x = Math.round(X * canvasDim.width.ratio);
    mousePos.y = Math.round(Y * canvasDim.height.ratio);

    mousePosBox.fireEvent(customEvents.onMouseCoordinatesChange);
  }

  function toPreviewBrushScale(value) {
    return value / 10;
  }

  function setupCanvasSettings(canvas) {
    const canvasConfigs = configs.canvas;
    const canvasDim = canvasConfigs.dim;
    const { width, height } = canvasDim;
    const minHeightClient = Math.min(height.client, height.default.client);
    height.client = minHeightClient;

    const dbw = width.drawingBuffer;
    const dbh = height.drawingBuffer;
    const cw = width.client;
    const ch = height.client;

    canvas.setProp('width', dbw)
      .setProp('height', dbh)
      .setStyle('width', utils.toPx(cw))
      .setStyle('height', utils.toPx(ch));

    DOMToolsBox.getChild('canvasWidthField').setAttr('value', dbw);
    DOMToolsBox.getChild('canvasHeightField').setAttr('value', dbh);
  }
})(window);