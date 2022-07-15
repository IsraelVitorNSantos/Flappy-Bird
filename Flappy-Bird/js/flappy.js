function loadConfig() {
  const config = {
    jogador: localStorage.nome ? localStorage.nome : 'desconhecido',
    cenario: localStorage.cenario ? localStorage.cenario : 'noturno',
    intervalo: localStorage.intervalo ? localStorage.intervalo : 'facil',
    distancia: localStorage.distancia ? localStorage.distancia : 'facil',
    velocidade: parseInt(localStorage.velocidade > 0 && localStorage.velocidade < 11 ? localStorage.velocidade : '5',),
    personagem: localStorage.personagem ? localStorage.personagem : 'balao',
    tipo: localStorage.tipo ? localStorage.tipo : 'real',
    velocPerson: localStorage.velocPerson ? localStorage.velocPerson : 'baixa',
    pontuacao: parseInt(localStorage.pontuacao ? localStorage.pontuacao : '1'),
  };
  return config;
}

function mudaCenario(cenario) {
  if (cenario == "diurno") {
    document.querySelector('[wm-flappy]').classList.add(cenario);
  }
  else if (cenario == "noturno") {
    document.querySelector('[wm-flappy]').classList.add(cenario);
  }
  else {
    document.querySelector('[wm-flappy]').classList.add('noturno');
  }
}

function mudaBarreira (corpo, borda) {
  const config = loadConfig();
  if(config.cenario == "noturno"){
      corpo.style.background = "linear-gradient(90deg, #bb4603, #ff7b00)";
      borda.style.background = "linear-gradient(90deg, #bb4603, #ff7b00)";
  }
  else if(config.cenario == "diurno"){
      corpo.style.backgroundColor = "linear-gradient(90deg, #639301, #A5E82E)";
      borda.style.backgroundColor = "linear-gradient(90deg, #639301, #A5E82E)";
  }
  else{
      corpo.style.background = "linear-gradient(90deg, #bb4603, #ff7b00)";
      borda.style.background = "linear-gradient(90deg, #bb4603, #ff7b00)";
  }
}

function mudaAbertura(abertura) {
  if (abertura == "facil") {
    return 350;
  }
  else if (abertura == "medio") {
    return 250;
  }
  else if (abertura == "dificil") {
    return 200;
  }
  else {
    return 350;
  }
}

function mudaIntervalo(intervalo) {
  if (intervalo == "facil") {
    return 600;
  }
  else if (intervalo == "medio") {
    return 500;
  }
  else if (intervalo == "dificil") {
    return 450;
  }
  else {
    return 600;
  }
}

function mudaPersonagem(personagem) {
  if (personagem == "passaro") {
    return personagem;
  }
  else if (personagem == "balao") {
    return personagem;
  }
  else if (personagem == "ovni") {
    return personagem;
  }
  else {
    return "balao";
  }
}

function mudaTipo(tipo) {
  if (tipo == "treino") {
    return tipo;
  }
  else if (tipo == "real") {
    return tipo;
  }
  else {
    return "real";
  }
}

function mudaVelPersonagem(velocidade) {
  if (velocidade == "baixa") {
    return {
      sobe: 5,
      desce: -2,
    };
  }
  else if (velocidade == "media") {
    return {
      sobe: 8,
      desce: -3,
    };
  }
  else if (velocidade == "rapida") {
    return {
      sobe: 11,
      desce: -4,
    };
  }
  else {
    return {
      sobe: 5,
      desce: -2,
    };
  }
}

function mudaPontuacao(pontuacao) {
  if (pontuacao == '1') {
    return pontuacao;
  }
  else if (pontuacao == '10') {
    return pontuacao;
  }
  else if (pontuacao == '100') {
    return pontuacao;
  }
  else {
    return 1;
  }
}

function placar(jogador) {
  const pontuacao = document.querySelector('.progresso').textContent;
  console.log(jogador, pontuacao);
  const navegar = confirm(`\nGAME OVER\n\nJogador: ${jogador}\nPlacar: ${pontuacao} \n\nClick em 'OK' para tentar novamente`,);
  if (navegar == true) {
    window.location.href = './flappy.html';
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function novoElemento(tagName, className) {
  const elemento = document.createElement(tagName);
  elemento.className = className;
  return elemento;
}

function Barreira(reversa = false) {
  this.elemento = novoElemento('div', 'barreira');
  const borda = novoElemento('div', 'borda');
  const corpo = novoElemento('div', 'corpo');

  mudaBarreira(borda, corpo);

  this.elemento.appendChild(reversa ? corpo : borda);
  this.elemento.appendChild(reversa ? borda : corpo);
  
  this.setAltura = altura => corpo.style.height = `${altura}px`;
}

function ParDeBarreiras(altura, abertura, popsicaoNaTela) {
  this.elemento = novoElemento('div', 'par-de-barreiras');
  
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
  this.setX = popsicaoNaTela => this.elemento.style.left = `${popsicaoNaTela}px`;
  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(popsicaoNaTela);
}

//                                                                     alterado
function Barreiras(altura, largura, abertura, espaco, notificarPonto, velocidade,) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3),
  ];

  const deslocamento = velocidade; // alterado
  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento);

      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length);
        par.sortearAbertura();
      }
      const meio = largura / 2;
      const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio;
      if (cruzouMeio) {
        notificarPonto();
      }
    });
  };
}

//                                  alterados
function Passaro(alturaJogo, personagem, velocidade) {
  let voando = false;
  this.elemento = novoElemento('img', 'passaro');
  this.elemento.src = `./img/${personagem}.png`;
//        alterado
   /* if (personagem == 'milho') {
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.setY = y => this.elemento.style.bottom = `${y}px`;    

    this.animar = () => {
      const novoY = this.getY() + (voando ? velocidade.sobe : velocidade.desce);
      const alturaMaxima = alturaJogo - this.elemento.clientWidth;

      if (novoY <= 0) {
        this.setY(0);
      } else if (novoY >= alturaMaxima) {
        this.setY(alturaMaxima);
      } else {
        this.setY(novoY);
      }
    };
    this.setY(alturaJogo); 
  }
  else{*/
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.setY = y => this.elemento.style.bottom = `${y}px`;

    window.onkeydown = e => voando = true;
    window.onkeyup = e => voando = false;

    this.animar = () => {                             // alterados
      const novoY = this.getY() + (voando ? velocidade.sobe : velocidade.desce);
      const alturaMaxima = alturaJogo - this.elemento.clientWidth;

      if (novoY <= 0) {
        this.setY(0);
      } else if (novoY >= alturaMaxima) {
        this.setY(alturaMaxima);
      } else {
        this.setY(novoY);
      }
    };
    this.setY(alturaJogo/2);
  }
//}

function Progresso() {
  this.elemento = novoElemento('span', 'progresso');
  this.atualizarPontos = pontos => {
    this.elemento.innerHTML = pontos;
  };
  this.atualizarPontos(0);
}

function estaoSobrepostos(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical;
}

function colidiu(passaro, barreiras) {
  let colidiu = false;

  barreiras.pares.forEach((parDeBarreiras) => {
    if (!colidiu) {
      const superior = parDeBarreiras.superior.elemento;
      const inferior = parDeBarreiras.inferior.elemento;
      colidiu = estaoSobrepostos(passaro.elemento, superior)
          || estaoSobrepostos(passaro.elemento, inferior);
    }
  });
  return colidiu;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* function colideItem(passaro, item) {
  
} */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function FlappyBird() {
  let pontos = 0;
  const areaDoJogo = document.querySelector('[wm-flappy]');
  const altura = areaDoJogo.clientHeight;
  const largura = areaDoJogo.clientWidth;

  const config = loadConfig();
  mudaCenario(config.cenario);

  const progresso = new Progresso();
  const barreiras = new Barreiras(
    altura, largura, mudaAbertura(config.intervalo), mudaIntervalo(config.distancia),
    () => progresso.atualizarPontos(pontos = pontos + mudaPontuacao(config.pontuacao)),
    config.velocidade,
  );

  const passaro = new Passaro(altura, mudaPersonagem(config.personagem), mudaVelPersonagem(config.velocPerson),);

  areaDoJogo.appendChild(progresso.elemento);
  areaDoJogo.appendChild(passaro.elemento);
  
  barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));
 
  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();

      if (mudaTipo(config.tipo) == 'real') {
        if (colidiu(passaro, barreiras)) {
          clearInterval(temporizador);
          placar(config.jogador);
        }
      }

      /* if (pontos == 2 || pontos == 20 || pontos == 200) {//pontos > 4 && pontos%5 == 0
        progresso.atualizarPontos(pontos = pontos + 10);
        const c = loadConfig();
        const milho = new Passaro(altura, 'milho', mudaVelPersonagem(c.velocPerson));
        const areaDoJogo = document.querySelector('[wm-flappy]');
        areaDoJogo.appendChild(milho.elemento);
        
        setInterval(() => {
          milho.animar();
        },20);
      } */

  }, 20);
    
  };
}

new FlappyBird().start();