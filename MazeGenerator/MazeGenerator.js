var FieldVisualizer = makeClass( function(step){
    
    Node.call(this);
    
    this.__size = [1,1];
    this.__selectable = this.__validToSave = 0;
    this.step = round ( step );
    this.k = {};
    
}, {
   
    __transformPoint: function(d){
        return round(d / this.step);
    },
    
    __visualize : function(x, y, c, t, i, point){
//         return;
        this.update();
        i = i || 0;
        var k = this.k[i] || {};
        this.k[i] = k;
        if (k[x] && k[x][y]) {
            k[x][y].__color = c;
        } else {
            
            if (!k[x]) k[x] = {};
            var size = this.step * 2;
            var n = this.__addChildBox({ 
                __x: x * size, 
                __y: -y * size,
                __alpha: 0.5, 
                __size:[ size, size ],
//                 __text: { __text: x + ' ' + y, __fontsize: 10 },
                __color: c,
                __onDestruct: function(){
                    k[x][y] = 0;
                }
            });
            
            if (point && point.a != undefined){
                var ss = mmax( 4, size / 2 );
                n.__ico = n.__addChildBox( {
                    __img: 'playIco',
                    __size: [ ss, ss ],
                    __rotate: RAD2DEG * point.a
                })
            }
            
            k[x][y] = n;
            
            if (t){
                _setTimeout(function(){ 
                    n.__removeFromParent(); 
                    
                }, t);
            }
                
        }
    },
    
    __getKNode: function(x, y, i){
        var k = this.k[i];
        if (k) {
            return k[x] ? k[x][y] : undefined 
        }
    },
    
    visualize : function(x, y, c, t){
        
        this.__visualize(
            this.__transformPoint(x),
            this.__transformPoint(y),
            c, t
        );
        
    },
    
    clear: function(){
        this.__clearChildNodes();
        this.k = {};
    },
    free: function(){
        this.clear();
        this.__removeFromParent();
    }
    
}, {
    
},

NodePrototype    

);


var BusyField = makeClass( function( step, strokeWidth, parentNode ){
    
    this.planarField = {};
    this.step = round(step);
    this.strokeWidth = strokeWidth || 1;
    this.width = 0;
    this.height = 0;
    if (parentNode){
        this.visualizer = new FieldVisualizer(step);
        parentNode.__addChildBox ( this.visualizer );
        this.width = this.__transformPoint( parentNode.__size.x );
        this.height = this.__transformPoint( parentNode.__size.y );
    }
    this.coverage = 0;
    this.points = 0;
    this.realWidth = 0;
    this.realHeight = 0;
    this.maxX = 0;
    this.maxY = 0;
}, 

{ 
    
    free : function(){
        this.clear();
        if (this.visualizer)
            this.visualizer.free();
    },

    clear : function(){
        this.coverage = 0;
        this.points = 0;
        this.realWidth = 0;
        this.realHeight = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.planarField = {};
        if (this.visualizer) {
            this.visualizer.clear();
        }
    },
    
    __plot: function(x, y, p){
        if (p) {
            return this.__plotPoint(x, y, p);
        } else {
            return this.__getPoint(x, y);
        }
    } 
    
    , __plotLineLow : function(x0, y0, x1, y1, p){
        var dx = x1 - x0,
        dy = y1 - y0,
        yi = 1;
        
        if (dy < 0){
            yi = -1
            dy = -dy
        }
        
        var D = 2*dy - dx;
        var y = y0;

        for( var x = x0 ; x < x1 - 1; x++ ){
            r = this.__plot(x,y,p);
            if (r){
                return r;
            }
            
            if (D > 0){
                y = y + yi;
                D = D - 2*dx;
            }
            D = D + 2*dy
        }
    }

    , __plotLineHigh : function(x0, y0, x1, y1, p){
        var dx = x1 - x0,
            dy = y1 - y0,
            xi = 1;
            
        if (dx < 0) {
            xi = -1;
            dx = -dx;
        }
        
        var D = 2*dx - dy;
        var x = x0, r;

        for( var y = y0; y < y1 - 1; y++){
            r = this.__plot(x,y,p);
            if (r)
                return r;
            
            if (D > 0){
                x = x + xi;
                D = D - 2*dy;
            }
            
            D = D + 2*dx;
        }
    }
        
    , __planarCheck: function(x0, y0, x1, y1, p){
        
        x0 = this.__transformPoint(x0);
        x1 = this.__transformPoint(x1);
        y0 = this.__transformPoint(y0);
        y1 = this.__transformPoint(y1);
        
        if (abs(y1 - y0) < abs(x1 - x0)) {
            return x0 > x1 ? this.__plotLineLow(x1, y1, x0, y0, p) : this.__plotLineLow(x0, y0, x1, y1, p);
        }
        else
        {
            return y0 > y1 ? this.__plotLineHigh(x1, y1, x0, y0, p) : this.__plotLineHigh(x0, y0, x1, y1, p);
        }
        
    },
    
    __transformPoint: function(d){
        return round(d / this.step / 2);
    },
    
    isLineBusy : function(x0, y0, x1, y1){
        return this.__planarCheck(x0, y0, x1, y1);
    },
    
    __plotPoint: function(x, y, p){
        var planarField = this.planarField;
        var sw = round( this.strokeWidth / 2.5 );
        var i = -sw, j = -sw;
        do {
            if (!planarField[ x + i ]) {
                planarField[x + i] = {};
                if (abs( x+i ) > this.maxX)
                    this.maxX =abs(x+i);
                this.realWidth = this.maxX * 2 + 1;    
            }
            
            if (!planarField[x + i][y + j]){
                this.points++;
                if (abs( y+j ) > this.maxY)
                    this.maxY = abs(y+j);
                this.realHeight = this.maxY * 2 + 1;    
            }
            
            
            
            planarField[x + i][y + j] = {
                x: x + i, y: y + j, p: p || 1
            };
            
            if (this.visualizer){
                this.visualizer.__visualize(x, y, 0x0000ff, 0, 0, p);
            }
            i++; if (i >= sw){ j++; i =-sw; } 
        } while ( j < sw );
    },
    
          
    __getPoint : function(x, y){
        var planarField = this.planarField;
        var sw = round( this.strokeWidth / 2.5 );
        var i = -sw, j = -sw;
        
        do {
            if ( planarField[x + i] && planarField[x + i][y + j] ) {
                this.visualizer.__visualize(x, y, 0x00ff00, 0.1, 2);
                
                return planarField[x + i][y + j];
            }
            i++; if (i >= sw){ j++; i =-sw; } 
        } while ( j < sw );
            
    }, 
    
    plotPoint: function(x, y, p){
        return this.__plotPoint(this.__transformPoint(x), this.__transformPoint(y), p);
    },
            
    getPoint : function(x, y){
        return this.__getPoint(this.__transformPoint(x), this.__transformPoint(y));
    },
    
    getNeighbourFreePoint: function(rnd){
        var planarField = this.planarField;
        var xkeys = objectKeys( planarField ).map(function(a){ return Number(a) });
        var sw = this.strokeWidth;
        var visualizer = this.visualizer;
        var w = floor( this.width / 2 - 0.5 );
        var h = floor( this.height / 2 - 0.5 );
        function fnd(xk){
            
            var x = xkeys[xk];
            if ( x < -w || x > w )
                return;
            
            var row = planarField[ x ];
            var ykeys = objectKeys( row ).map(function(a){ return Number(a) });
            
            function chk(xx, yy){
            
                if ( yy < -h || yy > h )
                    return;
                
                return !planarField[ xx - sw ] 
                    || !planarField[ xx - sw ][yy]
                    || !planarField[ xx + sw ] 
                    || !planarField[ xx + sw ][yy]
                    || !planarField[ xx ][yy - sw]
                    || !planarField[ xx ][yy + sw];
            }
            
            if (ykeys.length) {
                var begin = (rnd + 568) % ykeys.length;
                
                for (var yk = begin; yk < ykeys.length; yk++){
                    var y = ykeys[yk];
                    if (chk( x, y )) {
                        if (visualizer)
                            visualizer.__visualize(x, y, 0x111111, 0.1, 1);
                        return row[y];
                    }
                }
                for (var yk = begin-1; yk >= 0; yk--){
                    var y = ykeys[yk];
                    if (chk( x, y )) {
                        if (visualizer)
                            visualizer.__visualize(x, y, 0x111111, 0.1, 1);
                        return row[y];
                    }
                }
            
            }
        }
        
        
        if (xkeys.length) {
            var begin = rnd % xkeys.length;
            for (var xk = begin; xk < xkeys.length; xk++){
                var p = fnd(xk);
                if (p){
                    return p;
                }
            }
            for (var xk = begin-1; xk >= 0; xk--){
                var p = fnd(xk);
                if (p){
                    return p;
                }
            }
            return p;
        }
    },

    //returns 1 if drawed
    drawLineIfNotBusy: function(x0, y0, x1, y1, p){
        if ( !this.isLineBusy(x0, y0, x1, y1) ){
            this.drawLine(x0, y0, x1, y1, p || 1);
            return 1;
        }
    },
    
    drawLine: function(x0, y0, x1, y1, p){
        return this.__planarCheck(x0, y0, x1, y1, p || 1);
    },
    
    normalize: function(){
        var visualizer = this.visualizer;
        $each( this.planarField, function(px){
            $each( px, function(point){
                if (point.p && point.a != undefined) {
                    var kn = visualizer.__getKNode(point.x, point.y, 0);
                    if (kn && kn.__ico){
                        kn.__ico.__rotate = RAD2DEG(point.p.a )
                    }
                }
            });
            
        });
        
        
    }
    
}, { 
    
    coverage: createSomePropertyWithGetterAndSetter(function(){
        return 100 * this.points / mmax( 1, this.realWidth * this.realHeight )
    },
    function(v){
        this.points = v / 100 * mmax( 1, this.realWidth * this.realHeight );
    })
});

var BusyBinTreeField = makeClass( 
    function(step, strokeWidth, depth, parentNode){
        
        if (depth) {
            this.subField = new BusyBinTreeField( step * 2, strokeWidth / 2, depth - 1, parentNode);
        }
        this.busyField = new BusyField(step, strokeWidth, parentNode);
        
    },
    {
        
        free : function(){
            if (this.subField)
            {
                this.subField.clear();
                this.subField.free();
            }
            this.busyField.clear();
            this.busyField.free();
        },
        
        clear : function(){
            if (this.subField)
            {
                this.subField.clear();
            }
            this.busyField.clear();
        },
        
        isLineBusy : function(x0, y0, x1, y1){
            if (this.subField)
            {
                if (this.subField.isLineBusy(x0, y0, x1, y1)){
                    return this.busyField.isLineBusy(x0, y0, x1, y1);
                }
            } else {
                return this.busyField.isLineBusy(x0, y0, x1, y1)
            }
            
        },
         //returns 1 if drawed
        drawLineIfNotBusy: function(x0, y0, x1, y1, p){
            if (this.subField)
            {
                this.subField.drawLineIfNotBusy(x0, y0, x1, y1, p);
            }
            return this.busyField.drawLineIfNotBusy(x0, y0, x1, y1, p)
        },
        
        drawLine: function(x0, y0, x1, y1, p){
            if (this.subField)
            {
                this.subField.drawLine(x0, y0, x1, y1, p);
            }
            return this.busyField.drawLine(x0, y0, x1, y1, p)
        },
        
        plotPoint: function(x, y, p){
            if (this.subField)
            {
                this.subField.plotPoint(x, y, p);
            }
            return this.busyField.plotPoint(x, y, p);
        },
                
        getPoint : function(x, y){
            if (this.subField)
            {
                if (this.subField.getPoint(x, y)){
                    return this.busyField.getPoint(x, y);
                }
            } else {
                return this.busyField.getPoint(x, y);
            }
        },
        
        getNeighbourFreePoint: function(rnd){
            return this.busyField.getNeighbourFreePoint(rnd);
        },
        
        normalize: function(){
            if (this.subField)
            {
                this.subField.normalize();
            }
            this.busyField.normalize();
        }
        
    },
    
    {
        coverage: createSomePropertyWithGetterAndSetter(
            function(){
                return this.busyField.coverage;
            },
            function(v){
                this.busyField.coverage = v;
            }
        )
    }
);



var MazeMisc = {
    
    dropSomethingBy: function(arr, chanceSelection, returnIndex, prerandomMod){
        if (arr) {
            var tmp = {}, sum = 0, k = 0, success = 0;
            
            if (chanceSelection) {
                
                $each(arr, function(ai, i){
                    var c = isFunction(chanceSelection) ?
                        chanceSelection(ai, i) : chanceSelection[i];
                        
                    if (c > 0) {
                        tmp[i] = c;
                        sum += c;
                        success = 1;
                    }
                });
                
                if (success) {
                    var num = prerandomMod ? prerandomMod % sum : randomInt( 0, sum - 1 );
                    sum = 0;
                    
                    for (var i in tmp)
                    {
                        k = i;
                        sum += tmp[i];
                        if ( sum > num ) {
                            break;
                        }
                    }
                }
                
            } else {
                
                if (isArray(arr)) {
                    success = arr.length;
                    if (success) {
                        k = prerandomMod ? prerandomMod % success : randomInt(0, success - 1 ) ;
                    }
                } else if (isObject(arr)) {
                    
                    var keys = objectKeys( arr );
                    success = keys.length;
                    if (success) {
                        k = keys[ prerandomMod ? prerandomMod % success : randomInt(0, success - 1 ) ];
                    }
                }
            }
            
            if (success) {
                var r = returnIndex ? k : arr[k];
                return isNumeric(r) ? Number( r ) : r;
            }
            
        }
    },
    
    normalize: function(d){ d = isNumeric( d ) ? d : 0; return clamp( d / 9999, 0, 1 ); },
    
    denormalize: function(d){ d = isNumeric( d ) ? d : 0; return clamp( round( d * 9999 ), 0, 9999); },
    
    appendCI: function(data, curci){
        if (data.__ci == undefined){
            var cci = curci || 0;
            ObjectDefineProperties( data, {
               __ci: {
                   set: function(v){ cci = v; },
                   get: function(v){ return cci; },
                   enumerable: false
                } 
            });
        }
        return data;
    }
    
    
    
};
    
var MazeState = makeClass( function(maze, point, id){
    var state = this;
    point = point || 0;
    mergeObj( state, {
        id: id || 0,
        prevPos: point.v || defaultZeroVector2,
        maze : maze,
        rndSeed : maze.getInt(),
        maxLife: maze.getInt(2,20),
        minLoopLife: maze.getInt(1,10),
        
         // направляющие. как-то задают формы лабиринта
        rule: maze.getRule(),
        
        geom : 
            // простая линия по направляющей.
            function(){
                var rnd = state.maze.getInt();
                var v = state.getNextPosition(rnd);
                var good;
                for (var i = 1; i < 4; i++){
                    var point = maze.busy(v);
                    
                    if ( point == -2 ){
                        continue;
                    } else
                    if ( point == -1){
                        good = 1;
                    } else
                    if (isObject(point))
                    {
                        if ( state.canLoop && state.chance( 'loop' ) ){
                            var v = point.v;
                            v.set( maze.vertices[м-1], maze.vertices[v] );
                        }
                        else {
                            v = state.getNextPosition(rnd + i);
//                             console.log(v.x, v.y, v.angle);
                            continue;
                        }
                    } else {
                        continue;
                    }
                    
                    state.angle1 = state.angle1 + v.angle;
                    
                    maze.line(state.prevPos, v);
                    
                    state.angle1 = maze.anglify( state.angle1, v );
                    state.prevPos = v;
                    
                    state.life = (state.life||0) + 1;
                    if (state.life > state.maxLife)
                        return;
                    
                    state.canLoop = state.life > state.minLoopLife;
                
                    return good;
                }
                
                
                
            }
            
        , chancesMods: {
            
            loop: 0.1 * maze.getFloat(0.1), 
            mitosis: 0.3 * maze.getFloat(0.1)
            
        }
        
        
    } );
    
    state.angle1 = maze.anglify( ( point ? point.a /* * (maze.getInt(-1,1) || 1)*/ : maze.getInt() * state.rule()) || 0 , state.prevPos );
                           
}, {
    
    chance: function(key){
        //TODO: use prevPos
        return this.maze.getFloat() * this.chancesMods[key] > this.maze.getFloat();
    },
    
    getAngle: function(rnd){
        var idrop = (rnd % 3) - 1;
        return this.rule() * idrop;
    },
    
    getNextPosition: function(rnd){
        var a = this.getAngle(rnd);
        var v = (new Vector2(this.maze.dst, 0)).__rotateAroundZ0( this.angle1 + a ).add( this.prevPos  );
        v.angle = a;
        return v;
    },
    
    getNextGeom: function(){
         return this.geom;
         
    }
    
});


var Maze = makeClass( function(node){
 

    var t = this;
    Node.call(t);
    
    t.__color = 0xffffff;
    t.__size = [400, 800];
    t.__selectable = t.__validToSave = 0;
    t.__drawMode = 1;  
    t.node = node;
    
    t.vbuf = t.__verticesBuffer = t.__addAttributeBuffer('position', 2);
    t.ibuf = t.__indecesBuffer = new MyBufferAttribute( '', Uint16Array, 1, GL_ELEMENT_ARRAY_BUFFER , [ 0, 2, 1, 2, 3, 1 ], 1 );
    
    t.generate();
    
    t.__addOnDestruct( function(){
        t.interval = _clearInterval(t.interval);
    } );
    
    
},
    
{
    anglify: function(a, v){
        
//         if (this.getInt(0,1)) {
            v = new Vector2(v.x, v.y);
//         } else {
//             v = new Vector2(v.y, v.x);
//         }
        
        a = a - round( a / PI / 2 ) * PI * 2;
//         v.__rotateAroundZ0(a);
        a = v.angle() /*+ a / 2*/;
        
        return a;
    },
    
    chance: function(k){
        return k > this.getFloat(0,1) ? 0 : 1;
    },
    
    generateArray: function(alg, size, rndSeed){
        var f = this.possibleGeneratorAlgorithms[ this.pga_keys[ alg % this.pga_size ] ];
        var a = [];
        for (var i = 0; i < size; i++){
            a.push( f(i/size, rndSeed) );
        }
        return a;
    },
    
    getFloat: function(min, max, dontIncrement){
        var t = this;
        var data = t.currentState ? t.currentState.data || t.generateArray(1, 10, t.currentState.rndSeed) : t.mazeData;
        if (data) {
            data = MazeMisc.appendCI(data, data.__ci);
            if (t.currentState){
                t.currentState.data = data;
            }
            var ci = data.__ci;
            var d = data[ci]||0;
            if (!dontIncrement) {
                ci++;
                data.__ci = ci;
            }
            
            if (ci >= data.length){
                if (t.currentState) {
                    t.currentState.data = MazeMisc.appendCI( data.concat( t.generateArray(d, 20 + ( round(d * 12523.63412) % ( d ) ), t.currentState.rndSeed )), ci );
                } else {
                    t.mazeData = MazeMisc.appendCI( data.concat( t.generateArray(d, 20 + ( round(d * 12523.63412) % ( d ) ) )), ci );
                }
            }
            if (min||max){
//                 if (min == -1 && max == 1){
//                     console.log(d);
//                     debugger;
//                 }
                d = clamp(MazeMisc.normalize(d) * (max-min) + min, min, max );
            }
            return d;
        }
        debugger;
        return randomize(min||0, max||9999);
    },
    
    getInt: function(min, max, dontIncrement){
        return round( this.getFloat(min, max, dontIncrement) );
    },
    
    getRule: function(){
        return this.rule;
    },
                      
    generate: function (){
        
        var t = this;
        t.globalRndSeed = randomInt(0,9999);
        
        // алгоритмы генерации неслучайных последовательностей чисел от 0 до 9999
        t.possibleGeneratorAlgorithms = {
            1: function(part, rndSeed){ 
                rndSeed = rndSeed || t.globalRndSeed;
                return MazeMisc.denormalize( 0.5 + sin( part * rndSeed + rndSeed ) * 0.5 ); 
            }, 
            2: function(part, rndSeed){ 
                rndSeed = rndSeed || t.globalRndSeed;
                return MazeMisc.denormalize( 0.5 + cos( part * rndSeed + rndSeed ) * 0.5 );
            },
            3: function(part, rndSeed){ 
                rndSeed = rndSeed || t.globalRndSeed;
                return MazeMisc.denormalize( pow( part, MazeMisc.normalize(rndSeed) ) );
            }
        };
        
        t.pga_keys = objectKeys(t.possibleGeneratorAlgorithms);
        t.pga_size = t.pga_keys.length;
    
        
        var alg = MazeMisc.dropSomethingBy( t.possibleGeneratorAlgorithms, 0, 1 ),
            newMazeData = t.generateArray(alg, randomInt(10,20), randomize(10,20) );
            
        t.node.__userData = mergeObj( isObject(t.node.__userData) ? t.node.__userData : {}, {
            maze: {
                alg : alg,
                data : newMazeData
            }
        });
        
        t.mazeData = MazeMisc.appendCI( newMazeData.slice() );
    
        
        t.rule = MazeMisc.dropSomethingBy( [
            function(){ return PI / 2; }
//             function(){ return PI / 3; },
//             function(){ return PI / 4; },
//             function(){ return PI / 6; },
//             function(){ return PI / 8; }
        ], 0, 0, this.getInt() );
           
                      
        
        t.dst = t.getInt(20, 50);
        t.len = t.getInt(50, 100);
        
        t.minimumCoverage = t.getInt(99, 100);
        
        t.minStates = t.getInt(1, 10);
        t.m_right = t.__size.x/2;
        t.m_left = -t.m_right,
        t.m_top = t.__size.y/2
        t.m_bottom = -t.m_top;
        
        t.clear();
        
        t.step();
        
        t.interval = _setInterval( function(){
            t.step();
        }, 0.05);
        
                      
    },
    
    clear: function(soft){
        var t = this;
        if (!soft) {
            _clearInterval(t.interval);
        }
        
        t.vlen = 0;
        t.ilen = 0; 
        t.klen = 0;
        t.indeces = [];
        t.vertices = [];
         
        t.mazeData.__ci = 0;
        
        t.coverage = 0;
        
        t.currentStep = 0;
        
        if (t.busyBinTreeField){
            t.busyBinTreeField.free();
        }
        
        t.busyBinTreeField = new BusyBinTreeField(t.dst / 2, 1, 0, t.node);
        
        var st = t.minStates;
        t.states = [];
        
        //TODO: check point is free!
        for (var i = 0; i<st;i++){
            t.states.push(
                t.generateState( {
                    v: new Vector2( roundByStep( t.getInt(t.m_left + 1, t.m_right - 1), t.dst ), roundByStep( t.getInt(t.m_bottom + 1, t.m_top - 1), t.dst ) )
                } )
            );
        };
        
        
        
    },
        
    generateState: function(point, id){
        
        return new MazeState(this, point, id);  
        
    },
    
    __updateGeometry: function(){ return this; },
                      
    __render: function(){
        gl.lineWidth(10);
        renderer.__draw(this, this.ibuf.__realsize);
    },
    
    busy: function(v){
        var t = this, dst = t.dst / 1.5;
        if (v.x >= t.m_left && v.x <= t.m_right && v.y >= t.m_bottom && v.y <= t.m_top ) {
            return t.busyBinTreeField.getPoint( v.x, v.y ) || -1;
        }
        return -2;
    },  
    
    normalize: function(){
        
        this.busyBinTreeField.normalize();
        
    },
    
    line: function(v1, v2){
        var t = this;
        var i = t.vlen + 1;
        t.vertices[t.vlen++] = round( v1.x );
        t.vertices[t.vlen++] = round( v1.y );
        
        t.vertices[t.vlen++] = round( v2.x );
        t.vertices[t.vlen++] = round( v2.y );
        
        t.indeces[t.ilen++] = t.klen++;
        t.indeces[t.ilen++] = t.klen++;
        
        t.busyBinTreeField.drawLine( v1.x, v1.y, v2.x, v2.y, { st: t.currentState,  v: i, a: t.currentState.angle1 } );
        t.busyBinTreeField.plotPoint( v1.x, v1.y, { st: t.currentState,  v: i,            a: t.currentState.angle1 } );
        t.busyBinTreeField.plotPoint( v2.x, v2.y, { st: t.currentState,  v: i + 2,        a: t.currentState.angle1 } );
        
    },
    
    step: function(){
    
        var t = this;
        if ( t.currentStep < t.len || ( t.coverage < t.minimumCoverage ) ) {
            t.currentState = 0;
        
            this.normalize();
            
            for (var j in t.states) {
                t.currentState = t.states[j];
//                             console.log( globalRndSeed, t.currentState.rndSeed);
                var good = t.currentState.getNextGeom()();
                if (good) {
                    t.currentState.forAdd = t.currentState.chance( 'mitosis' );
                } else {
                    t.currentState.forRemove = 1;
                }
                
            }
            
            t.states = $filter(t.states, function(s){ return !s.forRemove });
        
            t.currentState = 0;
            
            $each( t.states.slice(), function(s){
                if (s.forAdd){ 
                   t.states.push( t.generateState( {
                       v : s.prevPos, 
                       st: s,
                       a: s.angle1
                   }, t.currentStep ) )
                }
            });
            
            t.vbuf.__getArrayOfSize(t.vlen, 1).set(t.vertices);
            t.ibuf.__getArrayOfSize(t.ilen, 1).set(t.indeces);
            
            while (t.states.length < t.minStates){
                //TODO: get free
                
                var point = t.busyBinTreeField.getNeighbourFreePoint( t.getInt(0, t.vertices.length) );
                
                if (point) {
                    var v = point.p.v;
                    var vec = new Vector2(t.vertices[v-1], t.vertices[v]);
                    t.states.push( t.generateState({
                        v: vec, 
                        st: point.p.st,
                        a: point.p.a
                    }, t.currentStep ) );
                } else {
                    
                    break;
                }
                
            }
            
            t.currentStep++;
            
        } else {
            if ( t.currentStep < t.len * 5 ) {
                t.currentStep++;
                    
            } else {
                t.clear(1);
            }
            
        }
    }
    
}, 
//properties
{
    coverage: createSomePropertyWithGetterAndSetter(
        function(){
            return (this.busyBinTreeField||0).coverage||0;
        },
        function(v){
            (this.busyBinTreeField||0).coverage = v;
        }
    )
    
},
//base class prototype
NodePrototype

);



var MazePlugin = ( function(){

    var publishFlag = 0;
 
    BUS.__addEventListener( {
        
        STATE_LOADED: function(){
            
        },
        
        LAYOUT_PREPARED : function(t, l){
            
            l.layoutView.$(function(n){
                
                if (n.__userData && n.__userData.maze && !n.__maze){
                    
                    n.__maze = n.__addChildBox( new Maze(n) );
                    
                }
                
            })
            
        }
    } );

    // StateWithKitten.disableOpenActiveLayouts = 1;
    StateWithKitten.disableSavingChangedLayouts = 1;
        
    addEditorEvents('MazePlugin', {
        
        generate: function(){
            
            eachSelected( function(n){
                if (n.__maze) {
                    n.__maze.clear();
                    n.__maze = n.__maze.__removeFromParent();
                }
                if (n.__userData && n.__userData.maze)
                    delete n.__userData.maze;
                
                n.__maze = n.__addChildBox( new Maze(n) );
            } );
            
        }
        
    });

    addKeyboardMap({
        
        'ctrl+g': 'MazePlugin.generate'
        
    });


    addEditorBehaviours({    
    
    });

})();
