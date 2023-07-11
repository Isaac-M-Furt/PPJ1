const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const vida_paragraph = document.getElementById('vida');
const pontos_paragraph = document.getElementById('pontos');

const jogador = {
    x:window.innerWidth/2 - 40,
    y:window.innerHeight - 40,
    width:40,
    height:40,
}

const settings = {
    velocidadeJogador: 20,
    velocidadeJogadorY: 15,
    spawnDelay: 100,
    pontoDelay: 2800,
    gravidade: 5,
}

const spawnState = {
    lastSpawn:0,
    lastDate:0,
    lastPonto:0,
    lastPontodate:0,
}

const gameState = {
    vida: 5,
    ponto: 0,
    iniciar: false
}

const eventos = {
    cpt: "colisaoponto",
    cvd: "colisaovida"
}

let objectsArray = [];
let pontoArray = [];

// function resetGame(){
//     jogador ={
//         x:window.innerWidth/2 - 40,
//         y:window.innerHeight - 40,
//         width:40,
//         height:40,
//     }
//     spawnState ={
//         lastSpawn:0,
//         lastDate:0,
//         lastPonto:0,
//         lastPontodate:0,
//     }
//     gameState = {
//         vida: 5,
//         ponto: 0,
//         iniciar: false
//     }
//     objectsArray = [];
//     pontoArray = [];
//     pontos_paragraph.innerHTML = 0;
//     vida_paragraph.innerHTML = 5;

//     resetCanvas();
//     desenhaJogador();

// }

function init(){
    resizeCanvas();
    resetCanvas();
    comandos();
    alert("Aperte Enter para iniciar! Desvie dos vermelhos, colete os dourados!")
    avisa();
    run();
    window.requestAnimationFrame(gameLoop);
}

//State
var estado = function () {
    var currentState = new f1(this);

    this.start = function () {
        //currentState.go();
        if(gameState.ponto>2 && gameState.ponto<6){
            console.log("f2")
            currentState = f2();
        }else if(gameState.ponto>5){
            console.log("f3")
            currentState = f3();
        }
    };
}

var f1 = function (fase) {
    this.fase = fase;
    settings.gravidade = 3;
    settings.spawnDelay = 500;
    settings.pontoDelay = 3200;
};

var f2 = function (fase) {
    this.fase = fase;
    settings.gravidade = 5;
    settings.spawnDelay = 300;
    settings.pontoDelay = 2800;

};

var f3 = function (fase) {
    this.fase = fase;
    settings.spawnDelay = 100;
    settings.gravidade = 7;
};

function run() {
    var fase = new estado();
    fase.start();
    console.log(fase.currentState)
}

function comandos(){
    window.addEventListener('keydown', (e) => {
        if(e.code == 'ArrowLeft'){
            movJogador(-settings.velocidadeJogador);
        } else if(e.code == 'ArrowRight'){
            movJogador(settings.velocidadeJogador);
        } else if(e.code == 'ArrowUp'){
            sobeJogador(-settings.velocidadeJogadorY);
        } else if(e.code == 'ArrowDown'){
            sobeJogador(settings.velocidadeJogadorY);
        } else if(e.code == 'Enter'){
            gameState.iniciar = true;
        }
    })
}

function movJogador(valor){
    const posJogador = jogador.x+valor;
    if(posJogador>canvas.width-jogador.width || posJogador<0){
        return;
    }
    jogador.x = posJogador;
}

function sobeJogador(valor){
    const posJogadorY = jogador.y+valor;
    if(posJogadorY<0 || posJogadorY > canvas.height-jogador.height){
        return;
    }
    jogador.y = posJogadorY;
}

function gameLoop(){
    if(gameState.iniciar){
        resizeCanvas();
        resetCanvas();
        desenhaJogador();
        spawner();
        posObject();
        desenhaObjects();
        colisoes();
    }

    window.requestAnimationFrame(gameLoop);

}

function desenhaJogador(){
        ctx.fillStyle  = "blue";
        ctx.beginPath();
        ctx.moveTo(jogador.x+jogador.width/2, jogador.y);
        ctx.lineTo(jogador.x+jogador.width, jogador.y+jogador.height);
        ctx.lineTo(jogador.x, jogador.y+jogador.height);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.stroke();
}

//Observer
function subject(){
    this.observers = [];
}

subject.prototype = {
    addObserver: function(obs){
        this.observers.push(obs);
    },
    notify: function (o, thisObj) {
        let scope = thisObj || window;
        this.observers.forEach(function (item) {
            item.call(scope, o);
        });
    }
}

function avisa(evt){
    let achiev = function (item) {
        if(item == eventos.cvd){
            console.log("perdeu vida");
            gameState.vida--;
            vida_paragraph.innerHTML = gameState.vida;
        } else if(item == eventos.cpt){
            console.log("Pontuou!")
            gameState.ponto++;
            run();
            pontos_paragraph.innerHTML = gameState.ponto;
        }
    };
    let event = new subject();
    event.addObserver(achiev);
    event.notify(evt);
}

//Prototype
function spawner(){
    if(spawnState.lastSpawn > settings.spawnDelay){
        objectsArray.push({
            id: new Date().getTime(),
            x:Math.floor(Math.random() * (canvas.width-15)),
            y:40,
            width:10,
            height:30,
        });
        spawnState.lastSpawn = 0;
        return;
    } 
    if(spawnState.lastPonto > settings.pontoDelay){
        pontoArray.push({
            id: new Date().getTime(),
            x:Math.floor(Math.random() * (canvas.width-35)),
            y:40,
            width:30,
            height:30,
        });
        spawnState.lastPonto = 0;
        return;
    }
    const agora = new Date().getTime();
    spawnState.lastSpawn += agora - spawnState.lastDate;
    spawnState.lastPonto += agora - spawnState.lastDate;
    spawnState.lastDate = agora;
    
}

function posObject(){
    objectsArray.forEach(object =>{
        object.y += settings.gravidade;
    });
    objectsArray = objectsArray.filter(object => object.y <canvas.height);
    
    pontoArray.forEach(ponto =>{
        ponto.y += settings.gravidade/2;
    });
    pontoArray = pontoArray.filter(ponto => ponto.y < canvas.height);   
}

function desenhaObjects(){
    objectsArray.forEach(object =>{
        ctx.fillStyle = 'red';
        ctx.fillRect(object.x, object.y,object.width,object.height);
    });
    pontoArray.forEach(ponto =>{
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(ponto.x+ponto.width/2, ponto.y);
        ctx.lineTo(ponto.x+ponto.width, ponto.y+ponto.height/2);
        ctx.lineTo(ponto.x+ponto.width/2, ponto.y+ponto.height);
        ctx.lineTo(ponto.x, ponto.y+ponto.height/2);
        ctx.lineTo(ponto.x+ponto.width/2, ponto.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "yellow";
        ctx.stroke();

    })

}

function colisoes(){
    objectsArray.forEach(object =>{
        if(
            object.x < jogador.x + jogador.width &&
            object.x + object.width > jogador.x &&
            object.y < jogador.y + jogador.height &&
            object.y + object.height > jogador.y
        ){
            objectsArray = objectsArray.filter(obj => obj.id !== object.id)
            if(gameState.vida <= 1){
                
                setTimeout(function(){
                    alert("Você perdeu, tente outra vez!")
                    location.replace(location.href)
                }, 200)
            }
            avisa(eventos.cvd);
            
        }
    })

    pontoArray.forEach(ponto =>{
        if(
            ponto.x < jogador.x + jogador.width &&
            ponto.x + ponto.width > jogador.x &&
            ponto.y < jogador.y + jogador.height &&
            ponto.y + ponto.height > jogador.y
        ){
            pontoArray = pontoArray.filter(pnt => pnt.id !== ponto.id)
            if(gameState.ponto >= 9){
                
                setTimeout(function(){
                    alert("Você venceu!");
                    location.replace(location.href)
                }, 200)
                ;
            }
            avisa(eventos.cpt);
            
        }
    })
}

function resetCanvas(){
    ctx.fillStyle = "gray";
    ctx.fillRect(0,0,canvas.width,canvas.height);

}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


init();