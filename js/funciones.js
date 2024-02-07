function llamarMetodosEspecies(especies_arr, depredarArray) {
  for (let j = 0; j < especies_arr.length; j++) {
    especies_arr[j].verificarBosque(bosques_array);
    especies_arr[j].verificarDesierto(desiertos_array);
    especies_arr[j].verificarMontania(montanias_array);
    especies_arr[j].mover(especies_arr);
    especies_arr[j].display();
    especies_arr[j].encuentro(especies_arr);
    especies_arr[j].aparear(especies_arr);
    comida_array = especies_arr[j].comer(comida_array);
    especies_arr[j].depredar(depredarArray);
    especies_arr[j].agotamiento();

    if (especies_arr[j].estaMuerta()) {
      especies_arr.splice(j, 1);
    }

    if (autorizarComida) {
      if (especies_arr[j].destello && especies_arr[j].xp > 0) { // Dentro de if(autorizarComida) porque daba error cuando control poblacional
        fill(255, 255, 255, 51);
        noStroke();
        ellipse(especies_arr[j].x, especies_arr[j].y, especies_arr[j].radio * 3, especies_arr[j].radio * 3);
      }
    }
  }
}

function llamarMetodosEntornos(entorno_arr) {
  for (let j = 0; j < entorno_arr.length; j++) {
    entorno_arr[j].display();

    if (!(entorno_arr[j] instanceof Bosque)) {
      entorno_arr[j].eliminarComidaDentro(comida_array);
    }
  }
}

async function iniciarEscena() {  // Cambia el estado de la escena al hacer clic en el botón "Play"
  escenaIniciada = true;
  this.hide();  // Oculta el botón después de iniciada la escena
  mensajeBienvenida.hide();
  await Tone.start();  // Espera a que el contexto de audio se inicie después del clic
}

function agregaEspecie1(padre1, padre2) {
  let p = new Especie1(padre1, padre2);
  especie1_array.push(p);
}

function agregaEspecie2(padre1, padre2) {
  let p = new Especie2(padre1, padre2);
  especie2_array.push(p);
}

function crearEntorno(entorno_arr, condicion, constructor, color) {
  if (condicion && mouseIsPressed) {
    if (!entorno_arr.creado) {
      let nuevoEntorno = new constructor(mouseX, mouseY, 100, color);
      entorno_arr.push(nuevoEntorno);
      entorno_arr.creado = true;
    }
  } else {
    entorno_arr.creado = false;
  }
}

if (autorizarComida) {

  function agregaComida() {
    let v = new Comida();
    comida_array.push(v);
  }

  function reponerComida() { // Se llama cuando hay menos de 20 comidas. Agrega 30 nuevas.
    let num = 30;
    for (let i = 0; i < num; i++) {
      comida_array.push(new Comida());
    }
  }

  function mousePressed() { // Se agrega una nueva Comida en la posición del click.
    if (!keyIsPressed) { // Verifica que ninguna tecla esté presionada
      comida_array.push(new Comida(mouseX, mouseY));
    }
  }

  function reseteaComida() { // Resetea la comida del mapa. La pone en 0 y crea 50 nuevas.
    comida_array = [];
    for (let i = 0; i < 50; i++) {
      agregaComida();
    }
  }

}

function boostEspecie(especie_arr) {
  // Verifica si alguna especie ya está en boost
  let boostActivo = especie_arr.some((tic) => tic.boost);

  // Si ya hay un boost activo, no inicies otro
  if (boostActivo) {
    return;
  }

  // Actualiza temporalmente las propiedades vel y rangoVision
  for (let i = 0; i < especie_arr.length; i++) {
    let tic = especie_arr[i];
    tic.boost = true; // Flag para indicar que la especie está en boost
    tic.vel *= 1.5;
    tic.rangoVision *= 1.5;
  }

  // Muestra el contador al lado del botón
  let temporizadorBoost = createP(10);
  temporizadorBoost.position(width - 250, height + 20);

  // Inicia el contador regresivo
  let tiempoBoost = 10;
  let boostInterval = setInterval(() => {
    tiempoBoost--;
    temporizadorBoost.html(tiempoBoost);

    if (tiempoBoost === 0) {
      clearInterval(boostInterval);
      temporizadorBoost.remove();

      // Restaura las propiedades vel y rangoVision al valor original
      for (let i = 0; i < especie_arr.length; i++) {
        let tic = especie_arr[i];
        tic.boost = false; // Restablece el flag
        tic.vel /= 1.5;
        tic.rangoVision /= 1.5;
      }
      boostActivo = false; // Reestablece el flag
    }
  }, 1000);
}

function verMutaciones(arr) {
  let mutaciones = {
    'augDescendencia': 0,
    'dimDescendencia': 0,
    'augRadio': 0,
    'dimRadio': 0,
    'augVel': 0,
    'dimVel': 0,
    'esDepredador': 0
  };

  for (let i = 0; i < arr.length; i++) {

    let cur_muts = arr[i].pasarMutacion;

    for (let mut in cur_muts) {
      if (cur_muts[mut] === 1 || cur_muts[mut] === 2) {
        mutaciones[mut]++;
      }
    }

  }

  let mutacion_string = `</br>`;
  for (let mut in mutaciones) {
    mutacion_string += `${mut}: ${mutaciones[mut]} </br>`
  }

  return mutacion_string;

}

// Si la población total > 150, se elimina la instancia más antigua de cada especie.
function controlPoblacional() {
  if (especie1_array.length + especie2_array.length > 150) {
    if (especie1_array.length > 0) {
      especie1_array.shift();
    }
    if (especie2_array.length > 0) {
      especie2_array.shift();
    }
  }
}