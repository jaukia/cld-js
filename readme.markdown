cld.js
======

Detect the langugage of any piece of text &mdash; the text goes in and a language comes out. This is a Javascript port of the Compact Language Detector from Chromium.

Compactness is relative: cld.js is 1 MB minified and gzipped, 3 MB just minified and 9.6 MB in its original form.

Cld.js provides function _detectLangugage(text)_ which returns the name of the language of the text.

To see an example:

* In a browser, open _"demo.html"_. For now, works only in Chrome and Firefox.

* On Node.js, run _"node demo-node.js"_.

Note that the porting may have caused degradation in the language detection! The library has not been much tested.

Origins and license
-------------------

The library is extracted from the source code for Google's Chromium library:

http://src.chromium.org/svn/trunk/src/third_party/cld

The extracted version is based on the version extracted by Mike McCandless:

http://code.google.com/p/chromium-compact-language-detector/

http://blog.mikemccandless.com/2011/10/language-detection-with-googles-compact.html

The LICENSE is the same as Chromium's LICENSE (which is used in the extracted version as well).

Building
--------

1. Put Emscripten (or a link to it) into the folder _"emscripten"_ and install all its requirements.

2. Install uglify.js by running:

        npm uglify-js

3. Run:

        cd src
        sh build.sh
        node minify.js

What was done
-------------

Main parts for getting the library to port to javascript:

* The extracted source code of the library was first taken from:

http://src.chromium.org/svn/trunk/src/third_party/cld

* _"src/cldapp.cc"_ was made based on the _"example.cc"_

* _"src/build.sh"_ was tuned to use Emscripten

* _"src/base/build_config.h"_ was tuned to hard-code os and architecture defines

* _"src/minify.js"_ and _"src/assets/*.js"_ were added to compress the file, wrap it in a function and clean the code 

Ideas for further work
----------------------

* Have a pretty API for getting the reliability of the detection and the language code in addition of the language name.

* Make it compress under 1MB :).

* Make some nice tweet or news article demo

* Use the library for something

* Create tests or port the original ones from Chromium