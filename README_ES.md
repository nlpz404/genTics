# [gen]Tics

Ecosistema virtual, sonoro e interactivo desarrollado en p5.js y tone.js. El ecosistema está habitado por 'tics', pequeñas células generadoras de sonido. Lxs 'tics' se pueden mover, comer, mutar, y reproducirse con chances de heredar. Lxs usuarixs pueden interactuar con ellxs alimentándolas, alterando su entorno, o modificando algunos de sus parámetros.

Versión online disponible: https://nlpz404.github.io/genTics/

## Reglas

- Tics con un punto negro han desarrollado una mutación.
- Tics con un punto blanco se han vuelto depredadorxs, lo que les permite comer a tics de otra especie.
- Lxs tics pierden constantemente su 'xp', y lo reponen comiendo.
- La comida se regenera cuando quedan menos de 20 comidas en el mapa, o cuando una comida pasa más de 30 segundos sin haber sido devorada.
- Unx tic saciado le informará la posición de la comida que tenga más próxima a otrxs tics de su misma especie que se encuentren cerca.
- Lxs tics cantan cuando se encuentran con otrxs tics de su misma especie.

## Modos de interacción

Acciones sobre el mapa:

- Click para agregar comida
- 'a'+click añade un bosque.
- 's'+click añade un desierto.
- 'd'+click añade una montaña.
    
Botones de interacción:

- Agregar instancias de cada especie.
- Resetear la comida.
- Aumentar temporalmente la velocidad y rango de visión de una especie.

## Instalación y Uso

    1. Cloná este repositorio en tu máquina local.
    2. Abrí el archivo index.html en tu navegador web.

Alternativamente podés ingresar a la versión online: https://nlpz404.github.io/genTics/

## Créditos

Este proyecto se basa parcialmente en el repositorio [Evolution_Simulator](https://github.com/KerrickC/Evolution_Simulator) de [KerrickC](https://github.com/KerrickC). Se ha utilizado parte de su código como punto de partida, el cual ha sido modificado y extendido para adaptarse a las necesidades específicas de [gen]Tics.

## Contribución

Los pull requests son bienvenidos. Para cambios importantes, por favor abrí un issue primero para discutir qué cambios te gustaría realizar.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
