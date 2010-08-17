Welcome !
=========

RightJS-UI is a collection of standard user-interface widgets
implemented using the RightJS library.


Builds
======

All the freshest builds of the project are available at the home page

http://rightjs.org/ui


If you need to build the things by yourself, you'll need Java, Ruby
and Rake tools, after that say in the console the following

    git submodule init
    git submodule update
    
    rake build

If you don't have Java you can use a remote build via google's API

    rake build REMOTE=true

And you also can build only some of the widgets

    rake build OPTIONS=calendar,autocompleter


--

The code released under terms of the MIT License
Copyright (C) 2009-2010 Nikolay Nemshilov