class ClassProspal {
    owner = "ENG";
    fabID = "D1D";
    assyID = "A11";
    materialCode = "M";

    constructor(pMRS, pWWID, pITEMS) {
        this.numMRS = pMRS,
            this.userID = pWWID,
            this.listItems = pITEMS
    }

    insertarComentario() {
        return `MRS# ${this.numMRS}`;
    }

    obtenerListaMaterial() {
        const contenido = decodificarValor(this.listItems);
        return JSON.parse(contenido);
    }

    obtenerTotalItems() {
        return this.obtenerListaMaterial().length;
    }
}