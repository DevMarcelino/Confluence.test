/**
 * Debug e fix para o menu mobile SlickNav
 * CONFLUENCE-C
 */

(function($) {
    'use strict';

    // Aguardar o carregamento completo do DOM
    $(document).ready(function() {
        
        console.log('=== Menu Debug - CONFLUENCE-C ===');
        
        // Verificar se jQuery está carregado
        if (typeof $ === 'undefined') {
            console.error('jQuery não está carregado!');
            return;
        }
        
        // Verificar se SlickNav está disponível
        if (typeof $.fn.slicknav === 'undefined') {
            console.error('SlickNav plugin não está carregado!');
            return;
        }
        
        // Verificar se o elemento existe
        var $menu = $('ul#navigation');
        console.log('Elemento #navigation encontrado:', $menu.length > 0);
        
        if ($menu.length === 0) {
            console.error('Elemento ul#navigation não encontrado!');
            return;
        }
        
        // Inicializar SlickNav com configuração otimizada
        $menu.slicknav({
            prependTo: ".mobile_menu",
            label: 'MENU',
            closedSymbol: '&#9658;', // Seta para direita quando fechado
            openedSymbol: '&#9660;', // Seta para baixo quando aberto
            allowParentLinks: true,
            nestedParentLinks: false,
            showChildren: false,
            removeClasses: false,
            removeStyles: false,
            brand: '',
            init: function() {
                console.log('SlickNav inicializado com sucesso');
                // Garantir que inicie fechado
                $('.slicknav_nav').hide();
                console.log('Estado inicial do menu:', $('.slicknav_nav').css('display'));
            },
            open: function() {
                console.log('Menu aberto');
            },
            close: function() {
                console.log('Menu fechado');
            }
        });
        
        // Adicionar classe para indicar que está pronto
        $('.mobile_menu').addClass('slicknav-ready');
        
        // Forçar estado inicial fechado
        setTimeout(function() {
            $('.slicknav_nav').hide().addClass('slicknav_hidden');
            $('.slicknav_btn').removeClass('slicknav_open');
            console.log('Estado após forçar fechado:', $('.slicknav_nav').css('display'));
        }, 100);
        
        // Teste de clique
        $(document).on('click', '.slicknav_btn', function() {
            console.log('Botão do menu clicado');
            console.log('Estado do menu no clique:', $('.slicknav_nav').css('display'));
        });

        // Listener direto no botão para teste
        $('.slicknav_btn').off('click').on('click', function() {
            console.log('Botão do menu clicado - listener direto');
            console.log('Estado do menu no clique (listener direto):', $('.slicknav_nav').css('display'));
        });
        
        console.log('=== Menu Debug Finalizado ===');
    });

    // Fallback caso o SlickNav falhe
    $(window).on('load', function() {
        setTimeout(function() {
            if (!$('.mobile_menu').hasClass('slicknav-ready')) {
                console.warn('SlickView não inicializou, aplicando fallback...');
                
                // Fallback simples
                $('.mobile_menu').html(`
                    <button class="mobile-toggle" style="background: #000; color: #fff; padding: 10px 15px; border: none;">
                        ☰ MENU
                    </button>
                    <ul class="mobile-nav" style="display: none; background: #fff; list-style: none; padding: 0;">
                        <li><a href="index.html" style="display: block; padding: 10px; color: #000;">início</a></li>
                        <li><a href="https://wa.link/q5rjh3" style="display: block; padding: 10px; color: #000;">Contato</a></li>
                    </ul>
                `);
                
                $('.mobile-toggle').on('click', function() {
                    $('.mobile-nav').slideToggle();
                });
            }
        }, 2000);
    });

})(jQuery);
