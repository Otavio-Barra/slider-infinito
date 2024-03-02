"use strict";

// pegar elementos
const slideWrapper = document.querySelector('[data-slide="wrapper"]');
const slideList = document.querySelector('[data-slide="list"]');
const navPreviousButton = document.querySelector(
  '[data-slide="nav-previous-button'
);
const navNextButton = document.querySelector('[data-slide="nav-next-button');
const controlsWrapper = document.querySelector(
  '[data-slide="controls-wrapper"]'
);
const slideItems = document.querySelectorAll('[data-slide="item"]');
const controlButton = document.querySelectorAll(
  '[data-slide="control-button"]'
);

// variavel que pegara o ponto inicial de onde o evento de click foi chamado, ela foi criada fora das funcoes para ter a possibilidade de usa-la e modifica-la em funcoes diferentes
let startingPoint = 0;

//essa variavel serve para guardar a quantidade de px que o mouse arrastou o slide e e usada para ao clicar no slide de novo ele nao voltar a posicao 0
let savePosition = 0;
let currentPosition = 0;

let movement = 0;

let currentSlideIndex = 0;

/*juntar todas elas em um obj fica mais declarativo e organizado
exemplo
const states = {
  startingPoint: 0,
  savePosition: 0,
  currentPosition: 0,
  movement:0,
  currentSlideIndeex:0
}
*/

//funcao para o mousedown
function onMouseDown(event, index) {
  // console.log("click");
  /*
   o event nao precisa ser passado na hora de chamar a funcao, meio que ele ja pega "automatico", com isso ele pega o evento exato de onde o ouvinte foi clicado.

  com a propriedade currentTargent o evento pega o elemento em que o ouvinte foi clicado nesse caso a div do item todo
  */
  const slideItem = event.currentTarget;
  // console.log(slideItem);

  // pega o pixel exato de onde o mousedown foi chamado e atribui a variavel startingPoint que esta foi da variavel
  startingPoint = event.clientX;

  //calcula a posicao atual do item
  currentPosition = event.clientX - savePosition;

  //pega o index atual do item
  currentSlideIndex = index;
  console.log(currentSlideIndex);
  // evento de mover o mouse em cima do item
  /* 
  outra logica a ser aplicada e o mouse move so funcionar quando o botao do mouse for clicado mas para isso temos que tirar um
  efeito padrao de q quando clica e arrasta o item ele pega a imagem e os eventos param de funcionar, esse efeito e causado pelo dragstar. essa funcao a baixo foi criada fora do mousedown
  */
  slideItem.addEventListener("mousemove", onMouseMove);
  /* jogando o mousemove dentro do mousedown o ouvinte do mousemove so sera executado quando o mousedown(click) for executado primeiro */
}

//funcao para o mouseup
function onMouseUp() {
  // console.log("botao solto");
  /*
   o event nao precisa ser passado na hora de chamar a funcao, meio que ele ja pega "automatico", com isso ele pega o evento exato de onde o ouvinte foi clicado.

  com a propriedade currentTargent o evento pega o elemento em que o ouvinte foi clicado nesse caso a div do item todo
  */
  const slideItem = event.currentTarget;
  // console.log(slideItem);

  /* pegar o tamanho do item depois verificar quantos px foi movido o item e assim passar o calculo para 
     o translate mudar o item do slide de lugar automaticamente, lembrando de salvar o valor de position no final
  */
  //tamanho do item do slide
  const slideWidth = slideItem.clientWidth;

  /* essa verificacao serve para ver se um determinado valor foi movimentado ao arrastar o mouse no item, tanto pra frente quanto para tras e caso nao tiver sido movido o suficiente ele continua no mesmo item */
  if (movement < -150) {
    const position = (currentSlideIndex + 1) * slideWidth;
    slideList.style.transform = "translateX(" + -position + "px)";
    savePosition = -position;
  } else if (movement > 150) {
    const position = (currentSlideIndex - 1) * slideWidth;
    slideList.style.transform = "translateX(" + -position + "px)";
    savePosition = -position;
  } else {
    const position = currentSlideIndex * slideWidth;
    slideList.style.transform = "translateX(" + -position + "px)";
    savePosition = -position;
  }

  /* para tirar o evento do mouse move assim que soltar o botao */
  slideItem.removeEventListener("mousemove", onMouseMove);
}

//funcao que vai no mousemove para evitar repeticao de codigo
function onMouseMove() {
  //calcula quantos px o mouse andou do ponto que foi clicado ate quando o botao foi solto, e como o startingPoint esta fora da funcao ele ja foi atribuido com o valor da outra funcao (no caso aqui do mousedown)
  movement = event.clientX - startingPoint;
  const position = event.clientX - currentPosition;
  // console.log(
  //   `px do mousemove: ${event.clientX} - ponto de partida: ${startingPoint} = ${movement}`
  // );

  /* 
  efeito de movimentar o item, o porem que ao clicar nele pela segunda vez mesmo idependente do local o item volta ao ponto 0 ou seja
  volta ao inicio de tudo.
  propriedade style e para mexer diretamente com o css
  */
  slideList.style.transform = "translateX(" + position + "px)";
  savePosition = position;
}

/* 

logica do slider 
  pegar o elemento pai da lista de itens (data-slide="list") e movê-lo pra esquerda ou direita com o elemento transform.

  pegar o tamanho do item do slide que nesse caso seria 1728px e multiplicar pela sua posicao ou seja para chegar no item 3
  seria 1728px * 3 = 5184px, esse valor de 5184px seria passado para o transform: translate no css.

  o uso do data-index e justamente para isso, pegar o valor desse index e multiplicar pelo tamanho maximo do item.
  (lembrando que o numero e negativo)

*/

/* primeiro fazer slide se movimentar com o mouse */
// percorrer todo os items do slide
slideItems.forEach((slideItem, index) => {
  /*responsavel por cancelar o efeito padrao que acontece quando arrasta algum item */
  slideItem.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  // lembrando que os eventos so vao funcionar nos itens
  //  colocar um evento neles de mousedown que e quando se clica com o botao esquerdo do mouse
  // nao e necessario passar o parametro event ao chamar a funcao, ele vem meio que padrao
  //como chamar a funcao direto igual o exemplo a baixo nao da certo passar o parametro
  // slideItem.addEventListener("mousedown", onMouseDown);
  //e ,ais pratico criar uma funcao e chamar o onMouseDown dentro dessa funcao
  slideItem.addEventListener("mousedown", (event) => {
    onMouseDown(event, index);
  });

  // event para quando o botao for solto
  slideItem.addEventListener("mouseup", onMouseUp);
});
