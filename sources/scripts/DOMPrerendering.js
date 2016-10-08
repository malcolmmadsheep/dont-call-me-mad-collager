'use strict';

import DOMElement from './DOMElement';
import * as utils from './utils';
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

export default function render() {
  const previewBox = renderBrushSettingsBox(picturesSources);
  const brushPreview = previewBox.getChild('brushPreview');
  const brushesBox = renderBrushplate(picturesSources, brushPreview.getAttr('src'));

  return {
    previewBox,
    brushesBox
  };
}

function createElement(tagName, options) {
  const element = document.createElement(tagName);

  for (let option in options) {
    if (options.hasOwnProperty(option)) {
      element[option] = options[option];
    }
  }

  return element;
}

function appendChildren(children, to) {
  children.forEach(child => to.append(child));
}

function renderBrushSettingsBox(sources) {
  const brushSettingsBox = new DOMElement(document.getElementById('brush-settings-box'));
  const previewBrush = createPreviewBrush(sources);

  brushSettingsBox.addChild('brushPreview', previewBrush);

  return brushSettingsBox;
}

function createPreviewBrush(sources) {
  const previewBrush = new DOMElement(document.getElementById('preview-brush'));
  previewBrush.setProp('src', sources[0]);

  return previewBrush;
}

function renderBrushplate(sources, selectedItemSource) {
  let maxHeight = -1;
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
  const brushesContainer = new DOMElement(document.getElementById('brushes'));

  const brushesCount = brushes.length;
  let i = 0;

  while (i < brushesCount) {
    const brush = brushes[i];
    brushesContainer.addChild(`brush-${i}`, brush, true);
    const clientHeight = brush.getProp('clientHeight');

    if (clientHeight > maxHeight) {
      maxHeight = clientHeight;
    }

    i += 1;
  }

  brushes.forEach(brush => brush.setStyle('height', utils.toPx(maxHeight)));

  return brushesContainer;
}