let aciertos = 0;
let errores = 0;
let preguntas;
let diff;
let contador;
let localS_fecha = [];
let localS_aciertos = [];
let localS_errores = [];
let today;
let porcentaje = 0;
let resultado = 0;
let fechaDown;
let aciertosDown;
let erroresDown;

// ************************ QUIZ **********************************


function getPreguntas(a) {

  let hide_gr = document.getElementById("quizHome"); // Oculta tanto el botón de comienzo del juego como el gráfico
  hide_gr.style.display = "none";
  let hide_ho = document.getElementById("grafica");
  hide_ho.style.display = "none";

  //decodificar caracteres '', "", y acentos a código HTML
  (function(window){
    window.htmlentities = {
      /**
       * Convierte una cadena a sus caracteres html por completo.
       *
       * @param {String} str String with unescaped HTML characters
       **/
      encode : function(str) {
        var buf = [];
        
        for (var i=str.length-1;i>=0;i--) {
          buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
        }
        
        return buf.join('');
      },
      /**
       * Convierte un conjunto de caracteres html en su carácter original.
       *
       * @param {String} str htmlSet entities
       **/
      decode : function(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
      }
    };
  })(window);
  console.log(htmlentities)

  fetch("https://opentdb.com/api.php?amount=5&category=10&difficulty=" + a + "&type=multiple")
    .then(item => item.json())
    .then(data => {
      preguntas = data.results;// Arr con los datos 
      console.log(preguntas)  

      htmlentities.decode(preguntas.forEach((element, index) => { // le hago un Foreach para que itere sobre "preguntas" y con cada una de las preguntas coja la función printQuestion, que lo que hace es pintar los botones y engancharlos en el DOM
        diff = element.difficulty
        contador = (index + 1);
        let respuestas = element.incorrect_answers.concat(element.correct_answer)
        let respuestasDesord = respuestas.sort(() => .5 - Math.random()) // esto es para que salgan las respuestas aleatoriamente colocadas

        printQuestions(element.question, respuestasDesord, element.correct_answer, contador, preguntas.length, diff)// estos son los valores de los parámetros que luego paso a la función PirintQuestion. SON POSICIONALES, por tanto element.question equivale al primera parámetro preguntas...y asi...
        let hide = document.getElementById("seccion_1"); // cuando genrea la primera pregunta, la pone en visible (ya que partimos de que están ocultas todas), solo la primera ya que el id es de la primera sección
        hide.style.display = "block";

      }));
    });
};

const mainDom = document.createElement("main");// creo el main fuera de la func prinQuestion, que a su vez está en la funcion getPreguntas (esta es la que va a crear tantas preguntas como haya) ya que no quiero que me cree un main por cada pregunta que cree, no quiero 10 main, quiero solo 1
document.body.appendChild(mainDom);

function printQuestions(pregunta, respuestas, correcta, contador, longitud, diff) {
  contFin = (contador + "/" + longitud); // Contador de preguntas. Lo pongo al comiezo para que empiece a contabilizar desde la pregunta 1, si lo pongo debajo de prinQuestion, la pregunta 1 sale como undefined
  const sectionDom = document.createElement("section");
  sectionDom.setAttribute("id", "seccion_" + contador);
  sectionDom.setAttribute("class", "borrar") // le añado un id correclativo para cada sección, así puedo identificarlas para mostraras y ocultarlas
  sectionDom.style.display = "none"; // desde el primer momento todas las secciones están en modo OCULTO
  mainDom.appendChild(sectionDom);
  const h2Dom = document.createElement("h2");
  h2Dom.innerText = pregunta; // esta pregunta es el parámetro de la función que ya contiene "question" en la funcion anterior
  sectionDom.appendChild(h2Dom);
  const DivDom = document.createElement("div");
  DivDom.setAttribute("class", "divDom")
  sectionDom.appendChild(DivDom);

  respuestas.forEach(element => {  // hago un forEach para que, cada vez que itere una respuesta, me cree un boton en el DOM
    const buttonDom = document.createElement("button");
    buttonDom.innerText = element;
    buttonDom.setAttribute("class", "buttonDom");
    buttonDom.setAttribute("value", element);
    DivDom.appendChild(buttonDom);
    buttonDom.addEventListener("click", function () { // con este forEach dentro del listener lo que hacemos al hacer click y seleccionar una respuesta es pintar en amarillo todas las ButtonDom 
      let botones = document.getElementsByClassName("buttonDom") // Array de botones con esa clase
      Array.from(botones).forEach(element => { // Lo de Array.from es para convertir botones en un array y que funcione el Foreach
        element.setAttribute("class", "buttonDom");
        element.style.borderColor = "#76D7C4";
      });
      this.style.borderColor = "#F1948A"; // a continuacion con el this del listener le decimos que a la respuesta clicada le damos una nueva clase botonClickado y la pintamos en rojo
      this.setAttribute("class", "botonClickado buttonDom"); // mantengo las dos clases para que cuando haga el CSS sea más fácil identificar los botones para darles estilo 

    });

  });
  const div_Next = document.createElement("div");
  div_Next.setAttribute("class", "div_Next");
  const buttonNext = document.createElement("button");
  buttonNext.setAttribute("class", "buttonNext");
  buttonNext.innerText = "Next";
  div_Next.appendChild(buttonNext);
  sectionDom.appendChild(div_Next);
  const Div_Cont = document.createElement("div");
  const p_cont = document.createElement("p");
  p_cont.setAttribute("id", "p_cont");
  p_cont.innerHTML = diff;
  Div_Cont.setAttribute("id", "contador");
  Div_Cont.innerHTML = contFin; // creo un contador de preguntas realizadas. Lo pongo aquí abajo para que salga al final de las opciones de respuestas
  div_Next.appendChild(Div_Cont);
  Div_Cont.appendChild(p_cont);
  buttonNext.addEventListener("click", () => {

    if (document.getElementsByClassName("botonClickado").length != 1) {
      // si hago un CL de document.getElementsByClassName("botonClickado"), y aparece un array vacio, quiere decir que no ha contestado, y salta la alerta, en cambio, si ha contestado ese array aparece con un elemento, el de la clase botonclickado y pasa al sigiente if
      alert("Mark any answer, please!");
    } else {
      if (document.getElementsByClassName("botonClickado")[0].value == correcta) { // le pongo la posición 0 porque si ha contestado, siempre va a generar un array de una sola posición, ya que nunca pueden estar dos botones clickados a la vez. y le decimos que su value sea igual a correcta, que es el parámetro que le hemos pasado la función.
        aciertos += 1;
        // let txt = ["Correct", "Yes!",  "Well done", "Amazing!", "You're the Best", "Fucking Master!!", "Ohh my Godness!", "Yasss, Queen!", "Marvellous..."];
        // let x = Math.floor(Math.random() * txt.length); // para que salgan alertas random
        // window.alert(txt[x])
      } else {
        errores += 1;
        alert(`Ohh no...Sashay Away!! The correct answer is : ${correcta}`)
      }
      let botones = document.getElementsByClassName("buttonDom"); // vuelvo a copiar esta acción para que pinte todos los botones de nuevo  a la clase botonDom para que si no se contesta a una pregunta, sale el alert
      Array.from(botones).forEach(element => {
        element.setAttribute("class", "buttonDom");
        element.style.borderColor = "#76D7C4";
      });
      sectionDom.style.display = "none";

      // ************************************* RESULTS ***************************************

      if (contador != longitud) {
        // condicional para que, si está en cualquier pregunta que NO es la 10 (ya que longitud es 10), muestre la sección siguiente
        document.getElementById("seccion_" + (contador + 1)).style.display = "block"
      } else { // y si ha llegado a la 10, haga esto

        if (localS_fecha == null && localS_errores == null && localS_aciertos == null) {

          localStorage.setItem('aciertos', JSON.stringify(localS_aciertos));// si está vacío, que crees estas variables [] en el localS
          localStorage.setItem('errores', JSON.stringify(localS_errores));

          today = new Date();
          let hour = String(today.getHours()).padStart(2, "0");
          let minut = String(today.getMinutes()).padStart(2, "0");
          let day = String(today.getDate()).padStart(2, "0");
          let month = String(today.getMonth() + 1).padStart(2, "0");
          let year = today.getFullYear();
          today = `${day}-${month}-${year} ${" "}${hour} ${":"}${minut}`
          localStorage.setItem('fecha', JSON.stringify(localS_fecha));// con esta fórmula creo la variable today para que muestre el día y hora en la que se genera cada partida.Pongo aqui debajo el setittem ya que today debe subirse al LocalStorage una vez inicializada, si pongo antes el localS que crear la avarible, la primera fecha sale undefined
        } else { // condición si el localS no está vacío
          localS_aciertos.push(aciertos);
          localS_errores.push(errores); // primero hago un push de los datos al array

          today = new Date();
          let hour = String(today.getHours()).padStart(2, "0");
          let minut = String(today.getMinutes()).padStart(2, "0");
          let day = String(today.getDate()).padStart(2, "0");
          let month = String(today.getMonth() + 1).padStart(2, "0");
          let year = today.getFullYear();
          today = `${day}-${month}-${year} ${" "}${hour} ${":"}${minut}` // vuelvo a crear today
          localS_fecha.push(today);
          localStorage.setItem('fecha', JSON.stringify(localS_fecha))
          localStorage.setItem('aciertos', JSON.stringify(localS_aciertos));
          localStorage.setItem('errores', JSON.stringify(localS_errores)) // lo guardo todo en el localS
        }
        porcentaje = Math.round((aciertos * 100) / longitud) + `${"%"}`;
        resultado = aciertos + `${"/"}` + longitud;

        const section_res = document.createElement("section");
        section_res.setAttribute("class", "section_res");
        mainDom.appendChild(section_res);
        const h2_res = document.createElement("h2");
        h2_res.setAttribute("id", "h2_res");
        section_res.appendChild(h2_res);
        h2_res.innerText = "And your result is..."
        const div_res = document.createElement("div");
        div_res.setAttribute("id", "div_res");
        section_res.appendChild(div_res);
        const h3_res = document.createElement("h3");
        h3_res.setAttribute("id", "h3_res");
        div_res.appendChild(h3_res);
        h3_res.innerText = porcentaje
        const p_res = document.createElement("p");
        p_res.setAttribute("id", "p_res");
        p_res.innerText = resultado
        h3_res.appendChild(p_res);
        const button_res = document.createElement("button");
        button_res.setAttribute("class", "button_res");
        const img = document.createElement("img");
        img.setAttribute("src", "./img/idea-genial.png")
        img.setAttribute("id", "img_playagain")
        button_res.appendChild(img);
        section_res.appendChild(button_res);
        const p_img = document.createElement("p");
        p_img.setAttribute("id", "p_img");
        p_img.innerText = "Play Again"
        button_res.appendChild(p_img);
        button_res.addEventListener("click", () => {
          let borrar = document.querySelectorAll(".borrar"); // selecciono todas las secciones de preguntas con la clase borrar
          borrar.forEach(element => {
            element.remove() // le hago un foreach para borrar cada una de ellas
          });

          section_res.remove() // borro tambien las secciones de la pantalla de resultados
          document.getElementById("quizHome").style.display = "block"; // muestro la del boton de comenzar y la del gráfico
          document.getElementById("grafica").style.display = "block";
          aciertos = 0;// pongo los contadores a 0 para que no lo acumule el localS
          errores = 0;
          grafico.update({ // actualiza el gráfico
            labels: localS_fecha,
            series: [
              localS_aciertos

            ]

          })
        });

      };

    };

  });


};


// ************************ HOME **********************************


const section_h = document.createElement("section");
section_h.setAttribute("id", "quizHome");
const dificultad = document.createElement("div");
dificultad.setAttribute("id", "dificultad");
const label_dific = document.createElement("label");
label_dific.setAttribute("id", "label_dific");
label_dific.innerHTML = "Difficulty";
const select_dific = document.createElement("select");
select_dific.setAttribute("id", "select_dific");
const option_difc1 = document.createElement("option");
option_difc1.setAttribute("value", "easy");
option_difc1.innerHTML = "Easy"
const option_difc2 = document.createElement("option");
option_difc2.setAttribute("value", "medium");
option_difc2.innerHTML = "Medium"
const option_difc3 = document.createElement("option");
option_difc3.setAttribute("value", "hard");
option_difc3.innerHTML = "Hard"

select_dific.appendChild(option_difc1);
select_dific.appendChild(option_difc2);
select_dific.appendChild(option_difc3);
label_dific.appendChild(select_dific)
dificultad.appendChild(label_dific);
mainDom.appendChild(section_h);

const h4_h = document.createElement("h4");
h4_h.innerText = "QUIZ";
section_h.appendChild(h4_h);
const h3_h = document.createElement("h3");
h3_h.setAttribute("id", "h3_h")
h3_h.innerText = "Test your knowledge";
section_h.appendChild(h3_h);
const button_h = document.createElement("button");
section_h.appendChild(button_h);
button_h.setAttribute("id", "buttonHome");
button_h.setAttribute("type", "text");
const img_start = document.createElement("img");
img_start.setAttribute("src", "./img/grifo.png")
img_start.setAttribute("id", "img_start")
button_h.appendChild(img_start);
button_h.addEventListener("click", function () {
  let a = document.getElementById("select_dific").value
  getPreguntas(a)
});


const section_gr = document.createElement("section");
section_gr.setAttribute("id", "grafica");
mainDom.appendChild(section_gr);

const div_gr = document.createElement("div");
div_gr.setAttribute("id", "quizGraphic")
div_gr.setAttribute("class", "ct-chart ct-perfect-fourth")

section_gr.appendChild(div_gr);
section_gr.appendChild(dificultad);

fechaDown = JSON.parse(localStorage.getItem('fecha')); // aqui recojo los datos del localS para utilizarlos en el gráfico
aciertosDown = JSON.parse(localStorage.getItem('aciertos'));
erroresDown = JSON.parse(localStorage.getItem('errores'));

let grafico = new Chartist.Line('.ct-chart', {
  labels: fechaDown,
  series: [
    aciertosDown
  ]
}, {
  high: 10,
  low: 0,
  fullWidth: false,
  axisY: {
    onlyInteger: true,
    offset: 25
  },
  axisX: {
    offset: 60,
    position: 'end',
  },
  chartPadding: {
    right: 15,
  },

});



