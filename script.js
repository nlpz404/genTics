// Este código es una versión modificada de 'Evolution Simulator' desarrollado por KerrikC con licencia MIT.
// El código original y su licencia se encuentran en: https://github.com/KerrickC/Evolution_Simulator

let especie1_array = [];
let especie2_array = [];
let especies_array = [especie1_array, especie2_array];

let comida_array = [];

let bosques_array = [];
let montanias_array = [];
let desiertos_array = [];
let entornos_array = [bosques_array, desiertos_array, montanias_array];

// Flags
let bosqueCreado = false;
let desiertoCreado = false;
let montaniaCreada = false;
let escenaIniciada = false; // Variable para rastrear el estado de la escena
let autorizarComida = true; // Cuando la población llegue al límite se desactiva la comida.

// Variables para llamar al DOM
let mensajeBienvenida
let esp1Restante
let esp2Restante
let comidaRestante
let esp1Muts
let esp2Muts

// Sonido
const gain = new Tone.Gain(0.7);
gain.toDestination();
const limitador = new Tone.Limiter(-50);
limitador.connect(gain);

function setup() {

  createCanvas(1000, 600);

  let botonPlay = createButton('Play');  // Agrega un botón "Play" en el centro del canvas
  botonPlay.position(width / 2 - 50, height / 2 - 25);
  botonPlay.size(100, 50);
  botonPlay.mousePressed(iniciarEscena); // Al tocar el botón, va a iniciar la escena (y el audio context)

  mensajeBienvenida = createDiv("Bienvenidx a [gen]Tics!<br>Este es un ecosistema virtual habitado por tics, células sonoras.<br>Podrás interactuar con ellxs de distintas maneras:<br>-Clickea para alimentarlxs.<br>-'a' + click: crea un <font color = 'green'>bosque</font>. Los bosques aumentan la velocidad de lxs tics por 5 segundos.<br>-'s' + click: crea un <font color = 'DarkGoldenRod'>desierto</font>. En los desiertos no crece comida y lxs tics se mueven más lento dentro de ellos.<br>-'d' + click: crea una <font color = 'DarkRed'>montaña</font>. Las montañas son impenetrables.<br><br>Explora los botones que aparecen debajo del mapa, encontrarás otros mecanismos para interactuar con este mundo.");
  mensajeBienvenida.style('background-color', 'lightgray'); // Relleno color gris claro
  mensajeBienvenida.style('font-size', '14px')
  mensajeBienvenida.style('padding', '10px');
  mensajeBienvenida.style('border-radius', '3px')
  mensajeBienvenida.position(width / 8, height / 2 + 40); // Centrado (a ojo) y 10 pixeles debajo de botonPlay

  let especie1_inicial = 5;
  let especie2_inicial = 5;
  let comida_inicial = 50;

  //Crear las instancias iniciales
  for (let i = 0; i < especie1_inicial; i++) {
    agregaEspecie1();
  }

  for (let i = 0; i < especie2_inicial; i++) {
    agregaEspecie2();
  }

  for (let i = 0; i < comida_inicial; i++) {
    agregaComida();
  }

  //UI
  let botonAgregaEspecie1 = createButton('Agrega Especie1 (celeste)');
  botonAgregaEspecie1.position(0, height + 20)
  botonAgregaEspecie1.size(100, 60)
  botonAgregaEspecie1.mousePressed(() => { agregaEspecie1(especie1_array) })

  let botonAgregaEspecie2 = createButton('Agrega Especie2 (violeta)');
  botonAgregaEspecie2.position(100, height + 20);
  botonAgregaEspecie2.size(100, 60)
  botonAgregaEspecie2.mousePressed(() => { agregaEspecie2(especie2_array) });

  let botonReseteaComida = createButton('Resetea comida');
  botonReseteaComida.position(200, height + 20);
  botonReseteaComida.size(100, 60)
  botonReseteaComida.mousePressed(() => { reseteaComida(comida_array) })

  let botonBoostEspecie1 = createButton('Boost Especie1 (celeste)');
  botonBoostEspecie1.position(width - 210, height + 20);
  botonBoostEspecie1.size(100, 60)
  botonBoostEspecie1.mousePressed(() => { boostEspecie(especie1_array) })

  let botonBoostEspecie2 = createButton('Boost Especie2 (violeta)');
  botonBoostEspecie2.position(width - 110, height + 20);
  botonBoostEspecie2.size(100, 60)
  botonBoostEspecie2.mousePressed(() => { boostEspecie(especie2_array) })

  let body = document.body;
  body.style.display = 'flex';

  let main = document.createElement('div');
  main.style.display = 'inline-block';
  main.style.fontSize = '14px'

  let esp1Info = document.createElement('div');
  esp1Restante = document.createElement('p');
  esp1Info.append(esp1Restante);

  let esp2Info = document.createElement('div');
  esp2Restante = document.createElement('p');
  esp2Info.append(esp2Restante);

  let comidaInfo = document.createElement('div');
  comidaRestante = document.createElement('p');
  comidaInfo.append(comidaRestante);

  let esp1MutsInfo = document.createElement('div');
  esp1Muts = document.createElement('p');
  esp1MutsInfo.append(esp1Muts);

  let esp2MutsInfo = document.createElement('div');
  esp2Muts = document.createElement('p');
  esp2MutsInfo.append(esp2Muts);

  main.append(esp1Info);
  main.append(esp2Info);
  main.append(comidaInfo);
  main.append(esp1MutsInfo);
  main.append(esp2MutsInfo);

  body.append(main);

}

function draw() {

  background(32, 33, 36);

  comidaRestante.innerHTML = `Comida restante: ${comida_array.length}`;
  esp1Restante.innerHTML = `Especie1 (celeste) restante: ${especie1_array.length}`;
  esp1Muts.innerHTML = `Especie1 (celeste) mutaciones: ${verMutaciones(especie1_array)}`
  esp2Restante.innerHTML = `Especie2 (violeta) restante: ${especie2_array.length}`;
  esp2Muts.innerHTML = `Especie2 (violeta) mutaciones: ${verMutaciones(especie2_array)}`

  if (escenaIniciada) {

    for (let i = 0; i < especies_array.length; i++) {
      let especies_arr = especies_array[i];
      llamarMetodosEspecies(especies_arr, especies_arr === especie1_array ? especie2_array : especie1_array);

      if (especies_arr.length === 0) {
        autorizarComida = false;
      }

    }

    for (let i = 0; i < comida_array.length; i++) {
      comida_array[i].display();

      if (millis() - comida_array[i].tiempoCreacion > 30000 && autorizarComida) {
        reseteaComida(i); // Si una comida pasa más de 30 segundos en pantalla, se resetea todo el array.
      }
    }

    if (comida_array.length < 20 && autorizarComida) {
      reponerComida(); // Si hay menos de 20 comidas en pantalla, se repone.
    }

    for (let i = 0; i < entornos_array.length; i++) {
      let entorno_arr = entornos_array[i];
      llamarMetodosEntornos(entorno_arr);
    }

    // Creación de entornos
    switch (true) {
      case keyIsDown(65): // 'a'
        crearEntorno(bosques_array, true, Bosque, color(0, 255, 0, 10));
        break;
      case keyIsDown(83): // 's'
        crearEntorno(desiertos_array, true, Desierto, color(255, 255, 0, 10));
        break;
      case keyIsDown(68): // 'd'
        crearEntorno(montanias_array, true, Montania, color(255, 0, 0, 30));
        break;
    }

    controlPoblacional();

  }
}
