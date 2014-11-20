describe('Custombox', function() {
    beforeEach(function() {
        $('<div id="modal" class="modal-demo"><button type="button" class="close" onclick="Custombox.close();"><span>&times;</span><span class="sr-only">Close</span></button><h4 class="title">Modal title</h4></div>').appendTo('body');
    });

    it('Check open custombox.', function () {
        Custombox.open({
            target: '#modal',
            effect: 'fadein'
        });
        expect($(document.documentElement)).toHaveClass('custombox-open');
    });
});