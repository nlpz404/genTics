class Entornos {
  constructor(x, y, lado, color) {
    this.x = x;
    this.y = y;
    this.lado = lado;
    this.color = color;
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.lado, this.lado);
  }

  // Método para eliminar instancias de Comida dentro del área de la montaña y desierto
  eliminarComidaDentro(comida_arr) {
    for (let i = comida_arr.length - 1; i >= 0; i--) {
      let comida = comida_arr[i];
      // Verificar si la posición de la comida está dentro del área
      if (
        comida.x > this.x &&
        comida.x < this.x + this.lado &&
        comida.y > this.y &&
        comida.y < this.y + this.lado
      ) {
        // Eliminar la instancia de comida del array
        comida_arr.splice(i, 1);
      }
    }
  }

}

class Bosque extends Entornos {}

class Desierto extends Entornos {}

class Montania extends Entornos {}