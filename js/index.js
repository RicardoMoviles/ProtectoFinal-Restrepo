let montoDeInversion;
let tiempoDeInversion;
let interesEfectivoAnual;
let mejorTasa;
let diasTasaMasAlta;
let continuarSimulando;
let rendimientos;
let cdt;

const links = [
    {text: "Inicio", url: "./index.html"},
    {text: "Simulador", url: "./simulador.html"},
]

const navBar = document.getElementById("navBar")

links.forEach(link =>{

    const ancla = document.createElement('a');
    ancla.className = "btn btn-dark";
    ancla.textContent = link.text;
    ancla.href = link.url;
    navBar.appendChild(ancla);
})


let tablaTasas = [
        [9.4, 9.5, 10.4, 10.5, 10.6, 10.75, 10.65, 10.25, 9.5, 9.2, 9.2, 9.2],
        [9.4, 9.5, 10.4, 10.5, 10.6, 10.75, 10.65, 10.25, 9.6, 9.3, 9.3, 9.3],
        [9.5, 9.6, 10.5, 10.6, 10.7, 10.85, 10.75, 10.35, 9.7, 9.4, 9.4, 9.4],
        [9.6, 9.7, 10.6, 10.65, 10.75, 10.9, 10.8, 10.45, 9.8, 9.5, 9.5, 9.5],
        [9.6, 9.7, 10.6, 10.65, 10.75, 10.9, 10.8, 10.45, 9.8, 9.5, 9.5, 9.5],
        [9.7, 9.8, 10.7, 10.75, 10.85, 11.00, 10.9, 10.55, 9.9, 9.6, 9.6, 9.6],
        [9.7, 9.8, 10.7, 10.75, 10.85, 11.00, 10.9, 10.55, 9.9, 9.6, 9.6, 9.6],
        [9.3, 9.4, 10.2, 10.25, 10.35, 10.45, 10.4, 10.4, 9.6, 9.3, 9.3, 9.3],
];
let rangoDias = [30, 60, 90, 120, 150, 180, 240, 360, 540, 720, 1080, 1440, 1799];
let rangoMontos = [500, 5000, 20000, 50000, 200000, 500000, 1000000, 5000000];

function asignarTexto (elemento, texto){
    let elementoHTML = document.querySelector(elemento);
    elementoHTML.innerHTML = texto;
}

class Cdt{
    constructor(monto, dias, fechaInicio, rendimientos, interes){
        this.monto = monto;
        this.dias = dias;
        this.fechaInicio = fechaInicio;
        this.rendimientos = rendimientos;
        this.interes = interes;
    }
    montoDias(){
        return `Si inviertes <b>${this.monto}</b> por <b>${this.dias}</b> días`;
    }
    rendimiento(){
        return `Tu rendimiento será de <b>${this.rendimientos}</b>`;
    }
    tasa(){
        return `Con una tasa de <b>${this.interes}</b>`;
    }
    fecha(){
        return `Fecha de Inicio CDT <b>${this.fechaInicio}</b>`;
    }
}

function crearTarjeta (monto, dias, rendimientos, interes){
    cdt = new Cdt(monto, dias, fechaInicio(), rendimientos, interes);
    const cdtCard = document.getElementById("cdtCard")
    cdtCard.innerHTML = `
                    <div class="card" id="info-card-rendimiento">
                        <div class="card-body">
                        <h5 class="card-title">RENDIMIENTO</h5>
                        <p>${cdt.montoDias()}</p>
                        <p>${cdt.rendimiento()}</p>
                        <p>${cdt.tasa()}</p>
                        <p>${cdt.fecha()}</p>
                        <p><b>${(interes == mejorTasa)? "Puedes obtener la mayor tasa de interes con el tiempo escogido": 
                        `La mejor tasa es de ${mejorTasa} entre ${rangoDias[diasTasaMasAlta]} y ${rangoDias[diasTasaMasAlta+1]-1} días`}</b></p>
                        </div>
                    </div>
                    `
}

function buscarFilaTasas(monto){
    const filaTablaTasas = (elemento) => elemento <= monto
    return rangoMontos.findLastIndex(filaTablaTasas);
}

function buscarColumnaTasas(dias){
    const columnaTablaTasas = (elemento) => elemento <= dias
    return rangoDias.findLastIndex(columnaTablaTasas);
}

function buscarTasa (dias, monto){
    return tablaTasas[buscarFilaTasas(monto)][buscarColumnaTasas(dias)];
}

function buscarMejorTasa(monto){
    let tasasrespectivasMonto = tablaTasas.at(buscarFilaTasas(monto));
    mejorTasa = Math.max(...tasasrespectivasMonto);
    diasTasaMasAlta = tasasrespectivasMonto.indexOf(mejorTasa);
}

function calcularRendimiento(monto, dias){
    rendimientos = Math.round(((monto*interesEfectivoAnual)/100)*((dias)/360));
    crearTarjeta(monto, dias, rendimientos, interesEfectivoAnual);
}

function fechaInicio(){
    const  fechaInicio = new Date();
    return fechaInicio.getDate() + "-"+ (fechaInicio.getMonth()+1) + "-" +fechaInicio.getFullYear();;
}

const form = document.getElementById("my-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
	const data = new FormData(event.target);
	montoDeInversion = data.get("monto");
	tiempoDeInversion = data.get("tiempo");
    if(montoDeInversion < 500 || tiempoDeInversion <30) {
        const infoCard = document.getElementById("info-card-rendimiento")
        infoCard != null ? infoCard.remove(): null; 
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa valores validos"
          });
    }else{
        Swal.fire({
            position: "top",
            icon: "success",
            title: "Puedes ver un resumen de tu CDT a continuacion",
            showConfirmButton: false,
            timer: 1500
          });
        interesEfectivoAnual = buscarTasa(tiempoDeInversion, montoDeInversion);
        buscarMejorTasa(montoDeInversion);
        calcularRendimiento(montoDeInversion, tiempoDeInversion);
    
        const cdtJSON = JSON.stringify(cdt);
        localStorage.setItem("cdt", cdtJSON);
        const cdtEnElLocal = localStorage.getItem("cdt");
        //JSON.parse, convierte el JSON, de string a objeto. 
        const cdtObjeto = JSON.parse(cdtEnElLocal);
        console.log(cdtObjeto); 
    }
   
});


asignarTexto('#title-cdt','Simulador Rendimientos CDT');
asignarTexto('#text-description-cdt', 'Por favor ingrese el valor que quiere invertir (minimo 500) y a cuantos días quiere su CDT (minimo 30 maximo 1799)');







