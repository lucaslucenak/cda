var opcaoSelecionada;
var sx, sy;
var tx, ty;
var botaoTransformar;
var botaoDesenhar;
var botaoLimpar;
var desenha = false;
var graus;
var eixoCisalhamento, valorCisalhamento;
var eixoRotacao, mReta, bReta;
var pontosX = [],
  pontosY;
var deixaRastro = false;
var sentido
var transforma = false

function setup() {
  var canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("#screen");
  botaoTransformar = select("#transformar");
  botaoTransformar.mousePressed(transformar);
  botaoDesenhar = select("#desenhar-figura");
  botaoDesenhar.mousePressed(desenhar);
  botaoLimpar = select('#limpar')
  botaoLimpar.mousePressed(limparTela)
  opcaoSelecionada = 'vazio'
  noLoop();
}

function draw() {
  novaTela();

  deixaRastro = document.querySelector("#deixa-rastro").checked;
  pontosX = getPontos("x-figura[]");
  pontosY = getPontos("y-figura[]");
  var matrizPonto = [pontosX, pontosY];
  var resultado = []

  if (desenha) {
    desenharFigura([pontosX, pontosY]);
  }

  if (opcaoSelecionada == "escala") {
    sx = Number(document.querySelector("#sx").value);
    sy = Number(document.querySelector("#sy").value);
    resultado = escala(matrizPonto, sx, sy,0, "2d");
  } 
  
  else if (opcaoSelecionada == "translacao") {
    tx = Number(document.querySelector("#tx").value);
    ty = Number(document.querySelector("#ty").value);
    resultado = translacao(matrizPonto, tx, ty , 0 , '2d');
  } 
  
  else if (opcaoSelecionada == "rotacao") {
     sentido = document.querySelector(
      'input[name="rotacao-sentido"]:checked'
    ).value;
    graus = Number(document.querySelector("#grausRotacao").value);

    if (sentido == "horario") {
       resultado = rotacaoHoraria(matrizPonto, graus, "2d");
    } else if (sentido == "antiHorario") {
       resultado = rotacaoAntiHoraria(matrizPonto, graus, "2d");
    }
  } 
  
  else if (opcaoSelecionada == "cisalhamento") {
     eixoCisalhamento = document.querySelector(
      'input[name="cisalhamento-eixo"]:checked'
    ).value;
     valorCisalhamento = Number(
      document.querySelector("#valorCisalhamento").value
    );

    if (eixoCisalhamento == "eixo-x") {
      resultado = cisalhamentoX(matrizPonto, valorCisalhamento, 0, "2d");
    } else if (eixoCisalhamento == "eixo-y") {
      resultado = cisalhamentoY(matrizPonto, 0,valorCisalhamento, "2d");
    }
  } 
  
  else if (opcaoSelecionada == "reflexao") {
    eixoRotacao = document.querySelector(
      'input[name="reflexao-eixo"]:checked'
    ).value;

    if (eixoRotacao == "eixo-x") {
       resultado = reflexaoX(matrizPonto, "2d");
    } else if (eixoRotacao == "eixo-y") {
      resultado = reflexaoY(matrizPonto, "2d");
    } else if (eixoRotacao == "eixo-reta") {
      mReta = Number(document.querySelector("#mReta").value);
      bReta = Number(document.querySelector("#bReta").value);
      var complemento = Array(pontosX.length).fill(0)
      matrizPonto = [pontosX, pontosY, complemento];
      desenharReta(-300, mReta * -300 + bReta, 300, mReta * 300 + bReta ,'ponto-medio' ,'#ffff00');

       resultado = reflexaoReta(matrizPonto, mReta, bReta);

    }

   
  }

  if(!deixaRastro && transforma) {
    novaTela()
  }

  if(transforma) {
    desenharFigura(resultado , 'green')
  }
  background(0);
  updatePixels();
  transforma = false
}

function desenhar() {
  desenha = true;
  draw();
}

function limparTela() {
  desenha = false
  transforma = false
  draw()
}

function transformar() {
  var dropdown = document.querySelector("#transformacoes-select");
  opcaoSelecionada = dropdown[dropdown.selectedIndex].value;
  transforma = true
  draw();
}

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

function mudarOpcoes() {
  var dropdown = document.querySelector("#transformacoes-select");
  var s = dropdown[dropdown.selectedIndex].value;
  var opcoes = document.querySelector("#opcoes-transformacao");
  while (opcoes.firstChild) {
    opcoes.removeChild(opcoes.lastChild);
  }




  if (s == "rotacao") {
    rotacaoOpcoesComponent();
  } else if (s == "translacao") {
    translacaoOpcoesComponent();
  } else if (s == "escala") {
    escalaOpcoesComponente();
  } else if (s == "cisalhamento") {
    cisalhamentoOpcoesComponent();
  } else if (s == "reflexao") {
    reflexaoOpcoesComponent();
  }
}

function limparOpcoes(opcoes) {
  while (opcoes.firstChild) {
    opcoes.removeChild(opcoes.lastChild);
  }
}

function rotacaoOpcoesComponent() {
  var dropdown = document.querySelector("#transformacoes-select");
  var s = dropdown[dropdown.selectedIndex].value;
  var opcoes = document.querySelector("#opcoes-transformacao");

  limparOpcoes(opcoes);

  var linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  var coluna1 = document.createElement("div"); 
  coluna1.setAttribute("class", "col");

  var linha2 = document.createElement("div");
  linha2.setAttribute("class", "row");
  var coluna2 = document.createElement("div"); 
  coluna2.setAttribute("class", "col");

  var grausInput = document.createElement("input");
  grausInput.setAttribute("placeholder", "Diga quantos graus");
  grausInput.setAttribute("id", "grausRotacao");
  grausInput.setAttribute("class", "form-control");

  var radioHorario = document.createElement("input");
  radioHorario.setAttribute("type", "radio");
  radioHorario.setAttribute("name", "rotacao-sentido");
  radioHorario.setAttribute("value", "horario");
  radioHorario.setAttribute("id", "horario");
  radioHorario.setAttribute("class", "mx-2");

  var radioAntiHorario = document.createElement("input");
  radioAntiHorario.setAttribute("type", "radio");
  radioAntiHorario.setAttribute("name", "rotacao-sentido");
  radioAntiHorario.setAttribute("value", "antiHorario");
  radioAntiHorario.setAttribute("id", "horario");
  radioAntiHorario.setAttribute("class", "mx-2");

  var labelHorario = document.createElement("label");
  labelHorario.textContent = "horario";
  labelHorario.setAttribute("for", "horario");

  var labelAntiHorario = document.createElement("label");
  labelAntiHorario.setAttribute("for", "antiHorario");
  labelAntiHorario.textContent = "Anti-horario";

  coluna1.appendChild(grausInput);
  coluna2.appendChild(radioHorario);
  coluna2.appendChild(labelHorario);
  coluna2.appendChild(radioAntiHorario);
  coluna2.appendChild(labelAntiHorario);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function translacaoOpcoesComponent() {
  var dropdown = document.querySelector("#transformacoes-select");
  var s = dropdown[dropdown.selectedIndex].value;
  var opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  var linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  var coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  var coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");

  var tx = document.createElement("input");
  tx.setAttribute("placeholder", "Diga TX");
  tx.setAttribute("id", "tx");
  tx.setAttribute("class", "form-control");

  var ty = document.createElement("input");
  ty.setAttribute("placeholder", "Diga TY");
  ty.setAttribute("id", "ty");
  ty.setAttribute("class", "form-control");

  coluna1.appendChild(tx);
  coluna2.appendChild(ty);

  linha1.appendChild(coluna1);
  linha1.appendChild(coluna2);

  opcoes.appendChild(linha1);
}

function escalaOpcoesComponente() {
  var dropdown = document.querySelector("#transformacoes-select");
  var s = dropdown[dropdown.selectedIndex].value;
  var opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  var linha = document.createElement("div");
  linha.setAttribute("class", "row");
  var coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");
  var coluna2 = document.createElement("div");
  coluna2.setAttribute("class", "col");

  var sx = document.createElement("input");
  sx.setAttribute("placeholder", "Diga SX");
  sx.setAttribute("id", "sx");
  sx.setAttribute("class", "form-control");

  var sy = document.createElement("input");
  sy.setAttribute("placeholder", "Diga SY");
  sy.setAttribute("id", "sy");
  sy.setAttribute("class", "form-control");

  coluna1.appendChild(sx);
  coluna2.appendChild(sy);

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);

  opcoes.appendChild(linha);
}

function cisalhamentoOpcoesComponent() {
  var dropdown = document.querySelector("#transformacoes-select");
  var s = dropdown[dropdown.selectedIndex].value;
  var opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  var linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  var coluna1 = document.createElement("div");
  coluna1.setAttribute("class", "col");

  var linha2 = document.createElement("div");
  linha2.setAttribute("class", "row");
  var coluna2 = document.createElement("div"); 
  coluna2.setAttribute("class", "col");

  var valorCisalhamento = document.createElement("input");
  valorCisalhamento.setAttribute("placeholder", "Diga valor cisalhamento");
  valorCisalhamento.setAttribute("id", "valorCisalhamento");
  valorCisalhamento.setAttribute("class", "form-control");

  var eixoX = document.createElement("input");
  eixoX.setAttribute("type", "radio");
  eixoX.setAttribute("name", "cisalhamento-eixo");
  eixoX.setAttribute("value", "eixo-x");
  eixoX.setAttribute("id", "cisalhamento-eixo-x");
  eixoX.setAttribute("class", "mx-2");

  var eixoY = document.createElement("input");
  eixoY.setAttribute("type", "radio");
  eixoY.setAttribute("name", "cisalhamento-eixo");
  eixoY.setAttribute("value", "eixo-y");
  eixoY.setAttribute("id", "cisalhamento-eixo-y");
  eixoY.setAttribute("class", "mx-2");

  var labelX = document.createElement("label");
  labelX.textContent = "Eixo X";
  labelX.setAttribute("for", "cisalhamento-eixo-x");

  var labelY = document.createElement("label");
  labelY.setAttribute("for", "cisalhamento-eixo-y");
  labelY.textContent = "Eixo Y";

  coluna1.appendChild(valorCisalhamento);
  coluna2.appendChild(eixoX);
  coluna2.appendChild(labelX);
  coluna2.appendChild(eixoY);
  coluna2.appendChild(labelY);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function reflexaoOpcoesComponent() {
  var dropdown = document.querySelector("#transformacoes-select");
  var s = dropdown[dropdown.selectedIndex].value;
  var opcoes = document.querySelector("#opcoes-transformacao");
  limparOpcoes(opcoes);

  var linha1 = document.createElement("div");
  linha1.setAttribute("class", "row");
  var coluna1 = document.createElement("div"); 
  coluna1.setAttribute("class", "col");
  var coluna2 = document.createElement("div"); 
  coluna2.setAttribute("class", "col");

  var linha2 = document.createElement("div");
  linha2.setAttribute("class", "row");
  var coluna3 = document.createElement("div"); 
  coluna3.setAttribute("class", "col");

  var eixoX = document.createElement("input");
  eixoX.setAttribute("type", "radio");
  eixoX.setAttribute("name", "reflexao-eixo");
  eixoX.setAttribute("value", "eixo-x");
  eixoX.setAttribute("id", "reflexao-eixo-x");
  eixoX.setAttribute('class', 'mx-2')

  var eixoY = document.createElement("input");
  eixoY.setAttribute("type", "radio");
  eixoY.setAttribute("name", "reflexao-eixo");
  eixoY.setAttribute("value", "eixo-y");
  eixoY.setAttribute("id", "relexao-eixo-y");
  eixoY.setAttribute('class', 'mx-2')

  var reta = document.createElement("input");
  reta.setAttribute("type", "radio");
  reta.setAttribute("name", "reflexao-eixo");
  reta.setAttribute("value", "eixo-reta");
  reta.setAttribute("id", "reflexao-eixo-reta");
  reta.setAttribute('class', 'mx-2')

  var mReta = document.createElement("input");
  mReta.setAttribute("placeholder", "Diga M da reta");
  mReta.setAttribute("id", "mReta");
  mReta.setAttribute("class", "form-control");

  var bReta = document.createElement("input");
  bReta.setAttribute("placeholder", "Diga B da reta");
  bReta.setAttribute("id", "bReta");
  bReta.setAttribute("class", "form-control");

  var labelX = document.createElement("label");
  labelX.textContent = "Eixo X";
  labelX.setAttribute("for", "reflexao-eixo-x");

  var labelY = document.createElement("label");
  labelY.setAttribute("for", "reflexao-eixo-y");
  labelY.textContent = "Eixo Y";

  var labelReta = document.createElement("label");
  labelReta.setAttribute("for", "reflexao-eixo-reta");
  labelReta.textContent = "Reta";

  coluna1.appendChild(eixoX);
  coluna1.appendChild(labelX);
  coluna1.appendChild(eixoY);
  coluna1.appendChild(labelY);
  coluna1.appendChild(reta);
  coluna1.appendChild(labelReta);
  coluna2.appendChild(mReta);
  coluna3.appendChild(bReta);

  linha1.appendChild(coluna1);
  linha2.appendChild(coluna2);
  linha2.appendChild(coluna3);

  opcoes.appendChild(linha1);
  opcoes.appendChild(linha2);
}

function removerCampo() {
  var linha = document.querySelector('#pontos-figura')
  var elementoRemover = linha.lastChild
  linha.removeChild(elementoRemover)
}

function adicionarCampo() {
  var container = document.querySelector('#pontos-figura')

  var linha = document.createElement('div')
  linha.setAttribute('class', 'row my-1 ')

  var coluna1 = document.createElement('div')
  coluna1.setAttribute('class', 'col')
  var coluna2 = document.createElement('div')
  coluna2.setAttribute('class', 'col')

  var novoCampoX = document.createElement('input')
  novoCampoX.setAttribute('name', 'x-figura[]')
  novoCampoX.setAttribute('class', 'form-control')
  novoCampoX.setAttribute('type', 'text')
  novoCampoX.setAttribute('placeholder', 'X do ponto')

  var novoCampoY = document.createElement('input')
  novoCampoY.setAttribute('name', 'y-figura[]')
  novoCampoY.setAttribute('class', 'form-control')
  novoCampoY.setAttribute('type', 'text')
  novoCampoY.setAttribute('placeholder', 'Y do ponto')

  coluna1.appendChild(novoCampoX)
  coluna2.appendChild(novoCampoY)

  linha.appendChild(coluna1)
  linha.appendChild(coluna2)

  container.appendChild(linha)

}