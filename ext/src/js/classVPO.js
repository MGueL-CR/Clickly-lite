class ClassVPO {
    caja = 1;
    urlVortex =
        "https://vortexreports.intel.com/Reports/Card/RunCardFilter.aspx";

    constructor(pNumero, pCantidad, pMaquina) {
        this.numero = pNumero;
        this.cantidad = pCantidad;
        this.maquina = pMaquina;
    }

    convertirATexto() {
        return JSON.stringify({
            'numero': this.numero,
            'cantidad': this.cantidad,
            'maquina': this.maquina
        });
    }

    generarEnlace() {
        return `${this.urlVortex}?${codificarValor(this.convertirATexto())}`;
    }

    guardarVPO() {
        guardarValorEnSS("WOTemp", this.convertirATexto());
    }

    obtenerComentario() {
        return `${this.numero} // QTY ${this.cantidad} // ${this.maquina}`;
    }

    mostrarInformacion() {
        return `\n\nVPO: - ${this.numero}\n\t  - ${this.maquina}\n\t  - Qty: ${this.cantidad}\n`;
    }
}