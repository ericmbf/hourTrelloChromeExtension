key = 'put your key here'
token = 'put your token here'

window.addEventListener('load', function () {
    window.setTimeout(function () {
        waitForElement('board', timeout);
    }, 1000);
})

function timeout() {
    setTimeout(function () {
        // Do Something Here
        putHourIntoCard();
        // Then recall the parent function to
        // create a recursive loop.
        timeout();
    }, 1000);
}

function putHourIntoCard() {
    var els = document.getElementsByClassName("list-header-name-assist js-list-name-assist");
    var interval = 200; // how much time should the delay between two iterations be (in milliseconds)?
    var promise = Promise.resolve();
    Array.prototype.forEach.call(els, function (el) {
        promise = promise.then(function () {

            // Do stuff here
            spans = []
            if ((el.innerHTML == 'Today') || (el.innerHTML == 'Tomorrow')) {
                var parentDiv = findAncestor(el, 'js-list-content');
                var spans = parentDiv.getElementsByClassName('custom-field-front-badges js-custom-field-badges');
            }

            for (i = 0; i < spans.length; i++) {

                var shouldCheck = false;
                var brothers = siblings(spans[i])
                brothers.forEach(element => {
                    if (element.classList.contains('js-badges')) {
                        if (findChildByClass(element, 'js-due-date-badge')) {
                            shouldCheck = true;
                        }
                    }
                });

                if (shouldCheck) {
                    var aTag = findUpTag(spans[i], "A");

                    if (aTag !== null) {
                        idCard = aTag.href.split("/")[4];

                        getJSON('https://api.trello.com/1/cards/' + idCard + '/due?key=' + key + '&token=' + token,
                            function (err, data) {
                                if (err !== null) {
                                    console.log(data)
                                } else {
                                    if (data._value !== null) {
                                        var date = new Date(data._value);
                                        hour = ('0' + date.getHours()).slice(-2);
                                        mins = ('0' + date.getMinutes()).slice(-2);
                                        hour = hour + ":" + mins
                                        spans[i].innerHTML = hour
                                    }
                                }
                            });
                    }
                }
            }
        });

        return new Promise(function (resolve) {
            setTimeout(resolve, interval);
        });
    });

    promise.then(function () {
        console.log('Loop finished.');
    });
}

var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

function findUpTag(el, tag) {
    while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName === tag)
            return el;
    }
    return null;
}

function findChildByClass(el, className) {
    for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].className.includes(className)) {
            notes = el.childNodes[i];
            return notes;
        }
    }
    return null;
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function waitForElement(elementId, callBack) {
    window.setTimeout(function () {
        var element = document.getElementById(elementId);
        if (element) {
            callBack(elementId, element);
        } else {
            waitForElement(elementId, callBack);
        }
    }, 3000)
}

var siblings = n => [...n.parentElement.children].filter(c => c != n)

