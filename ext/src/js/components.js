function nuevoDIV(pId, pClase) {
    const elemento = crearElemento("div");
    elemento.id = pId;
    elemento.className = pClase;
    return elemento;
}

function nuevoLabel(pReferencia, pValor) {
    const elemento = crearElemento("label");
    elemento.textContent = pValor;
    elemento.htmlFor = pReferencia;
    return elemento;
}

function nuevoInput(pTipo, pId, pNombre, pClass) {
    const elemento = crearElemento("input");
    elemento.id = pId;
    elemento.name = pNombre;
    elemento.type = pTipo;
    elemento.className = pClass;
    return elemento;
}

function nuevoInputBtn(pTipo, pId, pNombre, pClass, pValue) {
    const elemento = nuevoInput(pTipo, pId, pNombre, pClass);
    elemento.value = pValue;
    return elemento;
}

function nuevoSpan(pId, pClass, pValor) {
    const elemento = crearElemento('span');
    elemento.textContent = pValor
    elemento.id = pId;
    elemento.className = pClass;
    return elemento;
}

function nuevoParrafo(pId, pClass, pValor) {
    const elemento = crearElemento('p');
    elemento.id = pId;
    elemento.className = pClass;
    elemento.textContent = pValor;
    return elemento;
}

function nuevoBoton(pId, pClass, pTitle, pColor) {
    const elemento = crearElemento("button");
    elemento.id = pId;
    elemento.title = pTitle;
    elemento.type = "button";
    elemento.className = pClass;
    elemento.style.setProperty("--thisColor", pColor);
    return elemento;
}

function nuevoFormulario(pId, pClass, pMetodo) {
    const elemento = crearElemento('form');
    elemento.id = pId;
    elemento.method = pMetodo;
    elemento.className = pClass;
    return elemento;
}

function nuevoDialogo(pId, pClases) {
    const elemento = crearElemento('dialog');
    elemento.id = pId;
    elemento.className = pClases;
    return elemento;
}

function nuevoIcono(pId, pClass) {
    const elemento = crearElemento('i');
    elemento.id = pId;
    elemento.className = pClass;
    return elemento;    
}

function nuevoCombo(pId, pClases) {
    const elemento = crearElemento('select');
    elemento.id = pId;
    elemento.className = pClases;
    return elemento;
}

function nuevaOpcion(pValor, pTexto) {
    const elemento = crearElemento('option');
    elemento.value = pValor;
    elemento.textContent = pTexto;
    return elemento;
}

function nuevoContenedor(pDivPadre, pItems) {
    pItems.forEach(iItem => {
        pDivPadre.appendChild(iItem);
    });
}