function renderPartials() {
  $.get('menu.html', function(res) {
    $('#menu').append(res);
  });
  $.get('footer.html', function(res) {
    $('#footer').append(res);
  });
}

  function addrow(container, rownumber) {
    var buttonaddcol = '<button type="button" class="btn btn-success pull-right edit-botton-add-col clearfix"><i class="fa fa-columns" aria-hidden="true"></i></button>';
    var row = '<div id="row' + rownumber + '" class="row edit-row"><div class="col-sm-12 edit-col"><div class="edit-content"></div></div>' + buttonaddcol + '</div>';
    //var row = '<div id="row' + rownumber + '" class="row edit-row"><div class="col-sm-12 edit-col"><div class="edit-content"></div></div></div>';
    container.append(row);
  }

  var editrows = [];
  $('#button-add-row').off('click').on('click', function () {
    editrows.push([12]);
    addrow($('#container-edit'), editrows.length);
  });

  function dragMoveListener(event) {
    var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  var startPos = {x: 0, y: 0};
  var widgetBoxPos = null;
  var isInside = false;
  interact('#widget-box').draggable({
    allowFrom: '#widget-box-bar',
    inertia: true,
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    autoScroll: true,
    onmove: dragMoveListener,
    onend: function (event) {  }
  });

  interact('.widget').draggable({
    inertia: true,
    snap: ({
      targets: [startPos],
      range: Infinity,
      relativePoints: [ { x: 0.5, y: 0.5 } ],
      endOnly: true
    }),
    restrict: ({
      restriction: "#container-outer",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    }),
    autoScroll: true,
    onstart: function (event) {
      var rect = interact.getElementRect(event.target);
      startPos.x = rect.left + rect.width  / 2;
      startPos.y = rect.top  + rect.height / 2;
//       if (!widgetBoxPos) {
//       event.interactable.draggable({
//         snap: { targets: [ widgetBoxPos ] }
//       });
//         widgetBoxPos = null;
//       } else {
      event.interactable.draggable({
        snap: { targets: [ startPos ] }
      });
//       }

    },
    onmove: dragMoveListener,
    onend: function (event) { 
      //console.log('on end');
      //if (isInside) event.target.classList.add('d-none');
    }
  });

  interact('.dropzone').dropzone({
    accept: '.widget',
    overlap: 0.8,
    ondropactivate: function (event) {
      event.target.classList.add('drop-active');
      //console.log('ondropactivate');
    },
    ondragenter: function (event) {
       var dropzoneElement = event.target;
      var dropRect = interact.getElementRect(dropzoneElement),
          dropCenter = {
            x: dropRect.left + dropRect.width  / 2,
            y: dropRect.top  + dropRect.height / 2
          };
      event.draggable.draggable({
        snap: { targets: [ dropCenter ] }
      });
      isInside = true;
      widgetBoxPos = startPos;
      
      
      var draggableElement = event.relatedTarget;
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
      //draggableElement.textContent = 'Dragged in';
      //console.log('ondragenter');
      

    },
    ondragleave: function (event) {
      event.draggable.draggable({ snap: false });
      event.draggable.draggable({ snap: { targets: [ startPos ] } });
      isInside = false;
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
      //event.relatedTarget.textContent = 'Dragged out';
      //console.log('ondragleave');
    },
    ondrop: function (event) {
      //event.relatedTarget.textContent = 'Dropped';
      //console.log('ondrop');
    },
    ondropdeactivate: function (event) {
      var t = event.target,
          rt = event.relatedTarget;
      //event.target.classList.remove('drop-active');
      //event.target.classList.remove('drop-target');
      //console.log('ondropdeactivate');
      if (isInside) {
        //console.log('ondropdeactivate inside');
//         var previousDiv = event.relatedTarget.parentNode.innerHTML;
//         console.log(previousDiv);
        //var erow = t.getAttribute("data-edit-row");
        //var wtype = rt.getAttribute("data-widget-type");
        var erow = $(t).data("editRow").toString();
        var wtype = $(rt).data("widgetType");
        //console.log(erow);
        rt.parentNode.innerHTML = '<div class="widget" data-widget-type="'+wtype+'">'+wtype+'</div>';
        $(rt).remove();
        var arow = erow.split("|");
        arow.forEach(function(el) {
          console.log(el);
        });
        if (erow == '12') {
          $(t).data("editRow", "6|6");
          $(t).append('<div class="col-sm-6">' + wtype + '</div>');
          $(t).append('<div class="col-sm-6">' + wtype + '</div>');
        } else {
          
        }

      }
    }
  });
  
  

