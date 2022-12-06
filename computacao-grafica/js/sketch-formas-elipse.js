var botaoDesenharElipse;
var botaoLimparTela;
var desenhaElipse;
var xOrigem, yOrigem, raioX, raioY;
var dropdown;
var opcaoSelecionada;

function setup() {
  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  botaoDesenharElipse = select("#desenhar-elipse");
  botaoDesenharElipse.mousePressed(desenharElipse);
  botaoLimparTela = select("#limpar");
  botaoLimparTela.mousePressed(limparTela);
  desenhaElipse = false;
  noLoop();
}

function draw() {
  novaTela();

  dropdown = document.querySelector("#algoritmo");
  opcaoSelecionada = dropdown[dropdown.selectedIndex].value;

  if (desenhaElipse) {
    if (opcaoSelecionada == "ponto-medio") {
      xOrigem = Number(document.querySelector("#x_origem").value);
      yOrigem = Number(document.querySelector("#y_origem").value);
      raioX = Number(document.querySelector("#raio_x").value);
      raioY = Number(document.querySelector("#raio_y").value);
      desenharElipsePontoMedio(xOrigem, yOrigem, raioX, raioY);
    }
  }

  background(0);
  updatePixels();
}

function desenharElipse() {
  desenhaElipse = true;
  draw();
}

function limparTela() {
  desenhaElipse = false;
  draw();
}

