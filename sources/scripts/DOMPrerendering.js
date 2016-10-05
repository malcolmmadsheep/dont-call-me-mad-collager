'use strict';

import DOMElement from './DOMElement';
const picturesDirectory = './public/images';
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
  '10.png'
].map(filename => (`${picturesDirectory}/${filename}`));

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
  const brushes = sources.map(source => new DOMElement(createElement('img', {
    src: source,
    className: `brush-item`
  })));
  brushes[0].addClass('selected');
  const brushesContainer = new DOMElement(document.getElementById('brushes'));

  const brushesCount = brushes.length;
  let i = 0;

  while (i < brushesCount) {
    brushesContainer.addChild(`brush-${i}`, brushes[i], true);
    i += 1;
  }

  return brushesContainer;
}