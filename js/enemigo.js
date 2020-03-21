var enemigo=function(ty,y,x){
    this.size=16;
    switch(ty){
        case 0: // Enemigo 1
            this.IDtile=164;
            break;
        case 1: // Enemigo 2
            this.IDtile=165;
            break;
    }
    this.x=x;
    this.y=y;

    // Funcion dibujado ======================================================
    this.draw=function(){

        // Posicionamiento con ID ============================
        this.IDdecode=IDread(this.IDtile);
        //====================================================

        ctx.drawImage(
            tileMap,
            this.IDdecode[1]*16,this.IDdecode[0]*16, // Posicion del tile
            this.size,this.size,        // Tamaño del tile (ancho por alto)
            this.x*anchoF,this.y*altoF, // Posicion en el canvas
            anchoF,anchoF               // Tamaño en el canvas
        );
    }
    // ===================================================================================
    
    // Funcion principal de analisis de posicion (similar a los personajes)
    this.dano=function(x,y){
        if(this.alcanzable(x,y)){return true;}
        return(this.margenes(x,y));
    }

    // Funcion busqueda de jugadores. Si encuentra un jugador le ataca
    this.alcanzable=function(x,y){
        alcance=false;
        for(var key=0;key<2;key++){ // Si existe el jugador y esta enla posicin provisional le ataca
            if(jugador[key]&&jugador[key].x==x && jugador[key].y==y){
                console.log('Te atacan');
                sAtaque.play();     // Reproducir musica de ataque
                this.ataque(key);   // Funcion de ataque
                alcance=true;       // Posicion invalida
            }
        }     
        return alcance;
    }

    // Funcion daño al jugador. Procedemos de alcanzable, nos otorga la ID del jugador
    this.ataque=function(key){
        jugador[key].puntuacion=jugador[key].puntuacion-50; // Nº de puntos que quita
            jugador[key].vida(); // Analisis de vida del jugador
        }

    // Comprobar margenes y posiciones invalidas (Similar a jugadores pero sin puerta)
    this.margenes=function(x,y){
        margen=false;
        if(mapUse[y][x]!=54){
            margen=true;
        }
        x=xCorr(x);
        posicion=y+''+x;
        if(posicion==llave.posicion){
            margen=true;
        }
        // Elementos fijos (cajas [n] = 4). Fuera por localizarse en una lista (forEach)
        elemUse[4].forEach(function(valor){
            if(posicion==valor){
                margen=true;
            }
        });
        // Perimetro de figura
        figura.forEach(function(valor) {
            for(var i=0;i<4;i++){
                if(posicion==valor.posicion[i]){
                    margen=true;
                }
            }
        });
        return margen;
    }

    // Funciones de movimientos=========================
    this.derecha=function(){
        if(this.dano(this.x+1,this.y)==false){
            this.x++;
        }
    }
    this.izquierda=function(){
        if(this.dano(this.x-1,this.y)==false){
            this.x--;
        }
    }
    this.arriba=function(){
        if(this.dano(this.x,this.y-1)==false){
            this.y--;
        }
    }
    this.abajo=function(){
        if(this.dano(this.x,this.y+1)==false){
            this.y++;
        }
    }
    // =================================================

    // Generador movimiento aleatorio
    this.movimientoRand=function(){
        switch(Math.floor(Math.random()*4)){ // Generador de numeros aleatorios del 0 al 3
            case 0:
                this.arriba();
                break;
            case 1:
                this.abajo();
                break;
            case 2:
                this.izquierda();
                break;
            case 3:
                this.derecha();
                break;
        }
    }
}