// tamanho da tela
const LARGURA = 600;
const ALTURA = 600;

// intervalo de entrada
const INTERVALO_X_INPUT = [-parseInt(LARGURA / 2), parseInt(LARGURA / 2)];
const INTERVALO_Y_INPUT = [-parseInt(ALTURA / 2), parseInt(ALTURA / 2)];

// intervalo NDC: [-1, 1] para X e Y
const INTERVALO_X_NDC = [-1, 1];
const INTERVALO_Y_NDC = [-1, 1];

// resolução de saída DC (screen)
const INTERVALO_X_DC = [0, LARGURA];
const INTERVALO_Y_DC = [0, ALTURA];

// Criar nova Tela
function novaTela() {
  // limpa objetos da tela
  clear();

  // altera a cor do plano de fundo do gráfico
  background(0);

  // limpa os pixels
  loadPixels();
  pixels = [];

  // desenha eixo x
  desenharReta(
    parseInt(LARGURA / 2),
    0,
    -parseInt(LARGURA / 2),
    0,
    "ponto-medio",
    "#ccc"
  );

  // desenha eixo y
  desenharReta(
    0,
    -parseInt(ALTURA / 2),
    0,
    parseInt(ALTURA / 2),
    "ponto-medio",
    "#ccc"
  );

  // atualiza os pixels
  updatePixels();
}

// Desenhar retangulo na tela
function desenharRetangulo(xOrigem , yOrigem , largura, altura , cor = 'red') {
    var x = 0
    var y = 1
    
    var ponto1 = [xOrigem , yOrigem]
    var ponto2 = [xOrigem + largura , yOrigem]
    var ponto3 = [xOrigem + largura , yOrigem + altura]
    var ponto4 = [xOrigem , yOrigem + altura]

    var pontos = getRetaDDA(ponto1[x] , ponto1[y] , ponto2[x] , ponto2[y])
    pontos = pontos.concat( getRetaDDA(ponto2[x] , ponto2[y] , ponto3[x],ponto3[y]))
    pontos = pontos.concat( getRetaDDA(ponto3[x] , ponto3[y] , ponto4[x],ponto4[y]))
    pontos = pontos.concat( getRetaDDA(ponto4[x] , ponto4[y] , ponto1[x],ponto1[y]))


    pontos.forEach(function (ponto, i) {
        desenharPixel(ponto[0], ponto[1], cor);
    });
}

// Desenhar Figura na tela
function desenharFigura(pontos , cor ='red') {
  var pontosLigados = [  getPontosLigados(pontos[0]) , getPontosLigados(pontos[1]) ]
  var pontosX = []
  var pontosY = []
  var pontos = []
  
  for(let i = 0 ; i < pontosLigados[0].length ; i++) {
     pontosX.push( getPontosLigados(      pontosLigados[0][i])[0]          )
     pontosY.push( getPontosLigados(      pontosLigados[1][i]  )  [0]        )
  }
  for(let i = 0 ; i < pontosX.length ; i++ ) {
    pontos = pontos.concat( getRetaDDA(pontosX[i][0] , pontosY[i][0] , pontosX[i][1],pontosY[i][1]))
  }

  pontos.forEach(function (ponto, i) {
      desenharPixel(ponto[0], ponto[1], cor);
  });


}

// Determinar qual ponto deve esta ligado a qual no desenhar figura
function getPontosLigados(lista) {
  var resultado = []
  for(let i = 0 ; i < lista.length ; i++) { 
    resultado.push([ lista[i] ,lista[ (i + 1) % lista.length]] )
  }

  return resultado

}

// Desenhar Reta na tela
function desenharReta(xa, ya, xb, yb, algoritmo = "ponto-medio", cor = "red") {
  let pontos = [];

  if (algoritmo == "ponto-medio") {
    pontos = getRetaPontoMedio(xa, ya, xb, yb);
  } else if ("dda") {
    pontos = getRetaDDA(xa, ya, xb, yb);
  } else {
    return false;
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar Pixel na tela
function desenharPixel(x, y, cor = "red") {
  [x, y] = convertToCartesian([x, y]);
  set(x, y, color(cor));
}

// Calcular variacao de delta
function getDelta(a, b) {
  return a - b;
}

// Calcular reta utilizado algoritmo do ponto médio
function getRetaPontoMedio(x0, y0, x1, y1) {
  [x0, y0] = [round(x0), round(y0)];
  [x1, y1] = [round(x1), round(y1)];
  let [x,y] = [x0,y0];

  // incrementa ou decrementa
  let incX = x1 > x0 ? 1 : x1 < x0 ? -1 : 0;
  let incY = y1 > y0 ? 1 : y1 < y0 ? -1 : 0;

  // variacao de x e y
  let dx = abs(x1 - x0);
  let dy = abs(y1 - y0);
  
  let steep = false;

  // declive da reta
  if(dy > dx) {
    steep = true;
    [x,y] = [y,x];
    [dx,dy] = [dy,dx];
    [incX,incY] = [incY,incX];
  }

  // dstart
  let d = dx - (2 * dy);
  
  const pontos = [];

  if (steep) {
    pontos.push([y, x]);
  } else {
    pontos.push([x, y]);
  }

  for(let count = 1; count <= dx; ++count) {
    if(d <= 0) {
      y += incY;
      d += 2 * dx;
    }

    x += incX;
    d -= 2 * dy;

    if (steep) {
      pontos.push([y, x]);
    } else {
      pontos.push([x, y]);
    }
  }
  
  return pontos;
}

// Calcular reta utilizado Algoritmo DDA
function getRetaDDA(x0, y0, xEnd, yEnd) {
  var pontos = [];

  let dx = xEnd - x0,
    dy = yEnd - y0,
    steps,
    k;
  let xIncrement,
    yIncrement,
    x = x0,
    y = y0;

  //declive
  if (abs(dx) > abs(dy)) {
    steps = abs(dx);
  } else {
    steps = abs(dy);
  }

  //incremento
  xIncrement = float(dx) / float(steps);
  yIncrement = float(dy) / float(steps);

  pontos.push([x, y]);

  for (k = 0; k < steps; k++) {
    x += xIncrement;
    y += yIncrement;
    pontos.push([x, y]);
  }

  return pontos;
}

function to_ndc(ponto, intervalo_x, intervalo_y) {
  let [x, y] = ponto;
  let [xmin, xmax] = intervalo_x;
  let [ymin, ymax] = intervalo_y;
  let [ndcxmin, ndcxmax] = INTERVALO_X_NDC;
  let [ndcymin, ndcymax] = INTERVALO_Y_NDC;

  // fórmula completa para calcular o NDC
  ndcx = ((x - xmin) * (ndcxmax - ndcxmin)) / (xmax - xmin) + ndcxmin;
  ndcy = ((y - ymin) * (ndcymax - ndcymin)) / (ymax - ymin) + ndcymin;

  // fórmula reduzida do NDC
  ndcx_aux = (x - xmin) / (xmax - xmin);
  ndcy_aux = (y - ymin) / (ymax - ymin);

  return [ndcx, ndcy, ndcx_aux, ndcy_aux];
}

function to_coordinates(ponto, intervalo_x, intervalo_y) {
  let [ndcx, ndcy, ndcx_aux, ndcy_aux] = ponto;
  let [xmin, xmax] = intervalo_x;
  let [ymin, ymax] = intervalo_y;
  let [ndh, ndv] = [xmax - xmin, ymax - ymin];

  dcx = round(ndcx_aux * (ndh - 1));
  dcy = round(ndcy_aux * (ndv - 1));

  return [dcx, dcy];
}

function inp_to_ndc(ponto) {
  return to_ndc(ponto, INTERVALO_X_INPUT, INTERVALO_Y_INPUT);
}

function ndc_to_user(ponto) {
  return to_coordinates(ponto, INTERVALO_X_USER, INTERVALO_Y_USER);
}

function user_to_ndc(ponto) {
  return to_ndc(ponto, INTERVALO_X_USER, INTERVALO_Y_USER);
}

function ndc_to_dc(ponto) {
  return to_coordinates(ponto, INTERVALO_X_DC, INTERVALO_Y_DC);
}

function inp_to_dc(ponto) {
  return ndc_to_dc(inp_to_ndc(ponto));
}

function convertToCartesian(point) {
  let [pointScreenX, pointScreenY] = [point[0], point[1]];
  let [screenXMin, screenXMax] = INTERVALO_X_DC;
  let [screenYMin, screenYMax] = INTERVALO_Y_DC;
  let [screenWidth, screenHeight] = [
    screenXMax - screenXMin,
    screenYMax - screenYMin,
  ];
  return [
    pointScreenX - parseInt(screenWidth / 2),
    -pointScreenY + parseInt(screenHeight / 2),
  ];
}

function convertToScreen(point) {
  let [pointCartesianX, pointCartesianY] = [point[0], point[1]];
  let [cartesianXMin, cartesianXMax] = INTERVALO_X_DC;
  let [cartesianYMin, cartesianYMax] = INTERVALO_Y_DC;
  let [cartesianWidth, cartesianHeight] = [
    cartesianXMax - cartesianXMin,
    cartesianYMax - cartesianYMin,
  ];
  return [
    pointCartesianX - parseInt(cartesianWidth / 2),
    -pointCartesianY + parseInt(cartesianHeight / 2),
  ];
}

// Algortimo de recorte de linha Cohen Sutherland
function cohenSutherland(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {

    function bit(codigo, pos) {
    var bit = codigo << (31 - pos);
    bit = bit >>> 31;
    return bit;
  }

  function obterCodigo(x, y, xmin, ymin, xmax, ymax) {
    var codigo = 0;

    if (x < xmin) {
      codigo += 1;
    }
    if (x > xmax) {
      codigo += 2;
    }

    if (y < ymin) {
      codigo += 4;
    }
    if (y > ymax) {
      codigo += 8;
    }

    return codigo;
  }

  var aceito = false;
  var feito = false;

  var codigoFora;

  var x = 0,
    y = 0;

  while (!feito) {
    var codigo1 = obterCodigo(x1, y1, xmin, ymin, xmax, ymax);
    var codigo2 = obterCodigo(x2, y2, xmin, ymin, xmax, ymax);

    // Dentro da janela
    if (codigo1 == 0 && codigo2 == 0) {
      aceito = true;
      feito = true;

      // Fora da janela
    } else if ((codigo1 & codigo2) != 0) {
      feito = true;
    }

    // Parcialmente dentro
    else {

      codigoFora = codigo1 != 0 ? codigo1 : codigo2;

      // Esquerda
      if (bit(codigoFora, 0) == 1) {
        x = xmin;
        y = y1 + ((y2 - y1) * (xmin - x1)) / (x2 - x1);
      } 
      
      //Direita
      else if (bit(codigoFora, 1) == 1) {
        x = xmax;
        y = y1 + ((y2 - y1) * (xmax - x1)) / (x2 - x1);
      } 
      
      // Baixo
      else if (bit(codigoFora, 2) == 1) {
        y = ymin;
        x = x1 + ((x2 - x1) * (ymin - y1)) / (y2 - y1);
      } 
      
      // Topo
      else if (bit(codigoFora, 3) == 1) {
        y = ymax;
        x = x1 + ((x2 - x1) * (ymax - y1)) / (y2 - y1);
      }

      if (codigoFora == codigo1) {
        x1 = x;
        y1 = y;
      } else {
        x2 = x;
        y2 = y;
      }
    }
  } // fim while

  if (aceito) {
    x1 = x1;
    y1 = y1;
    x2 = x2;
    y2 = y2;
    return [x1, y1, x2, y2];
  } else {
    return null;
  }
}

// Multiplicacao de matrizes
function multiplicacaoMatriz(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
     throw new Error('Formato invalido');
  }
  let x = a.length,
  z = a[0].length,
  y = b[0].length;
  if (b.length !== z) {
     // XxZ & ZxY => XxY
     return null
  }
  let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
  let product = new Array(x);
  for (let p = 0; p < x; p++) {
     product[p] = productRow.slice();
  }
  for (let i = 0; i < x; i++) {
     for (let j = 0; j < y; j++) {
        for (let k = 0; k < z; k++) {
           product[i][j] += a[i][k] * b[k][j];
        }
     }
  }
  return product;
}

function desenharRetaBatimento(x1,y1,x2,y2,algoritmo = 'dda') {
  if(algoritmo == 'ponto-medio') {
    line(x1,y1,x2,y2)
  }
}

// Soma especial de matrizes para translacao
function somaMatriz(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
     throw new Error('Formato invalido');
  }

  let l1 = a.length
  let c1 = a[0].length

  let l2 = b.length
  let c2 = b[0].length

  var linha = []
  var resultado = []

  for(let i = 0 ; i < l2; i++) {
    linha = []
    for(let j = 0 ; j < c2 ; j++) {
      if(i == 0) {
        linha.push( a[0][0] + b[i][j]  )
      }
      else if(i == 1){
        linha.push( a[1][0] + b[i][j]  )
      } else {
        linha.push( a[2][0] + b[i][j]  )
      }
    }
    resultado.push(linha)
  }

  return resultado;
}

// Refletir matriz no plano XY
function reflexaoXY(matriz , dimensao = '3d' )  {
  var resultado = []

  if(dimensao == '3d') {
      var matrizReflexaoXY = [ [1,0,0] , [0,1,0] , [0,0,-1]]
      resultado = multiplicacaoMatriz(matrizReflexaoXY , matriz)
  }

  return resultado
}

// Refletir matriz no plano YZ
function reflexaoYZ(matriz , dimensao = '3d' )  {
  var resultado = []

  if(dimensao == '3d') {
      var matrizReflexaoYZ= [ [-1,0,0] , [0,1,0] , [0,0,1]]
      resultado = multiplicacaoMatriz(matrizReflexaoYZ , matriz)
  }

  return resultado
}

// Refletir matriz no plano XZ
function reflexaoXZ(matriz , dimensao = '3d' )  {
  var resultado = []

  if(dimensao == '3d') {
      var matrizReflexaoXZ= [ [1,0,0] , [0,-1,0] , [0,0,1]]
      resultado = multiplicacaoMatriz(matrizReflexaoXZ , matriz)
  }

  return resultado
}

// Refletir matriz em X
function reflexaoX(matriz , dimensao = '2d' )  {
  var resultado = []

  if(dimensao == '2d') {
      var matrizReflexaoX = [ [1,0] , [0,-1]]
      resultado = multiplicacaoMatriz(matrizReflexaoX , matriz)
  }

  return resultado
}

// Refletir matriz em Y
function reflexaoY(matriz , dimensao = '2d' )  {
  var resultado = []

  if(dimensao == '2d') {
      var matrixReflexaoY = [ [-1,0] , [0,1] ]
      resultado = multiplicacaoMatriz(matrixReflexaoY , matriz)
  }

  return resultado
}

// Refletir matriz em torno da reta
function reflexaoReta(matriz , m , b , dimensao = '2d') {
  var resultado = []

  if(dimensao == '2d') {
      var matrixReflexaoReta = [ [(1 - pow(m,2)) / (pow(m,2) + 1), (2*m) / (pow(m,2) + 1) , (-2 * b * m) / (pow(m,2) + 1) ] ,  [ (2*m) / (pow(m,2) + 1) , (pow(m,2) - 1) / ( pow(m,2) + 1 ) , b - ( b / (pow(m,2) + 1)  ) + (  (b*pow(m,2)  )/(pow(m,2) + 1)   )    ]  , [0,0,1]    ]   
      resultado = multiplicacaoMatriz(matrixReflexaoReta , matriz)
  }

  return resultado
}

// escalar matriz
function escala(matriz , sx , sy , sz = 0 , dimensao = '2d') {

  var resultado = []


  if(dimensao == '2d') {
      var matrizEscala = [ [sx , 0 ] , [0,sy ] ]
      resultado = multiplicacaoMatriz(matrizEscala , matriz)
  }

  else if(dimensao == '3d') {
    var matrizEscala = [ [sx , 0 , 0] , [0,sy , 0 ] , [0,0,sz] ]
    
    resultado = multiplicacaoMatriz(matrizEscala , matriz)
}


  return resultado

}

// Transladar matriz
function translacao(matriz , tx , ty , tz, dimensao = '2d') {
  
  var resultado = []
  
  if(dimensao == '2d') {
      var matrizTranslação = [ [tx] , [ty]]
      resultado = somaMatriz(matrizTranslação , matriz)
  }

  else if(dimensao == '3d') {
    var matrizTranslação = [ [tx] , [ty] , [tz]]
    resultado = somaMatriz(matrizTranslação , matriz)
}

  return resultado
}

// Cisalhar matriz no eixo X
function cisalhamentoX(matriz , a , b , dimensao = '2d') {
  var resultado = []

  if(dimensao == '2d') {
      var matrizCisalhamentoX = [ [1,a] , [0,1]]
      resultado = multiplicacaoMatriz(matrizCisalhamentoX,matriz)
  }

  else if(dimensao == '3d') {
    var matrizCisalhamentoX = [ [1,0,0] , [a,1 , 0] , [b,0,1]]
    resultado = multiplicacaoMatriz(matrizCisalhamentoX,matriz)
}

  return resultado
}

// Cisalhar matriz no eixo Y
function cisalhamentoY(matriz , a,b , dimensao = '2d') {
  var resultado = []

  if(dimensao == '2d') {
      var matrizCisalhamentoY = [ [1,0] , [b,1]]
      resultado = multiplicacaoMatriz(matrizCisalhamentoY,matriz)
  }

  else if(dimensao == '3d') {
    var matrizCisalhamentoY = [ [1 , a ,0] , [0 ,1,0] , [0,b,1]]
    resultado = multiplicacaoMatriz(matrizCisalhamentoY,matriz)
}
  return resultado
}

// Cisalhar matriz 3d no eixo Z
function cisalhamentoZ(matriz ,a, b , dimensao = '3d') {
  var resultado = []

   if(dimensao == '3d') {
    var matrizCisalhamentoZ = [ [1 , 0 ,a] , [0 ,1,b] , [0,0,1]]
    resultado = multiplicacaoMatriz(matrizCisalhamentoZ,matriz)
}
  return resultado
}

// rotacionar matriz no sentido antihorario dado um angulo
function rotacaoAntiHoraria(matriz , angulo , dimensao = '2d') {
  var resultado = []

  if(dimensao == '2d') {
      var ang = grausParaRadiano(angulo)
      var matrizRotacaoAntiHoraria = [ [Math.cos(ang).toPrecision(3) , -Math.sin(ang).toPrecision(3) ] , [ Math.sin(ang).toPrecision(3)  , Math.cos(ang).toPrecision(3) ] ]
      resultado = multiplicacaoMatriz(matrizRotacaoAntiHoraria , matriz)

  }

  return resultado
}

// rotacionar matriz no sentido horario  dado um angulo
function rotacaoHoraria(matriz , angulo , dimensao = '2d') {
  var resultado = []

  if(dimensao == '2d') {
      var ang = grausParaRadiano(angulo)
      var matrizRotacaoHoraria = [ [Math.cos(ang).toPrecision(3)  , Math.sin(ang).toPrecision(3) ] , [ -Math.sin(ang).toPrecision(3)  , Math.cos(ang).toPrecision(3) ]]
      resultado = multiplicacaoMatriz(matrizRotacaoHoraria , matriz)

  }

  return resultado
}

// rotacionar matriz em torno do eixo X dado um angulo
function rotacaoX(matriz, angulo) {
  var resultado = []

  var ang = grausParaRadiano(angulo)
  var matrizRotacao = [ [1,0,0] , [0,Math.cos(ang).toPrecision(3) , -Math.sin(ang).toPrecision(3)] , [0, Math.sin(ang).toPrecision(3) , Math.cos(ang).toPrecision(3) ]   ]
  resultado = multiplicacaoMatriz(matrizRotacao , matriz)
  return resultado
}

// rotacionar matriz em torno do eixo Y dado um angulo
function rotacaoY(matriz, angulo) {
  var resultado = []

  var ang = grausParaRadiano(angulo)
  var matrizRotacao = [ [Math.cos(ang).toPrecision(3),0,Math.sin(ang).toPrecision(3)], [0,1,0] , [-Math.sin(ang).toPrecision(3),0 , Math.cos(ang).toPrecision(3)]    ]
  resultado = multiplicacaoMatriz(matrizRotacao , matriz)
  return resultado
}

// rotacionar matriz em torno do eixo Z dado um angulo
function rotacaoZ(matriz, angulo) {
  var resultado = []

  var ang = grausParaRadiano(angulo)
  var matrizRotacao = [ [Math.cos(ang).toPrecision(3) , -Math.sin(ang).toPrecision(3) , 0] , [ Math.sin(ang).toPrecision(3) , Math.cos(ang).toPrecision(3) , 0] , [0,0,1]   ]
  resultado = multiplicacaoMatriz(matrizRotacao , matriz)
  return resultado
}

// Convert graus para radiano
function grausParaRadiano(angulo) {
  var resultado = angulo * (3.14 / 180)
  return resultado.toPrecision(3)
}

// Desenhar elipse por meio do ponto medio
function desenharElipsePontoMedio(xOrigem, yOrigem, raioX, raioY, cor = "red") {
  var pontos = [];
  var x = 0
  var y = raioY;
  var p1, p2;

  // simetria 4
  pontos.push([x + xOrigem, y + yOrigem]);
  pontos.push([-x + xOrigem, y + yOrigem]);
  pontos.push([x + xOrigem, -y + yOrigem]);
  pontos.push([-x + xOrigem, -y + yOrigem]);


  // regiao 1
  p1 = raioY * raioY - raioX * raioX * raioY + 0.25 * raioX * raioX;
  while (2 * raioY * raioY * x <= 2 * raioX * raioX * y) {
    if (p1 < 0) {
      x = x + 1;
      p1 = p1 + 2 * raioY * raioY * x + raioY * raioY;
    } else {
      x = x + 1;
      y = y - 1;
      p1 = p1 + 2 * raioY * raioY * x - 2 * raioX * raioX * y + raioY * raioY;
    }

    // simetria 4
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
  }


  // regiao 2
  p2 =
    (x + 0.5) * (x + 0.5) * raioY * raioY +
    (y - 1) * (y - 1) * raioX * raioX -
    raioX * raioX * raioY * raioY;
  while (y != 0) {
    if (p2 > 0) {
      y = y - 1;
      p2 = p2 - 2 * y * raioX * raioX + raioX * raioX;
    } else {
      x = x + 1;
      y = y - 1;
      p2 = p2 - 2 * y * raioX * raioX + 2 * x * raioY * raioY + raioX * raioX;
    }
    
    // simetria 4
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar circunferencia por meio do ponto medio
function desenharCircunferenciaPontoMedio(xOrigem, yOrigem, raio, cor = "red") {
  var x = 0;
  var y = raio;
  var p;
  var pontos = [];
  pontos.push([x + xOrigem, y + yOrigem]);
  p = Number.isInteger(raio) ? 1 - raio : 5 / 4 - raio;

  while (x <= y) {
    if (p < 0) {
      x = x + 1;
      p = p + 2 * x + 1;
    } else {
      x = x + 1;
      y = y - 1;
      p = p + 2 * x - 2 * y + 1;
    }
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
    pontos.push([y + xOrigem, x + yOrigem]);
    pontos.push([-y + xOrigem, x + yOrigem]);
    pontos.push([y + xOrigem, -x + yOrigem]);
    pontos.push([-y + xOrigem, -x + yOrigem]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar circunferencia por meio do metodo trigonometrico
function desenharCircunferenciaMetodoTrigonometrico(
  xOrigem,
  yOrigem,
  raio,
  cor = "red"
) {
  var angulo = 0;
  var pontos = [];
  var x;
  var y;
  while (angulo <= 2 * Math.PI) {
    x = xOrigem + raio * Math.cos(angulo);
    y = yOrigem + raio * Math.sin(angulo);
    angulo = angulo + Math.PI / 180;
    pontos.push([x, y]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar circunferencia por meio da equação explicita
function desenharCircunferenciaEquacaoExplicita(
  xOrigem,
  yOrigem,
  raio,
  cor = "red"
) {
  var x = 0;
  var y = raio;
  var pontos = [];
  pontos.push([x + xOrigem, y + yOrigem]);
  while (x <= y) {
    x = x + 1;
    y = Math.sqrt(raio * raio - x * x);
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
    pontos.push([y + xOrigem, x + yOrigem]);
    pontos.push([-y + xOrigem, x + yOrigem]);
    pontos.push([y + xOrigem, -x + yOrigem]);
    pontos.push([-y + xOrigem, -x + yOrigem]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}
