// Variables graficas
var canvas;//Recogeremos el objeto canvas
var ctx; //Variable de la cuadricula del juego
var fps=50; //
var anchoF=20;var altoF=20;//Sera los cuadrados que meteremos en nuestra cuadricula
var sizeTile=16;

// Variables del mapa
var nv=1;
var mapX;
var mapY;
var mapUse;
var maxTile;
var elemUse;
var IDtile;
var IDdecode=[];

// Variables personajes y enemigos
var thanos=[];
var xEnemigo;
var yEnemigo;
var jugador=[];
var xJugador;
var yJugador;

// Variables de elementos
var figura=[];
var xFigura;
var yFigura;
var bucle=[]; // Guardaremos los bucles para su control
var cofre;
var xCofre;
var yCofre;
var puerta;
var xPuerta;
var yPuerta;

// Variables de sonido
var sFondo;
var sPuerta=[];
var sLlave=[];
var sJugador;
var sAtaque;
var sNivel;
var sFire;
var sFirst=true;// Asegurarnos de reproducir la musica 1ª vez
var sBottom=0;  // Posicion de boton

// OBJETOS SONIDOS
// Fondo
sFondo = new Howl({
    src: ['./sound/fondo.ogg'],
    html5: true,
    loop: true
});

// Puertas
sPuerta[0]=new Howl({
    src: ['./sound/openDoor.ogg'],
    html5: true,
    loop: false
});
sPuerta[1]=new Howl({
    src: ['./sound/openDoorG.wav'],
    html5: true,
    loop: false
});
sPuerta[2]=new Howl({
    src: ['./sound/lockedDoor.wav'],
    html5: true,
    loop: false
});

// Llaves
sLlave[0]=new Howl({
    src: ['./sound/key.ogg'],
    html5: true,
    loop: false
});
sLlave[1]=new Howl({
    src: ['./sound/bottom.ogg'],
    html5: true,
    loop: false
});

// Pisadas
sJugador=new Howl({
    src: ['./sound/foot.ogg'],
    html5: true,
    loop: false
});

// Ataque
sAtaque=new Howl({
    src: ['./sound/hurt.ogg'],
    html5: true,
    loop: false
});

// Subir de nivel
sNivel=new Howl({
    src: ['./sound/levelUp.wav'],
    html5: true,
    loop: false
});

// Figuras
sFire=new Howl({
    src: ['./sound/fire.wav'],
    html5: true,
    loop: false
});

// Funcion de reproduccion del fondo y control del boton
function reproducir(ty){
    if(ty==0){
        if(sFirst){
            sFondo.play();
            sFirst=false;
            sBottom=1;
        }
    }
    if(ty==1&&sBottom==0){
        sFondo.play();
        sBottom=1;
        document.getElementById('boton').innerHTML='Con Sonido';
    }else if(ty==1){
        sFondo.stop();
        sBottom=0;
        document.getElementById('boton').innerHTML='Sin Sonido';
    }
}

//Reseteado del mapa =====================
function deleteCanvas(){
    canvas.width=600;
    canvas.heignt=400;            
}
//=======================================

// Eliminador de personajes
function eliminador(key){
    delete jugador[key];
}
//========================

// Funciones de conversiones ===========================
function IDread(ID){
    columna=0;
    fila=0;
    IDreturn=[];
    while (ID>(maxTile*(fila+1))-1){
        fila++;
    }
    columna=ID-((maxTile)*fila);
    IDreturn=[fila,columna];
    return IDreturn
}

function posRead(posElement){
    filElem=0;
    colElem=0;
    posReturn=[];
    filElem=Math.trunc(posElement/100);
    colElem=posElement-filElem*100;
    posReturn=[filElem,colElem];
    return posReturn;

}
// =========================================================

// Funcion de correccion de X para una correcta comparacion con las posicionesguardadas en la lista elem[]
function xCorr(x){
    if(x<10){
        x='0'+x;
    }
    return x;
}

// Generacion del mapa =========================================================================================================
function drawMap(){
    // Determinamos la posición del suelo
    var sueloColum=6; // Para no agrandrar el codigo introduzco ya la traduccion del ID del suelo
    var sueloFila=2;
    
    // Lectura IDs del mapa (i=y || j=x) (fila=y || columna=x)
    for(i=0;i<mapY;i++){
        for(j=0;j<mapX;j++){
            IDtile=mapUse[i][j];

            // Posicionamiento en tile con ID ====================  
            IDdecode=IDread(IDtile);
            //====================================================

            // Dibujado: Primero el suelo (el fondo) y luego el dibujo
            ctx.drawImage(tileMap,sueloColum*16,sueloFila*16,sizeTile,sizeTile,j*anchoF,i*altoF,anchoF,altoF); // Suelo
            ctx.drawImage(
                tileMap,
                IDdecode[1]*16,IDdecode[0]*16,  // Posicion del tile
                sizeTile,sizeTile,              // Tamaño del tile
                j*anchoF,i*altoF,               // Posicion en el canvas
                anchoF,anchoF                   // Tamaño en el canvas
            );
        }
    }
    // Elementos (Piedras)
    for(var i=0;i<5;i++){
        switch (i){
            case 0:
                IDtile=183;
                sizeTile=16;
                break;
            case 1:
                IDtile=184;
                sizeTile=16;
                break;
            case 2:
                IDtile=185;
                sizeTile=16;
                break;
            case 3:
                IDtile=186;
                sizeTile=16;
                break;
            case 4:
                IDtile=182;
                sizeTile=16;
                break;
        }
        // Posicionamiento con ID ============================
        IDdecode=IDread(IDtile);
        //====================================================

        // Leemos sus posiciones
        elemUse[i].forEach( function(posiElem) {
            posDecode=posRead(posiElem);
            ctx.drawImage(tileMap,IDdecode[1]*16,IDdecode[0]*16,sizeTile,sizeTile,posDecode[1]*anchoF,posDecode[0]*altoF,anchoF,altoF);
        });
    }
}

// ===================================================================================================================

// INICIADOR DEL JUEGO Y DE LOS NIVELES
function inicializar(recarga){
    // Creadores elementos mapa======================
    // Tile a usar
    tileMap = new Image();
    tileMap.src = './img/maptile.png';
    maxTile=24;

    // Selector de mapas
    if(nv==1){
        mapUse=map1;
        elemUse=elem1;
        // Tamaño del mapa
        mapX=30;
        mapY=20;
    }else if(nv==2){
        mapUse=map2;
        elemUse=elem2;
        // Tamaño del mapa
        mapX=30;
        mapY=20;
    }else{
        mapUse=map3;
        elemUse=elem3;
        // Tamaño del mapa
        mapX=30;
        mapY=20;
    }
    //=================================================

    // Localizacion canvas
    canvas=document.getElementById('pantalla');

    // Creaccion de coordenadas 2d.
    ctx=canvas.getContext('2d');
    document.getElementById('nivel').innerHTML='Nivel: '+nv;


    // CONSTRUCTORES (elem[n][p]:: [n]=> Elemento || [p]=> Atrubutos ) ===============================================================
    for(var key=0;key<2;key++){ // Solo se generara 2 personajes y 2 enemigos (En el futuro que sea mas movil)
        // Jugadores ([n] = 7 || [p] = Posicion)
        posJugDecode=posRead(elemUse[9][key]);

        // Enemigos ([n] = 10 || [p] = Posicion)
        posEneDecode=posRead(elemUse[10][key]);

        if(recarga==0){ // Si es la primera vez contruimos
            jugador[key]= new persona(key,posJugDecode[0],posJugDecode[1]); // personaje(identificador, posicion Y, posicion X)
            thanos[key]= new enemigo(key,posEneDecode[0],posEneDecode[1]);  // enemigo(identificador, posicion Y, posicion X)
        }else{ // Sino modificamos (Venimos de subir de nivel)
            if(jugador[key]){
                jugador[key].x=posJugDecode[1];
                jugador[key].y=posJugDecode[0];
                jugador[key].llave=false;
                jugador[key].idItems.innerHTML='';
            }
            thanos[key].x=posEneDecode[1];
            thanos[key].y=posEneDecode[0];
        }
    }

    // No se porque no recoge la variable Key
    if(recarga==0){
        setInterval(function(){thanos[0].movimientoRand();},1000);
        setInterval(function(){thanos[1].movimientoRand();},1000);
    }else{
        // Reseteo de bucles (Sino se solapan al generar las nuevas figuras)
        bucle.forEach(function(valor){
            clearInterval(valor);
        }); 
    }

    // ELEMENTOS ESPECIALES (elem[n][p]:: [n]=> Elemento || [p]=> Atrubutos )
    // Puerta ([n] = 5 || [p]{ 0 = Posicion; 1 = Tipo; })
    posDecode=posRead(elemUse[5][0]);
    puerta= new puertas(elemUse[5][1],posDecode[0],posDecode[1]); // puertas(tipo, posicion Y, posicion X)
    setInterval(function(){puerta.animacion();},100);

    // Llaves ([n] = 6 || [p] = Posicion)
    posDecode=posRead(elemUse[6][0]);
    llave= new llaves(elemUse[6][1],posDecode[0],posDecode[1]);
    setInterval(function(){llave.animacion();},100);

    // Figuras
    var keyFig=0;   // Variable para juntar una sucesion de 2 forEach
    figura=[];      // Vaciado de las figuras
    // Toten ([n] = 7 || [p] = Posicion)
    elemUse[7].forEach(function(posicion,key){ // (Posicion, Idetificador de figura)
        posDecode=posRead(posicion);
        figura[keyFig]=new figuras(0,posDecode[0],posDecode[1]);
        bucle[key]=setInterval(function(){figura[key].animacion();},200);
        keyFig=key+1; // Nos llevamos el siguiente identificador. No entiendo esta necesidad para el setInterval
    });
     // Cara ([n] = 8 || [p] = Posicion)
    elemUse[8].forEach(function(posicion,key){
        posDecode=posRead(posicion);
        key=key+keyFig; // Al identificador le sumamos los creados en el anterior forEach. No entiendo esta necesidad para la animacion
        figura[key]=new figuras(1,posDecode[0],posDecode[1]);
        bucle[key]=setInterval(function(){figura[key].animacion();},200);
    });
    
    // ================================================================================================================================

    // Impresion de atributos personajes (Separado y con forEach para prevenir errores si un personaje muere)
    jugador.forEach(function(valor){
        valor.imprNomb();
        valor.imprPuntua();
    });
    
    if(recarga==0){ // Solo si es la primera vez
        //Leer el teclado====================================================
        document.addEventListener('keydown',function(tecla){
            reproducir(0); // NOTA: SE DEBE REPRODUCIR CUANDO EL USUARIO HAYA INTERACTUADO ALGUNA VEZ
            if(jugador[0]){
                // Teclas del jugador 1
                if(tecla.keyCode==38){
                    jugador[0].arriba();
                }
                if(tecla.keyCode==40){
                    jugador[0].abajo();
                }
                if(tecla.keyCode==37){
                    jugador[0].izquierda();
                }
                if(tecla.keyCode==39){
                    jugador[0].derecha();
                }
            }
            if(jugador[1]){
                // Teclas del jugador 2
                if(tecla.keyCode==87){
                    jugador[1].arriba();
                }
                if(tecla.keyCode==65){
                    jugador[1].izquierda();
                }
                if(tecla.keyCode==83){
                    jugador[1].abajo();
                }
                if(tecla.keyCode==68){
                    jugador[1].derecha();
                }
            }
        });
    }
    // Bucle fraccionado de refresco de pantalla
    if(recarga==0){setInterval(function(){principal();},1000/fps);}
}
//=================================================================================

//Funcion principal================================================================
function principal(){
    deleteCanvas();
    drawMap();
    puerta.draw();
    llave.draw();
    for(var i=0;i<2;i++){ // Con for normal porque los enemigos nunca mueren
        thanos[i].draw();
    }
    jugador.forEach(function(valor){
        valor.draw();
    });
    figura.forEach(function(valor){ // Dibujamos tantas figuras como haya en el nivel
        valor.draw();    
    });
}
//===================================================================================