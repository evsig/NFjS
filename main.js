const   score = document.querySelector('.score'),
        start = document.querySelector('.start'),
        gameArea = document.querySelector('.gameArea'),
        car = document.createElement('div');
        car.classList.add('car');

start.addEventListener('click', startGame);
score.addEventListener('click', stopGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3 //кол-во машин(сложность)
};

/*по высоте элемента вычисляется их кол-во на странице*/
function getQuantityElements(heightElement){
    return Math.ceil(gameArea.offsetHeight / heightElement);
    //return document.documentElement.clientHeight / heightElement + 1;
}

function startGame(){
    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.top = 'auto';
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    for (let i = 0; i < getQuantityElements(100) + 1; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 1 + 'px'; //расстояние между линиями
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        let enemyImg = Math.floor(Math.random() * 4) + 1;
        console.log('enemyImg: ', enemyImg);
        enemy.y = -100 * setting.traffic * (i+1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(./image/enemy' + enemyImg + '.png) center / cover no-repeat';
        console.log('enemy.style.background: ', enemy.style.background);
        gameArea.appendChild(enemy);

    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft; //left - значение css
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (setting.start){

        if (keys.ArrowLeft && setting.x > 0){        //если зажата >
            setting.x -= setting.speed;            //двигаем по х влево
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }
        
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);  
    }
}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed; //движение дорожной разметки
        line.style.top = line.y + 'px'; //
    if (line.y >= document.documentElement.clientHeight) {//когда линия скрывается за высоту экрана
        line.y = -100;}
});
}

function stopGame() {
    setting.start = false;
    start.classList.remove('hide');
    start.style.top = score.offsetHeight;
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    
    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&  //условия столкновения
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
                stopGame();
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });


}