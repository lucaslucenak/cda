var x1, y1, x2, y2;
var xmin, ymin, xmax, ymax;
var xRetangulo, yRetangulo, largura, altura;
var desenhaJanela = false;
var desenhaReta = false;
var recortaReta = false;

var botaoDesenharJanela;
var botaoDesenharReta;
var botaoRecortar;
var botaoLimparTela;

function setup() {
  botaoDesenharJanela = select("#desenhar-janela");
  botaoDesenharJanela.mousePressed(desenharJanelaTela);

  botaoDesenharReta = select("#desenhar-reta");
  botaoDesenharReta.mousePressed(desenharRetaTela);

  botaoRecortar = select("#recortar");
  botaoRecortar.mousePressed(recortarRetaTela);

  botaoLimparTela = select("#limpar");
  botaoLimparTela.mousePressed(limparTela);

  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  noLoop();
}

function draw() {
  novaTela();
  x1 = Number(select("#reta_xa").value());
  y1 = Number(select("#reta_ya").value());
  x2 = Number(select("#reta_xb").value());
  y2 = Number(select("#reta_yb").value());

  xRetangulo = Number(select("#retangulo_x").value());
  yRetangulo = Number(select("#retangulo_y").value());
  largura = Number(select("#retangulo_w").value());
  altura = Number(select("#retangulo_h").value());

  if (desenhaJanela) {
    desenharRetangulo(xRetangulo, yRetangulo, largura, altura);
  }

  if (desenhaReta) {
    desenharReta(x1, y1, x2, y2 , 'ponto-medio' , '#00ff00');
  }

  if (recortaReta) {
    xmin = xRetangulo;
    ymin = yRetangulo;
    xmax = xRetangulo + largura;
    ymax = yRetangulo + altura;

    var resultado = cohenSutherland(x1, y1, x2, y2, xmin, ymin, xmax, ymax);
    if (resultado != null) {
      x1 = resultado[0];
      y1 = resultado[1];
      x2 = resultado[2];
      y2 = resultado[3];
      desenharReta(x1, y1, x2, y2 , 'ponto-medio' , '#00ff00');
    }
  }

  updatePixels();
}

function desenharJanelaTela() {
  desenhaJanela = true;
  draw();
}

function desenharRetaTela() {
  desenhaReta = true;
  draw();
}

function recortarRetaTela() {
  desenhaReta = false;
  recortaReta = true;
  draw();
}

function limparTela() {
  desenhaReta = false;
  recortaReta = false;
  desenhaJanela = false;

  x1 = select("#reta_xa").value('');
  y1 = select("#reta_ya").value('');
  x2 = select("#reta_xb").value('');
  y2 = select("#reta_yb").value('');

  xRetangulo = select("#retangulo_x").value('');
  yRetangulo = select("#retangulo_y").value('');
  largura = select("#retangulo_w").value('');
  altura = select("#retangulo_h").value('');
  draw();
}
