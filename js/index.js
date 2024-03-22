let montoDeInversion;
let tiempoDeInversion;
let interesEfectivoAnual;
let mejorTasa;
let diasTasaMasAlta;
let continuarSimulando;
let rendimientos;
let cdt;
let tablaTasas;
let rangoDias;
let rangoMontos;


const navBar = document.getElementById("navBar")
const links = [
    {text: "Inicio", url: "./index.html"},
    {text: "Simulador", url: "./simulador.html"},
]
links.forEach(link =>{

    const ancla = document.createElement('a');
    ancla.className = "btn btn-dark";
    ancla.textContent = link.text;
    ancla.href = link.url;
    navBar.appendChild(ancla);
})

function cargarJson(){
    fetch('tablas.json')
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        tablaTasas = data.tasas;
        rangoDias = data.rangoDias;
        rangoMontos = data.rangoMontos;
    })
    .catch(error => console.log(error))
}

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

cargarJson();
asignarTexto('#title-cdt','Simulador Rendimientos CDT');
asignarTexto('#text-description-cdt', 'Por favor ingrese el valor que quiere invertir (minimo 500) y a cuantos días quiere su CDT (minimo 30 maximo 1799)');







