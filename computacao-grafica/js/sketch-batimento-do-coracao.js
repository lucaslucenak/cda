var ecg;


var posicaoInicial,
  batimento_maximo = 100,
  batimento_minimo = 30,
  distancia_batimentos = 20,
  distancia_batimento = 10;
var sliderIdade, sliderSituacao;
var idade, situacao;

var frequencias = {
  20: { min: 100, max: 170 },
  25: { min: 100, max: 170 },
  30: { min: 95, max: 162 },
  35: { min: 93, max: 157 },
  40: { min: 90, max: 153 },
  45: { min: 88, max: 149 },
  50: { min: 85, max: 145 },
  55: { min: 83, max: 140 },
  60: { min: 80, max: 136 },
  65: { min: 78, max: 132 },
  70: { min: 75, max: 128 },
};

var situacoes = {
  0: 90,
  1: 70,
  2: 30,
  3: 20,
  4: 10,
};

class Ponto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function setup() {
  var canvas = createCanvas(900, 450);
  canvas.parent("#screen");
  frameRate(30);

  sliderIdade = document.querySelector("#slider-idade");
  sliderSituacao = document.querySelector("#slider-situacao");
  idade = sliderIdade.value;
  situacao = sliderSituacao.value;
  posicaoInicial = new Ponto(0, height / 2);
  ecg = new ECG(posicaoInicial, 100, 30, 20, 10);
  ecg.criarPontos();
}

function draw() {
  background(0);
  idade = sliderIdade.value;
  situacao = sliderSituacao.value;
  batimento_minimo = frequencias[idade]["min"];
  batimento_maximo = frequencias[idade]["max"];
  distancia_batimentos = situacoes[situacao];
  ecg.mostrarPontos();
}

class ECG {
  constructor() {
    this.pontos = [];

    this.indicePontoAtual = 0;

    this.criarPontos = function () {
      this.pontos.push(posicaoInicial);

      for (var i = 1; i < floor(width / distancia_batimento); i++) {
        var ponto_anterior = Object.assign({}, this.pontos[i - 1]);

        if (i % distancia_batimentos == 0) {
          var random_pontoInferior = floor(
            random(
              ponto_anterior.y - batimento_minimo,
              ponto_anterior.y - batimento_maximo
            )
          );
          var random_pontoSuperior = floor(
            random(
              ponto_anterior.y + batimento_minimo,
              ponto_anterior.y + batimento_maximo
            )
          );

          var pontoInferior = new Ponto(
            ponto_anterior.x + distancia_batimento,
            random_pontoInferior
          );
          this.pontos.push(pontoInferior);

          var pontoSuperior = new Ponto(
            pontoInferior.x + distancia_batimento,
            random_pontoSuperior
          );
          this.pontos.push(pontoSuperior);
          i++;
        } else {
          //
          var point = new Ponto(
            ponto_anterior.x + distancia_batimento,
            posicaoInicial.y
          );
          this.pontos.push(point);
        }
      }
    };

    this.reset = function () {
      this.pontos = [];
      this.criarPontos();

      this.indicePontoAtual = 0;
    };

    this.mostrarPontos = function () {
      stroke(0, 156, 0);
      strokeWeight(1);
      noFill();
      for (var i = 1; i < this.indicePontoAtual; i++) {
        desenharRetaBatimento(
          this.pontos[i - 1].x,
          this.pontos[i - 1].y,
          this.pontos[i].x,
          this.pontos[i].y,
          'ponto-medio'
        );
      }
      this.indicePontoAtual++;

      if (this.indicePontoAtual >= this.pontos.length) {
        this.reset();
      }
    };
  }
}
