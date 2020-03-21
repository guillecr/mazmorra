// TOTEN y CARA
var figuras=function(ty,y,x){
    this.x=x;
    this.y=y;
    // Definir sus posiciones de bloqueo de movimiento. Lo logico es meterlo en el switch dado que hay figuras animadas mas pequeñas.
    // Sin embargo solo uso 2 iguales.
    // En el futuro meterlo y añadir el resto de figuras
    this.posicion=[];
    this.posicion[0]=(this.y+2)+''+xCorr(x);      // Posicion real
    this.posicion[1]=(this.y+2)+''+xCorr(x+1);  // Posicion real
    this.posicion[2]=(this.y+1)+''+xCorr(x);    // Posicion real
    this.posicion[3]=(this.y+1)+''+xCorr(x+1);  // Posicion real
    switch(ty){
        case 0:
            this.IDtile=88; // Toten
            this.IDtileReal=88 //IDtile sin modificar (necesario para retomar al original y calcular el modificado)
            this.maxTile=1;
            this.alto=3;
            this.ancho=2;
            break;
        case 1:
            this.IDtile=16; // Cara
            this.IDtileReal=16 // IDtile sin modificar
            this.maxTile=1;
            this.alto=3;
            this.ancho=2;
            break;
    }

    this.cont=0; // Contador y determinador la modificacion del IDtile. Inicia sin modificación (Para animacion)

    // Funcion de dibujado
    this.draw=function(){

        // Posicionamiento con ID ============================
        this.IDdecode=IDread(this.IDtile);
        //====================================================
        ctx.drawImage(
            tileMap,
            this.IDdecode[1]*16,this.IDdecode[0]*16, // Posicion del tile
            this.ancho*16,this.alto*16, // Tamaño del tile
            this.x*anchoF,this.y*altoF, // Posicion en el canvas
            this.ancho*anchoF,this.alto*altoF // Tamaño en el canvas
            );
    }
    // Secuencia para animacion
    this.animacion=function(){
        this.cont++; // Recorre las tile de animacion
        if(this.cont>this.maxTile){ // Si nos vamos de su maximo volvemos a la posicion inicial
            this.IDtile=this.IDtileReal; // Retomamos posicion original
            this.cont=0;
        }
        this.IDtile=this.IDtileReal+(this.ancho*this.cont); // Modificacion de la ID con el modificador (cont*ancho. Si cont=0 no se modifica)  
    }
}

//PUERTA
var puertas=function(ty,y,x){
    this.x=x;
    this.y=y;
    this.ID=ty;
    this.firstSound=true;
    switch(ty){
        case 0: // Puerta normal
            x=xCorr(this.x);
            this.posicion=this.y+''+x;     // Posicion real
            this.postActi=(this.y+1)+''+x; // Posición de activación
            this.IDtile=172;
            this.maxTile=3;
            this.alto=1;
            this.ancho=1;
            break;
        case 1: // Compuerta
            x=xCorr(this.x+1); // +1 Por ser una puerta ancha
            this.posicion=(this.y+1)+''+x; // Posicion real
            this.postActi=(this.y+2)+''+x; // Posición de activación (no necesario, es por boton)
            this.IDtile=192;
            this.maxTile=4;
            this.alto=2;
            this.ancho=3;
            break;
    }

    this.cont=0; // Contador de animacin 
    this.activar=false; // Estado de la puerta (false = No se abre // Se puede activar=abrir). 
                        // Para abrir la puerta el personaje necesita la llave y estar en la posicion de activación

    // Dibujado
    this.draw=function(){

        // Posicionamiento con ID ============================
        this.IDdecode=IDread(this.IDtile);
        //====================================================
        ctx.drawImage(
            tileMap,
            this.IDdecode[1]*16,this.IDdecode[0]*16, // Posicion del tile
            this.ancho*16,this.alto*16, // Tamaño del tile
            this.x*anchoF,this.y*altoF, // Posicion en el canvas
            this.ancho*anchoF,this.alto*altoF // Tamaño en el canvas
            );
    }
    // Secuencia para animacion
    this.animacion=function(){
        if(this.activar==true && this.cont<this.maxTile){   // Si la puerta es activada recorremos su animacion hasta el final.
                                                            // Llegados mantenemos la IDtile activada
            this.IDtile=this.IDtile+this.ancho;
            this.cont++;
            this.reproducir();
        }
    }
    this.reproducir=function(){
        if(this.firstSound){
            sPuerta[this.ID].play();
        }
        this.firstSound=false;
    }
}

// Llave
var llaves=function(ty,y,x){
    this.x=x;
    this.y=y;
    x=xCorr(x);
    this.posicion=this.y+''+x; // Posicion real
    this.postActi=(this.y+1)+''+x; //Posición de activación
    this.ID=ty;
    this.firstSound=true;
    switch(ty){
        case 0: // Cofre
            this.IDtile=176;
            this.IDnum=5;
            this.boton=false;
            break;
        case 1: // Boton
            this.IDtile=120;
            this.IDnum=6;
            this.boton=true; // Capacidad de activar la puerta
            break;
    }

    // Tamaño uniforme para los 2 tipos
    this.alto=16;
    this.ancho=16;

    this.cont=0; // Contador de animacion
    this.activar=false; // Misma propiedad que en la puerta pero con libertad de actvacion (no requiere llave el personaje)
    this.draw=function(){

        // Posicionamiento con ID ============================
        this.IDdecode=IDread(this.IDtile);
        //====================================================
        ctx.drawImage(
            tileMap,
            this.IDdecode[1]*16,this.IDdecode[0]*16, // Posicion del tile
            this.ancho,this.alto, // Tamaño del tile
            this.x*anchoF,this.y*altoF, // Posicion en el canvas
            anchoF,anchoF // Tamaño en el canvas
            );
    }
    this.animacion=function(){
        if(this.activar==true && this.cont<this.IDnum){ // Si es activado recorre las IDtile de animacion hasta llegar a su tope
                                                        // Ahí para, guardando la ultima posicion (activado)
            this.cont++;
            this.IDtile++;
            if(this.boton){ // Si es boton activa la puerta
                puerta.activar=true;
            }
            this.reproducir();
        }    
    }
    // Funcion de sonido para solo 1ª vez
    this.reproducir=function(){
        if(this.firstSound){
            sLlave[this.ID].play(); 
        }
        this.firstSound=false;
    }   
}