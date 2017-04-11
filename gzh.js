var hookAjax = function() {
    // var node = document.createElement("script");
    // node.src = chrome.extension.getURL('feature.js');
    // document.head.appendChild(node);

    var node = document.createElement("script");
    node.src = chrome.extension.getURL('clipboard.min.js');
    document.head.appendChild(node);

    var node = document.createElement("script");
    node.src = chrome.extension.getURL('new_feature.js');
    document.head.appendChild(node);

};

var __main = function() {
    console.log('GZH.__main');
    hookAjax();
};

$(document).ready(function() {
    __main();
    main();
});
