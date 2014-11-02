/*
 ----------------------------
 Demo
 ----------------------------
 */
$(function () {
    $('.list-group-item').on('click', function ( e ) {
        Custombox.open({
            target: this.getAttribute('href'),
            effect: this.firstChild.nodeValue.trim().replace(/ /g,'').toLowerCase()
        });
        e.preventDefault();
    });

    $('.nav-tabs').tab();

    var $custompopover = $(document.getElementById('custompopover'));
    $('.table-popover tbody > tr').on('mouseover mouseout', function ( e ) {
        if ( e.type === 'mouseover' ) {
            var $this = $(this),
                demo = $this.data('demo') ? $this.data('demo') : $this.find('td').first().text(),
                offset = $this.offset();

            $custompopover.find('.prettyprint').hide();
            $(document.getElementById('demo-' + demo)).show();
            $custompopover.css({
                top:    $this.height() / 2 + offset.top - $custompopover.height() / 2,
                left:   offset.left - $custompopover.width() - 10
            }).show();
        } else {
            $custompopover.hide();
        }
    });

    $.ajax({
        url: 'package.json'
    }).done(function ( response ) {
        document.getElementById('version').innerHTML =  'v' + response.version;
    });
});