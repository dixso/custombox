describe('Custombox open', function() {
    beforeEach(function() {
        $('<div id="modal" class="modal-demo"><button type="button" class="close" onclick="Custombox.close();"><span>&times;</span><span class="sr-only">Close</span></button><h4 class="title">Modal title</h4></div>').appendTo('body');
    });

    var effects = ['fadein', 'slide', 'newspaper', 'fall', 'sidefall', 'blur', 'flip', 'sign', 'superscaled', 'slit', 'rotate', 'letmein', 'makeway', 'slip', 'corner', 'slidetogether', 'scale', 'door', 'push', 'contentscale'],
        i = 0,
        t = effects.length;

    for ( ; i < t; i++ ) {
        it('Check open custombox with the effect ' + effects[i] + '.', function () {
            Custombox.open({
                target: '#modal',
                effect: effects[i]
            });
            expect($(document.documentElement)).toHaveClass('custombox-open-' + effects[i]);
            Custombox.close();
        });
    }
});