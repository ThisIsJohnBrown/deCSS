let lines;
let startedRemoving = false;
const config = {
    maxAmountOfDestruction: 50,
    speed: 500
}

const cleanCSS = code => {
    var request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };
        request.open('POST', 'https://www.10bestdesign.com/dirtymarkup/api/css', true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send(`code=${encodeURIComponent(code)}&indent=tabs&newline-between-selectors=true&newline-between-rules=true`);
    });
};

const retrieveCSS = url => {
    var request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };
        request.open('GET', url, true);
        request.send();
    });
}

let sheets = document.querySelectorAll('link[rel=stylesheet]');
sheets.forEach(function (sheet) {
    if (sheet.getAttribute('href').indexOf('.css') !== -1) {
        retrieveCSS(sheet.getAttribute('href'))
            .then((sheetInfo) => {
                console.log('a')
                cleanCSS(sheetInfo.response).then((clean) => {
                    addCSS(JSON.parse(clean.response).clean);
                    sheet.remove();
                    beginDestruction();
                })
            })
    }
});

let styles = document.querySelectorAll('style');
styles.forEach(function (style) {
    cleanCSS(style.innerHTML).then((clean) => {
        addCSS(JSON.parse(clean.response).clean);
        style.remove();
        beginDestruction();
    })
});

const cssElement = document.createElement('style');
document.body.appendChild(cssElement);

const addCSS = css => {
    let tempLines = css.split('\n');
    let filteredLines = tempLines.filter((item, index) => {
        return item.indexOf('font-family') === -1
    })

    cssElement.innerHTML += filteredLines.join('\n');
    lines = cssElement.innerHTML.split('\n');
}

const removeLine = () => {
    for (let i = 0; i < config.maxAmountOfDestruction; i++) {
        const randomLineNum = Math.floor(Math.random() * lines.length);
        if (lines[randomLineNum].indexOf(':') != -1 && lines[randomLineNum].indexOf(';') != -1) {
            console.log(`removing: ${lines[randomLineNum]}`);
            lines.splice(randomLineNum, 1);
        }
    }

    cssElement.innerHTML = `* {transition: all ${config.speed / 1000 / 2}s;} ${lines.join('\n')}`;
}

const beginDestruction = () => {
    if (!startedRemoving) {
        startedRemoving = true;
        setInterval(removeLine, config.speed);
    }
}