/*btn jugar*/
$('#btn-jugar').click(
    function () {
        $('.oculto').removeClass('oculto');
        $('.container-width').addClass('oculto');
    }
);
/*Cerrar modal*/
$('#cerrar').click(
    function () {
        $('.oculto').removeClass('oculto');
        $('.container-width').addClass('oculto');
    }
);

import {
    PALABRAS
} from './words.js';

//Array de palablas existentes
import {
    PALABRASEX
} from './palabras.js';




const numero_intentos = 6;
let intentosRestantes = numero_intentos;
let palabraActual = [];
let siguienteLetra = 0;
let palabraCorrecta = PALABRAS[Math.floor(Math.random() * PALABRAS.length)]
// console.log(palabraCorrecta)


//Creamos la pizarra
function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < numero_intentos; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) { //van a ser palabras de 5 letras
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

//Programamos las letras
$('.keyboard-button').click(
    function () {
        if ($('.keyboard-button').css("class", "borderBlue")) {
            $('.keyboard-button').removeClass("borderBlue");
        }

        $(this).addClass("borderBlue");
        if (intentosRestantes === 0) {
            console.log('sale de la función')

        };
        if ($(this).text() == "enviar") {
            if (siguienteLetra != 5) {
                alert('No hay suficientes letras')
                return
            }
            comprobarResultado();

        };
        if ($(this).val() == "borrar") {
            borrarLetra();
            return
        };

        let letra = $(this).text();

        if (letra != 'enviar') {
            introducirLetra(letra);
        };

    }
)

function introducirLetra(letra) {
    if (siguienteLetra === 5) {
        return
    }

    let fila = $(".letter-row")[6 - intentosRestantes]
    let box = fila.children[siguienteLetra]
    animateCSS(box, "pulse")
    box.textContent = letra
    box.classList.add("filled-box")
    palabraActual.push(letra)
    siguienteLetra += 1
}

function borrarLetra() {
    if (siguienteLetra != 0) { //comprobamos que haya letras antes de borrarlas
        let fila = $(".letter-row")[6 - intentosRestantes]
        let box = fila.children[siguienteLetra - 1]
        box.textContent = ""
        box.classList.remove("filled-box")
        palabraActual.pop()
        siguienteLetra -= 1
        console.log(palabraActual.join(''));
    }

}

function comprobarResultado() {
    //  console.log(palabraCorrecta);
    // console.log(palabraActual.join(''));
  
    let fila = $(".letter-row")[6 - intentosRestantes]
    let arrayPalabraCorrecta = Array.from(palabraCorrecta); //pasamos la palabra correcta a 1 array

    //Comprobamos que está en la lista
    if (!PALABRASEX.includes(palabraActual.join(''))) {
        alert('Esa palabra no está en la lista.');
        return
    }

    for (let i = 0; i < 5; i++) {
        let colorLetra = '';
        let box = fila.children[i];
        let letra = palabraActual[i];

        let posicionLetra = arrayPalabraCorrecta.indexOf(letra);
        // console.log('letra ' + i + ' ' + posicionLetra);

        if (posicionLetra === -1) {
            colorLetra = '#787c7e';//gris

        } else {
            //Si las letras NO están repetidas
            if (palabraActual.indexOf(letra, i + 1) == -1) {
                if (palabraActual[i] === arrayPalabraCorrecta[i]) {
                    colorLetra = '#6aaa64'//verde
                } else {
                    colorLetra = '#c9b458'//amarillo
                }
                arrayPalabraCorrecta[posicionLetra] = "#";
            } else {//SI se repite la letra
                if ((palabraActual[i] !== arrayPalabraCorrecta[i])) {
                    colorLetra = '#787c7e';//gris
                } else if (palabraActual[i] === arrayPalabraCorrecta[i]) {
                    colorLetra = '#6aaa64'//verde
                    arrayPalabraCorrecta[posicionLetra] = "#";
                }
            }

            /* console.log(arrayPalabraCorrecta);
            console.log(palabraActual); */
        }

        let delay = 300 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            //sombreado
            box.style.backgroundColor = colorLetra
            colorTeclado(letra, colorLetra)
        }, delay)
    }

    if (palabraCorrecta == palabraActual.join('')) {
        alert("Has acertado! Enhorabuena!")
        intentosRestantes = 0
        $('#btn-volverJuego').removeClass('btnOculto');
        return
    } else {
        intentosRestantes -= 1;
        palabraActual = [];
        siguienteLetra = 0;

        if (intentosRestantes === 0) {
            alert("No te quedan más intentos! Fin del Juego!")
            alert(`La palabra correcta era: "${palabraCorrecta}"`)
        }
    }
}

function colorTeclado(letra, color) {
    let teclado = document.getElementsByClassName("keyboard-button");
    for (const teclas of teclado) {
        if (teclas.textContent === letra) {
            // console.log(letra);
            // console.log(color);
            let oldColor = teclas.style.backgroundColor
            // console.log(oldColor);
            if ((color === '#787c7e') && ((oldColor === 'rgb(106, 170, 100)') || (oldColor === 'rgb(201, 180, 88)'))) {
                return
            }
            if (oldColor === '#6aaa64') {//si el color anterior es verde, sale
                return
            }

            if (oldColor === '#c9b458' && color !== '#6aaa64') {//si el color anterior es amarillo y el que se pasa es distinto de verde, sale
                return
            }
            teclas.style.backgroundColor = color;
            break
        }
    }
}

//Poner las animaciones
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element
        node.style.setProperty('--animate-duration', '0.5s');

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

//evento botón volver a jugar
$('#btn-volverJuego').click(
    function () {
    //volvemos a inicializar las variables globales
        intentosRestantes = numero_intentos;
        palabraActual = [];
        siguienteLetra = 0;
        palabraCorrecta = PALABRAS[Math.floor(Math.random() * PALABRAS.length)]
        console.log(palabraCorrecta);

        //vaciamos la pizarra y volvemos a llamar a la función que la crea
        $('#game-board').empty();
        initBoard();

        //reiniciamos los colores del teclado
        let teclado = document.getElementsByClassName("keyboard-button");
        for (const teclas of teclado) {
            teclas.style.backgroundColor='';
        }

        //por último, escondemos el botón de volver a jugar
        $('#btn-volverJuego').addClass('btnOculto');
        

    }
)