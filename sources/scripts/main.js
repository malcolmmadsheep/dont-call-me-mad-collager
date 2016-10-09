'use strict';

import 'styles/main.scss';
import DOMElement from './DOMElement';
import * as utils from './utils';

(function(window) {
  const getElementById = document.getElementById.bind(document);
  const brushesDirectory = './public/images/brushes';
  const MAXIMUM_IMAGE_WIDTH = 200;
  const MAXIMUM_IMAGE_HEIGHT = 200;
  const picturesSources = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png',
    '9.png',
    '10.png',
    'dwi.png'
  ].map(filename => (`${brushesDirectory}/${filename}`));
  const DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH = 1680;
  const DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT = 1050;
  const DEFAULT_CANVAS_WIDTH_HEIGHT_RATIO = DEFAULT_CANVAS_DRAWING_BUFFER_WIDTH / DEFAULT_CANVAS_DRAWING_BUFFER_HEIGHT;
  const CANVAS = new DOMElement(getElementById('field'));
  const BODY = new DOMElement(document.body);
  const TRANSPARENT_BACKGROUND_VALUE = 'url("public/images/transparent-bg.gif") repeat';
  const UNCHAINED_SIZES_IMG_PATH = 'public/images/unchain.png';
  const CHAINED_SIZES_IMG_PATH = 'public/images/chain.png';
  CANVAS.setStyle('background', TRANSPARENT_BACKGROUND_VALUE);
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
        },
        chained: false
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
  let mousePosBox, scalingCoef, brushPreview;

  window.onload = function() {
    setToolsBoxItems(DOMToolsBox);
    setWorkspaceItems(DOMWorkspace);
    setStatusBarItems(DOMStatusBar);

    BODY.addChildren({
      DOMToolsBox,
      DOMWorkspace,
      DOMStatusBar
    });

    clearCanvas();
  }

  function setToolsBoxItems(toolsBox) {
    const canvasSettingsBox = new DOMElement(getElementById('canvas-settings-box'));
    const previewBox = createBrushSettingsBox(picturesSources);
    brushPreview = previewBox.getChild('brushPreview');
    const brushesBox = createBrushplate(picturesSources, brushPreview.getAttr('src'));
    const brushes = brushesBox.childrenToArray();
    const brushSettingsBox = new DOMElement(getElementById('brush-settings-box'), {
      previewBox,
      brushesBox
    });
    const canvasWidthField = new DOMElement(getElementById('canvas-width'));
    const canvasHeightField = new DOMElement(getElementById('canvas-height'));
    const canvasTBgRadio = new DOMElement(getElementById('transparent-background-color-radio'));
    const canvasColorBgRadio = new DOMElement(getElementById('color-background-color-radio'));
    const canvasBgColorInput = new DOMElement(getElementById('background-color-input'));
    const previewBrushWidthScale = new DOMElement(getElementById('preview-brush-width-scale'));
    const previewBrushHeightScale = new DOMElement(getElementById('preview-brush-height-scale'));
    const chainLable = new DOMElement(getElementById('chain'));
    const previewBrushWidthLabel = new DOMElement(getElementById('brush-width'));
    const previewBrushHeightLabel = new DOMElement(getElementById('brush-height'));
    const clearCanvasButton = new DOMElement(getElementById('clear-canvas'));
    const canvasDimConfigs = configs.canvas.dim;
    const dbw = canvasDimConfigs.width.drawingBuffer;
    const dbh = canvasDimConfigs.height.drawingBuffer;

    scalingCoef = Math.round(_toPreviewBrushScale(previewBrushWidthScale.getAttr('max')));
    const pbc = new DOMElement(brushPreview.parent.self.querySelector('.preview-brush-container'));
    pbc.setStyle('background', TRANSPARENT_BACKGROUND_VALUE);

    const brushConfigs = configs.brush;
    brushConfigs.src = brushPreview.getProp('src');
    const brushDimConfigs = brushConfigs.dim;
    const dimWidth = brushDimConfigs.width;
    const dimHeight = brushDimConfigs.height;
    dimWidth.default.client = brushPreview.getProp('clientWidth');
    dimWidth.default.image = brushPreview.getProp('width');
    dimHeight.default.client = brushPreview.getProp('clientHeight');
    dimHeight.default.image = brushPreview.getProp('height');
    const pbwi = dimWidth.image = _calculatePreviewClientSize('width');
    const pbhi = dimHeight.image = _calculatePreviewClientSize('height');
    brushPreview.setStyle('width', utils.toPx(pbwi));
    brushPreview.setStyle('height', utils.toPx(pbhi));

    chainLable.setStyles({
      'background-image': `url("${_getChainBgPath()}")`
    });
    chainLable.addListeners([{
      name: 'click',
      callback(event) {
        const chained = brushDimConfigs.chained = !brushDimConfigs.chained;

        this.setStyle('background-image', `url("${_getChainBgPath(chained)}")`);

        if (chained) {
          const widthScale = _toPreviewBrushScale(previewBrushWidthScale.getProp('value'));
          const heightScale = _toPreviewBrushScale(previewBrushHeightScale.getProp('value'));
          const value = widthScale === heightScale ? widthScale : 1;

          _resetScalesValues(_toPreviewBrushValue(value));
          _setMouse('down');
          changePreviewBrushSize(previewBrushWidthScale, 'width');
          changePreviewBrushSize(previewBrushHeightScale, 'height');
          _setMouse('up');
        }
      }
    }]);

    brushPreview.addListeners([{
      name: 'sizeChange',
      callback(customEvent) {
        const type = customEvent.detail;
        const newValue = _calculatePreviewClientSize(type);
        configs.brush.dim[type].image = newValue;

        this.setStyle(type, utils.toPx(newValue));
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
        updateCanvasResolutionWithEnter(event, 'width', dbw);
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
        updateCanvasResolutionWithEnter(event, 'height', dbh);
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
      name: 'mousedown',
      callback: onMouseDownEventHandler
    }, {
      name: 'change,mousemove',
      callback(event) {
        changePreviewBrushSize(this, 'width');
      }
    }, {
      name: 'mouseup',
      callback: onMouseUpEventHandler
    }]);
    previewBrushHeightScale.addListeners([{
      name: 'mousedown',
      callback: onMouseDownEventHandler
    }, {
      name: 'change,mousemove',
      callback(event) {
        changePreviewBrushSize(this, 'height');
      }
    }, {
      name: 'mouseup',
      callback: onMouseUpEventHandler
    }]);
    brushSettingsBox.addListeners([{
      name: 'previewBrushSizeChange',
      callback(customEvent) {
        const { width, height } = customEvent.detail;

        updatePreviewBrushSizeLabelsValues(width, height);
      }
    }]);
    clearCanvasButton.addListeners([{
      name: 'click',
      callback(event) {
        clearCanvas();
      }
    }]);
    brushes.forEach(brush => {
      brush.addListeners([{
        name: 'click',
        callback: createBrushHandler(brushes, brushPreview)
      }]);
    });

    canvasSettingsBox.addChildren({
      canvasWidthField,
      canvasHeightField,
      canvasColorBgRadio,
      canvasTBgRadio,
      canvasBgColorInput,
      clearCanvasButton
    });

    brushSettingsBox.addChildren({
      previewBrushWidthScale,
      previewBrushHeightScale,
      previewBrushWidthLabel,
      previewBrushHeightLabel
    });

    toolsBox.addChildren({
      brushSettingsBox,
      canvasSettingsBox
    });

    updatePreviewBrushSizeLabelsValues(pbwi, pbhi);

    return toolsBox;
  }

  function createBrushSettingsBox(sources) {
    const brushSettingsBox = new DOMElement(getElementById('brush-settings-box'));
    const previewBrush = createPreviewBrush(sources);

    brushSettingsBox.addChild('brushPreview', previewBrush);

    return brushSettingsBox;
  }

  function createPreviewBrush(sources) {
    const previewBrush = new DOMElement(getElementById('preview-brush'));
    previewBrush.setProp('src', sources[0]);

    return previewBrush;
  }

  function createBrushplate(sources, selectedItemSource) {
    let sumWidthes = -1;
    const brushesContainer = new DOMElement(getElementById('brushes'));
    const createElement = utils.createElement;
    const brushes = sources.map(source => {
      const img = new DOMElement(createElement('img', {
        src: source
      }));
      const div = new DOMElement(createElement('div', {
        className: `brush-item`
      }));

      div.addChild('brush-example', img, true);

      return div;
    });

    brushes[0].addClass('selected');

    const brushesCount = brushes.length;
    let i = 0;

    while (i < brushesCount) {
      const brush = brushes[i];
      brushesContainer.addChild(`brush-${i}`, brush, true);
      const width = parseFloat(brush.getStyle('width'));

      sumWidthes += width;
      i += 1;
    }

    const averageWidth = sumWidthes / brushesCount;
    const averageHeight = Math.round(averageWidth * 1.5);

    brushes.forEach(brush => brush.setStyle('height', utils.toPx(averageHeight)));

    return brushesContainer;
  }

  function createBrushHandler(brushes, brushPreview) {
    return function(event) {
      const currentBrushBox = this;
      const currentBrush = this.getChild('brush-example');
      const currentBrushSource = currentBrush.getProp('src');

      brushes.forEach(brush => brush.removeClass('selected'));
      currentBrushBox.addClass('selected');

      brushPreview.setAttr('src', currentBrushSource);
      const newDefaultWidth = currentBrush.getProp('naturalWidth');
      const newDefaultHeight = currentBrush.getProp('naturalHeight');

      const brushDimConfigs = configs.brush.dim;
      brushDimConfigs.width.default.image = newDefaultWidth;
      brushDimConfigs.height.default.image = newDefaultHeight;
    }
  }

  function updateCanvasResolutionWithEnter(event, propertyName, previousValue) {
    const { keyCode } = event;

    if (keyCode === 13) {
      updateCanvasResolution(event, propertyName, previousValue);
    }
  }

  function _resetScalesValues(value) {
    const dimConfigs = configs.brush.dim;

    dimConfigs.width.scale = dimConfigs.height.scale = _toPreviewBrushScale(value);

    const previewBrushWidthScale = DOMToolsBox.getChild('previewBrushWidthScale');
    const previewBrushHeightScale = DOMToolsBox.getChild('previewBrushHeightScale');

    previewBrushWidthScale.setProp('value', value);
    previewBrushHeightScale.setProp('value', value);

    changePreviewBrushSize(previewBrushWidthScale, 'width');
    changePreviewBrushSize(previewBrushHeightScale, 'height');
  }

  function updatePreviewBrushSizeLabelsValues(width, height) {
    DOMToolsBox.getChild('previewBrushWidthLabel')
      .setProp('textContent', utils.toPx(width))
      .getSibling('previewBrushHeightLabel')
      .setProp('textContent', utils.toPx(height));
  }

  function onMouseDownEventHandler(event) {
    _setMouse('down');
  }

  function onMouseUpEventHandler(event) {
    _setMouse('up');
  }

  function changePreviewBrushSize(target, type) {
    function changeSize(target, type, value) {
      const newScale = _toPreviewBrushScale(value);
      const brushTypeConfig = configs.brush.dim[type];
      const dbtc = brushTypeConfig.default.client;

      target.setProp('value', value);
      brushTypeConfig.scale = newScale;
      const onSizeChangeEvent = new CustomEvent('sizeChange', {
        detail: type
      });
      brushPreview.fireEvent(onSizeChangeEvent);
    }

    if (_isMouseDown()) {
      const value = target.getProp('value');
      changeSize(target, type, value);
      if (configs.brush.dim.chained) {
        const oppositType = (type === 'width') ? 'height' : 'width';
        const anotherScaler = (oppositType === 'width') ? DOMToolsBox.getChild('previewBrushWidthScale') : DOMToolsBox.getChild('previewBrushHeightScale');
        changeSize(anotherScaler, oppositType, value);
      }

      const previewBrushSizeChangeEvent = new CustomEvent('previewBrushSizeChange', {
        detail: {
          width: configs.brush.dim.width.image,
          height: configs.brush.dim.height.image
        }
      });
      DOMToolsBox.getChild('brushSettingsBox').fireEvent(previewBrushSizeChangeEvent);
    }
  }

  function setWorkspaceItems(workspace) {
    workspace.addChild('canvas', CANVAS);

    CANVAS.addListeners([
      { name: 'resolutionChange', callback: onCanvasResolutionChange }, // custom
      { name: 'mousemove', callback: onCanvasMouseCoordinatesUpdateHandler },
      { name: 'mousedown', callback: onMouseDownEventHandler },
      { name: 'mousemove,mousedown', callback: onCanvasMouseClickHandler },
      { name: 'mouseleave', callback: onCanvasMouseLeaveHandler },
      { name: 'mouseup', callback: onMouseUpEventHandler }
    ]);
    setupCanvasSettings(CANVAS);

    return workspace;
  }

  function onCanvasMouseClickHandler(event) {
    drawImage();
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
    const dbw = width.drawingBuffer;
    const dbh = height.drawingBuffer;
    const prevW = this.getProp('width');
    const prevH = this.getProp('height');

    const imgData = CTX.getImageData(0, 0, prevW, prevH);
    this.setProp('width', dbw)
      .setStyle('width', utils.toPx(width.client))
      .setProp('height', dbh)
      .setStyle('height', utils.toPx(height.client));

    clearCanvas();
    CTX.putImageData(imgData, 0, 0);
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

      width.client = Math.min(newClientWidth, width.drawingBuffer);
      height.client = Math.min(newClientHeight, height.drawingBuffer);
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

  function setCanvasBackgroundColor(color) {
    configs.canvas.backgroundColor = color;

    clearCanvas();
  }

  function drawImage() {
    if (_isMouseDown()) {
      const { x, y } = configs.mouse.pos;
      const brushDimConfigs = configs.brush.dim;
      const { width, height } = brushDimConfigs;
      const sourceImgWidth = width.default.image;
      const sourceImgHeight = height.default.image;
      const imgWidth = width.image;
      const imgHeight = height.image;
      const xPos = x - imgWidth / 2;
      const yPos = y - imgHeight / 2;

      CTX.drawImage(brushPreview.self, 0, 0, sourceImgWidth, sourceImgHeight, xPos, yPos, imgWidth, imgHeight);
    }
  }

  function setStatusBarItems(statusBar) {
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
    statusBar.addChild('mousePosBox', mousePosBox);

    return statusBar;
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

  function _calculatePreviewClientSize(type) {
    const previewBrushConfigsDimType = configs.brush.dim[type];
    const defaultClientValue = previewBrushConfigsDimType.default.client;
    const scale = previewBrushConfigsDimType.scale;

    return Math.round((defaultClientValue * scale / scalingCoef));
  }

  function _getChainBgPath(chained) {
    return chained ? CHAINED_SIZES_IMG_PATH : UNCHAINED_SIZES_IMG_PATH;
  }

  function _setMouse(param) {
    configs.mouse.isDown = (param === 'up') ? false : true;
  }

  function _isMouseDown() {
    return configs.mouse.isDown;
  }

  function _toPreviewBrushScale(value) {
    return value / 10;
  }

  function _toPreviewBrushValue(scale) {
    return scale * 10;
  }
})(window);