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
let slideItems = document.querySelectorAll('[data-slide="item"]');

let controlButtons;

//variavel para controlar o slideAutoPlay
let slideInterval;

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

//funcao para fazer o translate e nao ficar repetindo muito codigo
function translateSlide(position) {
  slideList.style.transform = `translateX(${position}px)`;
  savePosition = position;
}
//funcao resposavel por centralizar e ver a posicao do slide
function getCenterPosition(index) {
  //tamanho do item do slide
  const slideItem = slideItems[index];
  console.log(slideItem);
  const slideWidth = slideItem.clientWidth;
  /*
      para centralizar o item a logica e o seguinte, pegar o tamanho da tela e o tamanho do slide
      o que restar divide por 2 e aplica de margim dos dois lados  
    */
  const windowWidth = document.body.clientWidth;
  const margin = (windowWidth - slideWidth) / 2;
  const position = margin - index * slideWidth;
  return position;
}
function setVisibleSlide(index, animate) {
  //if que e responsavel por travar o primeiro e o ultimo slide para impedir bug caso o usuario passe rapido
  if (index === 0 && index === slideItems.length - 1) {
    index = currentSlideIndex;
  }
  const position = getCenterPosition(index);
  currentSlideIndex = index;
  //responsavel pela animacao ao mudar o item
  slideList.style.transition = animate === true ? "transform .5s" : "none";
  activeControlButton(index);
  translateSlide(position);
}
function nextSlide() {
  setVisibleSlide(currentSlideIndex + 1, true);
}
function previousSlide() {
  setVisibleSlide(currentSlideIndex - 1, true);
}
//funcao responsavel por criar os botoes em baixo do slider
function createControlsButtons() {
  //criar os botoes de acordo com a quantidade de elemento na tela
  slideItems.forEach(() => {
    const controlButton = document.createElement("button");
    controlButton.classList.add("slide-control-button");
    controlButton.classList.add("fas");
    controlButton.classList.add("fa-circle");
    controlButton.setAttribute("data-slide", "control-button");
    controlsWrapper.append(controlButton);
  });
}

function activeControlButton(index) {
  //para evitar bug nos botoes de controle vamos pegar o item pelo seu index
  const slideItem = slideItems[index];
  const dataIndex = Number(slideItem.dataset.index);
  const controlButton = controlButtons[dataIndex];
  controlButtons.forEach((controlButtonItem) => {
    controlButtonItem.classList.remove("active");
  });
  if (controlButton) controlButton.classList.add("active");
}

//funcao responsavel por criar os clones do inicio e do final do slide
function createSlideCones() {
  //ao inves de criar um novo elemento, copiamos ele usando o .cloneNode(true) *funcao a pesquisar depois*
  const firstSlide = slideItems[0].cloneNode(true);
  firstSlide.classList.add("slide-cloned");
  firstSlide.dataset.index = slideItems.length;

  const secondSlide = slideItems[1].cloneNode(true);
  secondSlide.classList.add("slide-cloned");
  secondSlide.dataset.index = slideItems.length + 1;

  const lastSlide = slideItems[slideItems.length - 1].cloneNode(true);
  lastSlide.classList.add("slide-cloned");
  lastSlide.dataset.index = -1;

  const penultimateSlide = slideItems[slideItems.length - 2].cloneNode(true);
  penultimateSlide.classList.add("slide-cloned");
  penultimateSlide.dataset.index = -2;

  slideList.append(firstSlide);
  slideList.append(secondSlide);
  slideList.prepend(lastSlide);
  slideList.prepend(penultimateSlide);

  slideItems = document.querySelectorAll('[data-slide="item"]');
}
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

  //tirar o efeito do transition
  slideList.style.transition = "none";

  // evento de mover o mouse em cima do item
  /* 
  outra logica a ser aplicada e o mouse move so funcionar quando o botao do mouse for clicado mas para isso temos que tirar um
  efeito padrao de q quando clica e arrasta o item ele pega a imagem e os eventos param de funcionar, esse efeito e causado pelo dragstar. essa funcao a baixo foi criada fora do mousedown
  */
  slideItem.addEventListener("mousemove", onMouseMove);
  /* jogando o mousemove dentro do mousedown o ouvinte do mousemove so sera executado quando o mousedown(click) for executado primeiro */
}

//funcao para o mouseup
function onMouseUp(event) {
  //mudar a quantidade necessaria de px para mover no celular ou no pc
  const pointsToMove = event.type.includes("touch") ? 50 : 150;
  /*
   o event nao precisa ser passado na hora de chamar a funcao, meio que ele ja pega "automatico", com isso ele pega o evento exato de onde o ouvinte foi clicado.

  com a propriedade currentTargent o evento pega o elemento em que o ouvinte foi clicado nesse caso a div do item todo
  */
  const slideItem = event.currentTarget;
  // console.log(slideItem);

  /* pegar o tamanho do item depois verificar quantos px foi movido o item e assim passar o calculo para 
     o translate mudar o item do slide de lugar automaticamente, lembrando de salvar o valor de position no final
  */

  /* essa verificacao serve para ver se um determinado valor foi movimentado ao arrastar o mouse no item, tanto pra frente quanto para tras e caso nao tiver sido movido o suficiente ele continua no mesmo item */
  if (movement < -pointsToMove) {
    nextSlide();
  } else if (movement > pointsToMove) {
    previousSlide();
  } else {
    setVisibleSlide(currentSlideIndex, true);
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
  translateSlide(position);
}
//funcionar o slider no celular
function onTouchStart(event, index) {
  event.clientX = event.touches[0].clientX;
  onMouseDown(event, index);
  const slideItem = event.currentTarget;
  slideItem.addEventListener("touchmove", onTouchMove);
}
function onTouchMove(event) {
  event.clientX = event.touches[0].clientX;
  onMouseMove(event);
}
function onTouchEnd(event) {
  onMouseUp(event);
  const slideItem = event.currentTarget;
  slideItem.addEventListener("touchmove", onTouchMove);
}

/* 

logica do slider 
  pegar o elemento pai da lista de itens (data-slide="list") e movê-lo pra esquerda ou direita com o elemento transform.

  pegar o tamanho do item do slide que nesse caso seria 1728px e multiplicar pela sua posicao ou seja para chegar no item 3
  seria 1728px * 3 = 5184px, esse valor de 5184px seria passado para o transform: translate no css.

  o uso do data-index e justamente para isso, pegar o valor desse index e multiplicar pelo tamanho maximo do item.
  (lembrando que o numero e negativo)

*/
function onControlButtonClick(index) {
  setVisibleSlide(index + 2, true);
}

//responsave por fazer o efeito infinito
function onSlideListTransitionEnd() {
  const slideItem = slideItems[currentSlideIndex];
  if (
    slideItem.classList.contains("slide-cloned") &&
    Number(slideItem.dataset.index) > 0
  ) {
    setVisibleSlide(2, false);
  }
  if (
    slideItem.classList.contains("slide-cloned") &&
    Number(slideItem.dataset.index) < 0
  ) {
    setVisibleSlide(slideItems.length - 3, false);
  }
}
function setAutoPlay() {
  slideInterval = setInterval(() => {
    setVisibleSlide(currentSlideIndex + 1, true);
  }, 4000);
}
function setListeners() {
  controlButtons = document.querySelectorAll('[data-slide="control-button"]');
  controlButtons.forEach((controlButton, index) => {
    controlButton.addEventListener("click", (event) => {
      onControlButtonClick(index);
    });
  });
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

    //add evento para funcionar no touch do celular
    slideItem.addEventListener("touchstart", (event) => {
      onTouchStart(event, index);
    });
    slideItem.addEventListener("touchend", onTouchEnd);
  });

  navNextButton.addEventListener("click", nextSlide);
  navPreviousButton.addEventListener("click", previousSlide);
  slideList.addEventListener("transitionend", onSlideListTransitionEnd);
  //quando colocar o mouse em cima do slider ele para de rodar automaticamente, para isso pegamos o slider inteiro
  slideWrapper.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });
  slideWrapper.addEventListener("mouseleave", () => {
    setAutoPlay();
  });
  let reziseTimeout;
  window.addEventListener("rezise", () => {
    clearTimeout(reziseTimeout);
    reziseTimeout = setTimeout(() => {
      setVisibleSlide(currentSlideIndex, true);
    }, 1000);
  });
}

function initSlider(startAtIndex) {
  createControlsButtons();
  createSlideCones();
  setListeners();
  setVisibleSlide(startAtIndex + 2, true);
  setAutoPlay();
}

initSlider(0);
