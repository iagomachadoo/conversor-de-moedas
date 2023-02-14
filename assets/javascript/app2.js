'use strict'


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

/* Criando lista de moedas */
const urlListaMoedas = './json/resposta-lista-moedas.json';

function pegarFlag(flag){
    return `https://www.countryflagicons.com/FLAT/24/${flag}.png`
}

let nomeMoedas = [];

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
            nomeMoedas.push(criarItem(pegarFlag(siglaFlag), nomeMoeda));

            pegarElementos('.conteudo__search-lista').forEach((item)=>{
                inserirElementos(item, criarItem(pegarFlag(siglaFlag), nomeMoeda))
            })
        };
    });

    esconderListaFlag()
};

/* Fazendo a conversão de valores */
async function converterValores(moedaRef, moedaAlvo, valorASerConvertido){
    //const respostaConversao = await fetch(`https://v6.exchangerate-api.com/v6/465de5fb1516f6aa0d01062f/pair/${moedaRef}/${moedaAlvo}/${valorASerConvertido}`);

    //const jsonResposta = await respostaConversao.json();

    //const resultadoDaConversao = jsonResposta.conversion_result
    //return resultadoDaConversao
}
/* converterValores(moedaLeft()) */


/* Criando os itens da lista de moedas */
function criarItem(url, texto){
    const elItem = criaelementoEAtributo('li', 'class', 'item')
    const elImg = criaelementoEAtributo('img', 'src', url)
    const elSpan = criaelementoEAtributo('span', 'class', 'texto')
    
    elSpan.innerText = texto
    inserirElementos(elItem, elImg)
    inserirElementos(elItem, elSpan)
    
    return elItem
}

/* Pegando valores a serem convertidos */
function pegarValorInput(id){
    const inputValor = pegarElemento(id).value;
    /* inputValor.addEventListener('change', (e) => {return e.target.value}) */
    return inputValor
}

/* Convertendo valores */
const btnConverter = pegarElemento(".conteudo__btn-converter");
btnConverter.addEventListener('click', (e) => {
    const valorInputLeft = pegarValorInput("#valor-left");
    const valorInputRight = pegarValorInput("#valor-right");
    console.log(valorInputLeft);
    console.log(valorInputRight);
})

puxarDadosListaMoedas();

/* Mostrando/ocultando lista ao clicar no campo de pesquisa */
pegarElementos('.conteudo__pesquisa').forEach((item) => {
    item.addEventListener('click', (e)=>{
        if(e.target.id === "pesquisa-left"){
            const classes = pegarElemento('#pesquisa-left + .conteudo__search-lista').classList;
            if(classes.contains('lista-v')){
                classes.remove('lista-v');
            }else{
                classes.add('lista-v');
            }
        }else{
            const classes = pegarElemento('#pesquisa-right + .conteudo__search-lista').classList;
            if(classes.contains('lista-v')){
                classes.remove('lista-v');
            }else{
                classes.add('lista-v');
            }
        }
    })
})


/* Pesquisa para selecionar moeda pelo nome */
document.querySelector('#pesquisa-left').addEventListener('input', (e)=> {
    pegarElementos('#pesquisa-left + .conteudo__search-lista').forEach((item) => {
        item.innerText = '';
    })

    nomeMoedas.filter((item) => 
        item.querySelector('span').innerText.toLowerCase().includes(document.querySelector('#pesquisa-left').value.toLowerCase())
    ).forEach((item) => {
        inserirElementos(pegarElemento('#pesquisa-left + .conteudo__search-lista'), item)
        item.addEventListener('click', (e)=>{
            document.querySelector('#pesquisa-left').value = e.target.innerText
            pegarElemento('#pesquisa-left + .conteudo__search-lista').classList.remove('lista-v')
        })
    })
})

document.querySelector('#pesquisa-right').addEventListener('input', (e)=> {
    pegarElementos('#pesquisa-right + .conteudo__search-lista').forEach((item) => {
        item.innerText = '';
    })

    nomeMoedas.filter((item) => 
        item.querySelector('span').innerText.toLowerCase().includes(document.querySelector('#pesquisa-right').value.toLowerCase())
    ).forEach((item) => {
        inserirElementos(pegarElemento('#pesquisa-right + .conteudo__search-lista'), item)
        item.addEventListener('click', (e)=>{
            document.querySelector('#pesquisa-right').value = e.target.innerText
            pegarElemento('#pesquisa-right + .conteudo__search-lista').classList.remove('lista-v')
        })
    })
})

function esconderListaFlag(){
    document.querySelectorAll('.conteudo__search-lista li').forEach(item => {
        item.addEventListener('click', (e)=>{
            console.log(e.target);
            document.querySelector('.conteudo__search-lista').classList.remove('lista-v')
            
        })
    });
}

/* Redimensionando lista de moedas */
window.addEventListener('resize', (e)=>{
    const larguraCampoPesquisa = pegarElemento('.conteudo__pesquisa').getBoundingClientRect().width;
    const listaMoedas = pegarElementos('.conteudo__search-lista')
    listaMoedas.forEach((item) => {
        item.style.width = `${larguraCampoPesquisa}px`;
    })
})