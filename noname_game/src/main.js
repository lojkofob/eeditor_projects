PlayerState = PlayerState || {}
function set_counter(c, v) { PlayerState[c] = v }
function get_counter(c) { return PlayerState[c] }
function inc_counter(c, v) { PlayerState[c] = PlayerState[c] || 0 + (v == undefined ? 1 : v) }
function dec_counter(c, v) { PlayerState[c] = PlayerState[c] || 0 - (v == undefined ? 1 : v) }
function TR(v) { return v }

function gridToWorld(p){
    return {
        x: p.x * 44,
        y: p.y * 44,
        z : 0
    }
}

function worldToGrid(p){
    return {
        x: round((p.x||0) / 44),
        y: round((p.y||0) / 44)
    }
}

var animators = {
 
    tap: function(n){
        n.__anim({ __scaleF:[1,0.9] },0.1, -2);
    },
    
    translate: function(gem, p, e){
        if (!gem) return;
        p = gridToWorld(p);
        
        if (gem.__x != p.x) {
            gem.__anim({ __x:p.x}, 0.1 + random()*0.1, 0, e || easeBackO);
        }
        
        if (gem.__y != p.y) {
            gem.__anim({ __y:p.y}, 0.1 + random()*0.1, 0, e || easeBackO);
        }
        gem.__translated = 1;
        _setTimeout(function(){
            gem.__translated = 0; 
        },0.2)
    },
    
    spawned: function(gem, parent){
        if (!gem) return;
        gem.__x = parent.__x;
        gem.__y = parent.__y;
        animators.translate(gem, gem);
    },
    
    destroy: function(gem, p , nogrid){
        if (!gem) return;
        gem.__disabled = 1;
        gem.__anim({ __scaleF:0 }, 0.1+ random()*0.1, 0, easeBackI).__removeAfter(0.2);
        
        if (!nogrid)
            grid.set(gem, 0);
        
        if (p){
            animators.translate(gem, p, easeBackI);
        }
    },
    
    rotate: function(gem, todir){
        if (!gem) return;
        
        var baseRotate = gem.baseRotate;
        gem.__rotate = clampRotation(gem.__rotate);
        
        var torot;    
        if (todir){
            gem.dir = todir;
            torot = gradFromDir(todir);
        } else {
            torot = round((gem.__rotate + 110 - baseRotate)/90)*90;
            gem.dir = dirFromGrad(torot);
        }
         
        gem.__anim({ __rotate: nearestRotate(gem.__rotate, torot + baseRotate)  }, 0.1 + random()*0.1, 0, easeBackO);
    },
    
    move: function(gem, dir){
        if (!gem) return;
        var newp = dirToPoint(dir, gem);
        if (!grid.get(newp)){
            grid.set(newp, gem);
            animators.translate(gem, gem);
            gem.timeout = _setTimeout(function(){
                gem.updatePatterns();
            }, 0.1);
        }
    },
    
    active: function(gem){
        if (!gem) return;
        var c = gem.__baseColor;
        anim(gem.color, { g:c.g - 0.2, b:c.b + 0.1 },0.1,-2);
    }
    
}
function clampRotation(r){
    if (r > 360) r-= 360;
    else
    if (r < 0) r += 360;
    return r;
}
function nearestRotate(base, next){
    if (base > 180 && next<180)
        next += 360;
    return next;
    
}

function randomDir(){
    
    return randomInt(1,4) * 2;
    
}

var grid = {  
    a: {},
    get: function(p, dir){
        if (dir){
            p = dirToPoint(dir, p);
        }
        if(abs(p.x)<50 && abs(p.y)<50)
            return this.a[p.x][p.y];
    },
    
    set: function(p, gem){
        if(abs(p.x)<50 && abs(p.y)<50) {
            if (gem && this.a[p.x][p.y])
                throw 'already exist!';
            this.a[p.x][p.y] = gem;
            if (gem){
                gem.x = p.x;
                gem.y = p.y;
            }
        }
        else {
            if (gem){
                animators.destroy(gem, p, 1);
            }
        }
        
    }
    
};


for (var x = -50;x<50;x++) {
    grid.a[x] = {};
    for (var y = -50;y<50;y++) {
        grid.a[x][y] = 0;
    }
}


var cfg = {
    red:{
        hasDiagonalFriends:1
    },
    redr:{
        hasDiagonalFriends:1
    }
};


options.__soundDisabled = 0;
function Gem(){
    Node.apply(this, arguments);
    
    this.__onTap = function(){
        
        if (this.onTap) {
            animators.tap(this);
            playsound('click2');
            this.runScript(this.onTap);
        }
        return 1;
    }
    
}

function playsound(s){
    playSound(s,0,0,0.01);
}

makeClass( Gem, {
    
    //methods
        
    runScript: function(s){
        var t = this;
        $each(s, function(cmd){
            t[cmd.cmd].apply(t, cmd.args);
        });
    },
    
    destroyFriends: function(){
        var t = this;
        playsound('click3');
        this.doWithFriends(function(f){
            if (!f.cantBeYellow) {
                animators.destroy(f, t);
            }
        });
    },
    
    activateFriends: function(){
        this.doWithFriends(function(f){
            f.activate();
        });
    },
    
    rotate: function(a,b,c){
        animators.rotate(this,a,b,c);
    },
    
    convertIn: function(a,b,c){
        convert(this, a,b,c);
    },
    
    resetInterval: function(d){
        var t = this;
        if (t.interval) {
            t.interval = _clearInterval(t.interval);
        } else {
            t.setInterval(d);
        }
    },
        
    setInterval: function(d){
        var t = this;
        if (!t.interval) {
            t.interval = _setInterval(function(){
                if (t.__disabled) return;
                animators.active(t);
                t.runScript(t.onInterval);
            }, Number(d) );
        }
    },
    
    moveFriends: function(){
        var t = this, gem = t, gemsToMove = [];
        while(1){
            gem = grid.get(gem, t.dir);
            if (!gem) break;
            if (gem.cantMove) return;
            if (gem.__translated) return;
            gemsToMove.push(gem);
        }
        
        $each(gemsToMove, function(g){ grid.set(g, 0); })
        $each(gemsToMove, function(g){ animators.move(g, t.dir); });
        
    },
    
    selectDir: function(a){
        var t = this;
        t.dir = grid.get(t, 6) ? grid.get(t, 2 ) ? grid.get(t, 4) ? grid.get(t, 8) ? 0 : 8 : 4 : 2 : 6;
        if (t.dir) {
            animators.rotate(t, t.dir);
        }
    },
    
    spawn: function(what){
        
        var t = this;
        if (!what) return;
          
        if (!t.dir) {
            t.dir = dirFromGrad(t);
        }
            
        if (t.dir) {
            animators.spawned( spawn(what, t.dir, t), t );
        }
      
    },
    
    activate: function(onStart){
        var t = this;
        if (t.__disabled) return;
        
        if (t.patterns) {
            t.timeout = _setTimeout( function(){ t.updatePatterns(); }, 0.1);
        }
            
        if (this.onActivated) {
            this.runScript(this.onActivated);
            return;
        }
        
        return 1;
    },
    
    autodir: function(){
        var t = this;
        if (t.dir){
            t.__rotate = gradFromDir(t.dir);
        } else {
            t.__rotate = randomInt(0,3) * 90;
            t.dir = dirFromGrad(t);
        }
    },
    
    convertFriend: function(what){
        var gem = dropSomethingBy(this.getFriends(function(g){ return !g.cantBeGreen }));
        if (gem){
            convert(gem, what);
        }
    },
                    
    spawned: function(){
        var t = this;
        if (t.onSpawn){
            t.runScript(t.onSpawn);
        }
        if (!t.dir) t.dir = 6;
    },
    
    __onDestruct: function(){
        this.__disabled = 1;
        if (grid.get(this) == this) {
            grid.set(this, 0);
        }
        
        if (this.interval) {
            this.interval = _clearInterval(this.interval);
        }
        
        if (this.timeout) {
            this.timeout = _clearTimeout(this.timeout);
        }
        
        inc_counter('d_gems');
        inc_counter('d_' + this.name);
        dec_counter('e_' + this.name);
    },
    
    matchCondition: function(c){
        var t = this;
        if (isNumber(c)){
            return t.patternType == c;
        }
        if (isString(c)){
            return c == t.name
        } 
        if (isObject(c)){
            for (var i in c){
                if (t[i] != c[i])
                    return 0;
            }
            return 1;
        }
        if (isArray(c)){
            for (var i in c){
                if (!t.matchCondition(c[i]))
                    return 0;
            }
            return 1;
        }
    },
    
    matchPattern: function(pattern){
        
        var t = this, r = [];
        for (var i=0; i < pattern.p.length; i++){
            var p = pattern.p[i];
            var gem = grid.get(t, p.o);
            if (!gem) return;
            if (!gem.matchCondition(p.pt)) return;
            r.push(gem);
        }

        return r;
    },
    
    updatePatterns: function(){
        var t = this, patterns = this.patterns;
        if (!t.parent) return;
        if (!t.__disabled)
        for (var i in patterns){
            var pattern = patterns[i];
            var n = t.matchPattern(pattern);
            if (n){
                playsound('click1');
                if (pattern.d){
                    
                    
                    $each(n, function(g){
                        
                        if (!$find(pattern.r, function(sp){
                            var gem = grid.get(sp.o, t);
                            return (gem && gem.name == g.name && gem.name == sp.n)
                        })){
                            animators.destroy(g, t);
                        }
                            
                    });
                    
                }
                
                $each(pattern.r, function(sp){
                    var gem = spawn(sp.n, sp.o, t);
                    if (gem) {
                        animators.spawned( gem, t );
                        if (sp.dir){
                            gem.dir = sp.dir;
                            gem.autodir();
                        }
                    }
                });
                
                return;
            }
        }

        // if not matched any pattern
        t.doWithFriends(function(g){
            g.updatePatterns();
        });
        
    },
    
    doWithFriends: function(f){
        var t = this, friends = t.getFriends();
        t.lastDo = TIME_NOW;
        $each(friends, function(g){
            if (g.lastDo != TIME_NOW) f(g);
        });
    },
    
    getFriends: function(filter){
        var f = [], g, t = this;
        filter = filter || function(){return 1};
        if (g = grid.get(t, 2)) if (filter(g)) f.push(g);
        if (g = grid.get(t, 4)) if (filter(g)) f.push(g);
        if (g = grid.get(t, 6)) if (filter(g)) f.push(g);
        if (g = grid.get(t, 8)) if (filter(g)) f.push(g);
          
        if (t.hasDiagonalFriends) {
            if (g = grid.get(t, 7)) if (filter(g)) f.push(g);
            if (g = grid.get(t, 9)) if (filter(g)) f.push(g);
            if (g = grid.get(t, 3)) if (filter(g)) f.push(g);
            if (g = grid.get(t, 1)) if (filter(g)) f.push(g);
        }
          
        return f;
        
    }
    
}, {
    
    baseRotate: {
        get: function(){ return this.cfg.__rotate||0 }
    }
    //properties
    
}, Node);


var mainNode = new Node({__size:{x:1, y:1}}), gui, levelNode;

function dirFromGrad(d){
    if (d) {
        if (d.__rotate!=undefined)
            d = d.__rotate;
        d = round(d/90) % 4;
        switch (d){
            case 0: return 6;
            case 1: return 8;
            case 2: return 4;
            case 3: return 2;
        }
    }
    return 0;
}

var gradConv = [0, 45 * 5, 45 * 6, 45 * 7, 45 * 4, 0, 0, 45 * 3, 45 * 2, 45 * 1 ];

function gradFromDir(d){
    return gradConv[d%10] || 0;
}

function dirToPoint(dir, base){
    
    if (isNumber(dir)){
        base = base || {x:0,y:0};
        var d = {x:base.x||0, y:base.y||0};
        if (!dir) return d;

        function mod(k){
            if (k%3 == 0) d.x++; else
            if (k%3 == 1) d.x--;
            if (k>6) d.y--; else
            if (k<4) d.y++;    
        }
        mod(dir%10);
        while (dir > 10) {
            dir = floor(dir/10);
            mod(dir%10);
        }
        
        return d;
    } else {
        if (isObject(dir) && isObject(base)){
            return {x:(base.x||0) + (dir.x||0), y:(base.y||0) + (dir.y||0)};
        }
    }
    return dir
}

function convert(t, r){
    
    animators.destroy(t);
    var gem = spawn(r, 0, t);
    animators.spawned( gem, t );
    return gem;
    
}

function spawn(c, p, parent){
    
     if (cfg[c]) {
         c = cfg[c];
     }
     
     p = dirToPoint(p, parent);
     if (!grid.get(p)) {
        var gem = levelNode.__addChildBox( new Gem(c) );
        gem.cfg = c;
        gem.gparent = parent;
        grid.set(p, gem);
        if (!parent){
            gem.__ofs = gridToWorld(p)
        }
        gem.timeout = _setTimeout(function(){
            gem.updatePatterns();
        }, 0.2);
        if (gem.spawned) {
            looperPost( function(){
                gem.spawned();
            });
        }
        inc_counter('s_gems');
        inc_counter('s_' + gem.name);
        inc_counter('e_' + gem.name);
        return gem;
     }
}

var userDataMap = {
    pt : 'patternType',
    cbm: 'cantMove',
    cbg: 'cantBeGreen',
    cby: 'cantBeYellow' 
};

function prepareScript(s){
    if (isString(s)){
        var r = [];
        var a = explodeString(s);
        $each(a, function(d){
            var k = explodeString(d,' ');
            if (k) {
                r.push({ cmd: k[0], args:k.slice(1) });
            }
        })
        return r;
    }
}

BUS.__addEventListener({
    __ON_GAME_LOADED: function(){
        
        var c = getLayoutByName('gems');
        
        $each( c, function(cc){
            if(!cfg[cc.name])
                cfg[cc.name] = {};
                
            mergeObj( cfg[cc.name], cc );
            
            var userData = {};
            
            $each(cc.__userData, function(d, i){
                if (userDataMap[i]){
                    userData[userDataMap[i]] = d;
                }
            });
            
            cfg[cc.name].onTap = prepareScript(cc.__userData.onTap);
            cfg[cc.name].onSpawn = prepareScript(cc.__userData.onSpawn);
            cfg[cc.name].onActivated = prepareScript(cc.__userData.onActivated);
            cfg[cc.name].onInterval = prepareScript(cc.__userData.onInterval);
            
            mergeObj( cfg[cc.name], userData );
            
            if (cfg[cc.name].__ofs){
                cfg[cc.name].__ofs.x = cfg[cc.name].__ofs.y = 0;
            }
        
        });
        
        
        var patterns = getLayoutByName('patterns');
        
        $each(patterns, function(c){
            var src = $find(c.__childs, function(ch){ return ch.name=='src' }),
              dst = $find(c.__childs, function(ch){ return ch.name=='dst' }),
              pattern = { d: 1, p:[], r:[] };

            if (src && dst){
                
                pattern.p = [];
                var nullelem;
                
                $each( src.__childs, function(csrc){
                    
                    if (csrc.__userData){
                        
                        var ofs = worldToGrid( csrc.__ofs || {x:0, y:0} );
                        
                        if (ofs.x==0 && ofs.y==0){
                            nullelem = csrc.name;
                        }
                        
                        var patternType = csrc.__userData.pt;
                        
                        pattern.p.push( { pt: patternType, o: ofs  } );
                        
                    }
                    
                });
                
                $each( dst.__childs, function(cdst){
                    var ofs = worldToGrid( cdst.__ofs || {x:0, y:0} );
                    var p = { n:cdst.name, o: ofs };
                    if (cdst.__rotate && ((cdst.__rotate % 90) == 0) ) {
                        p.dir = dirFromGrad(cdst.__rotate);
                    }
                    pattern.r.push(p);
                });
                
                if (nullelem){
                    if ( !cfg[nullelem].patterns ) cfg[nullelem].patterns = [];
                    cfg[nullelem].patterns.push(pattern);
                }
                
            }
            
        });
        
        scene.add( mainNode );
        
        startLevel(PlayerState.l);
        
        return 1;
    }
    
} );

var levelsCfg = {
    
    "1":{ need:{ e_white: 8 } },
    "2":{ need:{ s_white: 20, s_red: 10 } },
    "3":{ need:{ e_white: 15 } },
    "4":{ need:{ e_green: 22 } },
    "5":{ need:{ e_yellow: 2 } },
    "6":{ need:{ d_green: 100 } },
    "7":{ need:{ e_pinkblue: 20 } },
    "8":{ need:{ d_black: 20 } }
}

var k = objectKeys(levelsCfg);
var maxLevel = Number(k[k.length-1]);
    
function startLevel(d){
    
    d = clamp(d||1, 1, maxLevel);
    
    PlayerState.l = d;
    
    var levname = 'lev'+d;
    
    mainNode.__clearChildNodes();
    
    if (!globalConfigsData[levname]){
        globalConfigsData[levname] = extractLayoutFromLayout('pole', levname);
    }
    
    var pole = globalConfigsData[levname];
    
    var layout = getLayoutByName(levname)[0];
    
    levelNode = mainNode.__addChildBox( layout );
    
    levelNode = levelNode.__addChildBox( { __size:{x:1, y:1}, __z:-100 } );
        
    $each(cfg, function(a, i){ set_counter('e_' + i, 0); });

    
    
    
    if (!globalConfigsData.needTemplate) {
        globalConfigsData.needTemplate = extractLayoutFromLayout('needTemplate', '__main');
    }
    
    gui = mainNode.__addChildBox(new Node('__main',1));

    var bottom = gui.bottom;
    var levelCfg = levelsCfg[d];
    
    $each(pole.__childs, function(c){
        var p = worldToGrid(c.__ofs||{})
        var gem = spawn(c.name, p);
        if (gem) {
            if (c.__text)
                gem.__text = c.__text;
            if (c.__rotate) {
                gem.dir = dirFromGrad(c);
                gem.__rotate = c.__rotate;
            }
        }
    });
        
    $each( levelCfg.need, function(v, c){
        
        var nb = bottom.__addChildBox(globalConfigsData.needTemplate);
        var k = c.split('_');
        
        nb.b = k[0]=='e' ? 0 : get_counter(c);
        
        nb.ico.__init(cfg[k[1]]);
        
        nb.__listener = CountersObserver.__addListener( c, function(counter, val){ 
            var current = val - nb.b;
            nb.txt.__text = clamp(current, 0, v) + '/' + v;
            if (current >= v){
                CountersObserver.__removeListener(0, nb.__listener);
                nb.__listener = 0;
                
                var win = !$find( bottom.children , function(child){
                    if (child.__listener)
                        return 1
                });
                if (win){
                    inc_counter('lev' + d);
                    showCongrat(1);
                }
            }
        });
        
        nb.__listener.__on(c, get_counter(c));
        
        nb.__onDestruct = function(){
            if (this.__listener) {
                CountersObserver.__removeListener(0, this.__listener);
            }
        }
        
    });
    
    gui.opts.__onTap = function(){
        showCongrat();
        return 1;
    }
    onTapHighlight(gui.opts);
    
    
    gui.restart.__onTap = function(){
        startLevel(PlayerState.l);
        return 1;
    }
    onTapHighlight(gui.restart);
    
    gui.update(1);
    // PLAYER.__save();
    
}
var blockTaps = 0;
function showCongrat(withblo){
    
    var congrat = new Node('congrat',1);
    scene.add( congrat );
    congrat.__drag = congrat.__onTap = 1;
    congrat.__alpha = 0;
    congrat.__anim({__alpha:0.5});
    congrat.$(function(n){
        n.__scaleF = 0;
        n.__anim({__scaleF:1}, 0.2 + random() * 0.3,0, easeBackO);
        
    });
    congrat.__z = -300;
//     var but = congrat.$('but')[0];
    if (withblo) {
        blockTaps = 1;
        _setTimeout(function(){ blockTaps = 0; }, 2);
    }
//     but.__onTap = function(){
//         congrat.__removeFromParent();
//         startLevel(Number(PlayerState.l)+1);
//         return 1;
//     };
//     onTapHighlight(but);
    
    congrat.levels.__eachChild(function(c){
        var lev = Number( c.__textString );
        if (get_counter('lev'+lev))
            c.__alpha = 0.4;
        c.__onTap = function(){
            congrat.__removeFromParent();
            startLevel(this.__textString);
            return 1;
        }
        onTapHighlight(c);
    });
    
    congrat.cancel.__onTap = function(){
        congrat.__removeFromParent();
        return 1;
    };
    
    onTapHighlight(congrat.cancel);
    congrat.update(1);
    
    // PLAYER.__save();
    
}


function dropSomethingBy(arr, chanceSelection, returnIndex){
    if (arr) {
        var tmp = {}, sum = 0, k = 0, success = 0;
        
        if (chanceSelection) {
            
            $each(arr, function(ai, i){
                var c = chanceSelection(ai, i);
                if (c > 0) {
                    tmp[i] = c;
                    sum += c;
                    success = 1;
                }
            });
            
            if (success) {
                var num = randomInt( 0, sum - 1 );
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
                    k = randomInt(0, success - 1 ) ;
                }
            } else if (isObject(arr)) {
                
                var keys = objectKeys( arr );
                success = keys.length;
                if (success) {
                    k = keys[randomInt(0, success - 1 )];
                }
            }
        }
        
        if (success) {
            return returnIndex ? k : arr[k];
        }
        
    }
}



var countersObservers = {};
var CountersObserver = {
    __on: function( type, counter, val ){
        var a = countersObservers[counter], i = 0;
        //TODO: $filter
        if (a) for ( i = 0; i < a.length; )
            if (a[ i ].__on( counter, val )) a.splice(i, 1); else i++;
    },
    __addListener: function( counter, listener ){
        if (listener) {
            if (!listener.__on) {
                if (isFunction(listener)){ listener = { __on:listener } }
            }
            if (!countersObservers[counter]) countersObservers[counter] = [];
            countersObservers[counter].push( listener );
            return listener;
        }
    },
    __removeListener: function( counter, listener ){
        
        if (!counter){
            $each(countersObservers, function(co, c){
                removeFromArray( listener, co );
            });
        } else {
            if (countersObservers[counter])
                removeFromArray( listener, countersObservers[counter] );
        }
    }
    
};

BUS.__addEventListener( __ON_COUNTER_CHANGED, CountersObserver );

gestures.tap = function(){
    if (blockTaps) return 1;
};

