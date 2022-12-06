function setup() {
  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");

  document.querySelector('#desenhar').onclick = function() {
    atualizarTela();
  }

  document.querySelector('#testar').onclick = function() {
    testar();
  }

  document.querySelector('#limpar').onclick = function() {
    novaTela();
  }

  document.querySelector('canvas').onmousemove = function(e) {
    let [x, y] = convertToCartesian([e.pageX - this.offsetLeft, e.pageY - this.offsetTop + 1]);
    document.querySelector('#mouseX').innerHTML = x;
    document.querySelector('#mouseY').innerHTML = y;
  };

  noLoop();
}

function draw() {
  novaTela();
}

function atualizarTela() {
  var inputX1 = document.querySelector("#xa");
  var inputY1 = document.querySelector("#ya");
  var inputX2 = document.querySelector("#xb");
  var inputY2 = document.querySelector("#yb");
  var algoritmo = document.querySelector("#algoritmo").value;
  var cor = document.querySelector("#cor").value;

  if(inputX1.value == "" || inputY1.value == "" || inputX2.value == "" || inputY2.value == "") {
    alert("Preencha todas as informações da reta.");
    return false;
  } else if(algoritmo == "") {
    alert("Escolha o algoritmo para o desenho da reta.");
    return false;
  }

  var x1 = int(inputX1.value);
  var y1 = int(inputY1.value);
  var x2 = int(inputX2.value);
  var y2 = int(inputY2.value);

  if(algoritmo == 'dda') {
    desenharReta(x1, y1, x2, y2, 'dda', cor);
  } else if(algoritmo == 'ponto-medio') {
    desenharReta(x1, y1, x2, y2, 'ponto-medio', cor);
  }
  
  updatePixels();
}

function testar() {
  novaTela();
  
  var cor = document.querySelector("#cor").value;
  var algoritmo = document.querySelector("#algoritmo").value;

  if(algoritmo == "") {
    alert("Escolha o algoritmo para o desenho das retas.");
    return false;
  }

  var max = 300;
  for(var i = 0; i <= max; i = i + 10) {
    desenharReta(0, 0, i, max, algoritmo, cor); // 1º octante
    desenharReta(0, 0, max, i, algoritmo, cor); // 2º octante
    desenharReta(0, 0, max, -i, algoritmo, cor); // 3º octante
    desenharReta(0, 0, i, -max, algoritmo, cor); // 4º octante
    desenharReta(0, 0, -i, -max, algoritmo, cor); // 5º octante    
    desenharReta(0, 0, -max, -i, algoritmo, cor); // 6º octante
    desenharReta(0, 0, -max, i, algoritmo, cor); // 7º octante
    desenharReta(0, 0, -i, max, algoritmo, cor); // 8º octante
    
    /*desenharReta(i, max, 0, 0, algoritmo, 'blue');
    desenharReta(max, i, 0, 0, algoritmo, 'blue');
    desenharReta(max, -i, 0, 0, algoritmo, 'blue');
    desenharReta(i, -max, 0, 0, algoritmo, 'blue');
    desenharReta(-i, -max, 0, 0, algoritmo, 'blue');
    desenharReta(-max, -i, 0, 0, algoritmo, 'blue');
    desenharReta(-max, i, 0, 0, algoritmo, 'blue');
    desenharReta(-i, max, 0, 0, algoritmo, 'blue');*/
  }
  updatePixels();
}