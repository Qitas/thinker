jQuery(function($) {

    'use strict';

    var _Blog = window._Blog || {};

    _Blog.toggleMobileMenu = function() {
        $('.menu-toggle').on('click', () => {
            $('.menu-toggle').toggleClass('active');
            $('#mobile-menu').toggleClass('active');
        });
    };

    _Blog.toggleTheme = function() {
        const currentTheme = window.localStorage && window.localStorage.getItem('theme');
        const isDark = currentTheme === 'dark';
        $('body').toggleClass('dark-theme', isDark);
        $('.theme-switch').on('click', () => {
            $('body').toggleClass('dark-theme');
            window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light', );
        });
    };

    _Blog.changeTitle = function() {
        var currentTitle = document.title;
        window.onblur = function() {
            document.title = currentTitle;
        };
        window.onfocus = function() {
            document.title = currentTitle;
        };
    };

    _Blog.chroma = function() {
        const blocks = document.querySelectorAll('.highlight > .chroma');
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const afterHighLight = block.querySelector('pre.chroma > code');
            const lang = afterHighLight ? afterHighLight.className : '';
            block.className += ' ' + lang;
        }
    };

    _Blog.countdown = function() {
        if (window.countdownMap) {
            Object.keys(countdownMap).forEach(function(id) {
              $(id).countdown(countdownMap[id], {elapse: true})
                .on('update.countdown', function(event) {
                  var $this = $(this).html(event.strftime(''
                    + '<span>%D</span> 天 <br />'
                    + '<span>%H</span> 时 '
                    + '<span>%M</span> 分 '
                    + '<span>%S</span> 秒'));
              });
          });
        }
    };

    _Blog.typeit = function() {
        if (window.typeitArr) {
            for (let i = 0; i < typeitArr.length; i++) {
                const group = typeitArr[i];
                (function typeone (i) {
                    if (i === group.length - 1) {
                        new TypeIt(`#${group[i]}`, {
                            strings: document.getElementById(`r${group[i]}`).innerHTML,
                        }).go();
                        return;
                    }
                    let instance = new TypeIt(`#${group[i]}`, {
                        strings: document.getElementById(`r${group[i]}`).innerHTML,
                        afterComplete: () => {
                            instance.destroy();
                            typeone(i + 1);
                        },
                    }).go();
                })(0);
            }
        }
    };

    $(document).ready(function() {
        _Blog.toggleMobileMenu();
        _Blog.toggleTheme();
        _Blog.changeTitle();
        _Blog.chroma();
        _Blog.countdown();
        _Blog.typeit();
    });
});
