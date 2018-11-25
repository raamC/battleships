Generate battleships puzzles for fun.

Try and find all the ships, given the information on the ends of the rows and columns.

In main.js it is possible to configure the starting number and size of the ships, along with the size of the grid and the number of cells to reveal.


----------

Written in javascript using rollup.js. This allows you to separate the js code into modules, making it much easier to read and to reason about. The separate js files live in `/src` and are bundled by rollup.js into the `bundle.js` file. This is done using a CLI and running 

`rollup -c` 

which takes the config from `rollup.config.js`.