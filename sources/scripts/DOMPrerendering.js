'use strict';

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
  const previewBox = renderPreviewBox(picturesSources);
  const {previewBrush} = previewBox;
  const brushesBox = renderBrushplate(picturesSources, previewBrush.src);

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

function renderPreviewBox(sources) {
  const previewBrush = setPreviewBrush(document.getElementById('preview-brush'), sources);

  return {
    previewBrush
  };
}

function setPreviewBrush(previewBrush, sources) {
  const src = sources[0];

  previewBrush.src = src;

  return previewBrush;
}

function renderBrushplate(sources, selectedItemSource) {
  const brushes = sources.map(source => createElement('img', {
    src: source,
    className: `brush-item`
  }));
  brushes[0].classList.add('selected');
  const brushesContainer = document.getElementById('brushes');

  appendChildren(brushes, brushesContainer);

  return brushesContainer;
}
