'use strict';

/**
 * Application flow
 */
$('#splashScreen').click(function(e){
    $('#splashScreen').css('display', 'none');
    $('#menuScreen').css('display', 'flex');
});

$('#play').click(function(e){
    $('#menuScreen').css('display', 'none');
    $('#easelcan').css('display', 'block');
    $('#roundDisplay').css('display', 'block');
    $('#killDisplay').css('display', 'block');
    pause = false;
});

$('#about').click(function(e){
    $('#menuScreen').css('display', 'none');
    $('#aboutScreen').css('display', 'flex');
});

$('#menuButton').click(function(e){
    $('#aboutScreen').css('display', 'none');
    $('#menuScreen').css('display', 'flex');
});

