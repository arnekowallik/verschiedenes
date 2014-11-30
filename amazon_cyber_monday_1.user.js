// ==UserScript==
// @name        Amazon Cyber Monday - Übersicht v1
// @namespace   ArneKowallik
// @description Zeigt die Deals übersichtlich an
// @include     http://www.amazon.de/gp/angebote/ref=nav_cs_top_nav_gb27*
// @version     1
// @grant       GM_addStyle
// ==/UserScript==

// Lightbox       http://stackoverflow.com/questions/6265574/popup-form-using-html-javascript-css
// Timer-Prototyp http://aktuell.de.selfhtml.org/artikel/javascript/timer/

Function.prototype.Timer = function( interval, calls, onend) {
  var count = 0, payloadFunction = this, startTime = new Date();
  var callbackFunction = function () {
    return payloadFunction( startTime, count);
  };
  var endFunction = function () {
    if (onend) {  onend( startTime, count, calls);  }
  };
  var timerFunction = function () {
    count++;
    if (count < calls && callbackFunction() != false) {
      window.setTimeout( timerFunction, interval);
    } else {  endFunction();  }
  };
  timerFunction();
};

window.addEventListener ( "load", function () {      // todo: not in <iframe>
  
  var box    = document.createElement("div");
  var opener = document.createElement("a");
  
  box.id           = 'lightbox';
  box.innerHTML    = 'Testing out the lightbox';
  opener.id        = 'opener';
  opener.href      = '#';
  opener.innerHTML = 'Click me';
  opener.onclick   = function(){
    
    var lightbox = document.getElementById("lightbox");
    var dimmer   = document.createElement("div");

    dimmer.style.width =  window.innerWidth  + 'px';
    dimmer.style.height = window.innerHeight + 'px';
    dimmer.className = 'dimmer';

    dimmer.onclick = function(){
      document.body.removeChild(this);   
      lightbox.style.visibility = 'hidden';
    }

    document.body.insertBefore( dimmer, document.body.childNodes[0]);

    lightbox.style.visibility = 'visible';
    lightbox.style.top        = '20px';
    lightbox.style.left       = '10px';
    lightbox.style.height     = '50px';
    lightbox.style.width      = window.innerWidth          - 49 + 'px';
    
    console.log( "[TEST] MIDDLE function" );
    
    var breite      = unsafeWindow.Deal.controller.cells[100];
    var curr_page   = document.getElementById( "dealCurrentPage" ).innerHTML;
    var total_pages = document.getElementById( "dealTotalPages"  ).innerHTML;
    var angebote    = [];
    
    function copy_line( zeile ) {
      for (spalte = 0; spalte < breite; spalte++) {
        angebote.push({ html: document.getElementById( "100_dealView"+ spalte ).outerHTML, })
      }
    }
    function show_line( ) {
      var html = '<table style="font-size: small;"><tr>';
      for (i = 0; i < angebote.length; i++) {
        html  += '<td>'+ angebote[i].html +'</td>';
      }
      html    += '</tr></table>';
      lightbox.innerHTML += html; 
    }
    function async_worker ( zeile ) {
      var work = function () {
        var total_pages = document.getElementById( "dealTotalPages" ).innerHTML;
        if (zeile < total_pages) {
          copy_line( zeile );
          zeile++;
          document.getElementById("rightShovelBg").click( );
        } else return false;
      }
      var completed = function () { 
        show_result( );
        lightbox.style.height     = document.body.scrollHeight - 59 + 'px';
      }
      work.Timer( 1000, Infinity, completed); // interval, calls, onend
    }
    
    lightbox.innerHTML = '';
    lightbox.style.height     = '160px';
    
    new async_worker( 0 );
    
    return false;
  };
  
  document.body.insertBefore( box,    document.body.childNodes[0]);
  document.body.insertBefore( opener, document.body.childNodes[0]);
  
  console.log( "[TEST] LOAD fin" );
  
}, false );


//--- Style the control buttons.
GM_addStyle( "                                     \
     #lightbox{                                    \
        visibility:hidden;                         \
        position:absolute;                         \
        background:white;                          \
        border:2px solid #3c3c3c;                  \
        color:white;                               \
        z-index:1100;                              \
        padding:10px;                              \
     }                                             \
     .dimmer{                                      \
        background: #000;                          \
        position: absolute;                        \
        opacity: .5;                               \
        top: 0;                                    \
        z-index:1099;                              \
     }                                             \
" );
