/*
 ----------------------------
 Demo
 ----------------------------
 */
$(function () {
    $('.list-group-item').on('click', function ( e ) {
        Custombox.open({
            target:     this.getAttribute('href'),
            effect:     this.firstChild.nodeValue.trim().replace(/ /g,'').toLowerCase()
        });
        e.preventDefault();
    });

    $('.nav-tabs').tab();

    var $custompopover = $(document.getElementById('custompopover'));
    $('.table-popover tbody > tr').on('mouseover mouseout click', function ( e ) {
        var $this = $(this),
            demo = $this.data('demo') ? $this.data('demo') : $this.find('td').first().text(),
            $tooltip = $(document.getElementById('demo-' + demo));
        if ( e.type === 'mouseover' ) {
            var offset = $this.offset();
            $custompopover.find('.prettyprint').hide();
            $tooltip.show();
            $custompopover.css({
                top:    $this.height() / 2 + offset.top - $custompopover.height() / 2,
                left:   offset.left - $custompopover.width() - 10
            }).show();
        } else if ( e.type === 'mouseout' ) {
            $custompopover.hide();
        } else if ( !$this.closest('table').hasClass('table-methods') ) {
            var tmpFunc = new Function($tooltip.text());
            tmpFunc();
        }
    });

    $.ajax({
        url: 'package.json'
    }).done(function ( response ) {
        document.getElementById('version').innerHTML =  'v' + response.version;
    });
});