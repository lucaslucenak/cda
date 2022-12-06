var transformacoes;
var valores1;
var valores2;
var valores2;
var botaoTransformar;
var botaoDesenhar;
var botaoLimpar;
var transforma = false;
var desenha = false;
var deixaRatro = false;
var pontosX = [];
var pontosY = [];
var sx,
  sy,
  tx,
  ty,
  sentido,
  graus,
  valorCisalhamento,
  eixoCisalhamento,
  eixoRotacao;

function setup() {
  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  botaoTransformar = select("#transformar");
  botaoTransformar.mousePressed(transformar);
  botaoDesenhar = select("#desenhar-figura");
  botaoDesenhar.mousePressed(desenhar);
  botaoLimpar = select("#limpar");
  botaoLimpar.mousePressed(limparTela);
  opcaoSelecionada = "vazio";
  noLoop();
}

function draw() {
  novaTela();
  deixaRastro = document.querySelector("#deixa-rastro").checked;
  pontosX = getPontos("x-figura[]");
  pontosY = getPontos("y-figura[]");
  transformacoes = getValores("transformacoes[]");
  valores1 = getValores("valor1-transformacoes[]");
  valores2 = getValores("valor2-transformacoes[]");
  valores3 = getValores("valor3-transformacoes[]");

  // console.log('transformacoes : ' + transformacoes)
  // console.log('valores 1 :' + valores1)
  // console.log('valores 2 :' + valores2)

  var matrizPonto = [pontosX, pontosY];
  var resultado = [pontosX, pontosY];

  if (transforma) {
    for (let i = 0; i < transformacoes.length; i++) {
      var t = transformacoes[i].toLowerCase();

      if (t == "escala") {
        sx = Number(valores1[i]);
        sy = Number(valores2[i]);
        resultado = escala(resultado, sx, sy, 0, "2d");
      } else if (t == "translacao") {
        tx = Number(valores1[i]);
        ty = Number(valores2[i]);
        resultado = translacao(resultado, tx, ty, 0, "2d");
      } else if (t == "rotacao") {
        graus = Number(valores1[i]);
        sentido = valores2[i];

        if (sentido == "horario") {
          resultado = rotacaoHoraria(resultado, graus, "2d");
        } else if (sentido == "antihorario") {
          resultado = rotacaoAntiHoraria(resultado, graus, "2d");
        }
      } else if (t == "cisalhamento") {
        valorCisalhamento = Number(valores1[i]);
        eixoCisalhamento = valores2[i];

        if (eixoCisalhamento == "x") {
          resultado = cisalhamentoX(resultado, valorCisalhamento, 0, "2d");
        } else if (eixoCisalhamento == "y") {
          resultado = cisalhamentoY(resultado, 0, valorCisalhamento, "2d");
        }
      } else if (t == "reflexao") {
        eixoRotacao = valores1[i];
        if (eixoRotacao == "x") {
          resultado = reflexaoX(resultado, "2d");
        } else if (eixoRotacao == "y") {
          resultado = reflexaoY(resultado, "2d");
        } else if (eixoRotacao == "reta") {
          mReta = Number(valores2[i]);
          bReta = Number(valores3[i]);
          var complemento = Array(pontosX.length).fill(0);
          resultado = [resultado[0], resultado[1], complemento];
          desenharReta(
            -300,
            mReta * -300 + bReta,
            300,
            mReta * 300 + bReta,
            "blue"
          );

          resultado = reflexaoReta(resultado, mReta, bReta);
        }
      }
    }
  }

  if (desenha) {
    desenharFigura([pontosX, pontosY]);
  }

  if (!deixaRastro && transforma) {
    novaTela();
  }

  if (transforma) {
    desenharFigura(resultado, "green");
  }
  background(0);
  updatePixels();
  transforma = false;
}

function desenhar() {
  desenha = true;
  draw();
}

function transformar() {
  transforma = true;
  draw();
}

function limparTela() {
  desenha = false;
  transforma = false;
  draw();
}

//   function transformar() {
//     var dropdown = document.querySelector("#transformacoes-select");
//     opcaoSelecionada = dropdown[dropdown.selectedIndex].value;
//     transforma = true
//     draw();
//   }

function getPontos(nome) {
  var input = document.getElementsByName(nome);
  var pontos = [];

  for (var i = 0; i < input.length; i++) {
    var a = input[i];
    var k = Number(a.value);
    pontos.push(k);
  }

  return pontos;
}

function getValores(nome) {
    var input = document.getElementsByName(nome);
    var pontos = [];
  
    for (var i = 0; i < input.length; i++) {
      var a = input[i];
      var k = a.value;
      pontos.push(k);
    }
  
    return pontos;
  }


function removerCampo() {
  var linha = document.querySelector("#pontos-figura");
  var elementoRemover = linha.lastChild;
  linha.removeChild(elementoRemover);
}

function adicionarCampo() {
  var container = document.querySelector("#pontos-figura");

  var linha = document.createElement("div");
  linha.setAttribute("class", "row");

  var coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  var coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");

  var novoCampoX = document.createElement("input");
  novoCampoX.setAttribute("name", "x-figura[]");
  novoCampoX.setAttribute("class", "form-control");
  novoCampoX.setAttribute("type", "text");
  novoCampoX.setAttribute("placeholder", "X do ponto");

  var novoCampoY = document.createElement("input");
  novoCampoY.setAttribute("name", "y-figura[]");
  novoCampoY.setAttribute("class", "form-control");
  novoCampoY.setAttribute("type", "text");
  novoCampoY.setAttribute("placeholder", "Y do ponto");

  coluna1.appendChild(novoCampoX);
  coluna2.appendChild(novoCampoY);

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);

  container.appendChild(linha);
}

function removerCampoTransformacao() {
  var linha = document.querySelector("#opcoes-transformacao");
  var elementoRemover = linha.lastChild;
  linha.removeChild(elementoRemover);
}

function adicionarCampoTransformacao() {
  var container = document.querySelector("#opcoes-transformacao");

  var linha = document.createElement("div");
  linha.setAttribute("class", "row");

  var coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  var coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");
  var coluna3 = document.createElement("div");
  coluna3.setAttribute("class", "col");
  var coluna4 = document.createElement("div");
  coluna4.setAttribute("class", "col");

  var novoCampoTransformacao = document.createElement("input");
  novoCampoTransformacao.setAttribute("name", "transformacoes[]");
  novoCampoTransformacao.setAttribute("class", "form-control");
  novoCampoTransformacao.setAttribute("type", "text");
  novoCampoTransformacao.setAttribute("placeholder", "Transformacao");

  var novoCampo1 = document.createElement("input");
  novoCampo1.setAttribute("name", "valor1-transformacoes[]");
  novoCampo1.setAttribute("class", "form-control");
  novoCampo1.setAttribute("type", "text");
  novoCampo1.setAttribute("placeholder", "Valor 1");

  var novoCampo2 = document.createElement("input");
  novoCampo2.setAttribute("name", "valor2-transformacoes[]");
  novoCampo2.setAttribute("class", "form-control");
  novoCampo2.setAttribute("type", "text");
  novoCampo2.setAttribute("placeholder", "Valor 2");

  var novoCampo3 = document.createElement("input");
  novoCampo3.setAttribute("name", "valor3-transformacoes[]");
  novoCampo3.setAttribute("class", "form-control");
  novoCampo3.setAttribute("type", "text");
  novoCampo3.setAttribute("placeholder", "Valor 3");

  coluna1.appendChild(novoCampoTransformacao);
  coluna2.appendChild(novoCampo1);
  coluna3.appendChild(novoCampo2);
  coluna4.appendChild(novoCampo3);

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);
  linha.appendChild(coluna3);
  linha.appendChild(coluna4);

  container.appendChild(linha);
}
