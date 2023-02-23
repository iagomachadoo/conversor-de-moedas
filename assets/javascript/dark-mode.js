'use strict'

function pegarElemento(elemento){
    return document.querySelector(elemento);
};

/* start modo escuro */
pegarElemento('.header__check').addEventListener('change', pegarEstadoBtnCheked);

function pegarEstadoBtnCheked(e){
    this.checked ? modoEscuro('dark') : modoEscuro('light'); 
}

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

function salvandoTemaEscolhido(tema){
    tema === 'dark' ? localStorage.setItem('tema', 'dark') : localStorage.setItem('tema', 'light');
};

function pegandoTemaEscolhido(){
    const tema = localStorage.getItem('tema');

    if(tema === 'dark'){
        pegarElemento('.header__check').checked = true;
    }
    modoEscuro(tema);
};
/* end modo escuro */