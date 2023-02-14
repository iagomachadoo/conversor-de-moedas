'use strict'

/* Modo escuro */
pegarElemento('.header__check').addEventListener('change', (e)=>{
    const estadobtnModo = e.target.checked;
    if(estadobtnModo){
        pegarElemento('html').classList.add('dark-mode');
        pegarElemento('.header__light').style.opacity = "0.5";
        pegarElemento('.header__dark').style.opacity = "1";
    }else{
        pegarElemento('html').classList.remove('dark-mode');
        pegarElemento('.header__light').style.opacity = "1";
        pegarElemento('.header__dark').style.opacity = "0.5";
    }
})

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
    const itemImg = criaelementoEAtributo('img', 'src', pegarFlag(url));
    const itemSpan = criaelementoEAtributo('span', 'class', 'conteudo__search-texto ms-2');
    itemSpan.innerText = texto;

    inserirElementos(itemLi, itemImg);
    inserirElementos(itemLi, itemSpan);

    return itemLi
}

/* Criando lista de moedas */
const urlListaMoedas = './json/resposta-lista-moedas.json';

function pegarFlag(flag){
    return `https://www.countryflagicons.com/FLAT/24/${flag}.png`
}

let moedas = [];

async function puxarDadosListaMoedas(){
    const respostaListaMoedas = await fetch(urlListaMoedas);
    const jsonListaMoedas = await respostaListaMoedas.json();
    const listaMoedas = await jsonListaMoedas.currencies;
    listaMoedas.forEach(element => {
        //console.log(element);
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
    const classeListaMoedas = pegarElemento(`#${this.id} + .conteudo__search-lista`).classList;

    if(classeListaMoedas.contains('d-none')){
        classeListaMoedas.remove('d-none');
    }
}
/* end mostrando lista de moedas ao clicar no campo de pesquisa */


/* start ocultar lista de moedas depois de uma moeda selecionada */
function ocultarListaDeMoedas(){
    pegarElementos('.conteudo__search-item').forEach((itemListaMoedas) => {
        itemListaMoedas.addEventListener('click', moedaSelecionada);
        itemListaMoedas.addEventListener('click', ocultarLista);
    });
};

function ocultarLista(){
    pegarElemento(`#${this.parentNode.parentNode.children[0].id} + .conteudo__search-lista`).classList.add('d-none')
};
/* end ocultar lista de moedas depois de uma moeda selecionada */


/* start inserir elemento selecionado no campo de pesquisa */
function moedaSelecionada(){
    pegarElemento(`#${this.parentNode.parentNode.children[0].id}`).value = this.innerText
}
/* end inserir elemento selecionado no campo de pesquisa */


/* start pesquisar moeda no campo de seleção */
function selecionarMoeda(){
    pegarElementos('.conteudo__pesquisa').forEach((inputPesquisa) => {
        inputPesquisa.addEventListener('input', valorPesquisado);
    })
}

function valorPesquisado(){
    pegarElemento(`#${this.id} + .conteudo__search-lista`).innerText = ''
    
    moedas.filter((moeda) => {
        return moeda.querySelector('span').innerText.toLowerCase().includes(document.querySelector(`#${this.id}`).value.toLowerCase());

    }).forEach((item) => {
        console.log(this);
        inserirElementos(pegarElemento(`#${this.id} + .conteudo__search-lista`), item)
        item.addEventListener('click', (e)=>{
            document.querySelector(`#${this.id}`).value = e.target.innerText
            pegarElemento(`#${this.id} + .conteudo__search-lista`).classList.remove('lista-v')
        })
    })
}
/* end pesquisar moeda no campo de seleção */
