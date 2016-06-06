
var cssFile = chrome.extension.getURL('css/layout.css'),
    classVertical = 'layout-trello-vertical',
    classMixed = 'layout-trello-mixed',
    timer,
    mode=0;

// add css link to page
function insertCss() {
    if (document.getElementById('layoutcss') === null) {
        var css = document.createElement('link');
        css.id = 'layoutcss';
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = cssFile;
        document.getElementsByTagName('head')[0].appendChild(css);
    }
}

function toggleView() {
    var board = document.getElementById('board');
    switch(mode) {
    case 0:
        $('.badges').hide(); $('.list-card-members').hide();$('.list-card-labels').hide();
        $('.list-card').css('marginBottom','0px');
        $('.list-card-details').css('padding','1px 6px 1px 8px');
        $('.list-card-title').css('margin','0');
        mode=2; // skip 1
        break;
    case 1:
        $('.list-card-title').css('fontSize','12px');
        mode=2;
        break;
    case 2:
        $('.list-card-title').css('fontSize','13px').css('margin','3px 0 0 0').css('lineHeight','13px');
        $('.list-card-details').css('padding','0px 6px 0px 8px');
        $('.list-wrapper').width(510);  
        $('.list-card').width(500).css( "maxWidth", '500px'); 
        mode=99;
        break;
    case 99:
        // reset 
        $('.badges').show(); $('.list-card-members').show();$('.list-card-labels').show();
        $('.list-card').css('marginBottom','6px');
        $('.list-card-details').css('padding','6px 6px 6px 8px');
        $('.list-card-title').css('fontSize','').css('margin','0 0 4px').css('lineHeight','');
        $('.list-wrapper').width(270);  
        $('.list-card').css('width','').css( "maxWidth", '300px'); 
        mode=0;
        break;
    }
    // if (!board.classList.contains(classMixed)) {
    //     if (!board.classList.contains(classVertical)) {
    //         board.classList.add(classMixed);
    //         chrome.storage.sync.set({'classList': classMixed});
    //     } else {
    //         board.classList.remove(classVertical);
    //         chrome.storage.sync.remove('classList');
    //     }
    // } else {
    //     board.classList.remove(classMixed);
    //     board.classList.add(classVertical);
    //     chrome.storage.sync.set({'classList': classVertical});
    // }
}

function insertButton() {
    var btnNotifications = document.getElementsByClassName('header-notifications')[0];
    var btnView = document.createElement('a');

    btnView.id = 'layout-button';
    btnView.setAttribute('class', 'header-btn header-notifications js-toggle-view');
    btnView.setAttribute('title', 'Toggle Layout');
    btnView.setAttribute('href', '#');
    btnView.innerHTML = '<span class="header-btn-icon icon-lg icon-list light"></span>';
    btnView.onclick = toggleView;

    btnNotifications.parentNode.insertBefore(btnView, btnNotifications.nextSibling);
}

function readyCheck() {
    var btnNotifications = document.getElementsByClassName('header-notifications')[0];
    var btnView = document.getElementById('layout-button');

    if (!btnView && btnNotifications) {
        insertButton();
        insertCss();
        chrome.storage.sync.get('classList', function (result) {
            if(result.classList){
                board.classList.add(result.classList);
            }
        });
        clearInterval(timer);
    }
}

if (document.URL.indexOf('/b/') !== -1) {
    timer = setInterval(readyCheck, 100);   // one time only... cleared in readycheck
    // @todo Need better solution than interval checking after pushState,
    //       but readyState always 'complete' after initial DOM load
}
