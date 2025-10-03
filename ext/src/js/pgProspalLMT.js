const vObj = new Object();

function mainProspalLMT() {
    try {
        if (validarExistenciaParametros('MRS')) {
            setTimeout(() => {
                console.clear();
                generarClaseProspal();
                completarFormSuperior();
                agregarBotonContinuar();
            }, 2000);
        }
    } catch (error) {
        mostrarAlertaError(error);
    }
}

function agregarBotonContinuar() {
    const filaBotones = obtenerFilas().item(13);
    const divBotones = obtenerElementosPorTags(filaBotones, 'div').item(0).firstElementChild;
    const cantidadItems = vObj.prospal.obtenerListaMaterial().length;

    const btnContinuar = nuevoBoton('btnContinuar', 'btn btn-info', 'Completar Campos');
    const spnIcon = nuevoSpan('spnIcono', 'intelicon-new', '');
    const spnCount = nuevoSpan('spnCounter', '', `Continuar (0/${cantidadItems})`);

    btnContinuar.addEventListener('click', completarFormInferior);

    nuevoContenedor(btnContinuar, [spnIcon, spnCount]);
    nuevoContenedor(divBotones, [btnContinuar]);
}

function generarClaseProspal() {
    const urlParams = obtenerParametrosURL();
    vObj.prospal = urlParams.size > 0 ? new ClassProspal(urlParams.get("MRS"), urlParams.get("WWID"), urlParams.get("ITEMS")) : null;
}

function obtenerFilas() {
    const tabla = document.getElementsByClassName('manualTravelcreatelayoutTable').item(0);
    return tabla.rows;
}

function completarFormSuperior() {
    const contenedor = obtenerObjetoPorID('lab-manual-divider').parentElement;
    const pestañas = obtenerElementosPorTags(contenedor, 'ul').item(0);
    pestañas.lastElementChild.click();

    setTimeout(() => {
        const filas = obtenerFilas();
        const inputMaterialCode = obtenerElementosPorTags(filas.item(2), 'input').item(1);
        inputMaterialCode.value = vObj.prospal.materialCode;
        const inputWWID = obtenerElementosPorTags(filas.item(3), 'input').item(0);
        inputWWID.focus();
        inputWWID.value = vObj.prospal.userID;
        obtenerElementosPorTags(filas.item(3), 'input').item(1).focus();
    }, 2000);
}

function completarFormInferior() {
    //const objProspal = generarClaseProspal();
}