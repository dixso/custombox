## About Custombox:
Modal Window Effects with transitions CSS3. See the [project page](http://dixso.github.io/custombox/) for documentation and a demonstration.

Runs in IE 8-11, Firefox, Chrome, Safari and Opera.

## Bug Reports & Improvements

Found a bug? Please create an issue and include a publicly-accessible demonstration of the bug JSFiddle work well for demonstrating reproducible bugs, but you can use anything as long as it's publicly accessible.

Have an idea that improves Custombox? Please fork this repository, implement your idea (including documentation, if necessary), and submit a pull request to develop.

## Installation

Include the `custombox.min.js` script:

    <script src="custombox.min.js"></script>
    
Include the `custombox.min.css` stylesheet:

    <link rel="stylesheet" href="custombox.min.css">
    
Make sure to also include the legacy.js file along for the older browsers.
    
    <script src="legacy.min.js"></script>

## Basic usage
    document.getElementById('element').addEventListener('click', function ( e ) {
        Custombox.open({
            target: '#modal',
            effect: 'fadein'
        });
        e.preventDefault();
    });
    
## Building Custombox
Before you can build Custombox, you must install and configure the following dependencies on your machine:

- [Node.js](http://nodejs.org/): We use Node to run a development web server, run tests, and generate distributable files. Depending on your system, you can install Node either from source or as a pre-packaged bundle.
- [Grunt](http://gruntjs.com/): We use Grunt as our build system. Install the grunt command-line tool globally with:
        
        npm install -g grunt-cli
        
Once you have your environment setup just run:
    
    grunt init
    
To execute end-to-end (e2e) tests, use:
    
    grunt