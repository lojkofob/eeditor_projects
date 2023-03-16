var mainNode
    , graphNode
    , fpsText
    , brushSize = 8
    , fieldSize = 10
    , fieldStrength = 10
    , pfieldSize = 3
    , minLinkDist = 2
    , pfieldRnd = 0.5
    , maxLinks = 10
    , rdt = 0
    , field = []
    , pfield = []
    , emitter1
    , emitter2
    , cfps = 30
    , cpower = 100
    , usePlanar = 1
    , planarField = [], dx, dy
    , visual = 0
    , visualizer
    , renderToTexture = 2
    , rttNode;
    

var linkFunc;
//debug
function visualize(x, y, c){
    if (visualizer.k[x]) {
        if (visualizer.k[x][y]) {
             visualizer.k[x][y].__color = c;
        }
    }
}

function clearVis(){
     
    var szx = round( __screenCenter.x / fieldSize )
        , szy = round( __screenCenter.y / fieldSize )
    for (var x = -szx; x < szx; x++){
        if (visualizer.k[x])
        for (var y = -szy; y < szy; y++){
            if (visualizer.k[x][y])
                visualizer.k[x][y].__color = undefined;
        }
    }          
        
}
//undebug
function reallyLink(p1, p2, x1, x2, y1, y2){
    
    if (!p1.links[x1]) p1.links[x1] = {};
    if (!p2.links[x2]) p2.links[x2] = {};
    p1.links[x1][y1] = p2;
    p2.links[x2][y2] = p1;
    p1.l++;
    p2.l++;
    //debug

    if (visual)
        visualize(x1, y1, 0xff0000);
    //undebug

}

var sset1;
function plot(x, y){
    if (!planarField[x]) planarField[x] = {};
    if (!planarField[x-1]) planarField[x-1] = {};
    if (planarField[x][y])
        return 1;
    
    if (sset1) {
        planarField[x][y] = 1;
        planarField[x-1][y] = 1;
    //debug

        if (visual){
            visualize(x, y, 0x000000);
            visualize(x-1, y, 0x000000);
        }
        
        //undebug

    }
    
}

function _planarCheck(x1, x2, y1, y2){
    
    var dx = x2 - x1, dy = y2 - y1, x, y;
    
    if (dx == 0){
        for (y = y1; y < y2; y++) {
            if (plot(x, y)) return 1;
        }
    } else 
    if (dy == 0){
        for (x = x1; x < x2; x++) {
            if (plot(x, y)) return 1;
        }
    } else
    if (dx >= dy) {
        for (x = x1; x < x2; x++) {
            if (plot(x, y)) return 1;
            y = floor( y1 + dy * ( x - x1 ) / dx );
        }
    } else {
        for (y = y1; y < y2; y++) {
            if (plot(x, y)) return 1;
            x = floor( x1 + dx * ( y - y1 ) / dy );
        }
            
    }
}

function plotLineLow(x0, y0, x1, y1){
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
    if (plot(x,y)) return 1;
    if (D > 0){
       y = y + yi;
       D = D - 2*dx;
    }
    D = D + 2*dy
  }
}

function plotLineHigh(x0,y0, x1,y1){
  var dx = x1 - x0,
    dy = y1 - y0,
    xi = 1;
    
  if (dx < 0) {
    xi = -1;
    dx = -dx;
  }
  
  var D = 2*dx - dy;
  var x = x0;

  for( var y = y0; y < y1 - 1; y++){
    if (plot(x,y)) return 1;
    if (D > 0){
       x = x + xi;
       D = D - 2*dy;
    }
    
    D = D + 2*dx;
  }
}
    
function planarCheck(x0, x1, y0, y1, set1){
    
    sset1 = set1;
    
    if (abs(y1 - y0) < abs(x1 - x0)) {
        if ( x0 > x1 )
              return plotLineLow(x1, y1, x0, y0);
            else
             return plotLineLow(x0, y0, x1, y1);
                
    }
  else
    if ( y0 > y1 ) {
      return plotLineHigh(x1, y1, x0, y0);
    }
    else {
      return plotLineHigh(x0, y0, x1, y1);
    }
    
    /*

    if (x1 < x2) {
        if (y1 < y2)
            return _planarCheck(x1, x2, y1, y2);
        else 
            return _planarCheck(x1, x2, y2, y1);
    } else {
        if (y1 < y2)
            return _planarCheck(x2, x1, y1, y2);
        else 
            return _planarCheck(x2, x1, y2, y1);
    }
    */
}

var fsNode;
function updateFuncs(){
    
    linkFunc = usePlanar ? function(p1, p2, x1, x2, y1, y2){
  
        if (!planarCheck(x1, x2, y1, y2)){
            planarCheck(x1, x2, y1, y2, 1);
            reallyLink(p1, p2, x1, x2, y1, y2);
        }
        
    } : reallyLink;
    
    if (!fsNode)
        fsNode =  new Node({__size:[1,1], __color:0xffffff, __shader:'base'});
    
    if (!renderToTexture){
        if (rttNode) {
            if (rttNode.rt1)rttNode.rt1.dispose();
            if (rttNode.rt2)rttNode.rt2.dispose();
            if (rttNode.sceneBufferTexture)rttNode.sceneBufferTexture.dispose();
            rttNode.__destruct();
        }
    }
    if (!rttNode) {
        rttNode = new Node({__size:[1,1], __color:0xffffff, __shader:'super1'});
        rttNode.sceneBufferTexture = new WebGLRenderTarget( __realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor, { __dynamic:1 });
        rttNode.rt1 = new WebGLRenderTarget( __realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor, { __dynamic:1 });
    }
    
    if (renderToTexture == 2 && !rttNode.rt2)
        rttNode.rt2 = new WebGLRenderTarget( __realScreenSize.x * scaleFactor * 0.5, __realScreenSize.y * scaleFactor * 0.5, { __dynamic:1 });
    
    
    mainNode.__alpha = renderToTexture ? randomize(0.01, 0.04) : 1;
    
    rttNode.__shader = renderToTexture == 2 ? 'super2' : 'super1';
    
    setNonObfuscatedParams(rttNode, 
        'sc', randomize(0.97, 1.03),
        'r1', randomize(-0.2, 0.3),
        'g1', randomize(-0.2, 0.3),
        'b1', randomize(-0.2, 0.3)
    );
    
    rttNode.__killAllAnimations();
    if (randomBool()){
        rttNode.__anim(setNonObfuscatedParams( {}, 'r1', randomize(-0.2, 0.3) ), randomize(2,6), -1);
        rttNode.__anim(setNonObfuscatedParams( {}, 'g1', randomize(-0.2, 0.3) ), randomize(2,6), -1);
        rttNode.__anim(setNonObfuscatedParams( {}, 'b1', randomize(-0.2, 0.3) ), randomize(2,6), -1);
    }
    
    rttNode.__rotate = renderToTexture == 2 ? randomize(-1,1) : 0;
    
    renderer.__renderLoop = renderToTexture == 2 ? function(){
        
        renderNodeToTexture( mainNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.sceneBufferTexture,
            __fullScreen: 1
        });
        
        setNonObfuscatedParams(rttNode,'map1', rttNode.sceneBufferTexture.__texture, 'map2', rttNode.rt2.__texture);
        
        renderNodeToTexture( rttNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.rt1,
            __fullScreen: 1
        });
        
        setNonObfuscatedParams( fsNode, 'map', rttNode.rt1.__texture );

        renderNodeToTexture( fsNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.sceneBufferTexture,
            __fullScreen: 1
        });
        
          renderNodeToTexture( fsNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.rt2,
            __fullScreen: 1
        });
        
        renderer.__setRenderTarget( null );
        renderer.__render( fsNode, camera );
        
    } : renderToTexture == 1 ? function(){
        
        renderNodeToTexture( mainNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.sceneBufferTexture,
            __fullScreen: 1
        });
        
        renderer.__setRenderTarget( null );
        setNonObfuscatedParams( rttNode, 'map', rttNode.sceneBufferTexture.__texture );
        renderer.__render( rttNode, camera );
        
    } : function(){
        renderer.__setRenderTarget( null );
        renderer.__render( scene, camera );
    }
    
}

var FluidComponent = makeClass( function(){
     
    }, {
        
        __initParticle: function(particle){ 
            particle.links = {};
            particle.l = 0;
        },
        
        __updateParticle: function(particle, dt){ 
            var pos = particle.__current_position
                , fx = round(pos.x / fieldSize)
                , fy = round(pos.y / fieldSize);
//debug
                
            if (visual) 
                visualize(fx, fy, 0x0000ff);
            
            //undebug

    
            particle.__current_velocity.lerp( (field[fx]||0)[fy]||defaultZeroVector2, rdt * fieldStrength * particle.__start_size.x / 10);
            
            if (pfieldSize) {
                
                if (!pfield[fx]) pfield[fx] = [];
                if (!pfield[fx][fy]) pfield[fx][fy] = particle;
                                    
                particle.fx = fx;
                particle.fy = fy;
                
                function pplll(x,y){
                    if (x && y) {
                        var pp = (pfield[x + fx]||0)[y + fy];
                        if (pp && pp.l < maxLinks /*&& !pp.linked*/) {
                            linkFunc(particle, pp, fx+x, fx, fy+y, fy)
                            // particle.linked = 1;
                        }
                    }
                }

                
                if ( usePlanar || random() > pfieldRnd ) {
                    
                    $each(particle.links, function(pl){
                        $each(pl, function(pp, i){
                            if (usePlanar) {
                                if (planarCheck(fx, pp.fx, fy, pp.fy)){
                                    particle.l--;
                                    delete pl[i];
                                } else {
                                    planarCheck(fx, pp.fx, fy, pp.fy, 1 );
                                }
                            }
                            
                            if ( (pp.fx < fx - pfieldSize) || 
                                 (pp.fx > fx + pfieldSize) || 
                                 (pp.fy < fy - pfieldSize) || 
                                 (pp.fy > fy + pfieldSize) )
                            {
                                particle.l--;
                                delete pl[i];
                            } 
                        })
                    });
                    
                    for (var x = minLinkDist; x <= pfieldSize; x++){
                        for (var y = minLinkDist; y <= pfieldSize; y++){
                            pplll(0,y);
                            pplll(x,y);
                            pplll(-x,y);
                            pplll(x,-y);
                            pplll(-x,-y);
                            pplll(x,0);
                            if (particle.l > maxLinks) 
                                break;
                        }
                        if (particle.l > maxLinks) break;
                    }
                }
            }

        },
        
        __update: function(emitter, dt) { 
            rdt = clamp(dt, 0, 1);
            emitter.power = cpower;
            emitter.rate = clamp( cpower * ( usePlanar ? 5 : 10 ), 10, 10000 );
        }
        
    }, {
        
    },
    ComponentDefaultsProtoMethods
);

 var dfps = 0;
// _setInterval(function(){
//      consoleLog(currentFPS,  cpower);
// }, 2);
//  
var targetFps = 40;

function clee(emitter, tf){
    if (emitter)
    if ( currentFPS < targetFps / tf ){
        var l = emitter.__particles.length;
        var nc = floor(l * ( 0.98 - (1 - currentFPS/targetFps) * 0.2 ) );
        emitter.__particles = emitter.__particles.slice(l - nc, l);
        cpower *= 0.98;
    }
}

_setInterval(function(){
    dfps = cfps - currentFPS;
    cfps = lerp(cfps, currentFPS, 0.1);
    var q = (cfps/(targetFps - 5));
    cpower = lerp(cpower, cpower * q * q, 0.01);
    
    clee(emitter1, 1.2);
    clee(emitter2, 1.2);
    clee(emitter1, 4);
    clee(emitter2, 4);
    clee(emitter1, 2);
    clee(emitter2, 2);
    
}, 0.1);
/*
_setInterval(function(){
    if (fpsText) {
        fpsText.__text = currentFPS + ' ' + ( emitter1.__particles.length + emitter2.__particles.length );
    }
}, 1);
 */
function updateEmitter(emitter){
    var np = emitter.__nodePosition;
    emitter.origin = randomBool() ? { x:[-np.x,__screenCenter.x * 0.9],y:[np.y,__screenCenter.y*0.9] } : { x:[0,10], y:[0,10] };
    
    var dc = emitter.__getComponentByType('d');
    dc.size = randomBool() ? 10 : randomBool() ? 20 : { width:[15,10], height:[7,2] };
    dc.size_factor = randomBool() ? randomize(0.5,2) : [[[ 0,0,3 ],[randomize(0.1,0.8),randomize(0.5,2),3],[randomize(0.1,0.8),randomize(0.5,2),3],[1,0]]] ;
    dc.velocity = [  randomBool() ? 0 : randomInt(-100,100), randomInt(0,100) ];
    
    emitter.blending = randomInt(1,3);
    
    emitter.lifespan = randomInt(10,60);
    
    emitter.__drawMode = randomInt(3,4);
    
}

function updateView(f){
    if (emitter1){
        if (!f) {
            
            if (randomBool()) {
                updateEmitter(emitter1);
            }
            
            if (randomBool()) {
                updateEmitter(emitter2);
            }

            emitter1.__particles = $filter(emitter1.__particles, function(p){
                var pos = p.__current_position;
                return pos.x > -__screenCenter.x && pos.x < __screenCenter.x && pos.y > -__screenCenter.y && pos.y < __screenCenter.y
            });
            
            emitter2.__particles = $filter(emitter2.__particles, function(p){
                var pos = p.__current_position;
                return pos.x > -__screenCenter.x && pos.x < __screenCenter.x && pos.y > -__screenCenter.y && pos.y < __screenCenter.y
            });
            
            if (randomBool()){
                transformField();
            }
            
            if (randomBool()){
                mainNode.__color = randomInt(0,0xffffff)
                mainNode.__color.lerp({r: 0, g: 0, b:0},0.5);
            }
    
            if (randomBool()){
                renderToTexture = randomInt(0,2);
            }
                
            /*
            PlayerState.brushSize = brushSize;
            PlayerState.fieldSize = fieldSize;
            PlayerState.fieldStrength = fieldStrength;
            PlayerState.pfieldSize = pfieldSize;
            PlayerState.pfieldRnd = pfieldRnd;
            PlayerState.maxLinks = maxLinks;
            PlayerState.cpower = cpower;
            
            PlayerState.e1 = emitter1.toJson();
            PlayerState.e2 = emitter2.toJson();
            
            PlayerState.field = field;
            
            PLAYER.__save();*/
            
            if (randomBool() && graphNode){
                
                graphNode.__blending = randomInt(1,3);
            }
            
            if (randomBool() && graphNode) {
                graphNode.__alpha = randomize(0.5, 1.5);
            }
            
            
        }
        
        scaleFactor = [1,0.5,0.25][randomInt(0,2)];
        onWindowResize(1);
        
        updateFuncs();
        
    }
    return 1;
}
 
function transformField(){
    
    brushSize = randomInt(5, 10);
    fieldSize = randomInt(10,20);
    fieldStrength = randomInt(3,20);
    pfieldSize = randomBool() ? 0 : randomInt(3,7);
    minLinkDist = mmin(1, mmin(pfieldSize - 1, randomInt(1, 4)));
    pfieldRnd = random();
    maxLinks = randomInt(2,10);
    usePlanar = randomBool();
        
    var szx = round( __screenCenter.x / fieldSize ) - 2
        , szy = round( __screenCenter.y / fieldSize ) + 2
        , type = randomInt(0,6)
        , multType = randomInt(0,6)
        , fractType = randomInt(0,6)
        , angle1 = randomInt(1,6)
        , angle2 = roundByStep ( randomBool() ? angle1 : randomInt(1,12), 2 ) / randomInt(1,2)
        , mult = 1
        , dmod1 = randomize(-1,1)
        , dmod2 = randomize(-1,1);
        
    dmod1 *= dmod1;
    dmod2 *= dmod2;
//debug
    
    visualizer.__clearChildNodes();
    visualizer.k = {};
    
    //undebug

    
    var ll = clamp( randomize(-1,1), 0, 1);
    for (var x = -szx; x < szx; x++){
        
        if (!field[x]) field[x] = {};
        for (var y = -szy; y < szy; y++){
            //debug

            if (visual) {
                if (!visualizer.k[x]) {
                    visualizer.k[x] = {};
                }
                
                visualizer.k[x][y] = visualizer.__addChildBox({ __x:x * fieldSize, __y: -y * fieldSize, __alpha:0.5, __size:[fieldSize, fieldSize] } );
            }            
            
            //undebug

            
        
            var d = sqrt(x * x + y * y);
            
            var xangle = Math.atan2(y, x) * angle1 * ( 1 + d * dmod1 );
            var yangle = Math.atan2(x, y) * angle2 * ( 1 + d * dmod2 );
            
            switch (multType){
                case 0: break;
                case 1: mult = x * y / fieldSize / fieldSize; break;
                case 2: mult = (x * x + y * y) / fieldSize/ fieldSize / fieldSize; break;
                case 3: mult = (x * x - y * y) / fieldSize/ fieldSize / fieldSize; break;
                case 4: mult = (-x * x + y * y) / fieldSize/ fieldSize / fieldSize; break;
                case 5: mult = sin(xangle); break;
                case 6: mult = cos(xangle); break;
            }

            var v;
            switch (type){
                case 0: v = new Vector2(randomize(-100,100), randomize(-100,100)); break;
                case 1: v = new Vector2(x, y); break;
                case 2: v = new Vector2(-y, x); break;
                case 3: v = new Vector2(y, -x); break;
                case 4: v = new Vector2(-x, -y); break;
                case 5: v = new Vector2(sin(xangle), cos(xangle)).__multiplyScalar( 1 + d * dmod1 ); break;
                case 6: v = new Vector2(cos(xangle), sin(xangle)).__multiplyScalar( 1 + d * dmod1 ); break;
            }
            
            switch (fractType){
                case 0: break;
                case 1: mult *= sin(mult); break;
                case 2: mult *= cos(mult * 2); break;
                case 3: mult = sign(mult) * 1 / (abs(mult)+0.1); break;
                case 4: mult = sign(mult) * mult * mult; break;
                case 5: mult *= sin(yangle); break;
                case 6: mult *= cos(yangle); break;
            }
            
            if (ll && field[x][y]) {
                field[x][y].lerp(v.__multiplyScalar(mult), ll);
            } else {
                field[x][y] = v.__multiplyScalar(mult);
            }
            
        }
    }
}
 /*
_setInterval(function(){
    PLAYER.__save()
}, 10);*/

BUS.__addEventListener( setNonObfuscatedParams( {},
    
    __ON_RESIZE, function(){
        
        if (mainNode) {
            mainNode.n1.__x = clamp(mainNode.n1.__x, -__screenCenter.x+100, __screenCenter.x-100 );
            mainNode.n2.__x = clamp(mainNode.n2.__x, -__screenCenter.x+100, __screenCenter.x-100 );
            
            mainNode.n1.__y = clamp(mainNode.n1.__y, -__screenCenter.y+100, __screenCenter.y-100 );
            mainNode.n2.__y = clamp(mainNode.n2.__y, -__screenCenter.y+100, __screenCenter.y-100 );
            mainNode.update(1);
        }
        
        
        if (renderToTexture && rttNode) {
            rttNode.update(1);
            rttNode.rt1.__setSize(__realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor);
            rttNode.sceneBufferTexture.__setSize(__realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor);
            if (rttNode.rt2)
                rttNode.rt2.__setSize( __realScreenSize.x * scaleFactor * 0.5, __realScreenSize.y * scaleFactor * 0.5);

        }
        
    },
    
    __ON_GAME_LOADED, function(){
    /*
        if (PlayerState.field) {
            
            brushSize = PlayerState.brushSize;
            fieldSize = PlayerState.fieldSize;
            fieldStrength = PlayerState.fieldStrength;
            pfieldSize = PlayerState.pfieldSize;
            pfieldRnd = PlayerState.pfieldRnd;
            maxLinks = PlayerState.maxLinks;
            cpower = PlayerState.cpower;
            
            field = PlayerState.field;
            $each(field, function(k, x){ $each(k, function(v, y){
                k[y] = new Vector2(v.x, v.y);
            }) })
        }
        */
        
        var brushSizeSquared = brushSize * brushSize;
        
        mainNode = new Node('main',1).__init({
            __keepDragThenMouseOut: 1,
            __drag: function(x,y,dx,dy){
                var m = toNodeCoords(mouse)
                    , fx = round(m.x / fieldSize)
                    , fy = round(m.y / fieldSize)
                    , k
                    , v;
                    
                for (var x = fx - brushSize; x < fx + brushSize; x++) {
                    for (var y = fy - brushSize; y < fy + brushSize; y++){
                        
                        if (!field[x]) field[x] = {};
                        if (!field[x][y]) field[x][y] = new Vector2(0,0);
                        
                        k = 1 - ((fx-x) * (fx-x) + (fy-y) * (fy-y)) / brushSizeSquared;
                        v = field[x][y];
                        v.__lerpComponents( v.x*0.5 + dx * (2+ random()), v.y*0.5 - dy* (2 + random()), k / 10 );
                        
                    }
                }
                
                if (mainNode.text1)
                    mainNode.text1 = mainNode.text1.__removeFromParent();
                
            }
        });
        
        //debug

        
                visualizer = mainNode.__addChildBox({__size:[1,1]});
        //undebug

                
        transformField();
        
        addToScene(mainNode);
        /*
        if (PlayerState.e1){
            mainNode.n1.__effect = { emitters:[ PlayerState.e1 ] };
        }
        if (PlayerState.e2){
            mainNode.n2.__effect = { emitters:[ PlayerState.e2 ] };
        }*/
        
        emitter1 = mainNode.n1.__effect.emitters[0];
        var fc = new FluidComponent();
        emitter1.__addComponent( fc );
        emitter2 = mainNode.n2.__effect.emitters[0];
        emitter2.__addComponent( fc );
        
        
        mainNode.n1.__drag = mainNode.n2.__drag = function(x,y,dx,dy){
            this.__x += dx;
            this.__y += dy;
        }
        
        mainNode.but.__onTap = function(){
            return updateView();
        };
        
        onTapHighlight(mainNode.but);
        
        updateView(/*PlayerState.field*/);
        
        
        graphNode = mainNode.__addChildBox({__z: -100, __color: 0xffffff, __size:[100,100] });
        
        
        var vbuf, vlen = 0, vertices = [];
        var ibuf, ilen = 0, indeces = [];
        
        vbuf = graphNode.__verticesBuffer = graphNode.__addAttributeBuffer('position', 2);
        ibuf = graphNode.__indecesBuffer = new MyBufferAttribute( '', Uint16Array, 1, GL_ELEMENT_ARRAY_BUFFER , [ 0, 2, 1, 2, 3, 1 ], 1 );
        
        graphNode.__updateGeometry = function(){
            if (pfieldSize) {
                
                vlen = 0;
                vertices = [];
                ilen = 0;
                indeces = [];
                pfield = {};
                planarField = {};
                
                var klen = 0;

                function processEmitter(particles){
                    var particle;
                    var pos, l1, l2, pp, pushed;
                    for (var k =0; k < particles.length; k++){
                        particle = particles[k];
                        pos = particle.__current_position;
                        
                        var iblen = klen;
                        
                        pushed = 0;
                        for (var i in particle.links){
                            for (var j in particle.links[i]){
                                pp = particle.links[i][j];
                                if (pp) {
                                    
                                    if (!pushed) {
                                        vertices[vlen++] = pos.x;
                                        vertices[vlen++] = pos.y;
                                        pushed = 1;
                                    }
                        
                                    pp = pp.__current_position;
                                    vertices[vlen++] = pp.x;
                                    vertices[vlen++] = pp.y;
                                    
                                    indeces[ilen++] = iblen;
                                    indeces[ilen++] = ++klen;
                                    
                                }
                            }
                        }
                        if (pushed)
                            klen++;
                    }
                    
                }
                 
 
                processEmitter(emitter1.__particles);
                processEmitter(emitter2.__particles);
            
                
                vbuf.__getArrayOfSize(vlen, 1).set(vertices);
                ibuf.__getArrayOfSize(ilen, 1).set(indeces);
            }

            return this;
        }
        
        graphNode.__drawMode = 1;
        
        graphNode.__render = function(){
            
            if (pfieldSize){ 
                graphNode.__updateGeometry();
                
                renderer.__draw(graphNode, ibuf.__realsize);
                
                //debug

                if (visual)
                    clearVis();

//undebug
                
            }
 
        }
        
        
        fpsText = mainNode.__addChildBox({sha:0,sva:2,__size:[100,30],ha:0});
        
        
        return 1;
    }
    
));
