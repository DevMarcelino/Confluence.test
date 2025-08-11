(function($) {
    $(document).ready(function() {
        // Remover destaque de debug
        $('.slicknav_btn').css({
            'outline': 'none',
            'z-index': '',
            'position': '',
            'background-color': ''
        });
        
        // Garantir que o menu inicie oculto
        $('.slicknav_nav').hide().addClass('slicknav_hidden');
        $('.slicknav_btn').removeClass('slicknav_open');
    });
})(jQuery);
