'use strict'

/* start modo escuro */
pegarElemento('.header__check').addEventListener('change', (e)=>{
    e.target.checked ? modoEscuro('dark') : modoEscuro('light'); 
});

window.onload = pegandoTemaEscolhido; 

function modoEscuro(tema){
    salvandoTemaEscolhido(tema);
    
    if(tema === 'dark'){
        pegarElemento('html').classList.add('dark-mode');
        pegarElemento('.header__light').style.opacity = "0.5";
        pegarElemento('.header__dark').style.opacity = "1";
    }else{
        pegarElemento('html').classList.remove('dark-mode');
        pegarElemento('.header__light').style.opacity = "1";
        pegarElemento('.header__dark').style.opacity = "0.5";
    }
}

function salvandoTemaEscolhido(valorTema){
    const temaEscolido = (valorTema === 'dark') ? localStorage.setItem('tema', 'dark') : localStorage.setItem('tema', 'light');
};

function pegandoTemaEscolhido(){
    const tema = localStorage.getItem('tema');
    if(tema === 'dark'){
        pegarElemento('.header__check').checked = true;
    }
    modoEscuro(tema);
};
/* end modo escuro */

function pegarElemento(elemento){
    return document.querySelector(elemento);
};

function pegarElementos(elemento){
    return document.querySelectorAll(elemento);
}

function criaelementoEAtributo(elemento, attr, valor){
    const elementoCriado = document.createElement(elemento);
    elementoCriado.setAttribute(attr, valor);
    return elementoCriado;
}

function inserirElementos(pai, filho){
    pai.appendChild(filho);
}

function criarItemListaDeMoedas(url, texto){
    const itemLi = criaelementoEAtributo('li', 'class', 'conteudo__search-item p-3 d-flex align-items-center');
    const itemImg = criaelementoEAtributo('img', 'src', pegarFlag('24', url));
    const itemSpan = criaelementoEAtributo('span', 'class', 'conteudo__search-texto ms-2');
    itemSpan.innerText = texto;

    inserirElementos(itemLi, itemImg);
    inserirElementos(itemLi, itemSpan);

    return itemLi
}

/* Criando lista de moedas */
const urlListaMoedas = './json/resposta-lista-moedas.json';

function pegarFlag(tamanho, flag){
    return `https://www.countryflagicons.com/FLAT/${tamanho}/${flag}.png`
}

let moedas = [];

async function puxarDadosListaMoedas(){
    const respostaListaMoedas = await fetch(urlListaMoedas);
    const jsonListaMoedas = await respostaListaMoedas.json();
    const listaMoedas = await jsonListaMoedas.currencies;
    listaMoedas.forEach(element => {
        
        const flag1 = element.currency === 'XOF';
        const flag2 = element.currency === 'XPF';
        const flag3 = element.currency === 'XCD';
        const flag4 = element.currency === 'XAF';

        if(!flag1 && !flag2 && !flag3 && !flag4){
            const siglaFlag = element.currency.slice(0,2);
            const siglaMoeda = element.currency;
            const nomeMoeda = element.description;
            moedas.push(criarItemListaDeMoedas(siglaFlag, `${siglaMoeda} - ${nomeMoeda}`));
            
            pegarElementos('.conteudo__search-lista').forEach((item)=>{
                inserirElementos(item, criarItemListaDeMoedas(siglaFlag, `${siglaMoeda} - ${nomeMoeda}`))
            })
        };
    });
    redimensionarListaMoedas();
    ocultarListaDeMoedas();
    selecionarMoeda();
};

puxarDadosListaMoedas()

/* Star Redimensionando listas de moeda */
function igualandoWidth(){
    const widthInputPesquisar = pegarElemento('.conteudo__pesquisa').getBoundingClientRect().width;
    pegarElementos('.conteudo__search-lista').forEach((lista) => {
        lista.style.width = `${widthInputPesquisar}px`;
    })
};

function redimensionarListaMoedas(){
    igualandoWidth()
    addEventListener('resize', igualandoWidth)
    addEventListener('DOMContentLoaded', igualandoWidth)
};
/* End Redimensionando listas de moeda */

/* start mostrando lista de moedas ao clicar no campo de pesquisa */
pegarElementos('.conteudo__pesquisa').forEach((campoPesquisa) => {
    campoPesquisa.addEventListener('click', mostrarListaMoedas)
})

function mostrarListaMoedas(){
    const inputPesquisa = this;
    
    const classeListaMoedas = pegarElemento(`#${inputPesquisa.id} + .conteudo__search-lista`).classList;

    if(!classeListaMoedas.contains('d-none') && !inputPesquisa.value){
        classeListaMoedas.add('d-none');
    }else{
        classeListaMoedas.remove('d-none');
    }
}
/* end mostrando lista de moedas ao clicar no campo de pesquisa */

/* start ocultar lista de moedas depois de uma moeda selecionada */
function ocultarListaDeMoedas(){
    pegarElementos('.conteudo__search-item').forEach((itemListaMoedas) => {
        itemListaMoedas.addEventListener('click', moedaSelecionada);
        itemListaMoedas.addEventListener('click', ocultarLista);
        itemListaMoedas.addEventListener('click', mostrarResultado);
    });
};

function ocultarLista(){
    const inputPesquisar = this.parentNode.parentNode.children[0];

    pegarElemento(`#${inputPesquisar.id} + .conteudo__search-lista`).classList.add('d-none')
};
/* end ocultar lista de moedas depois de uma moeda selecionada */

/* start inserir elemento selecionado no campo de pesquisa */
function moedaSelecionada(){
    const inputPesquisar = this.parentNode.parentNode.children[0];
    const itemListaMoedas = this;
    
    pegarElemento(`#${inputPesquisar.id}`).value = itemListaMoedas.innerText
}
/* end inserir elemento selecionado no campo de pesquisa */

/* start pesquisar moeda no campo de seleção */
function selecionarMoeda(){
    pegarElementos('.conteudo__pesquisa').forEach((inputPesquisa) => {
        inputPesquisa.addEventListener('input', valorPesquisado);
    })
}

function valorPesquisado(){
    const inputPesquisa = this;

    pegarElemento(`#${inputPesquisa.id} + .conteudo__search-lista`).innerText = ''
    
    moedas.filter((moeda) => {
        return moeda.querySelector('span').innerText.toLowerCase().includes(document.querySelector(`#${inputPesquisa.id}`).value.toLowerCase());

    }).forEach((item) => {
        inserirElementos(pegarElemento(`#${inputPesquisa.id} + .conteudo__search-lista`), item)
        item.addEventListener('click', inserirMoedaNoCampoPesquisa);
        item.addEventListener('click', mostrarResultado)

    })
}

function inserirMoedaNoCampoPesquisa(){
    const nomeMoeda = this.innerText;
    const inputPesquisa = this.parentNode.parentNode.children[0];
    
    pegarElemento(`#${inputPesquisa.id}`).value = nomeMoeda;
    pegarElemento(`#${inputPesquisa.id} + .conteudo__search-lista`).classList.add('d-none')
}
/* end pesquisar moeda no campo de seleção */

/* start criando bloco de resultado da conversão */
function mostrarResultado(){
    const itemMoedaSelecionada = this.children[1].innerText;
    const valorInput = this.parentNode.parentNode.nextElementSibling.value
    const ladoDeReferencia = this.parentNode.parentNode.children[0].id.split('-')[1];

    const ladoResultado = pegarElemento(`#resultado-${ladoDeReferencia}`);

    const boxResultadoValor = criaelementoEAtributo('div', 'class', 'resultado__valor')
    const imgBandeira = criaelementoEAtributo('img', 'src', pegarFlag('48', itemMoedaSelecionada.split('-')[0].slice(0,2)));

    const valorMoeda = criaelementoEAtributo('span', 'class', 'resultado__num');
    const nomeMoeda = criaelementoEAtributo('span', 'class', 'resultado__nome');

    valorMoeda.innerText = valorInput
    nomeMoeda.innerText = itemMoedaSelecionada.split('-')[1];

    pegarElemento('.resultado').classList.remove('d-none');

    ladoResultado.classList.remove('d-none');
    ladoResultado.innerHTML = " ";

    inserirElementos(ladoResultado, imgBandeira);
    inserirElementos(ladoResultado, boxResultadoValor);
    inserirElementos(boxResultadoValor, valorMoeda);
    inserirElementos(boxResultadoValor, nomeMoeda);
}
/* end criando bloco de resultado da conversão */

/* start pegando valor do input number */
pegarElementos('.conteudo__input').forEach((input) => {
    input.addEventListener('input', pegarValorInput)
})

function pegarValorInput(){
    const boxResultado = pegarElemento(`#resultado-${this.id.split('-')[1]}`);
    boxResultado.querySelector('.resultado__valor > span').innerText = this.value;
}
/* end pegando valor do input number */