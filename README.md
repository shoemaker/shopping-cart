# shopping-cart
Bare-bones shopping cart, used for test automation sandbox. Forked from [web-scaffold](https://github.com/shoemaker/web-scaffold).


[ ![Codeship Status for shoemaker/shopping-cart](https://www.codeship.io/projects/8642e760-19ba-0132-f737-1ab97f9d8d9d/status)](https://www.codeship.io/projects/34471)


## Getting Started 

    $> npm install 
    $> bower install 
    $> gulp develop 

Now open your browser to `http://localhost:3000`. 

## Web 

[Express](http://expressjs.com/) is used as the web framework. This project uses a typical MVC pattern. Views use the Handlebars templating engine. Using [LESS](http://lesscss.org/) to pre-process CSS. 

## Tasks 
Tasks are managed using [Gulp](http://gulpjs.com/). 

`$> gulp develop` Compiles and minifies LESS and JS, launches project using nodemon. Watches for file changes to restart the project.  
`$> gulp build` Build out just the files needed for deployment, copies to the `dist` folder.  
`$> gulp test` Run tests defined in the `test` folder.  

## Tests 

A few mock tests are defined in the `test` folder using [mocha](http://mochajs.org/) and [expect.js](https://github.com/LearnBoost/expect.js).  
Two ways to kick off the tests:  

    $> gulp test 
    $> npm test 

## Dependencies

[Simple Cart](http://simplecartjs.org/)  
[jQuery Form Validator](http://formvalidator.net/)
