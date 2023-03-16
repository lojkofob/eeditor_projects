
let MapGeneratorPlugin = (() => {

    consoleLog('2dMapGenerator!');
    var o, o2;

    
    function clone(a) {
        if (isArrayOrObject(a)) {
            if (a.constructor !== Object && a.constructor !== Array) {
                return a;
            }
            return $map(a, clone);
        } else
        {
            try {
                return structuredClone(a);
            } catch {}
        }
        return a;
    }
 
    function good(x, y){ 
        return x >=0 && x < o.w && y >=0 && y < o.h;
    }

    
    function getdirect(x, y, a){ 
        a = a || o.arr;
        return a[clamp(x, 0, o.w - 1) + clamp(y, 0, o.h - 1) * o.w]||0;
    }

    function getnearest(x, y, a){ 
        a = a || o.arr;
        x = round(x);
        y = round(y);
        return a[clamp(x, 0, o.w - 1) + clamp(y, 0, o.h - 1) * o.w]||0;
    }

  
    
    function getlinear(x, y, a)
    {
        if (floor(x) == x && floor(y) == y) { return getdirect(x, y, a); }
        
        var x1 = floor(x), x2 = ceil(x);
        var y1 = floor(y), y2 = ceil(y);

        if (x1 === x2) {
            return (getdirect(x1, y1, a) * (y2 - y) + getdirect(x1, y2, a) * (y - y1)) / (y2 - y1);
        }
        if (y1 === y2) {
            return (getdirect(x1, y1, a) * (x2 - x) + getdirect(x2, y1, a) * (x - x1)) / (x2 - x1);
        }
 
        return (
            getdirect(x1, y1, a) * (x2 - x) * (y2 - y) +
            getdirect(x2, y1, a) * (x - x1) * (y2 - y) +
            getdirect(x1, y2, a) * (x2 - x) * (y - y1) +
            getdirect(x2, y2, a) * (x - x1) * (y - y1)
        ) / ((x2 - x1) * (y2 - y1));

    }
  
    function cubicHermite(a, b, c, d, t){
        return 0.5 * (c - a + (2.0*a - 5.0*b + 4.0*c - d + (3.0*(b - c) + d - a)*t)*t)*t + b;
    }
  
    function getbicubic(x, y, a)
    {
        if (floor(x) == x && floor(y) == y) { return getdirect(x, y, a); }

        // bicubic interpolation
        // x -= 0.5;
        // y -= 0.5;

        var xint = floor(x < 0 ? x + 1 : x), xfract = x - xint,
            yint = floor(y < 0 ? y + 1 : y), yfract = y - yint;
            
        return cubicHermite(
            cubicHermite(
                getdirect(xint - 1, yint - 1, a),
                getdirect(xint    , yint - 1, a),
                getdirect(xint + 1, yint - 1, a),
                getdirect(xint + 2, yint - 1, a), xfract),

            cubicHermite(
                getdirect(xint - 1, yint    , a),
                getdirect(xint    , yint    , a),
                getdirect(xint + 1, yint    , a),
                getdirect(xint + 2, yint    , a), xfract),

            cubicHermite(
                getdirect(xint - 1, yint + 1, a),
                getdirect(xint    , yint + 1, a),
                getdirect(xint + 1, yint + 1, a),
                getdirect(xint + 2, yint + 1, a), xfract),

            cubicHermite(
                getdirect(xint - 1, yint + 2, a),
                getdirect(xint    , yint + 2, a),
                getdirect(xint + 1, yint + 2, a),
                getdirect(xint + 2, yint + 2, a), xfract),

            yfract);
    } 

    var g = getbicubic;

    function s(x, y, v, a){ 
        a = a || o.arr;
        a[clamp(x, 0, o.w - 1) + clamp(y, 0, o.h - 1) * o.w] = v||0; 
    }

    function each(f){ 
        for (var i = 0; i < o.arr.length; i++) {
            f(i, o.arr[i]);
        }
    }

    function map(f){ 
        for (var i = 0; i < o.arr.length; i++) {
            o.arr[i] = f(i, o.arr[i]);
        }
    }

    function mapxy(f, sx, sy, fx, fy, mx, my){ 
        sx = sx||1; sy = sy||1; fy = fy||0; fx = fx||0; mx = mx || o.w; my = my || o.h;
        for (var y = fy; y < my; y+=sy) 
        for (var x = fx; x < mx; x+=sx) {
            s(x, y, f(x, y, g(x, y)));
        }
    }
    function mapxyc(f, sx, sy, fx, fy, mx, my){ 
        oo = clone(o);
        sx = sx||1; sy = sy||1; fy = fy||0; fx = fx||0; mx = mx || o.w; my = my || o.h;
        for (var y = fy; y < my; y+=sy) 
        for (var x = fx; x < mx; x+=sx) {
            s(x, y, f(x, y, g(x, y, oo.arr)));
        }
    }


    function eachxy(f, sx, sy){ 
        sx = sx||1; sy = sy||1;
        for (var y = 0; y < o.h; y+=sy) 
        for (var x = 0; x < o.w; x+=sx) {
            f(x, y, g(x, y));
        }
    }


    let plugin = makeSingleton({
        options: {
            size: new Vector2(64, 64),
            szmult: 10,
            
            colors: [
                0x3c3484,
                0x03b0f7,
                0xc3d075,
                0x1d4d1b,
                0x254132,
                0x1f2e29,
                0xb5dbdd,
                0xffffff
            ],
            
/*
            colors: [
                0x0,
                0x111111,
                0x222222,
                0x333333,
                0x444444,
                0x555555,
                0x666666,
                0x777777,
                0x888888,
                0x999999,
                0xaaaaaa,
                0xbbbbbb,
                0xcccccc,
                0xdddddd,
                0xeeeeee,
                0xfefefe
            ],
*/

            generators: [ 
                { force: 1 },
                'randomize',
                { value: 0.1, repeat: 1 },
                'cellularAutomata',
                'clone',
                
                'clear',
                { force: 1 },
                'randomize',
                { value: 0.4, repeat: 1 },
                'cellularAutomata',
                { force: 0.5 },
                'mix',
                { force: 5 },
                'mul',
                { force: 0.3 },
                'blur',
                'blur',
                { force: 0.44 },
                'mul',
                'quad',
                'add',
                {scale: new Vector2(1.02, 1.02), rotation: 0.08, repeat: 30 },
                'transform',
                {rotation: 0.05, offset: new Vector2(1, -0.7), repeat: 10 },
                'transform',
                {rotation: 0.03, offset: new Vector2(-1, -0.7), repeat: 10 },
                'transform'
            ],

            generators1: [
                { force: 0.1, details: 0.5 },
                'diamondSquare',
                { force: -1 },
                'add',
                'clone',
                'swap',
                { force: 0.1, details: 0.5 },
                'diamondSquare',
                { force: 0.5 },
                'mix',
                { force: -2.0 },
                'blur', 
                { force: 0.6 },
                'blur', 
                'blur',
                { force: 0.6 },
                'mul',
                'quad',
                'mul'
                
            ],

            rasterizer: 'shaded',
            texturizer: 'shaded',

            animated: 0.1 
        },

        generators: {

            clone() {
                 o2 = clone(o);
            },

            clamp(){ 
                each((i,v) => o.arr[i] = clamp(v, o.min||0, o.max || (o.colors.length-1))); 
            },

            swap() { var tmp = o; o = o2; o2 = tmp; },

            mix() { if (!o2) return; map((i,v) => lerp(v, o2.arr[i], o.force)); },
 
            labAutomata(){
                mapxy((x, y, v) => {
                    var nwc = 0;
                    for (var x1 = x-1; x1 <= x + 1; x1++){
                        for (var y1 = y-1; y1 <= y + 1; y1++){
                            if (g(x1, y1) < o.value) {
                                nwc++;
                            }
                        }
                    }
                    return nwc > 4 ? 1 : 0;
                });
            },

            cellularAutomata(){
                var oo = clone(o);
                
                mapxy((x, y, v) => {
                    var nwc = 0;
                    for (var x1 = x-1; x1 <= x + 1; x1++){
                        for (var y1 = y-1; y1 <= y + 1; y1++){
                            if (good(x1, y1) && !(x1 == x && y1 == y)) {
                                if ((g(x1, y1, oo.arr) < o.value)) {
                                    nwc++;
                                }
                            }
                        }
                    } 
                    return nwc > 4 ? 0 : 1;
                }, 1, 1, 1, 1, o.w-1, o.h -1);
            },
            
            diamondSquare(){
                var w = o.w, h = o.h, l = o.colors.length, f = (o.force||0) * 100;

                if ((w != h) || !isPowerOfTwo(w - 1) || !isPowerOfTwo(h - 1)) {
                    var c = mmax(nextPowerOfTwo(w), nextPowerOfTwo(h)) + 1;
                    var a = new Float32Array(c * c);
                    for (var y = 0; y < h; y++) {
                        for (var x = 0; x < w; x++) {
                            a[y*w+x] = o.arr[y*w + x];
                        }
                    }
                    w = c;
                    h = c;
                    o.arr = a;
                }
 
                var c = mmax(w, h) - 1;
                var wh = c+1;

                s(0, 0, randomInt(0, l - 1));
                s(0, c, randomInt(0, l - 1));
                s(c, 0, randomInt(0, l - 1));
                s(c, c, randomInt(0, l - 1));
                
                while (c > 1) {
                    var v = c / 2;
                    for (var y = 0; y < wh; y += c) {
                        for (var x = 0; x < wh; x += c) {
                            s(x + v, y + v, 
                                clamp(
                                 (g(x, y) + g(x, y + c) + g(x + c, y) + g(x + c, y + c)) / 4 + randomFloat(-f, f), -1, l ));
                        }
                    }

                    for (var y = 0; y < wh; y += v) {
                        for (var x = (y+v) % c; x < wh; x += c) {
                            var count = 0;
                            if (y>=v) count++;
                            if (y<=h-v) count++;
                            if (x>=v) count++;
                            if (x<=w-v) count++;
                            s(x, y, clamp(
                                (g(x, y-v) + g(x-v, y) + g(x+v, y) + g(x, y + v))/count + randomFloat(-f, f), -1, l ));
                        }
                    }
                     
                    f *= o.details;
                    c /= 2;
                }
            },

            clear(){ map(i => 0); },
            random(){ map(i=>randomFloat(0, o.colors.length - 1)); },
            randomize(){ map((i,v) => v + randomFloat(-o.force, o.force)); },
            min(){ map((i,v) => mmin(o.value, v)); },
            max(){ map((i,v) => mmax(o.value, v)); },
            add(){ map((i,v) => v + o.force); },
            mul(){ map((i,v) => v * o.force); },
            quad(){ map((i,v) => v * v); },

            xmirror() {
                for (var y = 0; y < o.h; y++) {
                    for (var x = 0; x < o.w / 2; x++) {
                        s(x, y, g(o.w - x - 1, y));
                    }                    
                }
            },

            ymirror() {
                for (var y = 0; y < o.h / 2; y++) {
                    for (var x = 0; x < o.w; x++) {
                        s(x, y, g(x, o.h - y - 1));
                    }
                }
            },

            transform() {
                
                var pivot = o.pivot || new Vector2(o.w / 2, o.h / 2),
                    matrix = o.matrix;

               if (!matrix) {
                    matrix = new Matrix4();
                    var q = (o.rotation || 0) / 2,
                        s = o.scale ? isNumber(o.scale) ? { x: o.scale, y: o.scale } : o.scale : defaultOneVector2,
                        S = o.skew || defaultZeroVector2,
                        of = o.offset || defaultZeroVector2,
                        ae = matrix.e,
                        z = sin(q),
                        z2 = z + z,
                        az = 1 - z * z2,
                        wz = cos(q) * z2,
                        sx = 1 / s.x, sy = 1 / s.y;
                    ae[0] = az * sx;
                    ae[4] = tan(S.x) - wz * sy;
                    ae[1] = tan(S.y) + wz * sx;
                    ae[5] = az * sy;
                    ae[12] = of.x;
                    ae[13] = of.y;
                    ae[10] = 1;
                }
  
                mapxyc((x, y, v) => {
                    v = new Vector2(x, y).__sub(pivot).__applyMatrix4(matrix).__add(pivot);
                    return g(v.x, v.y, oo.arr);
                });
            },

            blur(){
                var ff = o.force / 2, of = (1 - 2 * ff), l = o.colors.length;

                for (var y = 0; y < o.h; y += 2) 
                    for (var x = 0; x < o.w; x++) {
                        s(x, y, g(x, y-1) * ff + g(x, y) * of + g(x, y+1) * ff);
                    }

                for (var y = 0; y < o.h; y++)
                    for (var x = 0; x < o.w; x+=2) {
                        s(x, y, g(x-1, y) * ff + g(x, y) * of + g(x+1, y) * ff);
                    }

                for (var y = 1; y < o.h; y += 2)
                    for (var x = 0; x < o.w; x++) {
                        s(x, y, g(x, y-1) * ff + g(x, y) * of + g(x, y+1) * ff);
                    }

                for (var y = 0; y < o.h; y++)
                    for (var x = 1; x < o.w; x+=2) {
                        s(x, y, g(x-1, y) * ff + g(x, y) * of + g(x+1, y) * ff);
                    }
            },

            smartblur(){
                var f = o.force / 2, of = (1 - 2 * f), l = o.colors.length;

                function smartblur(x, y){
                    var ff = 1 / clamp(g(x, y), 1.0, l) * f;
                    return ff;
                }

                for (var y = 0; y < o.h; y += 2) 
                    for (var x = 0; x < o.w; x++) {
                        var ff = smartblur(x, y), of = (1 - 2 * ff);
                        s(x, y, g(x, y-1) * ff + g(x, y) * of + g(x, y+1) * ff);
                    }

                for (var y = 0; y < o.h; y++)
                    for (var x = 0; x < o.w; x+=2) {
                        var ff = smartblur(x, y), of = (1 - 2 * ff);
                        s(x, y, g(x-1, y) * ff + g(x, y) * of + g(x+1, y) * ff);
                    }

                for (var y = 1; y < o.h; y += 2)
                    for (var x = 0; x < o.w; x++) {
                        var ff = smartblur(x, y), of = (1 - 2 * ff);
                        s(x, y, g(x, y-1) * ff + g(x, y) * of + g(x, y+1) * ff);
                    }

                for (var y = 0; y < o.h; y++)
                    for (var x = 1; x < o.w; x+=2) {
                        var ff = smartblur(x, y), of = (1 - 2 * ff);
                        s(x, y, g(x-1, y) * ff + g(x, y) * of + g(x+1, y) * ff);
                    }
            }

        },

        rasterizers: {
            base() {
                var data = new Uint8Array(o.w * o.h * 4), k, c;
                for (var i = 0; i < o.arr.length; i++) {
                    k = i * 4;
                    var kk = clamp(round(o.arr[i]||0), 0, o.colors.length - 1);
                    c = o.colors[kk];
                    data[k+0] = clamp(round(c.r * 255), 0, 255);
                    data[k+1] = clamp(round(c.g * 255), 0, 255);
                    data[k+2] = clamp(round(c.b * 255), 0, 255);
                    data[k+3] = 255;
                }
                o.rarr = data;
            },

            shaded(){
                plugin.rasterizers.base();
                o.rarr2 = new Uint8Array(o.w * o.h);
                for (var i = 0; i < o.arr.length; i++) {
                    o.rarr2[i] = round(clamp((o.arr[i]||0) * 33, 0, 255));
                }
            }

        },

        texturizers: {
            base() {
                o.__shader = 'base';
                o.map = new Texture({ width: o.w, height: o.h, data: o.rarr }, { 
                    __magFilter: GL_NEAREST, __minFilter: GL_NEAREST,
                    v: 1 });
            },
            shaded() {
                o.__shader = 'mapshaded';
                o.__uniforms = {
                    mapsize: new Vector2(o.w, o.h)
                };
                o.map = new Texture({  width: o.w, height: o.h, data: o.rarr }, { 
                    // __magFilter: GL_NEAREST, __minFilter: GL_NEAREST,
                    v: 1 });

                o.map2 = new Texture({ width: o.w, height: o.h, data: o.rarr2 }, { 
                        __format: GL_LUMINANCE,
                        __type: GL_UNSIGNED_BYTE,
                        v: 1 
                    });
            }
        }
    }, {

        prepare(n){
            var opts = plugin.options
                , sz = opts.size;

            if (!n.mapview) {
                n.mapview = n.__addChildBox({name:"mapview"});
            }

            if (!n.colorsview) {
                n.colorsview = n.__addChildBox({name:"colorsview", __size: { x: 100 * opts.colors.length, y: 100 }, ha: 3 });
                $each(opts.colors, c=>{
                    n.colorsview.__addChildBox({
                        __color: c, __size: {x:90, y: 90 }, __spacing: 5, __z: -1
                    });
                });
            }

            opts.colors =  $map(n.colorsview.__childs, v => v.__color);

            var mapview = n.mapview;
            if (mapview.map) {
                mapview.map = mapview.map.__destruct();
            } else {
                mapview.__addOnDestruct(()=>{ if (this.map) this.map = this.map.__destruct(); });
            }

            if (mapview.__width * mapview.__height == 0) {
                mapview.__size = sz.__clone().__multiplyScalar(opts.szmult);
            }

            if (!mapview.__shader || mapview.__shader == "c") {
                mapview.__shader = 'base';
            }

            return {
                mapview: mapview
            };
        },

        generation(){
            return $filter( $map( plugin.options.generators, v => {
                if (isObject(v)) {
                    var f = function() { 
                        mergeObj(o, v);
                    };
                    f.v = v;
                    return f;
                } else {
                    return plugin.generators[v];
                }
             }), a => a);
        },

        process(p){
            var opts = plugin.options
                , sz = opts.size
                , generation = this.generation(p);

            if (!generation.length) return;

            o = {
                w: sz.x,
                h: sz.y,
                arr: new Float32Array(sz.x * sz.y),
                colors: opts.colors,
                force: 0.2,
                details: 0.6
            };

            var rasterizer = plugin.rasterizers[plugin.options.rasterizer];
            var texturizer = plugin.texturizers[plugin.options.texturizer];
                
            var animated = opts.animated;
            if (animated) {
                if (plugin.tm) {
                    _clearTimeout(plugin.tm);
                }
                var gstep = 0;
                function uu(){
                    var tmp = 0;
                    if (o.repeat) {
                        o.repeat--;
                    } else {
                        tmp = 1;
                    }

                    var gg = generation[gstep];
                    gg();

                    rasterizer();
                    texturizer();
                    if (p.mapview.map) p.mapview.map = p.mapview.map.__destruct();
                    mergeObj(p.mapview, o);

                    if (tmp) {
                        gstep++;
                    }

                    var next = generation[gstep];
                    if (next) {
                        plugin.tm = _setTimeout(uu, next.v ? 0.01 : animated);
                    }
                }
                uu();
                
            } else {
                $fcall(generation);
                rasterizer();
                texturizer();

                if (p.mapview.map) p.mapview.map = p.mapview.map.__destruct();
                mergeObj(p.mapview, o);
            }

            
        },

        generate(layout){
            
            var view = (layout||Editor.currentLayout||0).layoutView||0;
            if (!view) {
                return;
            }
            
            view.__setAliasesData({
                "2dMapGenerator"(n){
                    plugin.process( plugin.prepare(n) );
                }
            });

        }       

    });

    
    BUS.__addEventListener({
        LAYOUT_ACTIVATED(t, layout) { plugin.generate(layout); }
    });

    addKeyboardMap({
        'g': '2dMapGenerator.generate'
    });

    addEditorEvents('2dMapGenerator', {
        generate() { plugin.generate(); }
    });

    addEditorBehaviours({ });

    return plugin;

})();
