var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function(selector) {
    return document.querySelectorAll(selector)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var addClass = function(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className)
        return true
    }
    return false
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 函数可以查找 element 的所有子元素
var find = function(element, selector) {
    return element.querySelectorAll(selector)
}

var showMore = function() {
  var dom = e('.QuestionRichText-more');
  // TODO: 这里可以清真一点
  if (dom != null) {
    dom.click()
    return true;
  }
  return false;
}

var changeColor = function() {
  var dom = e('.QuestionRichText').querySelector('div')

  if (dom != null) {
    addClass(dom, 'c')
    return true;
  }
  return false;
}

// 通过 body.scrollTop 来计算当前浏览到第几个答案
var heightToCur = function(h) {
  var list = es('.List-item')
  if (h < list[0].offsetTop) {
    return 0
  }
  for (var i = 1; i < list.length; i++) {
    if (h >= list[i-1].offsetTop && h < list[i].offsetTop) {
      return i - 1;
    }
  }
  return i - 1;
}

// 全局变量：当前浏览的前n个回答
// 使用全局变量的原因：
// 需要监听滚动事件，来判断浏览到第几个回答
// 需要监听键盘事件，来做快捷键跳转上一个/下一个答案
// cur 初始值不能为零，因为之后刷新会自动到上次浏览的位置
var cur;

var autoLoadMore = function() {
  var d = e('.QuestionMainAction')
  if (d != null) {
    d.click()
  }
}

var scrollToAnswer = function(d) {
  var body = e('body')
  // 80 是一个经验数字
  body.scrollTop = d.offsetTop - 80
}

var pinAnswerTool = function() {
  var h = e('body').scrollTop;
  var curAnswer = findAnswerList()[cur]
  var tools = e('.tools')
  // 经验值, 知乎header的高度，先写死
  var n = 60

  if (curAnswer.offsetTop > h) {
    tools.style.top = `${curAnswer.offsetTop}px`;
  } else {
    tools.style.top = `${h + 60}px`
  }
}
var bindScroll = function() {
  var body = e('body')
  window.onscroll = function() {
    // n 经验数，不然会影响计算结果
    var n = 200;
    var h = body.scrollTop + n;
    cur = heightToCur(h);
    pinAnswerTool();
  }
  return true;
}

var findAnswerList = function() {
  var card = e('.Card')
  return find(card, '.List-item')
}

var bindKeyBoard = function() {
  document.onkeydown = function(event) {
    var list = findAnswerList()
    var body = e('body')
    if (event.key == 's' || event.key == 'j') {
      // 浏览到倒数第二条条时自动刷新
      var n = 2
      if (cur + n >= list.length) {
        autoLoadMore()
      }
      // 这里的三元符是自己懒了..
      cur = cur + 1 >= list.length ? cur: cur + 1
      scrollToAnswer(list[cur]);
    } else if (event.key == 'a' || event.key == 'k') {
      cur = cur <= 0 ? 0: cur - 1
      scrollToAnswer(list[cur]);
    }
  }
  return true;
}

var getAnswerInfoListTemplate = function() {
  var list = e('.List');
  var items = find(list, '.List-item');
  var template = ''
  items.forEach(function(v) {
    var img = v.querySelector('.Avatar') || {};
    var username = img.alt;
    var time =  v.querySelector('.ContentItem-time');
    if (time == null) {
      // 被折叠的答案
      var t = `
        <div>${img.outerHTML} <span> ${username} </span></div>
      `
      template += t;
    } else {
      var t = `
        <div>${img.outerHTML} <span> ${username} ${time.innerHTML} </span></div>
      `
      template += t;
    }
  })
  return template;

}

var pinAnswerList = function() {

  var list = e('.List');
  var items = find(list, '.List-item');
  var text = e('.List-headerText').querySelector('span').textContent;
  var n = parseInt(text);
  if (n > 20) {
    n = 20
  }
  if (items.length >= n) {
    console.log('list', items);
    var  t = `
      <div class=pin-answer-list>
      </div>
    `
    var b = e('body')
    appendHtml(b, t)
    var dom =  e('.pin-answer-list')
    appendHtml(dom, getAnswerInfoListTemplate());
    return true;
  } else {
    return false;
  }

}
var init = function() {
  console.log('init');
  var body = e('body');
  var t = `
    <div class=tools>
    <div>
      <button id=up class=VoteButton>点赞</button>
    </div>
    <div>
      <button id=down class=VoteButton>反对</button>
    </div>
    <div>
      <button id=copy class=VoteButton data-clipboard-target="#foo">复制链接</button>

      <input id="foo" value="" style='position: fixed; top: -100px;'>
    </div>
    </div>
  `
  appendHtml(body, t)
  // var clipboard = new Clipboard('#id-button-copy');
  var clipboard = new Clipboard('#copy');
  clipboard.on('success', function () {
       console.log('success');
   });
  var n = 200;
  var h = e('body').scrollTop + n
  cur = heightToCur(h);
  return true
}

var bindTools = function() {
  var up = e('#up');
  bindEvent(up, 'click', function() {
    findAnswerList()[cur].querySelector('.VoteButton--up').click()
  })
  var down = e('#down');
  bindEvent(down, 'click', function() {
    findAnswerList()[cur].querySelector('.VoteButton--down').click()
  })
  var copy = e('#copy');
  bindEvent(copy, 'click', function(event) {
    var item = findAnswerList()[cur].querySelector('.ContentItem-time')
    var a = item.querySelector('a')
    var link = `https://www.zhihu.com${a.attributes.href.value}`
    var input = e('#foo')
    input.setAttribute('value', link)
    // window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
  })
  return true;
}

var isQuestionPage = function() {
  var list = location.pathname.split('/')
  return list.length == 3 && list[1] == 'question'
}

var listenURLChange = function(callback) {
   var oldURL = location.href;
   setInterval(function() {
     var newURL = location.href;
     if (newURL != oldURL) {
       callback();
     }
     oldURL = newURL;
   }, 100)
}

var timer = function(func, interval) {
  return setInterval(function() {
    func();
  }, interval)
}

var changeStatus = function(status, callback) {
  if (status == false) {
    return callback();
  }
  return true;
}

var main = function() {
  // 插件的功能只初始化一次，所以使用status变量
  var initStatus = false;
  var showMoreStatus = false;
  var changeColorStatus = false;
  var bindScrollStatus = false;
  var bindKeyBoardStatus = false;
  var bindToolsStatus = false;
  var pinAnswerListStatus = false;

  var new_feature_main = function() {
    if (isQuestionPage() == true) {
      initStatus = changeStatus(initStatus, init);
      showMoreStatus = changeStatus(showMoreStatus, showMore);
      changeColorStatus = changeStatus(changeColorStatus, changeColor);
      bindScrollStatus = changeStatus(bindScrollStatus, bindScroll);
      bindKeyBoardStatus = changeStatus(bindKeyBoardStatus, bindKeyBoard);
      bindToolsStatus = changeStatus(bindToolsStatus, bindTools);
      pinAnswerListStatus = changeStatus(pinAnswerListStatus, pinAnswerList);
    }
  }

  timer(new_feature_main, 100)
}
