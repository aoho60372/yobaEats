var btnStats = document.querySelector('.stats__title');
var btnInfo = document.querySelector('.info__title');
var btnOpts = document.querySelector('.opts__title');
var fieldStats = document.querySelector('.header__stats');
var fieldInfo = document.querySelector('.header__info');
var fieldOpts = document.querySelector('.header__opts');
var textField = document.querySelector("h1");
var body = document.querySelector('body');

var arrayBtns = [btnStats, btnInfo, btnOpts];
var arrayFields = [fieldStats, fieldInfo, fieldOpts];
var arrayFull = document.getElementsByClassName('-js-checking');

var check = 0;

function toggleMenus() {
    for (var i = 0; i <= 2; i++){
        if (i === arrayBtns.indexOf(this)){
            arrayBtns[i].classList.toggle('-js-button-pressed');
            arrayBtns[i].classList.toggle('--button');
            arrayFields[arrayBtns.indexOf(this)].classList.toggle('-js-not-display');
        } else {
            arrayFields[i].classList.add('-js-not-display');
            arrayBtns[i].classList.remove('-js-button-pressed');
            arrayBtns[i].classList.add('--button');
        }
    }
}

btnStats.addEventListener('click', toggleMenus);
btnInfo.addEventListener('click', toggleMenus);
btnOpts.addEventListener('click', toggleMenus);

body.onclick = function(e) {
    for (var i = 0; i <= arrayFull.length; i++){
        if(e.target === arrayFull[i]) {
            check = 1;
        }
    }

    if (check !== 1){
        for (var i = 0; i <= 2; i++){
            arrayBtns[i].classList.remove('-js-button-pressed');
            arrayBtns[i].classList.add('--button');
            arrayFields[i].classList.add('-js-not-display');
        }
    }

    check = 0;
}