var mainNode
    , graphNode
    , fpsText
    , emitters = []
    , cfps = 30
    , planarField = [], dx, dy
    , visual = 0
    , visualizer
    , rttNode
    , bits
    , pfield = []
    , fsNode
    , w = {
        moffsetRnd: 0
        , e: {}
        , field: {}
        , cpower: 1000
        , usePlanar: 1
        , renderToTexture: 2
        , graphEmitters: 0
        , brushSize: 8
        , fieldSize: 10
        , fieldStrength: 10
        , pfieldSize: 3
        , minLinkDist: 2
        , pfieldRnd: 0.5
        , maxLinks: 10
        , rdt: 100
        , dmod1: 1
        , dmod2: 1
        , type: 1
        , multType: 2
        , fractType: 3
        , angle1: 40
        , angle2: 10
        , ll: 0.2
        , limits: setNonObfuscatedParams({},
            'sc', [0.97, 1.03],
            'r1', [-0.3, 0.3],
            'g1', [-0.3, 0.3],
            'b1', [-0.3, 0.3],
            'mf', [0.5, 0.9],
            'ck', [0.3, 0.9],
            'cc', [0.5, 0.9]
        )
    };


function deepCloneSavable(data) {
    if (isObject(data)) {
        var temp = {};
        for (var key in data) {
            var v = data[key];
            if (v != null && !isFunction(v)) {
                temp[key] = deepCloneSavable(v);
            }
        }
        return temp;
    }
    if (isArray(data)) {
        var temp = [];
        for (var i = 0; i < data.length; i++) {
            var v = data[i];
            if (v != null && !isFunction(v)) {
                temp[i] = deepCloneSavable(v);
            }
        }
        return temp;
    }
    return data;
}

// load
mergeObj(w, JSON.parse(LocalGetKey("w")));
$each(w.field, v => $each(v, (vv, i) => v[i] = new Vector2(vv.x, vv.y)));


function save() {
    LocalSetKey("w", JSON.stringify(deepCloneSavable(w)));
}



function processAudio() {
    var audio = html.__getElementById('audio')
    audio.src = "res/Kalimba.mp3";
    audio.load();

    mainNode.__onTap = () => {
        var AC = window.AudioContext || window.webkitAudioContext;
        var context = new AC()
            , src = context.createMediaElementSource(audio)
            , analyser = context.createAnalyser();
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 256;
        var l = analyser.frequencyBinCount, l8 = floor(l / 8);
        bits = new Uint8Array(l + 1);

        var MusicComponent = makeClass(function () {

        }, {

            __updateParticle: function (p, dt) {

                var pos = p.__current_position, s = p.__current_size;

                var d = clamp(defaultZeroVector2.__distanceTo(pos) / __screenSize.x / 4, 0, 1),
                    sf = (bits[mmin(floor(l * d), l)] / 255);

                pos = pos.lerp(defaultZeroVector2, - (sf - 0.5) * dt);
                sf = sf * sf * 4;
                s.x *= sf;
                s.y *= sf;

            },
            /* 
          __update: function (emitter, dt) {
                this.xx = ((this.xx || 0) + 1) % bits.length;
                var bb = bits[floor(l / 10)];
                if (bb > 140) {
                    rttNode.__rotate = -bb;
                }
                bb = bits[floor(l / 2)];
                if (bb > 140) {
                    rttNode.__scaleF = bb / 170;
                }
            }
            */

        }, {

        },
            ComponentDefaultsProtoMethods
        );

        _setInterval(() => {
            analyser.getByteFrequencyData(bits);
        }, 0.0166);

        audio.play();
        mainNode.__onTap = () => { };

        var mc = new MusicComponent();
        $each(emitters, e => e.__addComponent(mc));

    }


}



var linkFunc;
//debug
function visualize(x, y, c) {
    if (visualizer.k[x]) {
        if (visualizer.k[x][y]) {
            visualizer.k[x][y].__color = c;
        }
    }
}

function clearVis() {

    var szx = round(__screenCenter.x / w.fieldSize)
        , szy = round(__screenCenter.y / w.fieldSize)
    for (var x = -szx; x < szx; x++) {
        if (visualizer.k[x])
            for (var y = -szy; y < szy; y++) {
                if (visualizer.k[x][y])
                    visualizer.k[x][y].__color = undefined;
            }
    }

}
//undebug
function reallyLink(p1, p2, x1, x2, y1, y2) {

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

    return true;
}

var sset1;
function plot(x, y) {
    if (!planarField[x]) planarField[x] = {};
    if (!planarField[x - 1]) planarField[x - 1] = {};
    if (planarField[x][y])
        return 1;

    if (sset1) {
        planarField[x][y] = 1;
        planarField[x - 1][y] = 1;
        //debug

        if (visual) {
            visualize(x, y, 0x000000);
            visualize(x - 1, y, 0x000000);
        }

        //undebug

    }

}

function _planarCheck(x1, x2, y1, y2) {

    var dx = x2 - x1, dy = y2 - y1, x, y;

    if (dx == 0) {
        for (y = y1; y < y2; y++) {
            if (plot(x, y)) return 1;
        }
    } else
        if (dy == 0) {
            for (x = x1; x < x2; x++) {
                if (plot(x, y)) return 1;
            }
        } else
            if (dx >= dy) {
                for (x = x1; x < x2; x++) {
                    if (plot(x, y)) return 1;
                    y = floor(y1 + dy * (x - x1) / dx);
                }
            } else {
                for (y = y1; y < y2; y++) {
                    if (plot(x, y)) return 1;
                    x = floor(x1 + dx * (y - y1) / dy);
                }

            }
}

function plotLineLow(x0, y0, x1, y1) {
    var dx = x1 - x0,
        dy = y1 - y0,
        yi = 1;

    if (dy < 0) {
        yi = -1
        dy = -dy
    }

    if (dy + dy > 50)
        return;


    var D = 2 * dy - dx;
    var y = y0;

    for (var x = x0; x < x1 - 1; x++) {
        if (plot(x, y)) return 1;
        if (D > 0) {
            y = y + yi;
            D = D - 2 * dx;
        }
        D = D + 2 * dy
    }
}

function plotLineHigh(x0, y0, x1, y1) {
    var dx = x1 - x0,
        dy = y1 - y0,
        xi = 1;

    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }

    if (dx + dy > 50)
        return;

    var D = 2 * dx - dy;
    var x = x0;

    for (var y = y0; y < y1 - 1; y++) {
        if (plot(x, y)) return 1;
        if (D > 0) {
            x = x + xi;
            D = D - 2 * dy;
        }

        D = D + 2 * dx;
    }
}

function planarCheck(x0, x1, y0, y1, set1) {

    sset1 = set1;

    if (abs(y1 - y0) < abs(x1 - x0)) {
        if (x0 > x1)
            return plotLineLow(x1, y1, x0, y0);
        else
            return plotLineLow(x0, y0, x1, y1);

    }
    else
        if (y0 > y1) {
            return plotLineHigh(x1, y1, x0, y0);
        }
        else {
            return plotLineHigh(x0, y0, x1, y1);
        }

}


var FluidComponent = makeClass(function () {

}, {

    __initParticle: function (particle) {
        particle.links = {};
        particle.l = 0;
    },

    __updateParticle: function (particle, dt) {
        var pos = particle.__current_position;

        if (abs(pos.x) > __screenCenter.x) {
            particle.__live = false;
            return;
        }

        if (abs(pos.y) > __screenCenter.y) {
            particle.__live = false;
            return;
        }


        var fx = round(pos.x / w.fieldSize)
            , fy = round(pos.y / w.fieldSize);

        //debug

        if (visual)
            visualize(fx, fy, 0x0000ff);

        //undebug

        particle.__current_velocity.lerp((w.field[fx] || 0)[fy] || defaultZeroVector2, w.rdt * w.fieldStrength * particle.__start_size.x / 10);

        if (w.pfieldSize) {

            if (!pfield[fx]) pfield[fx] = [];
            if (!pfield[fx][fy]) pfield[fx][fy] = particle;

            particle.fx = fx;
            particle.fy = fy;

            function pplll(x, y) {
                if (x && y) {
                    var pp = (pfield[x + fx] || 0)[y + fy];
                    if (pp && pp.l < w.maxLinks) {
                        return linkFunc(particle, pp, fx + x, fx, fy + y, fy)
                        // particle.linked = 1;
                    }
                }
            }

            if (w.usePlanar || (random() > w.pfieldRnd)) {

                $each(particle.links, function (pl) {
                    $each(pl, function (pp, i) {
                        if (w.usePlanar) {
                            if (planarCheck(fx, pp.fx, fy, pp.fy)) {
                                particle.l--;
                                delete pl[i];
                            } else {
                                planarCheck(fx, pp.fx, fy, pp.fy, 1);
                            }
                        }

                        if ((pp.fx < fx - w.pfieldSize) ||
                            (pp.fx > fx + w.pfieldSize) ||
                            (pp.fy < fy - w.pfieldSize) ||
                            (pp.fy > fy + w.pfieldSize)) {
                            particle.l--;
                            delete pl[i];
                        }
                    })
                });

                for (var x = w.minLinkDist; x <= w.pfieldSize; x++) {
                    for (var y = w.minLinkDist; y <= w.pfieldSize; y++) {
                        pplll(0, y) || pplll(x, 0) || pplll(x, y) || pplll(-x, y) || pplll(x, -y) || pplll(-x, -y);
                        if (particle.l > w.maxLinks)
                            break;
                    }
                    if (particle.l > w.maxLinks) break;
                }
            }
        }

    },

    __update: function (emitter, dt) {
        w.rdt = clamp(dt, 0, 1);
        emitter.power = w.cpower;
        emitter.rate = clamp(w.cpower * (w.usePlanar ? 5 : 10), 10, 10000);
    }

}, {

},
    ComponentDefaultsProtoMethods
);

var dfps = 0;
// _setInterval(function(){
//      consoleLog(currentFPS,  w.cpower);
// }, 2);
//  
var targetFps = 40;

function clee(e, tf) {
    if (e)
        if (currentFPS < targetFps / tf) {
            var l = e.__particles.length;
            var nc = floor(l * (0.98 - (1 - currentFPS / targetFps) * 0.2));
            e.__particles = e.__particles.slice(l - nc, l);
            w.cpower = clamp(w.cpower * 0.97, 100, 10000);
        }
}

_setInterval(function () {
    dfps = cfps - currentFPS;
    cfps = lerp(cfps, currentFPS, 0.1);
    var q = (cfps / (targetFps - 5));
    w.cpower = lerp(w.cpower, w.cpower * q * q, 0.01);

    $each(emitters, e => {
        clee(e, 1.2);
        clee(e, 2);
        clee(e, 3);
    });

}, 0.1);

//debug
_setInterval(function () {
    if (fpsText) {
        var s = 0;
        $each(emitters, e => s += e.__particles.length);
        fpsText.__text = currentFPS + ' ' + s;
    }
}, 1);
//undebug

function updateEmitter(emitter, i) {
    var e = w.e[i];

    emitter.origin = e.origin;

    var dc = emitter.__getComponentByType('d');

    dc.size = e.size;
    dc.size_factor = e.size_factor;
    dc.velocity = e.velocity;

    emitter.blending = e.blending;
    emitter.lifespan = e.lifespan;
    emitter.__drawMode = e.__drawMode;

}

function RND() {

    randomBool() ? w.brushSize = randomInt(5, 10) : 0;
    randomBool() ? w.fieldSize = randomInt(10, 20) : 0;
    randomBool() ? w.fieldStrength = randomInt(3, 20) : 0;
    randomBool() ? w.pfieldSize = randomBool() ? 0 : randomInt(3, 7) : 0;
    randomBool() ? w.graphEmitters = randomBool() ? 0 : randomInt(0, emitters.length) : 0;
    randomBool() ? w.minLinkDist = mmax(1, mmin(w.pfieldSize - 1, randomInt(1, 4))) : 0;
    randomBool() ? w.pfieldRnd = random() : 0;
    randomBool() ? w.maxLinks = randomInt(2, 3) : 0;
    randomBool() ? w.usePlanar = randomBool() : 0;
    randomBool() ? w.dmod1 = randomize(-1, 1) : 0;
    randomBool() ? w.dmod2 = randomize(-1, 1) : 0;
    randomBool() ? w.type = randomInt(0, 6) : 0;
    randomBool() ? w.multType = randomInt(0, 6) : 0;
    randomBool() ? w.fractType = randomInt(0, 6) : 0;
    randomBool() ? w.angle1 = randomInt(1, 6) : 0;
    randomBool() ? w.angle2 = roundByStep(randomBool() ? w.angle1 : randomInt(1, 12), 2) / randomInt(1, 2) : 0;

    randomBool() ? w.moffsetRnd = randomize(-0.1, 0.1) : 0;

    w.ll = clamp(randomize(-1, 1), 0, 1);


    mainNode.__color = randomInt(0, 0xffffff)
    mainNode.__color.lerp({ r: 0, g: 0, b: 0 }, 0.5);


    w.renderToTexture = randomInt(0, 2);
    w.gblending = randomInt(1, 3);

    w.galpha = randomize(0.5, 1.5);

    w.color = randomInt(0, 0xffffff);


    w.a = w.renderToTexture ? randomize(0.000001, 0.04) : 1;



    $each(w.limits, (v, k) => {
        w[k] = randomize(v[0], v[1]);
        w[k + 'a'] = randomBool();
    });

    var rrr = [0, 30, 45, 60, 90, 135, 180];
    rr = rrr[randomInt(0, rrr.length - 1)];
    w.__rotate = randomize(rr - 1, rr + 1);

    rrr = [1, 0.8, 1.2];
    rr = rrr[randomInt(0, rrr.length - 1)] * randomSign();
    w.__scalex = randomize(rr - 0.01, rr + 0.01);

    rr = rrr[randomInt(0, rrr.length - 1)] * randomSign();
    w.__scaley = randomize(rr - 0.01, rr + 0.01);
    var bb = [1, 2, 3];
    $each(emitters, (e, i) => {
        var b = bb[randomInt(0, bb.length)];
        removeFromArray(b, bb);
        var np = e.__nodePosition;
        w.e[i] = {
            origin: { x: [-np.x, __screenCenter.x * 0.9], y: [np.y, __screenCenter.y * 0.9] },
            // origin: randomBool() ? { x: [-np.x, __screenCenter.x * 0.9], y: [np.y, __screenCenter.y * 0.9] } : { x: [0, 10], y: [0, 10] },
            size: randomBool() ? 10 : randomBool() ? 20 : { width: [15, 10], height: [7, 2] },
            size_factor: randomBool() ? randomize(0.5, 2) : [[[0, 0, 3], [randomize(0.1, 0.8), randomize(0.5, 2), 3], [randomize(0.1, 0.8), randomize(0.5, 2), 3], [1, 0]]],
            velocity: [randomBool() ? 0 : randomInt(-100, 100), randomInt(0, 100)],
            blending: b,
            lifespan: randomInt(10, 60),
            __drawMode: randomInt(3, 4)
        };
    });



    if (randomBool()) {
        transformField();
    }

    save();

}

function updateView() {

    $each(emitters, (e, i) => {
        updateEmitter(e, i);
        e.__particles = $filter(e.__particles, function (p) {
            var pos = p.__current_position;
            return pos.x > -__screenCenter.x && pos.x < __screenCenter.x && pos.y > -__screenCenter.y && pos.y < __screenCenter.y
        });
    });


    mainNode.__color = w.color;
    mainNode.__color.lerp({ r: 0, g: 0, b: 0 }, 0.5);

    if (graphNode) {
        graphNode.__blending = w.gblending;
        graphNode.__alpha = w.galpha;
    }

    scaleFactor = [1, 0.5, 0.25][randomInt(0, 2)];
    onWindowResize(1);


    linkFunc = w.usePlanar ? function (p1, p2, x1, x2, y1, y2) {

        if (!planarCheck(x1, x2, y1, y2)) {
            planarCheck(x1, x2, y1, y2, 1);
            return reallyLink(p1, p2, x1, x2, y1, y2);
        }

    } : reallyLink;

    if (!fsNode)
        fsNode = new Node({ __size: [1, 1], __color: 0xffffff, __shader: 'base' });

    if (!w.renderToTexture) {
        if (rttNode) {
            if (rttNode.rt1) { rttNode.rt1.__destruct(); delete rttNode.rt1; }
            if (rttNode.rt2) { rttNode.rt2.__destruct(); delete rttNode.rt2; }
            if (rttNode.sceneBufferTexture) { rttNode.sceneBufferTexture.__destruct(); delete rttNode.sceneBufferTexture; }
            rttNode.__destruct();
            rttNode = 0;
        }
    }

    if (!rttNode) {
        rttNode = new Node({ __size: [1, 1], __color: 0xffffff, __shader: 'super1' });
        rttNode.sceneBufferTexture = new WebGLRenderTarget(__realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor, { __dynamic: 1 });
        rttNode.rt1 = new WebGLRenderTarget(__realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor, { __dynamic: 1 });
    }

    if (w.renderToTexture == 2 && !rttNode.rt2) {
        rttNode.rt2 = new WebGLRenderTarget(__realScreenSize.x * scaleFactor * 0.5, __realScreenSize.y * scaleFactor * 0.5, { __dynamic: 1 });
    }


    mainNode.__alpha = w.a;
    rttNode.__shader = w.renderToTexture == 2 ? 'super2' : 'super1';

    rttNode.__killAllAnimations();

    $each(w.limits, (v, k) => {
        rttNode[k] = w[k];
        if (w[k + 'a']) {
            rttNode.__anim(setNonObfuscatedParams({}, k, randomize(v[0], v[1])), randomize(2, 6), -1);
        }
    });

    rttNode.__rotate = 0;
    rttNode.__scaleF = 1;
    rttNode.__x = 0;
    rttNode.__y = 0;

    renderer.__renderLoop = w.renderToTexture == 2 ? function () {


        rttNode.__rotate = w.__rotate;
        rttNode.__scalex = w.__scalex;
        rttNode.__scaley = w.__scaley;
        rttNode.__x = (__screenCenter.x - mouse.x) * w.moffsetRnd;
        rttNode.__y = (__screenCenter.y - mouse.y) * w.moffsetRnd;

        renderNodeToTexture(mainNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.sceneBufferTexture,
            __fullScreen: 1
        });

        setNonObfuscatedParams(rttNode,
            'map1', rttNode.sceneBufferTexture.__texture,
            'map2', rttNode.rt2.__texture);

        renderNodeToTexture(rttNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.rt1,
            __fullScreen: 1
        });


        renderNodeToTexture(fsNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.sceneBufferTexture,
            __fullScreen: 1
        });

        renderNodeToTexture(fsNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.rt2,
            __fullScreen: 1
        });

        setNonObfuscatedParams(fsNode,
            'map', rttNode.rt1.__texture);

        renderer.__setRenderTarget(null);
        renderer.__render(fsNode, camera);

        rttNode.__rotate = 0;
        rttNode.__scaleF = 1;
        rttNode.__x = 0;
        rttNode.__y = 0;

    } : w.renderToTexture == 1 ? function () {

        renderNodeToTexture(mainNode, {
            __size: __screenSize,
            __withoutUpdate: 1,
            __target: rttNode.sceneBufferTexture,
            __fullScreen: 1
        });

        renderer.__setRenderTarget(null);
        setNonObfuscatedParams(rttNode, 'map', rttNode.sceneBufferTexture.__texture);
        renderer.__render(rttNode, camera);

    } : function () {
        renderer.__setRenderTarget(null);
        renderer.__render(scene, camera);
    }


}

function transformField() {

    var szx = round(__screenCenter.x / w.fieldSize) - 2
        , szy = round(__screenCenter.y / w.fieldSize) + 2
        , mult = 1;

    //debug
    visualizer.__clearChildNodes();
    visualizer.k = {};
    //undebug


    for (var x = -szx; x < szx; x++) {

        if (!w.field[x]) w.field[x] = {};
        for (var y = -szy; y < szy; y++) {
            //debug

            if (visual) {
                if (!visualizer.k[x]) {
                    visualizer.k[x] = {};
                }
                visualizer.k[x][y] = visualizer.__addChildBox({ __x: x * w.fieldSize, __y: -y * w.fieldSize, __alpha: 0.5, __size: [w.fieldSize, w.fieldSize] });
            }

            //undebug


            var d = sqrt(x * x + y * y);

            var xangle = Math.atan2(y, x) * w.angle1 * (1 + d * w.dmod1);
            var yangle = Math.atan2(x, y) * w.angle2 * (1 + d * w.dmod2);

            switch (w.multType) {
                case 0: break;
                case 1: mult = x * y / w.fieldSize / w.fieldSize; break;
                case 2: mult = (x * x + y * y) / w.fieldSize / w.fieldSize / w.fieldSize; break;
                case 3: mult = (x * x - y * y) / w.fieldSize / w.fieldSize / w.fieldSize; break;
                case 4: mult = (-x * x + y * y) / w.fieldSize / w.fieldSize / w.fieldSize; break;
                case 5: mult = sin(xangle); break;
                case 6: mult = cos(xangle); break;
            }

            var v;
            switch (w.type) {
                case 0: v = new Vector2(randomize(-100, 100), randomize(-100, 100)); break;
                case 1: v = new Vector2(x, y); break;
                case 2: v = new Vector2(-y, x); break;
                case 3: v = new Vector2(y, -x); break;
                case 4: v = new Vector2(-x, -y); break;
                case 5: v = new Vector2(sin(xangle), cos(xangle)).__multiplyScalar(1 + d * w.dmod1); break;
                case 6: v = new Vector2(cos(xangle), sin(xangle)).__multiplyScalar(1 + d * w.dmod1); break;
            }

            switch (w.fractType) {
                case 0: break;
                case 1: mult *= sin(mult); break;
                case 2: mult *= cos(mult * 2); break;
                case 3: mult = sign(mult) * 1 / (abs(mult) + 0.1); break;
                case 4: mult = sign(mult) * mult * mult; break;
                case 5: mult *= sin(yangle); break;
                case 6: mult *= cos(yangle); break;
            }

            if (w.ll && w.field[x][y]) {
                w.field[x][y].lerp(v.__multiplyScalar(mult), w.ll);
            } else {
                w.field[x][y] = v.__multiplyScalar(mult);
            }

        }
    }
}


BUS.__addEventListener(setNonObfuscatedParams({},

    __ON_RESIZE, function () {

        if (mainNode) {
            mainNode.n1.__x = clamp(mainNode.n1.__x, -__screenCenter.x + 100, __screenCenter.x - 100);
            mainNode.n2.__x = clamp(mainNode.n2.__x, -__screenCenter.x + 100, __screenCenter.x - 100);

            mainNode.n1.__y = clamp(mainNode.n1.__y, -__screenCenter.y + 100, __screenCenter.y - 100);
            mainNode.n2.__y = clamp(mainNode.n2.__y, -__screenCenter.y + 100, __screenCenter.y - 100);
            mainNode.update(1);
        }


        if (w.renderToTexture && rttNode) {
            rttNode.update(1);
            rttNode.rt1.__setSize(__realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor);
            rttNode.sceneBufferTexture.__setSize(__realScreenSize.x * scaleFactor, __realScreenSize.y * scaleFactor);
            if (rttNode.rt2)
                rttNode.rt2.__setSize(__realScreenSize.x * scaleFactor * 0.5, __realScreenSize.y * scaleFactor * 0.5);

        }

    },


    __ON_VISIBILITY_CHANGED, function (visible) {
        if (!visible)
            save();
    },

    __ON_GAME_LOADED, function () {

        var brushSizeSquared = w.brushSize * w.brushSize;

        mainNode = new Node('main', 1).__init({
            __keepDragThenMouseOut: 1,
            __drag: function (x, y, dx, dy) {
                var m = toNodeCoords(mouse)
                    , fx = round(m.x / w.fieldSize)
                    , fy = round(m.y / w.fieldSize)
                    , k
                    , v;

                for (var x = fx - w.brushSize; x < fx + w.brushSize; x++) {
                    for (var y = fy - w.brushSize; y < fy + w.brushSize; y++) {

                        if (!w.field[x]) w.field[x] = {};
                        v = w.field[x][y];
                        if (!v) v = w.field[x][y] = new Vector2((v || 0).x || 0, (v || 0).y || 0);

                        k = 1 - ((fx - x) * (fx - x) + (fy - y) * (fy - y)) / brushSizeSquared;
                        v.__lerpComponents(v.x * 0.5 + dx * (10 + random()), v.y * 0.5 - dy * (10 + random()), k / 10);

                    }
                }

                if (mainNode.text1)
                    mainNode.text1 = mainNode.text1.__removeFromParent();

            }
        });


        //debug
        visualizer = mainNode.__addChildBox({ __size: [1, 1] });
        //undebug


        addToScene(mainNode);

        emitters.push(mainNode.n1.__effect.emitters[0]);
        emitters.push(mainNode.n2.__effect.emitters[0]);

        var fc = new FluidComponent();
        $each(emitters, e => e.__addComponent(fc));


        processAudio();

        mainNode.n1.__drag = mainNode.n2.__drag = function (x, y, dx, dy) {
            this.__x += dx;
            this.__y += dy;
        }

        updateView();

        graphNode = mainNode.__addChildBox({ __z: -100, __color: 0xffffff, __size: [100, 100] });

        var vbuf, vlen = 0, vertices = [];
        var ibuf, ilen = 0, indeces = [];

        vbuf = graphNode.__verticesBuffer = graphNode.__addAttributeBuffer('position', 2);
        ibuf = graphNode.__indecesBuffer = new MyBufferAttribute('', Uint16Array, 1, GL_ELEMENT_ARRAY_BUFFER, [0, 2, 1, 2, 3, 1], 1);

        graphNode.__updateGeometry = function () {
            if (w.graphEmitters) {

                vlen = 0;
                vertices = [];
                ilen = 0;
                indeces = [];
                // w.pfield = {};
                planarField = {};

                var klen = 0;

                function processEmitter(particles) {
                    var particle, pos, l1, l2, pp, pushed, iblen;
                    for (var k = 0; k < particles.length; k++) {
                        particle = particles[k];
                        pos = particle.__current_position;
                        iblen = klen;
                        pushed = 0;
                        for (var i in particle.links) {
                            for (var j in particle.links[i]) {
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

                $each(emitters, (e, i) => w.graphEmitters > i ? processEmitter(e.__particles) : 0);


                vbuf.__getArrayOfSize(vlen, 1).set(vertices);
                ibuf.__getArrayOfSize(ilen, 1).set(indeces);
            }

            return this;
        }

        graphNode.__drawMode = 1;

        graphNode.__render = function () {

            if (w.pfieldSize) {
                graphNode.__updateGeometry();

                renderer.__draw(graphNode, ibuf.__realsize);

                //debug

                if (visual)
                    clearVis();

                //undebug

            }

        }


        fpsText = mainNode.__addChildBox({ sha: 0, sva: 2, __size: [100, 30], ha: 0 });


        return 1;
    }

));
