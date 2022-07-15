class Elemento_Radio {
  constructor(radio_name) {
    this.options = document.querySelectorAll(`input[name='${radio_name}']`);
    this.name = radio_name;
    this.value = 0;
  }
}

class Elemento_Input {
  constructor(input_name) {
    this.input = document.querySelector(`input[id='${input_name}']`);
    this.name = input_name;
  }
}

function saveConfig(nome, valor) {
  localStorage.setItem(nome, valor);
  console.log(valor);
}

function verificaRadio(elemento) {
  for (var aux = 0; aux < elemento.options.length; aux++) {
    elemento.options[aux].onclick = function () {
      elemento.value = this.value;
    };
  }
}

const jogador = new Elemento_Input('nome');
const cenario = new Elemento_Radio('cenario');
const intervalo = new Elemento_Radio('intervalo');
const distancia = new Elemento_Radio('distancia');
const velocidade = new Elemento_Input('velocidade');
const personagem = new Elemento_Radio('personagem');
const tipo = new Elemento_Radio('tipo');
const velocPerson = new Elemento_Radio('velocPerson');
const pontuacao = new Elemento_Radio('pontuacao');

verificaRadio(cenario);
verificaRadio(intervalo);
verificaRadio(distancia);
verificaRadio(personagem);
verificaRadio(tipo);
verificaRadio(velocPerson);
verificaRadio(pontuacao);

const form = document.querySelector('#formulario');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  saveConfig(jogador.name, jogador.input.value);
  saveConfig(cenario.name, cenario.value);
  saveConfig(intervalo.name, intervalo.value);
  saveConfig(distancia.name, distancia.value);
  saveConfig(velocidade.name, velocidade.input.value);
  saveConfig(personagem.name, personagem.value);
  saveConfig(tipo.name, tipo.value);
  saveConfig(velocPerson.name, velocPerson.value);
  saveConfig(pontuacao.name, pontuacao.value);
  window.location.href = './flappy.html';
});