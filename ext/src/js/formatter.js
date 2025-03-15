function crearPopoverError() {
    const divErr = nuevoDIV('msgError', 'msgError p-0');
    const popMain = nuevoDIV('popMain', 'card');
    const popHead = nuevoDIV('popHeader', 'card-header py-2')
    const spnTitle = nuevoSpan('msgTitle', 'msgTitle', 'Atención!!');
    const btnErr = nuevoInputBtn('button', 'btnErr', 'btnErr', 'btnErr', 'X');
    const popBody = nuevoDIV('popBody', 'card-body p-3');
    const parrP1 = nuevoParrafo('ppTitle', 'ppTitle', '¡Ocurrió un error!');
    const parrP2 = nuevoSpan('ppMore', 'ppMore', 'Error: Error...');

    addAtributo(divErr, 'popover', 'manual');
    addAtributo(btnErr, 'popovertarget', 'msgError');

    nuevoContenedor(popHead, [spnTitle, btnErr]);
    nuevoContenedor(popBody, [parrP1, parrP2]);
    nuevoContenedor(popMain, [popHead, popBody]);
    nuevoContenedor(divErr, [popMain]);
    insertarElementoPorTag('body', divErr);
}