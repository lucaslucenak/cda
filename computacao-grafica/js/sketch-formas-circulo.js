var botaoDesenharCircunferencia;
var botaoLimparTela;
var desenhaCircunferencia;
var xOrigem, yOrigem, raio;
var dropdown;
var opcaoSelecionada;

function setup() {
  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  botaoDesenharCircunferencia = select("#desenhar-circunferencia");
  botaoDesenharCircunferencia.mousePressed(desenharCircunferencia);
  botaoLimparTela = select("#limpar");
  botaoLimparTela.mousePressed(limparTela);
  desenhaCircunferencia = false;
  noLoop();
}

function draw() {
  novaTela();

  dropdown = document.querySelector("#algoritmo");
  opcaoSelecionada = dropdown[dropdown.selectedIndex].value;

  if (desenhaCircunferencia) {
    xOrigem = Number(document.querySelector("#x_origem").value);
    yOrigem = Number(document.querySelector("#y_origem").value);
    raio = Number(document.querySelector("#raio").value);
    if (opcaoSelecionada == "ponto-medio") {
      desenharCircunferenciaPontoMedio(xOrigem, yOrigem, raio);
    } else if (opcaoSelecionada == "equacao-explicita") {
      desenharCircunferenciaEquacaoExplicita(xOrigem, yOrigem, raio);
    } else if (opcaoSelecionada == "metodo-trigonometrico") {
      desenharCircunferenciaMetodoTrigonometrico(xOrigem, yOrigem, raio);
    }
  }

  background(0);
  updatePixels();
}

function desenharCircunferencia() {
  desenhaCircunferencia = true;
  draw();
}

function limparTela() {
  desenhaCircunferencia = false;
  draw();
}

