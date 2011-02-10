# Welcome !

RightJS-UI is a collection of standard user-interface widgets
implemented using the RightJS library.



## Builds

All the latests builds of the project are available at the home page

http://rightjs.org/ui

In order to build any widgets on your own you'll need
[NodeJS](http://nodejs.org) and if you also have [npm](http://npmjs.org)
you might want to install the [nake](https://github.com/MadRabbit/Nake)
tools

    npm install nake

After that either run `nake`

    nake build

or, if you don't have [npm](http://npmjs.org), just run the `Nakefile`
directly with [NodeJS](http://nodejs.org)

    node Nakefile build

Try, `-l` or `--list` key to see which other tasks are available



## Options

And you also can build/pack/check only some of the widgets

    nake build OPTIONS=calendar,autocompleter



## License

The code released under terms of the MIT License

Copyright (C) 2009-2011 Nikolay Nemshilov