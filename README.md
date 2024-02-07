# [gen]Tics
> ReadMe en español disponible [aquí](./README_ES.md).

Virtual, sonic, and interactive ecosystem developed in p5.js and tone.js. This ecosystem is inhabited by 'tics', small sound-generating cells. 'Tics' can move, eat, mutate, and reproduce with chances of inheritance. Users can interact with them by feeding them, altering their environment, or modifying some of their parameters.

Online version available: https://nlpz404.github.io/genTics/.

## Rules

- Tics with a black dot have developed a mutation.
- Tics with a white dot have become predators, allowing them to eat tics from another species.
- Tics constantly lose their 'xp' and replenish it by eating.
- Food regenerates when there are fewer than 20 foods on the map, or when any food has not been eaten for more than 30 seconds.
- A satiated tic will inform the position of the nearest food to nearby tics of its own species.
- Tics sing when they encounter other tics of its own species.

## Interaction

Actions on the map:

- Click to add food.
- 'a' + click adds a forest.
- 's' + click adds a desert.
- 'd' + click adds a mountain.

Interaction buttons:

- Add instances of each species.
- Reset the food.
- Temporarily increase the speed and vision range of a species.

## Installation and Usage

1. Clone this repository to your local machine.
2. Open the index.html file in your web browser.

Alternatively, you can access the online version: [genTics](https://nlpz404.github.io/genTics/).

## Credits

This project is partially based on the [Evolution_Simulator](https://github.com/KerrickC/Evolution_Simulator) repository by [KerrickC](https://github.com/KerrickC). Part of its code has been used as a starting point, which has been modified and extended to suit the specific needs of [gen]Tics.

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
