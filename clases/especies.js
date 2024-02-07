class Especies {
  constructor(notas, padre1, padre2) {
    this.x = random(width);
    this.y = random(height);

    this.padre1 = padre1;
    this.padre2 = padre2;

    // Propiedades físicas
    this.radio = 15;
    this.xp = 50; //Cae por cansancio o por depredación y aumenta comiendo o depredando
    this.velAgotamiento = 0.015; //Velocidad a la que disminuye el xp por frame
    this.vel = 5; // Velocidad de movimiento
    this.rangoVision = this.radio * 3.5; // Rango de visión.
    this.apareamientos_restantes = 5;
    this.cantHijos = 2; //cantidad de hijos posible
    this.mutante = false;
    this.esDepredador = false;
    this.destello = false; // Propiedad destello (para cuando hay encuentros)

    // Propiedades de interacción con entornos
    this.efectoBosqueAplicado = false; // Indicador para rastrear si tiene un efecto bosque aplicado
    this.efectoDesiertoAplicado = false;

    // Propiedades sonoras
    this.notas = notas
    this.melodia = this.generarMelodia();
    this.melodiaIndex = 0;
    this.cantando = false;    // Flag que indica si el tic está cantando
    this.panner = new Tone.Panner(0).connect(limitador); // Tone.Panner para panear el canto
    this.sintetizador;

    // Propiedades genéticas
    this.pasarMutacion = {
      'augDescendencia': 0,
      'dimDescendencia': 0,
      'augRadio': 0,
      'dimRadio': 0,
      'augVel': 0,
      'dimVel': 0,
      'esDepredador': 0
    }

    this.info = {
      'Speed': this.vel,
      'XP': this.xp,
      'Mates Remaining': this.apareamientos_restantes,
      'Number of Offspring': this.cantHijos,
      'Radius': this.radio,
      'Mutations': this.pasarMutacion
    }

    this.mutar();
  }


  // MÉTODOS

  // Métodos de sonido
  generarMelodia() {
    const duraciones = [0.1, 0.2, 0.3, 0.4, 0.5];
    let melodia = [];

    for (let i = 0; i < 2; i++) { // el segundo argumento del for loop determina la melodia. Si i<2 resulta en silencio-nota-silencio-nota
      const duracionSilencio = random(duraciones);
      melodia.push({ tipo: 'silencio', duracion: duracionSilencio });

      const nota = random(this.notas);
      const duracionNota = random(duraciones);
      melodia.push({ tipo: 'nota', valor: nota, duracion: duracionNota });
    }

    return melodia;
  }

  async canto() {
    const elemento = this.melodia[this.melodiaIndex];
    if (elemento.tipo === 'nota') {
      let panValue = map(this.x, 0, width, -1, 1);  // Mapea la posición x del tic al rango de paneo

      panValue = constrain(panValue, -1, 1);  // Asegura que el mapeo esté dentro de [-1, 1]

      this.panner.pan.value = panValue; // Actualiza el valor del Tone.Panner de acuerdo a la posición x del tic

      this.sintetizador.triggerAttackRelease(elemento.valor, elemento.duracion); // Reproduce cada nota de la melodía en el synth
    }

    await new Promise(resolve => setTimeout(resolve, elemento.duracion * 1000)); // Espera a que el elemento de la melodía termine

    this.melodiaIndex++; // Pasa al siguiente elemento de la melodía

    if (this.melodiaIndex >= this.melodia.length) { // Si llega al final de la melodía, la reinicia
      this.melodiaIndex = 0;
    }
  }

  // Métodos de comportamiento con otrxs tics
  async encuentro(especie_arr) {
    let encuentroEnCurso = false;

    for (let i = 0; i < especie_arr.length; i++) { // Verifica si se produce un encuentro con otros tics de Especie1 y no consigo mismo
      if (especie_arr[i] !== this) {
        let objetivo_x = especie_arr[i].x;
        let objetivo_y = especie_arr[i].y;
        let distancia = dist(this.x, this.y, objetivo_x, objetivo_y);

        if (distancia < this.rangoVision && distancia > 0) {
          encuentroEnCurso = true;

          // Establecer destello en true para ambas instancias involucradas en el encuentro
          this.destello = true;
          especie_arr[i].destello = true;

          break;
        }
      }
    }

    if (encuentroEnCurso && !this.cantando) {
      // El tic canta sólo si hay un encuentro y todavía no está cantando
      this.cantando = true;
      while (encuentroEnCurso) { // Mientras hay un encuentro
        await this.canto(); // el tic canta
        encuentroEnCurso = false; // cuando termina el cuentro, deja de cantar
        for (let i = 0; i < especie_arr.length; i++) {
          let objetivo_x = especie_arr[i].x;
          let objetivo_y = especie_arr[i].y;
          let distancia = dist(this.x, this.y, objetivo_x, objetivo_y);

          if (distancia < this.rangoVision && distancia > 0) {
            encuentroEnCurso = true;
            break;
          }
        }
      }
      // Restablecer destello a false después de que termina el encuentro
      this.destello = false;
      especie_arr.forEach(instancia => (instancia.destello = false));

      this.cantando = false;
    }
  }

  listoParaAparear() {
    if (this.xp >= 70 && this.apareamientos_restantes > 0) {
      return true;
    }
  }

  aparear(especie_arr) {

    for (let i = 0; i < especie_arr.length; i++) {
      let objetivo_x = especie_arr[i].x;
      let objetivo_y = especie_arr[i].y;

      if (this.listoParaAparear() && especie_arr[i].listoParaAparear()) { // Verifica que ambos tics de Especie1 estén en condición de aparear
        let distancia = dist(this.x, this.y, objetivo_x, objetivo_y);

        if (distancia < this.rangoVision && distancia > 0) {
          this.apareamientos_restantes--;
          for (let hijos = 0; hijos <= this.cantHijos; hijos++) {
            if (especie_arr == especie1_array) {
              agregaEspecie1(this.pasarMutacion, especie_arr[i].pasarMutacion); // Le pasa a los hijos los atributos de mutación de sus padres
            }
            else if (especie_arr == especie2_array) {
              agregaEspecie2(this.pasarMutacion, especie_arr[i].pasarMutacion);
            }
          }
          this.xp -= 50; // Aparearse es agotador!

        }
        return true; // Hubo apareamiento
      }
    }
    return false; // No hubo apareamiento
  }

  // Comunica la posición de 'Comida' a otras instancias cercanas de la misma especie
  hayComidaComunicaEspecie(especie_arr) {
    if (this.xp >= 70) {
      const ticsCerca = this.hallarTicsCerca(especie_arr, 200);
      for (const tic of ticsCerca) {
        tic.moverAComida(this.hallarComidaCerca());
      }
    }
  }

  // Hallar otras instancias de la misma especie dentro de un radio específico
  hallarTicsCerca(ticsArray, radio) {
    return ticsArray.filter(tic => {
      const distancia = dist(this.x, this.y, tic.x, tic.y);
      return distancia > 0 && distancia < radio;
    });
  }

  // Método para encontrar la posición de 'Comida' más cercana en un radio específico
  hallarComidaCerca() {
    let minDistancia = this.rangoVision * 1.2;
    let comidaCerca = null;

    for (const comida of comida_array) {
      const distancia = dist(this.x, this.y, comida.x, comida.y);
      if (distancia < minDistancia) {
        minDistancia = distancia;
        comidaCerca = comida;
      }
    }
    return comidaCerca;
  }

  // Método para que instancias cercanas de la misma 'Especie' se acerquen a 'Comida'
  moverAComida(comidaCerca) {
    if (comidaCerca) {
      const angulo = atan2(comidaCerca.y - this.y, comidaCerca.x - this.x);
      this.x += cos(angulo) * (this.vel / 4);
      this.y += sin(angulo) * (this.vel / 4);
    }
  }

  // Métodos de comportamiento individual
  mover(especie_arr) {
    // Se mueve en dirección aleatoria
    this.x += random(-this.vel, this.vel);
    this.y += random(-this.vel, this.vel);

    // Verificar límites y reaparecer en lado contrario si excede pantalla
    if (this.x > width + this.radio) {
      this.x = -this.radio;
    } else if (this.x < -this.radio) {
      this.x = width + this.radio;
    }

    if (this.y > height + this.radio) {
      this.y = -this.radio;
    } else if (this.y < -this.radio) {
      this.y = height + this.radio;
    }

    // Condicional para acercar al tic hacia Comida que vea cerca, siempre que tenga hambre
    if (this.xp < 70) {
      const comidaCerca = this.hallarComidaCerca();
      this.moverAComida(comidaCerca);
    }

    this.hayComidaComunicaEspecie(especie_arr)
  }

  comer(comida_array) {
    for (let i = 0; i < comida_array.length; i++) {
      let objetivo_x = comida_array[i].x;
      let objetivo_y = comida_array[i].y;

      //Verificar colisión con comida y comer si hay capacidad
      let distancia = dist(this.x, this.y, objetivo_x, objetivo_y);

      if (distancia < 10 && distancia > 0 && this.xp <= 95) {
        this.xp += 5;
        comida_array.splice(i, 1);
        return comida_array;
      }
    }
    return comida_array;
  }

  depredar(especie_array) {
    if (this.esDepredador) {
      for (let i = 0; i < especie_array.length; i++) {
        let objetivo_x = especie_array[i].x;
        let objetivo_y = especie_array[i].y;

        //Verificar colisión con presas y comer
        let distancia = dist(this.x, this.y, objetivo_x, objetivo_y);

        if (distancia < this.rangoVision && distancia > 0 && this.xp <= 95) {
          this.xp += 5;
          especie_array.splice(i, 1);
          return especie_array;
        }
      }
      return especie_array;
    } else {
      return especie_array;
    }
  }

  // Disminuir constantemente la xp. Se acelera cuando hay control poblacional.
  agotamiento() {
    if (autorizarComida) {
      this.xp -= this.velAgotamiento;
    }
    else {
      this.xp -= this.velAgotamiento * 10;
    }
  }

  // Verificar si el tic debe morir de hambre
  estaMuerta() {
    return this.xp <= 0;
  }

  realizarMutacion() { //muta sólo si tiene chance de mutar
    let chanceDeMutacion = random(5);
    if (chanceDeMutacion === 0) {
      this.mutar();
    }
  }

  mutar() {
    var genDePadres = {
      'augDescendencia': 0,
      'dimDescendencia': 0,
      'augRadio': 0,
      'dimRadio': 0,
      'augVel': 0,
      'dimVel': 0,
      'esDepredador': 0
    }

    // Ver mutaciones en padres
    for (var mut in this.padre1) {
      if (this.padre1[mut] === 1) {
        genDePadres[mut]++;
      }
    }
    for (var mut in this.padre2) {
      if (this.padre2[mut] === 1) {
        genDePadres[mut]++;
      }
    }

    for (var mut in genDePadres) {

      let mutador_val;

      if (genDePadres[mut] === 0) {
        mutador_val = Math.floor(Math.random() * 30);
      } else if (genDePadres[mut] === 1) {
        mutador_val = Math.floor(Math.random() * 7);
      } else if (genDePadres[mut] === 2) {
        mutador_val = Math.floor(Math.random() * 3);
      }

      if (mutador_val === 0) {

        this.mutante = true;

        switch (mut) {
          case 'esDepredador':
            let chance = Math.floor(Math.random() * 5);
            if (chance <= 3) {
              this.esDepredador = true;
              this.pasarMutacion[mut] = 1;
            }
            break;

          case 'augDescendencia':
            this.cantHijos += Math.floor(Math.random() * 5);
            this.pasarMutacion[mut] = 1;
            break;

          case 'dimDescendencia':
            this.cantHijos -= Math.floor(Math.random() * 3);
            this.pasarMutacion[mut] = 1;

            break;
          case 'augRadio':
            this.radio += Math.floor(Math.random() * 5);
            this.pasarMutacion[mut] = 1;
            break;

          case 'dimRadio':
            this.radio -= Math.floor(Math.random() * 5);
            this.pasarMutacion[mut] = 1;
            break;

          case 'augVel':
            this.vel += Math.floor(Math.random() * 5);
            this.pasarMutacion[mut] = 1;
            break;

          case 'dimVel':
            this.vel -= Math.floor(Math.random() * 5);
            this.pasarMutacion[mut] = 1;
            break;
        }
      }
    }
  }

  //Métodos de comportamiento en entornos
  // Verificar que el tic esté pasando por un bosque. Se le aplica un efecto temporal de aumento de velocidad.
  verificarBosque(bosques) {
    if (!this.efectoBosqueAplicado) {
      for (let bosque of bosques) {
        let distancia = dist(this.x, this.y, bosque.x + bosque.lado / 2, bosque.y + bosque.lado / 2);
        if (distancia < this.radio + bosque.lado / 2) {
          this.efectoBosqueAplicado = true; // Marca que el efecto ha sido aplicado
          this.vel *= 2;
          setTimeout(() => {
            this.vel /= 2;
            this.efectoBosqueAplicado = false;
          }, 5000);
          break;  // Sale del bucle para evitar colisiones adicionales en este ciclo
        }
      }
    }
  }

  // Verificar que el tic esté pasando por un desierto. Se le reduce la velocidad.
  verificarDesierto(desiertos) {
    if (!this.efectoDesiertoAplicado) {
      for (let desierto of desiertos) {
        let distancia = dist(this.x, this.y, desierto.x + desierto.lado / 2, desierto.y + desierto.lado / 2);
        if (distancia < this.radio + desierto.lado / 2) {
          this.efectoDesiertoAplicado = true; // Marca que el efecto ha sido aplicado
          this.vel /= 2;
          setTimeout(() => {
            this.vel *= 2;
            this.efectoDesiertoAplicado = false; // Restablece el indicador después de 0.1 segundos
          }, 100);
          break;  // Sale del bucle para evitar colisiones adicionales en este ciclo
        }
      }
    }
  }

  // No puede pasar por una montaña
  verificarMontania(montanias) {
    for (let montania of montanias) {
      // Verificar si la posición de la especie está dentro del área de la montaña
      if (
        this.x > montania.x &&
        this.x < montania.x + montania.lado &&
        this.y > montania.y &&
        this.y < montania.y + montania.lado
      ) {
        // Cambiar la dirección de movimiento para alejarse de la montaña
        let angulo = atan2(this.y - montania.y, this.x - montania.x);
        this.x += cos(angulo) * this.vel; // Mover en sentido contrario al ángulo
        this.y += sin(angulo) * this.vel;
        break; // Salir del bucle al moverse fuera de una montaña
      }
      break;
    }
  }

}

//SUBCLASES

class Especie1 extends Especies {

  constructor() {

    const notasEspecie1 = ['C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4'];

    super(notasEspecie1);

    this.sintetizador = new Tone.Synth({ // Sintetizador para el canto de cada tic de Especie1
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
      },
    }).connect(this.panner);  // Conecta al Panner
  }

  display() {
    fill(44, 180, 253);
    ellipse(this.x, this.y, this.radio * 2, this.radio * 2);
    noStroke();
    textSize(20);

    if (this.listoParaAparear()) {
      fill(40, 255, 0);
    } else {
      fill(255, 255, 255);
    }
    text(`${Math.floor(this.xp)}`, this.x, this.y)

    if (this.esDepredador) {
      fill(255, 255, 255);
      stroke(33, 62, 104);
      ellipse(this.x, this.y, this.radio, this.radio);
      noStroke();
    } else if (this.mutante) {
      fill(0, 0, 0);
      stroke(0, 0, 0);
      ellipse(this.x, this.y, this.radio, this.radio);
      noStroke();
    }

    this.realizarMutacion();
  }
}

class Especie2 extends Especies {

  constructor() {

    const notasEspecie2 = ['C#4', 'D#4', 'F4', 'G4', 'A4', 'B4', 'C#5', 'D#5', 'F5', 'G5', 'A5', 'B5']; // wholetone
    // const notasEspecie2 = ['C#4', 'D#4', 'E#4', 'G#4', 'A#4', 'C#5', 'D#5', 'E#5', 'G#5', 'A#5']; // pentatonica

    super(notasEspecie2);

    this.sintetizador = new Tone.Synth({ // Sintetizador para el canto de cada tic de Especie2
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
      },
      volume: -10
    }).connect(this.panner);  // Conecta al Panner
  }

  display() {
    fill(168, 13, 170);
    ellipse(this.x, this.y, this.radio * 2, this.radio * 2);
    noStroke();
    textSize(20);
    if (this.listoParaAparear()) {
      fill(40, 255, 0);
    } else {
      fill(255, 255, 255);
    }
    text(`${Math.floor(this.xp)}`, this.x, this.y)
    if (this.esDepredador) {
      fill(255, 255, 255);
      stroke(255, 255, 255);
      ellipse(this.x, this.y, this.radio, this.radio);
      noStroke();
    } else if (this.mutante) {
      fill(0, 0, 0);
      stroke(0, 0, 0);
      ellipse(this.x, this.y, this.radio, this.radio);
      noStroke();
    }

    this.realizarMutacion();
  }
}