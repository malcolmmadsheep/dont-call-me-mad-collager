﻿(function() {
  var canvas,
    context,
    objects = [];
  console.log('huy');
  window.onload = function() {
    var imgSrc = '';
    var isDefault = true;
    var brushes = document.getElementById('brushes');
    var randBtn = document.getElementById('rand');
    var mouseIsDown = false;
    var dontStop = false;
    canvasCreation();
    brushesSetUp(brushes);
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    var CHBshouldIStop = document.getElementById('shouldIStop');
    var sizeRange = document.getElementById('size');
    var sizeExamp = document.getElementById('examplePic');
    var exampHeight = sizeExamp.height;
    sizeExamp.height = window.innerHeight * sizeRange.value / 100;

    canvas.addEventListener('click', function(evt) {
      var size = sizeRange.value / 100;
      var pos = getMousePos(canvas, evt);
      if (isDefault) {
        var n = (Math.random().toFixed(1) * 10) % 10 + 1;
        imgSrc = 'img/' + String(n) + '.png';
      }
      createObject(pos, imgSrc, size);
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
      if (mouseIsDown && dontStop) {
        var size = sizeRange.value / 100;
        var pos = getMousePos(canvas, evt);
        if (isDefault) {
          var n = (Math.random().toFixed(1) * 10) % 10 + 1;
          imgSrc = 'img/' + String(n) + '.png';
        }
        createObject(pos, imgSrc, size);
      }
      evt.target.style.cursor = 'initial';
    }, false);

    canvas.addEventListener('mousedown', function() {
      mouseIsDown = true;
    }, false);

    canvas.addEventListener('mouseup', function() {
      mouseIsDown = false;
    }, false);

    randBtn.addEventListener('click', function() {
      isDefault = true;
      lastTarget = null;
      $('.brush').removeClass('selected');
    }, false);

    var cleCan = document.getElementById('clearCanvas');
    cleCan.addEventListener('click', function() {
      clearCanvas(context, canvas);
    }, false);

    var lastTarget = null;
    $('#brushes').on('click', function(e) {
      var target;
      if ($(e.target).is('div')) {
        target = $(e.target);
      } else {
        target = $(e.target).parent('div');
      }

      var lastSrc = lastTarget ? lastTarget.children('img').attr('src') : '';
      var currSrc = target.children('img').attr('src');

      if (!lastTarget) {
        lastTarget = target;
        target.addClass('selected');
        target.css('border-right', '3px solid red');
      } else if (lastSrc !== currSrc) {
        lastTarget.removeClass('selected');
        lastTarget.css('border-right', '1px solid navy');
        lastTarget = target;
        target.addClass('selected');
        target.css('border-right', '3px solid red');
      }

      imgSrc = target.children('img').attr('src');
      $('#examplePic').attr('src', imgSrc);
      isDefault = false;
    });

    sizeRange.addEventListener('change', function() {
      sizeExamp.height = window.innerHeight * sizeRange.value / 100;
      var tools = document.getElementById('tools');
      tools.height = window.innerHeight;
    }, false);

    CHBshouldIStop.addEventListener('click', function(e) {
      if (e.target.checked) {
        dontStop = true;
      } else {
        dontStop = false;
      }
    }, false);
  }

  window.onresize = function() {
    canvasResizing(canvas);
  }

  function canvasCreation() {
    $canvas = document.createElement('canvas');
    $canvas.width = window.innerWidth - window.innerWidth / 20 * 3;
    $canvas.height = window.innerHeight;
    $canvas.id = 'myCanvas';
    document.body.appendChild($canvas);
  }

  function canvasResizing(can) {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
  }

  function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function createObject(pos, imgSrc, size) {
    var length = objects.length;
    objects[length] = {};
    objects[length].image = new Image();
    objects[length].options = {};
    objects[length].options.height = Math.round(window.innerHeight * size);
    objects[length].options.width = Math.round(objects[length].options.height * 0.7);
    objects[length].image.src = imgSrc;

    objects[length].image.onload = function() {
      context.drawImage(objects[length].image,
        pos.x - objects[length].options.width / 2,
        pos.y - objects[length].options.height / 2,
        objects[length].options.width,
        objects[length].options.height);
    }
  }

  function clearCanvas(context, canv) {
    context.clearRect(0, 0, canv.width, canv.height);
  }

  function brushesSetUp(brushes) {
    for (var i = 1; i < 11; i++) {
      var brush = document.createElement('div');
      brush.className = 'brush';
      if (i % 2 === 0) {
        brush.style.borderRight = '1px solid navy';
      }
      var brushImg = document.createElement('img');
      brushImg.src = 'img/' + i + '.png';
      brush.appendChild(brushImg);
      brushes.appendChild(brush);
    }
  }
})();