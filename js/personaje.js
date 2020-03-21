var persona=function(ty,y,x){
    this.size=16;   // Tamaño de tile
    this.ID=ty;     // Identificador del jugador
    //Posiciones iniciales
    switch(ty){
        case 0: // Jugador 1
            this.IDtile=188;
            break;
        case 1: // Jugador 2
            this.IDtile=189;
            break;
    }
    // Definir nombre
    this.nombre='';
    while (this.nombre==''){
        this.nombre=prompt("Nombre de jugador", "");
        this.nombre=this.nombre.trim();
    }

    // Definir sus variables
    this.x=x;
    this.y=y;
    this.llave=false;       // Empieza sin llave
    this.puntuacion=100;    // Empieza con 100 puntos
    this.vivo=true;         // Empieza vivo

    // Definir sus cuadros de salida de caracteristicas
    this.idNomb=document.getElementById('nombre'+ty);
    this.idPunt=document.getElementById('punt'+ty);
    this.idItems=document.getElementById('items'+ty);

    //Funcin imprimir puntuacion
    this.imprPuntua=function(){
        this.idPunt.innerHTML=this.puntuacion;
    }
    // Funcion imprimir nombre
    this.imprNomb=function(){
        this.idNomb.innerHTML=this.nombre;
    }

    // Dibujado del personaje
    this.draw=function(){
        // Posicionamiento con ID ============================
        this.IDdecode=IDread(this.IDtile);
        //====================================================
        ctx.drawImage(
            tileMap,
            this.IDdecode[1]*16,this.IDdecode[0]*16, // Posicion del tile
            this.size,this.size, // Tamaño del tile (ancho por alto)
            this.x*anchoF,this.y*altoF, // Posicion en el canvas
            anchoF,anchoF // Tamaño en el canvas
        );        
    }

    // FUNCIONES ANALISIS POSICION

    // Principal (ejecuta las diferentes funciones de analisis) :: Procedemos de cualquier movimiento y nos otorga la prevision de movimiento
    this.dano=function(x,y){
        if(this.ataque(x,y)){return true;}  // Si se mueve al enemigo le ataca y no se mueve a su posicion
        return(this.margenes(x,y));         // Determina las posicines permitidas
    }

    // Enemigo
    this.ataque=function(x,y){
        for(i=0;i<2;i++){
            if(thanos[i].x==x && thanos[i].y==y){   // Si la posicion a moverse es igual a la de algun enemigo
                sAtaque.play();                     // Sonido de ataque
                this.puntuacion=this.puntuacion-50; // Perdemos 50 puntos por daño
                this.vida();                        // Analisis de vida (si sigue vivo) e imresión de los puntos
                return true;                        // Posicion invalida
            }
        } 
        return false; // Posicion sin enemigos
    }

    // Movimientos permitidos
    this.margenes=function(x,y){
        margen=false;
        // Suelo y llave
        if(mapUse[y][x]!=54){ // Si no es suelo (IDtile de suelo = 54) o 
            margen=true;
        }
        x=xCorr(x); // Corregimos la X para una correcta lectura de las posiciones guardadas
        posicion=y+''+x; // Formacion de posicion (Comodidad de analisis)
        if(posicion==llave.posicion){ // Si es la llave (boton o cofre)
            margen=true;
        }
        //Entrar en la puerta
        if(posicion==puerta.posicion&&puerta.activar){  // Si la posicion es una puerta abierta (activada) si que se puede entrar (excepcion a la norma de suelo)
            margen=false;
        }

        // Posicines pese a ser IDtile = 54 no son validas:
        // Elementos fijos (cajas [n] = 4). Fuera por localizarse en una lista (forEach)
        elemUse[4].forEach(function(valor){
            if(posicion==valor){
                margen=true;
            }
        });
        // Perimetro de figura. Fuera por localizarse en una lista y tener un perimetro complejo
        figura.forEach(function(valor){ 
            for(var i=0;i<4;i++){ // Las figuras estan constituidas por 4 posicines invalidas (en el futuro esto sera un atributo de la clase)
                if(posicion==valor.posicion[i]){
                    sFire.play();   // Sonido figura
                    margen=true;
                }
            }
        });
        return margen; // Al final del analisis de psiciones validas devolvemos el resultado
    }

    // Analisis de los objetos que interaccionan con el personaje (Proceemos de la confirmación de modificación de posición)
    this.logicaObjetos=function(){
        x=xCorr(this.x);
        this.posicion=this.y+''+x; // Formamos la posición. Lo hago como atributo por si mas adelante trabajo con este valor
        // Llave
        if(this.posicion==llave.postActi){  // Analisis con la posicion de activación
            llave.activar=true;             // Activamos la animacion de a llave
            this.llave=true;                // Nos llevamos la llave
            this.idItems.innerHTML='Llave'; // Mostramos la llave
        }
        // Puerta salida
        if(this.posicion==(puerta.posicion)){   // Analisis con la posicion real de la puerta (Este caso solo se puede dar si la puerta está activada)
            this.victoria();                    // Ganamos en el nivel
        }
        // Puerta apertura
        if(this.posicion==puerta.postActi){ // Analisis con la posicion de activacion de la puerta
            if(this.llave){                 // Si tenemos la llave abrimos la puerta
                puerta.activar=true;
            }else{
                console.log('Necesitas la llave'); // Si no tenemos llave nos mostrara un mensaje
                sPuerta[2].play();  // Sonido puerta cerrada
            } 
        }
    }
    //Funciones de movimientos======
    this.derecha=function(){
        if(this.dano(this.x+1,this.y)==false){  // Analisis previo de posicion valida
            sJugador.play();                    // Sonido de pasos
            this.x++;                           // Modificacion de posición
            this.logicaObjetos();               // Analisis de elementos a interaccionar
        }
    }
    this.izquierda=function(){
        if(this.dano(this.x-1,this.y)==false){
            sJugador.play();
            this.x--;
            this.logicaObjetos();
        }
    }
    this.arriba=function(){
        if(this.dano(this.x,this.y-1)==false){
            sJugador.play();
            this.y--;
            this.logicaObjetos();
        }
    }
    this.abajo=function(){
        if(this.dano(this.x,this.y+1)==false){
            sJugador.play();
            this.y++;
            this.logicaObjetos();
        }
    }
    //======================

    //Funcion de victoria (Procedemos de haber podido entrar en la puerta)
    this.victoria=function(){
        this.puntuacion=this.puntuacion+50; // Ganamos 50 puntos (el que lo pasa)
        this.imprPuntua();                  // Imprimims los puntos
        alert('Has ganado con '+this.puntuacion+' puntos'); // Mensaje indicando nivel superado
        nv++;                               // Saltamos al siguiente nivel
        sNivel.play();                      // Sonido de subir nivel
        document.getElementById('nivel').innerHTML='Nivel: '+nv; // Imprimimos el nivel al que vamos
        if(nv>3){                           // Si recorremos todos los niveles volvemos al primero
            nv=1;
            // Construccion del mensaje final
            var mensaje='Fin de la partida';
            jugador.forEach(function(valor){
                mensaje+=valor.nombre+' ha terminado con '+valor.puntuacion+'.';
            });
            mensaje+=' Gracias por jugar';
            alert(mensaje); // Imprimir dicho mensaje
        }
        inicializar(1); // Re-Iniciamos (1) el juego con el nuevo nivel
    }

    // Comprobador de vida (Procedemos de cualquier ataque)
    this.vida=function(){
        this.imprPuntua(); // Imprimimos los nuevos puntos
        if(this.puntuacion<1){ // Si es menor de 1 mostramos un mensaje e eliminamos al jugador
            if(!jugador[0] || !jugador[1]){ // Si eliminamos un jugador cuando ya alguno ha sido eliminado se entiende que el juego se queda sin jugadores
                alert('Fin de la partida');
                location.href='index.html'; // Recargamos todo el juego
            }else{
                alert('Has muerto '+this.nombre);
            }
            eliminador(this.ID); // Funcion de eliminación            
        }
    }
}