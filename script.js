

function Punto(x,y) {
    this.x = x;
    this.y = y;
}

function Linea(p1,p2) {
    //teniendo dos puntos trazamos una linea 
    //teorema de pitagoras
    this.p1 = p1;
    this.p2 = p2;
    this.lon = Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
}

function Forma() {
    //tiempo que tarda en dibujarse la forma
    this.t = null;
    this.puntos = [];
    this.lineas = [];
}

Forma.prototype = {
    inicio: function () {
        if (this.context === undefined) {
            var canvas = document.getElementById("canvas");
            //creamos el context
            Forma.prototype.context = canvas.getContext('2d');
            Forma.prototype.w = canvas.width;
            Forma.prototype.h = canvas.height;
        }
    },
    dibujar: function() {
        var i, ctx = this.context;
        ctx.strokeStyle = this.color();
        ctx.beginPath();
        ctx.moveTo(this.puntos[0].x, this.puntos[0].y);//punto inicial
        for ( i = 1; i < this.puntos.length; i++) {
            ctx.lineTo(this.puntos[i].x, this.puntos[i].y);            
        }
        ctx.closePath();
        ctx.stroke();
    },
    color: function() {
        var i, rgb = [];
        for (i = 0; i < 3; i++) {
            rgb[i] = Math.round(255*Math.random());
        }
        return 'rgb('+rgb.join(',')+')';
    },
    dibujarLineas: function() {
        if (this.lineas.length > 0) {
            return this.lineas;
        }
        var i,lineas = [];
        for ( i = 0; i < this.puntos.length; i++) {
            lineas[i] = new Linea(this.puntos[i], this.puntos[i+1] || this.puntos[0])//con el or verificamos que cierre las lineas            
        }
        this.lineas = lineas;
        return lineas //regresamos lineas que es el objeto
    },
    generaX: function() {
        return Math.floor(Math.random()*this.w);
    },
    generaY: function() {
        return Math.floor(Math.random()*this.h);
    },
    limpia: function() {
        this.context.clearRect(0,0,this.w,this.h);
    },
    repite: function(figura) {
        if (figura == 'cuadrado') new Cuadrado().dibujar();
        if (figura == 'rectangulo') new Rectangulo().dibujar();
        if (figura == 'triangulo') new Triangulo().dibujar();
        if (figura == 'circulo') new Circulo().dibujar();
    }

}

function Triangulo() {
    //genera tres puntos aleatorios
    var a,b,c;
    //hereda los metodos de Forma
    a = new Punto(this.generaX(), this.generaY());
    b = new Punto(this.generaX(), this.generaY());
    c = new Punto(this.generaX(), this.generaY());
    this.puntos=[a,b,c];
    
}
function Rectangulo(ladoA, ladoB) {
    var x, y;
    x = this.generaX();
    y = this.generaY();
    if (arguments.length == 2) {
        this.ladoA = ladoA;
        this.ladoB = ladoB;
    }else{
        this.ladoA = this.generaX();
        this.ladoB = this.generaY();
    }
    this.puntos =[
        new Punto(x,y),
        new Punto(x+this.ladoA,y),
        new Punto(x+this.ladoA,y+this.ladoB),
        new Punto(x,y+this.ladoB)
    ]
}
function Cuadrado(){
    var lado = this.generaY();
    //llamamos a la funcion constructora
    Rectangulo.call(this,lado,lado);
}
function Circulo(centro,radio) {
    this.dibujar = function() {
        //overwrite sobre dibujar
        var ctx = this.context;
        ctx.beginPath();//comienza a dibujar
        ctx.strokeStyle = this.color();
        ctx.lineWidth = Math.floor(Math.random()*5);//si quiero circulos mas anchos incrementar
        //dibujamos circulos con arc (punto central, radio, aungulo inicio, angulo fin ( 2*math.pi =360))
        ctx.arc(this.generaX(), this.generaY(), this.generaY()/4,0,2*Math.PI);
        ctx.stroke();
    }
    
}

//Herencia

//Funcion constructora f
var f = new Forma();

Triangulo.prototype = f;
Rectangulo.prototype = f;
Cuadrado.prototype = f;
Circulo.prototype = f;



window.onload = function() {
    var forma = document.getElementById('forma');
    forma.onchange = function() {
        if (f.t != null) {
            clearInterval(f.t);
        }
        console.log(f);
        f.inicio();
        f.limpia();
        f.t = setInterval(f.repite,500,forma.value)
    }

}