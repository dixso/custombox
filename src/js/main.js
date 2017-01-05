$(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $.get('https://api.github.com/repos/dixso/custombox/releases/latest').done(function(response) {
    if (response && response.tag_name) {
      $(document.getElementById('download')).prop('href', 'https://github.com/dixso/custombox/archive/' + response.tag_name + '.zip');
    }
  });

  $(document).on('click', '[data-custombox]', function() {
    var options = $(this).data('custombox');
    if (!options.content.target) {
      options.content.target = '#demo-modal';
    }

    new Custombox.modal(options).open();
  });

  $(document).on('click', '#credits-link', function() {
    new Custombox.modal({
      content: {
        effect: 'corner',
        target: '#credits'
      },
      overlay: {
        onOpen: function () {
          $(document.getElementById('btb-methods')).find('button').removeClass('btb-methods');
        },
        onClose: function () {
          $(document.getElementById('btb-methods')).find('button').addClass('btb-methods');
        }
      }
    }).open();
  });

  var effects = ['fadein', 'slide', 'newspaper', 'blur', 'superscaled', 'rotate', 'corner', 'slidetogether', 'scale', 'door'];
  var animate = ['top', 'right', 'bottom', 'left'];
  var positionX = ['left', 'center', 'right'];
  var positionY = ['top', 'center', 'bottom'];
  $(document).on('click', '#open-multiple', function() {
    new Custombox.modal({
      content: {
        effect: effects[Math.floor(Math.random() * effects.length)],
        target: '#demo-modal-multiple-1',
        animateFrom: animate[Math.floor(Math.random() * animate.length)],
        animateTo: animate[Math.floor(Math.random() * animate.length)],
        positionX: positionX[Math.floor(Math.random() * positionX.length)],
        positionY: positionY[Math.floor(Math.random() * positionY.length)],
      },
      overlay: {
        active: Math.random() < 0.5
      }
    }).open();
  });
});