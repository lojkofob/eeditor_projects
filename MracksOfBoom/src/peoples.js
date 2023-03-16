var DEF_MAN_Z = -45,
    DEF_MAN_STREET_Z = 10;

var MAN_STATE_IDLE = 0,
    MAN_STATE_WORKING = 1,
    MAN_STATE_WALK = 2;

var debugTasks = 0, debuggerDisabled = 1, debugNodes = 0;
//debug
debugTasks = findGetParameter('debugTasks') ? 1 : 0;
debuggerDisabled = findGetParameter('debuggerDisabled') ? 1 : 0;
//undebug


function pcimg(g){ 
    if (randomBool() || g) {
        if (!__window.pcimg){
            __window.pcimg = $filter( globalConfigsData.__frames, function(a, f){ 
                return f.startsWith('pc_img'); 
            } );
        }
        return dropSomethingBy(__window.pcimg);
    }
    return 'pc_anim_' + randomInt(0,71);
}
            
var config = {
    
    peoplesSpeed: 1,
    workSpeed: 1,
    maxtimeForWork : 1 * 60,
    mintimeForWork : 1,
    liftSpeed: 1
};


var mansFloorXMap = [{},{},{},{},{}];

function moveMan(){
    var man = this, node = man.node, task = man.movingToWpTask || 0, wp = task.wp;
    
    if (man.state == MAN_STATE_WALK){
        
        if (wp){
            
            var dt = __currentFrameDeltaTime,
                tx = man.targetX, ty = man.targetY, node = man.node, ofs = node.__ofs, x = ofs.x, y = ofs.y;
                
            if ( tx != x ){
                
                
                var s = sign( tx - x )
                    , dx = s * dt * config.peoplesSpeed / 20;
                
                var fx = floor(x/20);
                
                if (!mansFloorXMap[man.__floor][fx])
                    mansFloorXMap[man.__floor][fx] = {};
                    
                var mp = (mansFloorXMap[man.__floor][fx]||0)[s];
                    
                if (!mp) {
                    mp = mansFloorXMap[man.__floor][fx][s] = {};
                }
                
                
                delete mp[man.name];
                if (objectHasKeys(mp)){
                    man.spdmd = lerp(man.spdmd||man.speedMod, (man.lxmapRndMod||0.5) + 0.3, clamp( dt / 100, 0.01, 1 ) );
                } else {
                    man.spdmd = lerp(man.spdmd||man.speedMod, man.speedMod, clamp( dt / 200, 0.01, 1 ) );
                }
                dx *= man.spdmd;
                
                if (man.lxmap != mp){
                    if (man.lxmap)
                        delete man.lxmap[man.name];
                    man.lxmap = mp;
                }
                
                mp[man.name] = 1;
                
                node.__scalex = s;
                
                if (sign( tx - (x + dx) ) != s){ // дошел
                    node.__x = tx;
                }
                else {
                    
                    node.__x += dx;
                    if (!task.animation) {
                        task.animation = man.startAnimation( 'walk', 1 );
                    }
                }
                
            } else 
            if ( ty != y ){
                
                var s = sign( ty - y )
                    , dy = s * dt * config.peoplesSpeed / 20;
                    
                if (sign( ty - (y + dy) ) != s){ // дошел
                    
                    node.__y = ty;
                    
                } else {
                    
                    node.__y += dy;
                    if (!task.animation) {   
                        node.__scalex = randomBool()?1:-1;
                        task.animation = man.startAnimation( 'walk', y < ty ? 2 : 3 );
                    }
                }
                
            } else {
                man.state = MAN_STATE_IDLE;
            }
            
        } else {
            man.state = MAN_STATE_IDLE;
        }
        
    } else {

        if (wp){
            man.targetX = wp.x + randomize(-wp.w, wp.w);
            man.targetY = wp.y;
            man.state = MAN_STATE_WALK;
        }
        
    }
    
}


var floorHeight = 63;

var mans = {};

var hasElecrticity = 1;

 var waypoints = makeSingleton( {
    
    __arr: {}
    
    
}, {
   
    add: function( type, wp ){
        
        if (!waypoints.__arr[type])
            waypoints.__arr[type] = [];
        
        if (!waypoints.__arr[type][wp.__floor])
            waypoints.__arr[type][wp.__floor] = [];
            
        waypoints.__arr[type][wp.__floor].push(wp);
        
    },
    
    getByIndex: function(type, _floor, index){
        return getDeepFieldFromObject(waypoints.__arr,type,_floor,index) || 0;
    },
    
    
    getByName: function(type, _floor, name){
        
        var d = [];
        if (_floor == undefined){
            $each( waypoints.__arr[type], function(f){
                $each( f, function(n){
                    if (n.name == name){
                        d.push(n);
                    }
                } );
            } );
        } else {
            d = $filter( (waypoints.__arr[type]||0)[_floor], function(n){
                return n.name == name 
            });
        }
        return dropSomethingBy(d) || 0;
    },
    
    getALLByTypeAndFloor: function(type, _floor) {
        return waypoints.__arr[type][_floor] || 0;
    },
    
    getRoomWp: function(room, _floor){
        if (isString( room )) room = waypoints.getByName('rooms', _floor, room );
        return room || 0;
    },
    
    getRandomRoom: function(){
        return dropSomethingBy( waypoints.$(0, 'rooms'), function(r){
            return r.name != 'closet_f' &&
                   r.name != 'closet_m' && 
                   r.name != 'stairs' ? 1 : 0
        });
    },  
    
    getMansInRoom: function(room, _floor){
        room = waypoints.getRoomWp(room);
        return selectMans( mans, function(man){
            if (man.__floor == room.__floor) {
                var wp = man.node.__worldPosition;
                
                return wp.x > room.left && wp.x < room.right;
            }
        });  
    },
    
    getWaypointsInRoom: function( room, type ){
        room = waypoints.getRoomWp(room) || 0;
        return (type ? (room.innerWaypointsByType||0)[type] : room.innerWaypoints) || [];
    },
    
    $: function(selector, type, _floor){
        var s = [];
        if (isFunction(selector)) {
            if (!type) {
                
                if (_floor != undefined) {
                    $each( waypoints.__arr, function(l){
                        $each( l[_floor], function(wp){
                            if (selector(wp)){ s.push(wp); }
                        });
                    });
                } else {
                
                    $each( waypoints.__arr, function(l){
                        $each( l, function(fl){
                            $each( fl, function(wp){
                                if (selector(wp)){ s.push(wp); }
                            });
                        });
                    });
                    
                }
                    
                
            } else {
                
                if (_floor != undefined) {
                    $each( waypoints.__arr[type][_floor], function(wp){
                        if (selector(wp)){ s.push(wp); }
                    });
                    
                } else {
                    $each( waypoints.__arr[type], function(fl){
                        $each( fl, function(wp){
                            if (selector(wp)){ s.push(wp); }
                        });
                    });
                }
            }
        } else
        if (isObject(selector)){
            return this.$(function(n){  
                for (var i in selector) if (n[i]!=selector[i]) return;
                return 1;
            }, type, _floor);
        } else {
            
             if (type) {
                
                if (_floor != undefined) {
                    return waypoints.__arr[type][_floor];
                } else {
                    $each( waypoints.__arr[type], function(fl){
                        $each( fl, function(wp){
                            s.push(wp);
                        });
                    });
                }
                
             } else {
                 
                if (_floor != undefined) {
                    $each( waypoints.__arr, function(l){
                        $each( l[_floor], function(wp){
                            s.push(wp);
                        });
                    });
                    
                } else {
                
                    $each( waypoints.__arr, function(l){
                        $each( l, function(fl){
                            $each( fl, function(wp){
                                s.push(wp);
                            });
                        });
                    });
                    
                }
                
            }
            
        }
        return s;
    },
    
    calculate: function(){
        var rooms = waypoints.__arr['rooms'];
        delete waypoints.__arr['rooms'];
        
        $each( rooms, function(fl){
            $each( fl, function(room){

                if (room.name == 'closet_f' ){
                    room.maxVisitors = 2;
                } else if(room.name == 'closet_m' ){
                    room.maxVisitors = 3;
                }
                
                room.left = room.x - room.w - 10;
                room.right = room.x + room.w + 10;
                room.innerWaypointsByType = {};
                room.isRoom = 1;
                room.innerWaypoints = waypoints.$( function(wp){
                    if ( wp != room ) {
                    
                        if ( wp.x > room.left && wp.x < room.right ){
                            
                            if (!room.innerWaypointsByType[wp.type]) {
                                room.innerWaypointsByType[wp.type] = [];
                            }
                            
                            room.innerWaypointsByType[wp.type].push(wp);
                            
                            wp.room = room;
                            return 1;
                        }
                    }
                    
                }, undefined, room.__floor);
                
            });
        });
        
        waypoints.__arr['rooms'] = rooms;
        
    }
    
} );

var workerImages = [ 'hammer', 'pick', 'hammer_and_pick', 'hammer_and_wrench', 'compression', 'desktop_computer', 'computer', 'male-mechanic', "thinking_face"];
var gladImages = [ 'slightly_smiling_face', "grinning","smile" ];
var waitingImages = [ 'hourglass_flowing_sand', 'watch', "stopwatch","timer_clock" ];
var socialImages = [ "right_anger_bubble", "speech_balloon","thought_balloon","thinking_face","face_with_raised_eyebrow","speaking_head_in_silhouette" ];

var fireImages =  ["face_with_symbols_on_mouth","rage","angry","bomb"]; //TODO: они есть?
var laughingImages = ["rolling_on_the_floor_laughing","rolling_on_the_floor_laughing","laughing"]; //TODO: они есть?
var dinnerImages = ["shallow_pan_of_food","sandwich","bowl_with_spoon","pizza","coffee","tea","knife_fork_plate"];

var sonyPSImages = ["video_game","joystick"]; // - отобразить, что пошел, собрался.
var sonyPSPlayImages = ["smiley","angry","rage","grinning","disappointed_relieved"]; // - сам процесс игры.

var tableGamesImages = ["game_die","speech_balloon","thinking_face","face_with_raised_eyebrow"];

var phoneImages = ["iphone", "calling","speaking_head_in_silhouette","thinking_face","grinning"];

//TODO:
var bossBirthday = ["balloon","tada","gift","bouquet","sparkles","raised_hands","birthday","clinking_glasses"];

var sadImajes = ["slightly_frowning_face","white_frowning_face","disappointed","cry"];
var lolImages = ["rolling_on_the_floor_laughing","rolling_on_the_floor_laughing","laughing"];
var angryImages = ["face_with_symbols_on_mouth","rage","angry","bomb"];
var acheImages = ["face_with_head_bandage","mask","pill","hospital","sneezing_face"];
var sickImages = ["nauseated_face","face_vomiting"]; 

var tiredImages = ["zzz","bed"];



var lift = makeSingleton({ 
    
    __floor: 1,
    enabled: 1,
    d: {},
    calls: {},
    mans: []
    
}, {
    
    init: function(){
        
        function ldoor(y) {
            lift.d[y] = mainScene.__getObjectByName('lifts').__childs[y+1]
            lift.d[y].__getObjectByName('txt').__text = 1;
        }
        
        ldoor(1);
        ldoor(2);
        ldoor(3);
        ldoor(4);
        
        this.reset();
        
    },
    
    callToTheFloor: function(_floor){
        
        this.calls[_floor] = 1;
        
    },
    
    update: function(){
 
        if (this.moving) {
            
        } else {
            
            if (!this.opened) {
                if (this.calls[this.__floor]){
                    this.open();
                    return;
                } 
                else 
                for (var i = 1; i <= 4; i++){
                    if ( this.calls[i] ) {
                        
                        this.moveToFloor(i);
                        return;
                        
                    }
                }
            }
            
            if (this.opened) {
                if (this.mans.length) {
                    this.close();
                } else {
                    if ( this.openedTime < TIME_NOW - 20 ){
                        this.close();
                    }
                        
                }
            }
            
        }
        
    },
    
    moveToFloor: function(_floor){
        
        var t = this;
        t.moving = 1;
        if (this.opened) {
            this.close();
        }
        
        var time = 2 * abs(  this.__floor - _floor ) / config.liftSpeed;
        
        anim(this, { __floor: _floor, moving: 0 }, time, 0, easeLinear );
        
        
    },
    
    reset: function(){
        _clearInterval(this.interval);
        this.interval = _setInterval( function(){ lift.update(); }, convertToGameTime( 10 ) );
    },
    
    open: function(){
        var node = this.d[this.__floor];
        
        this.openedTime = TIME_NOW;
        
        node.leftdoor.__size = [ 0.1, 1 ];
        node.rightdoor.__size = [ 0.1, 1 ];
        
        $each(lift.mans, function(man){
            man.node.__visible = 1;
            man.node.__y = normalizePeopleY( YByFloor(lift.__floor), man);
        });
        
        this.calls[this.__floor] = 0;
        this.opened = 1;
        this.reset();
    },
    
    close: function(){
        var node = this.d[this.__floor];
        
        $each(lift.mans, function(man){
            man.node.__visible = 0;
        });
        
        node.leftdoor.__size = [ 0.51, 1 ];
        node.rightdoor.__size = [ 0.51, 1 ];
        
        this.opened = 0;
        this.reset();
    }
    
    
}, {
    
    openedAtFloor: createSomePropertyWithGetterAndSetter( 
        function(){
            return this.opened ? this.__floor : -1 
        },
        function(){ }
    ),
    
    __floor:  createSomePropertyWithGetterAndSetter( 
        function(){
            return this.__f;
        },
        function(v){ 
            if (round(this.__f) != round(v)) {
                $each(this.d, function(n){
                    n.__getObjectByName('txt').__text = round( v );
                });
            }
            this.__f = v;
        }
    ),
    
}); 

function isWaypointFree(wwp){
     return (wwp.busy.length < wwp.maxVisitors)
}

function selectFreeWaypoint(wp, forMan){
    if (isArray( wp )) {
        if (forMan){
            var likewp = dropSomethingBy( $filter( wp, function(wwp){
                return forMan.wpLikes.indexOf(wwp) >= 0 && isWaypointFree(wwp);
            } ) );
            if (likewp)
                return likewp;
        } 
        
        wp = dropSomethingBy( $filter( wp, isWaypointFree ) );
    }
    else 
    if (wp && !isWaypointFree(wp)) {
        return;
    }
        
    return wp;
}

function debugthis(){
    //debug
    if(!debuggerDisabled)
        debugger;
    //undebug
}

var __taskIds__ = 0;
var ManTask = makeClass(function(opts){
    this.id = __taskIds__++;
    this.onStart = function(){};
    this.starter = function(){};
    this.onFinish = [];
    mergeObj(this, opts);
    this.finishFunc = this.finish.bind(this);
    
}, {
    
    toString: function(){
      return '<' + this.id + ' ' + this.name + '>';
    },
                        
    start: function(){
        var t = this;
        t.man.currentStarterTask = t;
        if (t.parallel){
            t.starter();
            t.onStart();
            t.man.runNextTask();
            t.started = 1;
        } else 
        if ( t.starter() ) {
            t.man.currentTask = this;
            t.onStart();
            t.started = 1;
        } else {
            t.cancel();
            t.man.runNextTask();
        }
        t.man.currentStarterTask = 0;
        if (t.started) {
            if (t.finishTimeout){
                t.timeout = _setTimeout( t.finishFunc, t.finishTimeout );
            }
        }
    },
    
    __finish: function(res){
        var t = this;
        
        if (t.man.currentTask == t){
            t.man.currentTask = 0;
        }
        
        //debug
        else {
            
            if (res && !t.parallel){
                // как это закончена успешно не текущая задача?
                // t.man.currentTask может обнулиться через отмену
                if (t.man.currentTask) {
                    debugthis();
                }
            }
        }
        //undebug
        
        if (t.animation) killAnim(t.animation);
        if (t.interval) _clearInterval(t.interval);
        if (t.timeout) _clearTimeout(t.timeout);
                        
        $each( t.onFinish, function(f){ f.call(t, res); } );
        
        if (res && !t.parallel){
            t.man.runNextTask();
        }
        
        return this;
    },
    
    cancel: function(){
        return this.__finish();
        
    },
    
    finish: function(){
        return this.__finish(1);
    }
    
    
}, {
    
} );


// TODO:  карточка создана: сделать чтоб персы меньше накладывались друг на друга когда идут в одном направлении

// просто выполнить функцию в виде задачи
function simpleFunctionTask(func, params) {
    return new ManTask( mergeObj( {
        name: 'function',
        starter: function(){
            var tmp = this.man.__tkchk;
            this.man.__tkchk = 1;
            func.call(this);
            this.man.__tkchk = tmp;
            looperPost( this.finishFunc );
            return 1;
        }
    }, params ) );
}


function animationTask(animation, type, time, parallelTask, onFinish) {
    time = time || 1;
    
    return new ManTask( { 
        name: 'anim ' + animation + (parallelTask ? ' parallel' : ''),
                        
        parallel: parallelTask,
        
        onFinish: onFinish || [ ], 
        
        starter: function(){
            var t = this;
            t.man.startAnimation(animation, type, time);
            // need timeout if parallel ?
            return 1;
        },
        
        finishTimeout: convertToGameTime( time )
    } );
}

  
function seatTask(man, animation, time, bubbles, waypoints, onStart, onFinish, parallelTask, realSeatWp, secondTry){
    
    time = time || 1;
    
    var wp = selectFreeWaypoint(realSeatWp, man) || selectFreeWaypoint( waypoints, man );
    
    if (!secondTry){
        return [
            // move to waypoint and seat
            wp,
            function(){
                //тут важно выполнять именно в функции, т.е. когда чел дошел до вэйпоинта
                var task = seatTask(this.man, animation, time, bubbles, waypoints, onStart, onFinish, parallelTask, wp, 1);
                this.man.addTasksToFront( task );
            }
        ]
    }
    
    /*
    if (!wp || (realSeatWp != wp)) {
        debugger;
        return;
    }*/
    
    return [
        // move to waypoint again! and seat
        wp
        , new ManTask( { 
            
            wp: wp,
            
            name: 'anim ' + animation + (parallelTask ? ' parallel' : ''),
                            
            parallel: parallelTask,
            
            onFinish:[ function(success){
                
                this.man.stay();
                if (wp)
                    removeFromArray(this.man, wp.busy);
                
                if (onFinish)
                    onFinish(wp);
                
            } ], 
            
            starter: function(){
                
                var t = this;
                
                wp = selectFreeWaypoint(wp, man);
                
                if (!wp || (realSeatWp != wp)) { // пока шел место заняли :(
//                     debugger;
                    return;
                }
                
                if (onStart && !onStart(realSeatWp)){ // например нет электричества
                    return;
                }
                
                t.man.seatwp = wp;
                
                wp.busy.push(t.man);
                
                if (man && man == t.man)
                    if (man.wpLikes.indexOf(wp) < 0)
                        man.wpLikes.push(wp);
                
                t.animation = t.man.seat(wp, animation, time);
                
                if (bubbles) {
                    t.interval = _setInterval( function(){ 
                        t.man.tell( '', bubbles );
                    }, randomInt( 15, 25 ) );
                }
                
                return 1;
            },
            
            finishTimeout: convertToGameTime( time )
            
        } )
    ];
    
};

// периодически выкидывать какие-то бабблы

function bubblesTask(imagesArray, time, period, parallel){
    
    period = convertToGameTime ( period == undefined ? randomInt( 15, 25 ) : period );
    
    var func = function(){ 
        this.man.tell( '', imagesArray );
    };
    
    if (!period){
        if (!time) {
            return simpleFunctionTask(func);
        }
    }
    
    var t = waitingFunctionTask(time);
    t.parallel = parallel;
    func = func.bind(t);
    if (period) {
        t.onStart = function(){
            t.interval = _setInterval( func, period );
        }
    } else {
        t.onFinish.push(func);
    }
    
    return t;
    
}

// задача на "дождаться какого-то события"
// через каждый интервал time если func возвращает что-то, то переходим к следующей задаче
// если нет параметра func то просто ждем time секунд
function waitingFunctionTask(time, func, params) {
    time = convertToGameTime( time || 1 );

    return new ManTask( mergeObj( { 
 
        name: 'wait ' + time, 
        
        finishTimeout: func ? 0 : time,
        
        starter: function(){
            var t = this;
            if (func) {
                t.interval = _setInterval(
                    function(){
                        if (func()) { 
                            _clearInterval(t.interval);
                            t.finish();
                        }
                    }, time );
            } 
            return 1;
        }
    }, params));
}


function setStatusTask(s, msg, imgs){
    return new ManTask( {
        s: s,
        name:'setStatus',
        starter: function(){
            this.man.tell( msg, imgs ).setStatus(s);
            looperPost( this.finishFunc );
            return 1;
        }
    });
}


function chance( f ){
    return f > random();
}

function normalizePeopleY(y, man){
    if (man && man.inLift){
        return -floorByY(y) * floorHeight + 141;
    }
    return -floorByY(y) * floorHeight + 144;
}

function floorByY(y){
    return clamp( round( ( -y + floorHeight * 2 ) / floorHeight ), 0, 4);
}

function YByFloor(_floor){
    return -_floor * floorHeight + floorHeight * 2.5;
}

var tasksOnFree = {
            
    moveToRandomFloor: 1,    // пойти на случайный этаж
    moveToWork: 1,           // пойти работать
//     moveToHome : 1,          // пойти домой
    moveToEat: 1,            // пойти есть
    moveToCloset: 1,         // пойти в туалет
    moveToSocial : 1,        // пойти пообщаться
    moveToHR : 1,            // пойти к hr
    moveToMeeting : 1,       // пойти на совещание
    moveToBossMeeting : 1,   // пойти на совещание у директора
    moveToPhoneCall : 1,     // пойти позвонить
    moveToPlaySonyPS : 1,    // играть в sonyPS
//     moveToPlayTableGames : 1,// играть в настолки
    moveToWalk : 1,          // пойти погулять по офису
    moveToFloorWalk : 1,     // пойти погулять по этажу
    moveToPayOrder : 1,      // оплатить заказ
    moveToDinner : 1,        // идет в столовую
    moveToFinancial: 1,      // пойти в отдел кадров
    moveToServer: 1,         // копаться в серверной
    moveToDirs: 1,           // пойти к руководству
    moveToQCAeration: 1      // qc проветривание

};


var tasksByEventChances = {
    moveToStartWorkingDay: 1,    // начать рабочий день
    chanceToSmoke: 1,              // пойти курить
    moveToBigBoss: 1             // собраться в кабинете у мрака
};

ObjectDefineProperties( __window, {
    selectedMan: createSomePropertyWithGetterAndSetter(
        function(){ return this.__sem; },
        function(v){
            
            if (this.__sem != v){
                if (this.__sem) {
                    this.__sem.unselected();
                }
                if (v){
                    v.selected();
                }
            }
                
            //debug
            if (this.__sem){
                if (this.__sem.debugNode) {
                    this.__sem.debugNode = this.__sem.debugNode.__removeFromParent();
                }
            }
            
            if (v && !v.debugNode){
                v.createDebugNode();
            }
            //undebug
            
            if (this.__sem){
                this.__sem.cameraFollow = 0;
            }
            
            this.__sem = v;
            
            updateManInfo();
        }
    )
});
                
function updateManInfo(){
    if (__window.selectedMan){
        
        gui_manInfo.__visible = 1;
        
        gui_manInfo.__text = __window.selectedMan.getInfo();
        
    } else {
        gui_manInfo.__visible = 0;
    }
    
}
    

    

var Man = makeClassWithArrayIterator(function(cfg){

// параметры
//   timeForWork: randomize(10,20),  // среднее рабочее время
//   likeLift: random(),   // насколько любит кататься на лифте
              
//   timeForLate: 1, // насколько может опаздать
//   chanceToAche: 0, //random(), // шанс заболеть
//   workArea: 'art',   // комната для работы
//   gender: 'female' // пол

    var t = this;
    
    t.__log = []
    
    t.wpLikes = [];

    t.cfg = cfg;
    
    t.tasks = [];
     
    t.init( cfg );
    
    t.behavioursTable = {};
    if (behavioursCfg) {
        var behaviours = [ t.behaviour, t.gender, t.name, t.type, 'base' ].join(',').split(',');
        $each( behaviours, function(b){ 
            var c = behavioursCfg[b];
            
            $each(c, function(w, i){
                t.behavioursTable[i] = (t.behavioursTable[i] || 0) + w;
            });
        });
    }
    
    t.speedMod = t.gender == 'male' ? 1.1 : 1;

    delete t.behavioursTable['id'];
    delete t.behavioursTable['i'];
    
}, {
   // methods 
    getInfo: function(){
        return this.name + ' ' + this.type + '\n' + this.status;
    },
    
    setStatus: function(s){
        if (s != undefined) {
            this.status = s;
            updateManInfo();
        }
    },
    
    chance: function( i ){
        
        return isString(i) ? chance( this.behavioursTable[i] ) : isNumeric(i) ? chance(i) : 0;
        
    },
    
    selected: function(){
        if (!this.sel) {
            this.sel = this.node.__addChildBox( {
                __size: [25,40], __color: 0xffffff, __blending: 2,
                __img: 'bbr', __corner: [-16,-16], __z: -10, __y: 5
            } );
            this.sel.__anim({__scaleF: [2, 1]}, 0.3, 0, easeBounceO)
        }
    },
    
    unselected: function(){
        if (this.sel) {
            this.sel = this.sel.__removeFromParent();
        }
    },
    
    match: function(selector){
        if (selector instanceof Man) {
            return selector == this;
        } else
        if (isFunction(selector)) {
            return selector.call(this, this);
        }  else
        if (isObject(selector)){
            return this.match( function(){
                for (var i in selector) {
                    if (isFunction( this[i] )){
                        if (!this[i](selector[i]))
                            return;
                    }
                    else {
                        if (this[i]!=selector[i])
                            return;
                    }
                }
                return 1;
            });
        }
    },
    
    init: defaultMergeInit,
    
    removeBubbl: function(){
        
        if (this.bubbl){
            if (options.__timeMultiplier >= 4) {
                this.bubbl.__removeFromParent();    
            } else {
                this.bubbl.__anim( { __scaleF:0 }, 0.2, 0, easeBackI ).__removeAfter(0.2);
            }
            this.bubbl = 0;
        }
        return this;
    },
        
    addBubbl: function(bubbl){
        if (isArray(bubbl))
            bubbl = { __img: dropSomethingBy(bubbl) };
        
        if (bubbl){
            var t = this;
            
            t.removeBubbl()
                .bubbl = this.node.__addChildBox({
                    __img: bubbl.__img,
                    __y : -70,
                    __scaleF: 0.3,
                    __anchor:{x:0,y:-1},
                    __transformAnchor: 1,
                    __onDestruct: function(){
                        if (t.bubbl == this) t.bubbl = 0;
                    }
                }).__removeAfter(2);
                
            if (options.__timeMultiplier < 4) {
                this.bubbl.__anim( { __scaleF:[0, 0.3] }, 0.3, 0, easeBackO )
            }
            
        }
        return this;
    },
    
    tell: function(mess, bubbl){
        
//         if (__window.__debugTells){ 
        if (mess)
            this.log(mess);
//         }
        if (bubbl)
            this.addBubbl(bubbl);
        
        return this;
        
    },
    
    onFree: function(){
        var t = this;
        var taskMethod = dropSomethingBy(tasksOnFree, function(c,i){ 
            if (isFunction( t[i] )){
                return t.behavioursTable[i];
            }; 
        }, 1);
        
//         if (debugTasks) if (randomBool())
//           taskMethod = 'moveToPlaySonyPS';
        
        if (debugTasks){
            consoleLog('free:', taskMethod);
        }
        
        t[taskMethod]();
        return this;
    },
    
    getNearestStairsWpId: function(){
        if (this.__floor == 0) return 0;
        return this.node.__x > 0 ? 1 : 0;
    },
    
    moveToFloorTask: function(_floor){
        return new ManTask( {
            
            __floor: _floor,
            
            name:'moveToFloor',
        
            starter: function(){
                
                //эта задача не влияет на общение
                this.startedSocialTasksWithMan = 0;
                
                var man = this.man;
                
                if (man.onStreet || man.isOnStreet()){
                    return;   
                }
                
                var currentFloor = man.__floor
                    , needFloor = this.__floor;
                    
                if (man.movingToWpTask) {
                    debugthis();
                }
                
                var dy = man.node.__y - normalizePeopleY( YByFloor(this.__floor) );
                
                if ((currentFloor != needFloor) || dy) {
                    
    //                 man.likeLift = 0;
                        
                    if (dy && lift.enabled && currentFloor > 0 && needFloor > 0 &&  chance( man.likeLift * abs( needFloor - currentFloor ) ) ) {
                        
                        man.tell('поеду на ' + needFloor + ' этаж', { __img:'man-running' });
                        
                        man.addTaskForLift( waypoints.getByIndex('lift', currentFloor, 0), waypoints.getByIndex('lift', needFloor, 0) );
                        
                    }
                    else {
                        
                        man.tell('иду с ' + currentFloor + ' на ' + needFloor + ' этаж', { __img:'man-walking' });
                    
                        var wpp = (needFloor * currentFloor) == 0 ? 0 : man.getNearestStairsWpId();
                        var i = sign(currentFloor - needFloor);
                        
                        var wpname = dy > 0 ? 'stairsup' : 'stairsdown';
                        var wpname2 = dy < 0 ? 'stairsup' : 'stairsdown';
                        
                        man.addTasksToFront( function(){ man.z = DEF_MAN_Z; } );
                        
                        if (currentFloor != needFloor) {
                                                        
                            for (var j = needFloor; j != currentFloor; j += i) {
                                var nextFloor = j + i;
                                
                                man.addTasksToFront(
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname, nextFloor, wpp ) ),
                                    simpleFunctionTask(function(){ man.z = -10; }, { cantCanceled: 1 }),
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname + 2, nextFloor, wpp ), { cantCanceled: 1 } ),
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname2 + 2, j, wpp ), { cantCanceled: 1 } ),
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname2, j, wpp ), { cantCanceled: 1 } )
                                );
                            }
                        
                        }
                        
                        // чел на лестнице - надо дойти до исходной
                        var ddy = man.node.__y - normalizePeopleY( YByFloor(currentFloor) );
                        if ( ddy ){
                            
                            if (ddy < 0 && currentFloor >= needFloor){
                                man.addTasksToFront(
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname2 + 2, currentFloor, wpp ), { cantCanceled: 1 } ),
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname2, currentFloor, wpp ), { cantCanceled: 1 } )
                                );
                            } else {
                                
                                man.addTasksToFront(
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname + 2, currentFloor, wpp ), { cantCanceled: 1 } ),
                                    man.moveToWaypointTask ( waypoints.getByIndex( wpname, currentFloor, wpp ), { cantCanceled: 1 } )
                                );
                                
                            }
                            
                        }
                        
                            /*
                        if (debugTasks){
                            $each( man.tasks, function(t){
                                var wp = t.wp
                                if (wp) {
                                    consoleLog(wp.name, wp.__floor, wp.x, wp.y);
                                }
                            });
                         
                            debugger;
                        }
                        */
                    }
                    

                }
                
            } 
    
        } )
        
    },
    
//  Действия:
        
//     прийти на работу: выходит из-за границы экрана - идет в раздевалку - дошел - анимация рук - свободен
//     опаздывать: стоять за границей экрана. 
//     болеть: стоять за границей экрана. -- какого ему там стоять?
    
    moveToStartWorkingDay: function(lateTime){
        
        var t = this;
        
        // некоторые пришли без верхней одежды
        t.needLocker = 1; // 0.5 > random();
        var maxTime = lateTime || t.behavioursTable.timeMaxForLate || 1;
        var tm = pow( randomize( t.behavioursTable.timeMinForLate || 0, maxTime + 5 ) / maxTime, t.behavioursTable.lateProbability || 0.1 ) * maxTime * 60;
        
        _setTimeout(function(){
            
            //debug
            //TODO: remove it
            if (debugTasks) t.behavioursTable.chanceToAche = 0;
            //undebug
            
            if (!lateTime && chance( t.behavioursTable.chanceToAche )) {
                t.tell('сегодня заболел');
                return this;
            }
            
            var spawn = waypoints.getByName('misc', 1, 'spawn');
            
            t.appear( spawn );
            
            if (t.needLocker) {
                t.moveToLocker();
            } else {
                t.runNextTask();
            }
            
        }, convertToGameTime( tm ) );
        
        return this;
    },
    
    moveToLocker: function(){
        
        this.moveToTheRoom('locker', undefined, undefined, 'идет в раздевалку');
        if (this.needLocker){
            this.addTasks( 
                setStatusTask('переодевается'),
                animationTask( 'gesture', randomInt( 1, 3 ), randomInt( 10, 30 ) ) 
            );
        }
        return this;
    },

    moveToRandomRoom: function(){
        
        return this.moveToTheRoom( waypoints.getRandomRoom(), undefined, undefined, 'гуляет' );
        
    },
    
    moveToRandomFloor: function(){
        
        var targetFloor = randomInt(0, 4);
        while (targetFloor == this.__floor) {
            targetFloor = randomInt(0, 4);
        }
        return this.addTasks(
            setStatusTask('гуляет', 'иду на случайный этаж'),
            this.moveToFloorTask(targetFloor) 
        );
        
    },
    
    stay: function(){
        this.node.__y = normalizePeopleY(this.node.__y, this);
        this.node.__scalex = 1;
        this.z = this.isOnStreet() ? DEF_MAN_STREET_Z : DEF_MAN_Z;
    },
    
    seat: function(wp, anim, time){
        
        var t = this, wpnode = (wp||0).wpnode;  
        var imgopts = { h: 0, x: 0, atype: 1};
        if (wpnode){
            
            var sc = wpnode.__getWorldScale(), wppos = wpnode.__worldPosition.clone();
            
            imgopts = setNonObfuscatedParams({}
                , 'work_chair', { h: 16, x: -1, atype: 1 }
                , 'chair3', { h: 12, x: -1, atype: 1 }
                , 'food_chair1', { h: 14, x: 0, atype: 2 }
                , 'food_chair2', { h: 14, x: 0, atype: 1 }
                , 'chair2', { h: 15, x: 2, atype: 1, s:-1 }
            )[wpnode.__img] || imgopts;
            
            wppos.y -= imgopts.h;
            wppos.z = -wpnode.__totalZ;
            
            wppos.x += sc.x * imgopts.x;
            t.node.__scalex = -sc.x * (imgopts.s||1);
            t.node.__ofs = wppos;
            
        }
        
        if (anim) {
            var cdf = setNonObfuscatedParams({},
                'eat', [ 'ест', 'кушает', 'ест', 'кушает', 'насыщается', 'поглощает пищу', 'поглощает пищу', 'вкушает', 'обедает', 'уплетает', 'полдничает' ],
                
                'seat', [ 'общается', 'болтает', 'разговаривает', 'беседует' ],
                
                'tipe',  [ 'работает', 'пишет в слаке', 'читает башорг', 'смотрит в монитор' ].concat( 
                
                    setNonObfuscatedParams({ },
                        
                        //TODO: fill it!
                        
                        type_dev , [ 'кодит', 'программирует', 'дебажит', 'кодит', 'программирует', 'дебажит', 'вставляет арт в поект', 'анимирует', 'читает StackOverflow', 'читает хабр', 'лазит в интернете', 'пишет код', 'пишет говнокод', 'рефакторит', 'компилирует', 'пишет скрипт', 'верстает', 'расставляет пробелы', 'переносит строки', 'пишет непонятные символы', 'смотрит в монитор', 'изучает язык', 'изучает c++', 'инкапсулирует', 'пилит движок', 'пилит проект', 'пилит костыли', 'выпиливает костыли', 'лазит в Джире' ],
                        
                        type_qc , [ 'читает гиктаймс', 'лазит в интернете', 'играет', 'тестирует', 'лазит в Джире' ],
                        'servDev',  [ ],
                        'sup', [ ],
                        'fin', [ ],
                        'sys', [ ],
                        'pm', [ ],
                        'prod', [ ],
                        'hr', [ ],
                        'hoz', [ ],
                        type_gd , [ ]
                    )[t.type] || []),
                    
                'draw', [ 'рисует' ]
            );
            
            if (cdf[anim]) {
                t.setStatus( dropSomethingBy( cdf[anim] ));
            }
            
            
            return t.startAnimation( anim, imgopts.atype, time );
        } else {
            return imgopts;
        }
                                    
    },
//     пойти работать: пошел до рабочего места в своей рабочей зоне -> дошел до рабочего места -> сел -> включилась анимация компа -> прошло время отведенное на работу -> свободен 
    
    
    moveToWorkInstantly: function(){
        var t = this;
        if (t) {
            
            var wrke = t.state == MAN_STATE_WORKING;
            
            t.cancelAllTasks();
            
            if (wrke){
                //TODO: dont touch me!
                t.tell( "я и так работаю!", [ 'angry' ]);
            }
            else {
                t.addTask(function(){ 
                    t.moveToWork();
                });
            }
            
            if (!t.currentTask) {
                t.runNextTask( randomize(1, 2) );
            }

        }
        return t;
    },
    
    pcOn: function(wp, wpnode){
        
        if (wp) {
            var parent;
            if (wpnode) {
                parent = wpnode;
            } else {
                wpnode = wp.wpnode || 0;
                parent = wpnode.parent;
            }
            
            if (!parent)
                return;
             
            wp.pcon = this;
            
            $each(wp.pc, function(a){ a.__removeFromParent() });
            
            var pp = parent, pp2;
            pp.length = 1;
            var img = pp.__img;
            var pcanimnode, pcanimnode2;
            
            switch (img){
                case 'table1': 
                    pp = pp.$({__img: 'small_monitor'});
                    pcanimnode = { __size: [3, 9], __img: pcimg(), __ofs: [0, -1] };
                    break;
                
                case 'table10':
                case 'table9':
                    pp2 = pp.$({__img: 'arttablet'});
                    pp = pp.$({__img: 'monitor1'});
                    pcanimnode = { __size: [7, 9], __img: pcimg(), __ofs: [0, -1] };
                    pcanimnode2 = { __size: [6, 6], __skewX: 0.78539, __img: pcimg() };
                    break;
                    
                case 'table11':
                case 'table8':
                    pp2 = pp.$({__img: 'monitor3'});
                    pcanimnode2 = { __size: [7, 9], __img: pcimg(), __ofs: [0, -1.5] };
                    
                    pp = pp.$({__img: 'monitor4'});
                    pcanimnode = { __size: [15, 9], __img: pcimg(), __ofs: [0, -1.5] };
                    break;
                
                case 'one_monitor_table':
                    pcanimnode = { __size: [7, 9], __img: pcimg(), __ofs: [ 1.5, -6.5 ] };
                    break;
                    
                case 'one_monitor_table2':
                    pcanimnode = { __size: [7, 9], __img: pcimg(), __ofs: [1.5,-7] };
                    break;
                    
                case 'one_monitor_table3':
                    pcanimnode = { __size: [7, 10], __img: pcimg(), __ofs: [5.5,-7] };
                    break;
                
                case 'table4':
                    pcanimnode = { __size: [5, 4], __y: -7, __img: pcimg() };
                    break;
                        
                case 'two_monitors_table': 
                    pcanimnode = { __childs: [
                        { __size: [7, 9], __img: pcimg(), __ofs: [-5.5,-6.5] },
                        { __size: [7, 9], __img: pcimg(), __ofs: [4.5,-6.5] }
                    ] };
                    break;
                    
                case 'sonyPS': 
                    pcanimnode = { __size: [13, 26], __ofs:[27, -7.6], __img: 'pc_anim_' + dropSomethingBy([ 8, 16, 24,32, 40, 41, 49, 56, 60, 38, 46,18, 26]) };
                    break;
                    
                default: 
                    consoleLog(img); 
                    debugger;
            }
            
            wp.pc = [];
            if (pcanimnode && pp && pp.length){
                
                if (pp instanceof NodeArrayIterator){
                    for (var i = 0; i< pp.length; i++){
                        wp.pc.push( pp[i].__addChildBox(pcanimnode) );
                    }
                } else {
                    wp.pc.push( pp.__addChildBox(pcanimnode) );
                }
                
                
            }
            if (pcanimnode2 && pp2 && pp2.length){
                if (pp2 instanceof NodeArrayIterator){
                    for (var i = 0; i< pp2.length; i++){
                        wp.pc.push( pp2[i].__addChildBox(pcanimnode2) );
                    }
                } else {
                    wp.pc.push( pp2.__addChildBox(pcanimnode2) );
                }
                
            }
            
            $each(wp.pc, function(a){ 
                a.__traverse( function(b){
                    if (b.__img && !b.__skewX)
                        b.__scalex = randomSign();
                });
            });
            
            var t = this;
            wp.pconTimeout = _setTimeout( function(){
                if (wp.pcon == t){
                    t.pcOn(wp);
                }
            }, randomInt(10,60) );
//             if (!wp.pc.length)
//                 debugger;
        }
        
        
    },
    
    pcOff: function(wp){
        if (wp){
            wp.pcon = 0;
            _clearTimeout(wp.pconTimeout);
            if (chance(0.8)) {
                $each(wp.pc, function(a){ a.__removeFromParent() });
                wp.pc = 0;
            } else {
                $each(wp.pc, function(a){ a.__traverse(function(b){
                    if (b.__img) {
                        b.__img = pcimg(1);
                    }
                }) });
            }
        }
    },
    
    
    moveToWork: function(){
        
        var t = this;
        
        if (!hasElecrticity) {
            return;
        }

        var time = 60 * clamp( round( ( ( t.behavioursTable.timeForWork || 10 ) + randomize(0,10) ) / config.workSpeed ), config.mintimeForWork, config.maxtimeForWork )
        , room = waypoints.getRoomWp( t.workArea );        
        t.addTasks(
            setStatusTask('идет работать', 'иду работать', workerImages ),
            room,
            seatTask(t, t.type == 'art' ? 'draw' : 'tipe', time, 0, waypoints.getWaypointsInRoom( room, 'work' ),
                function(wp){
                    if (hasElecrticity){
                        t.state = MAN_STATE_WORKING;
                        t.tell('работаю ' + time + 'сек',  workerImages );
                        t.pcOn(wp);
                        return 1;
                    }
                }, 
                function(wp){
                    t.pcOff(wp);
                    t.state = MAN_STATE_IDLE;
                })
        );
    
        return this;
    },
    
//      TODO: пойти домой: идет в раздевалку - дошел - включает анимацию рук на 5 секунд - выходит из здания, идет за экран - вышел за экран - свободен 
//     (ну вдруг работник может прийти ночью. В уборную. Вернулся по событию. - создана карточка
    
    moveToHome: function(){
        var t = this;
        
        if ( t.moveToHomeTimeout){
            return t;
        }
        
        if ( t.addedTimeToGoHome ){
        
            var tm = round( convertToGameTime( t.addedTimeToGoHome ) );
            
            if (tm) {
                t.tell( 'задержусь на ' + tm + 'мин' );
            }
            
            t.moveToHomeTimeout = _setTimeout( function(){
                t.moveToHomeTimeout = 0;
                t.moveToHome();
            }, tm * 60 );
            
            t.addedTimeToGoHome = 0;
            
        } else {
            
            if (t.needLocker) {
                t.moveToLocker();
            } 
            
            t.addTasks(
                setStatusTask('идет домой', 'иду домой!', gladImages ),
                waypoints.getByName('misc', 1, 'spawn'),
                setStatusTask('не на работе' ),
                function(){ t.disappear(); }
            );
            
        }
        
        return t;
    },
    
    /*
        пойти пить чай: идет в столовую - дошел - идет к правой стенке - возится возле правой стенки (анимация шевеления руками, что-то там делает) - садится за свободный стол - включает анимацию питья - пьет какое-то время - свободен.
        
        пойти обедать: идет в столовую - дошел - идет к правой стенке - возится возле правой стенки (анимация шевеления руками, что-то там делает) - садится за свободный стол - включает анимацию еды - есть какое-то время - свободен.
        
        пойти в столовую просто так: идет в столовую - дошел - идет к правой стенке - возится возле правой стенки (анимация шевеления руками, что-то там делает) - свободен
        
        пойти есть пиццу сидя: идет в столовую - дошел - подходит к столам (на них уже появится пицца) - включает анимацию рук - отходит от стола с пиццей - идет к свободному столу в столовой - садится - включает анимацию еды - ест какое-то время - свободен.
        
        пойти есть пиццу стоя: идет в столовую - дошел - подходит к столам (на них уже появится пицца) - включает анимацию рук - отходит от стола в случайную точку столовой - ест стоя (отдельная получается анимация) какое-то время - свободен.
        
    */
    
    moveToEat: function(args){
        
        // TODO: занятость wp - карточка создана
        // разнообразные стили поедания пищи (стоя, сидя, пиццу, чай)
        this.addTasks(
            setStatusTask('идет кушать', 'иду кушать', dinnerImages ),
            waypoints.getByName('misc', 1, 'dinnerWall'),
            setStatusTask('готовится покушать'),
            animationTask( 'gesture', randomInt(1,3), randomize(10,60) ),
            setStatusTask('идет кушать'),
            seatTask( this, 'eat', randomize( 5*60, 20*60 ), 0, waypoints.getALLByTypeAndFloor('eat', 1) ) 
        );
        
        return this;
        
    },
    
    
//     пойти курить: идти на улицу в курилку - дошел - включает анимацию курения - курит какое-то время - свободен.
    
    moveToSmoke: function(){
        var t = this;
        function gogogo(cc, tm1, tm2){
            if (chance(cc)) 
                t.addTasks( 
                    setStatusTask('идет на перекур', 'иду курить'),
                    'smokePlace', 
                    setStatusTask('курит'),
                    animationTask('smoke', randomInt(1,3),  randomize( tm1 * 60, tm2 * 60 ) ) 
                );
        }
        gogogo(1, 4, 10);
//         gogogo(0.7, 2, 3);
//         gogogo(0.3, 1, 2);
//         gogogo(0.2, 1, 2);
        return this;
    },
    
//     пойти в туалет: пойти до уборной на текущем этаже подходящей по полу - дошел до убороной - открывается дверь - исчезает - находится в уборной какое-то время - свободен (
    
    moveToCloset: function(){
        
        if (!this.gender) {
            debugthis();
            return this;
        }
        
        var room = waypoints.getRoomWp('closet_' + this.gender.charAt(0), this.__floor || 1);
        
        var t = this;
        // анимация дверей
        
        this.addTasks(
            setStatusTask('идет в туалет', 'иду в туалет'),
            room,
            function(){
                
                if (isWaypointFree(room)){
                    
                    t.addTasksToFront(
                        setStatusTask('в туалете'),
                        waitingFunctionTask( randomize( 30, 10 * 60  ), 0, { 
                            cantCanceled: 1, 
                            onStart: function(){
                                t.moveInto();
                                room.busy.push(t);
                            },
                            
                            onFinish: [ function(){
                                t.moveOut();
                                removeFromArray(t, room.busy);
                                t.setStatus('');
                            } ]
                        })
                    )
            
                }
            }    
        );
        
        return this;
    },
    
    
    _startSocialTasks: function(withman){
        this.startedSocialTasksWithMan = withman;
        return this;
    },
    
    _endSocialTasks: function(){
        this.startedSocialTasksWithMan = 0;
        return this;
    },
    
//     пойти пообщаться: пойти в случайный отдел - дошел - выбирает сотрудника - подходит к сотруднику - включает анимацию общения - общается какое-то время (баблы над головой) - свободен
        
    moveToSocial: function(){
        
        var t = this;
        
        var room = waypoints.getRandomRoom();
        
        return t.addTasks(
            setStatusTask('идет пообщаться с кем-то', 'хочу пообщаться в ' + room.name, socialImages),
            room, 
            function(){
                var findedman = waypoints.getMansInRoom( room ).randomManWithout(t);
                if (findedman) {
                    
                    var x = findedman.node.__worldPosition.x;
                    //ближайший wp к findedman
                    var wp = waypoints.getWaypointsInRoom( room ).sort( function(wpp){
                        return wpp.x - x
                    })[0];
                    
                    if (!wp) {
                        return;
                    }
                    
                    var time = randomInt( 60, 10 * 60 );
                    
                    //TODO: why cancelAllTasks?
                    findedman.cancelAllTasks();
                    
                    findedman._startSocialTasks(t)
                        .addTasksToFront(
                            wp,
                            setStatusTask('общается'),
                            bubblesTask( socialImages, time )
                        )
                        ._endSocialTasks();
                    
                    t._startSocialTasks(findedman)
                        .addTasksToFront(
                            wp,
                            setStatusTask('общается'),
                            animationTask( 'gesture', randomInt(1,3), time, 1 ),
                            bubblesTask( socialImages, time )
                        )
                        ._endSocialTasks();
                    
                }
            }
        );
        
    },
    
    
    moveToTheRoomToSocialWithMan: function(room, manOpt, exactlyToMan, time){
        
        if (exactlyToMan){
            //TODO: move exactly to man 
            return this;
        }
        
        var t = this;
        room = waypoints.getRoomWp(room);
        
        var wpss = waypoints.getWaypointsInRoom( room, 'social' ), wps1, wps2;
        
        if (room.name == 'hr') {
            wps1 = wpss[0];
            wps2 = wpss[1];
        }
        
        t.addTasks(
            setStatusTask('идет пообщаться с кем-то', 'хочу пообщаться с кем-то', socialImages),
            room,
            function(){
            
                time = time || randomInt( 60, 10 * 60 );
                    
                var findedman = selectMans( waypoints.getMansInRoom(room) ).randomManWithout(t)
                if (findedman){
                    
                    //TODO: why cancelAllTasks?
                    findedman.cancelAllTasks()
                    ._startSocialTasks(t)
                    .addTasks(
                        seatTask( 0, 'seat', time, socialImages, wps1 )
                    )
                    ._endSocialTasks();
                    
                    
                    t._startSocialTasks(findedman)
                    .addTasksToFront(
                        seatTask( 0, 'seat', time, socialImages, wps2 )
                    )
                    ._endSocialTasks();
                    
                    
                    
                    
                }
                
            }
        );
        
        return this;
            
    },
    
//         пойти к hr: пойти в кабинет hr - дошел - ?проверяет есть ли Олеся ?- садится за стол - включить анимацию общения - общаться какое-то время - свободен 
    moveToHR: function(){
        if (this.name != 'ogabrielyan') {
            return this.moveToTheRoomToSocialWithMan('hr', {
                name: 'ogabrielyan',
                state: MAN_STATE_WORKING 
            } );
        }
        return this;
    },
    
    moveToSocialInTheRoom: function(room,  time, status){
        
        var t = this;
        
        room = waypoints.getRoomWp( room );
        
        t.addTasks(
            setStatusTask(status || 'идет пообщаться с кем-то', 'иду пообщаться в комнату ' + room.name  + ' на ' + time + ' сек', socialImages),
            room,
            seatTask( 0, 'seat', time, socialImages, waypoints.getWaypointsInRoom(room, 'social') )
        );
        
        return this;
    },
    
//         пойти на совещание: пойти в требуемую conference - сесть за свободный стол - включить общение - общаться какое-то время - свободен
    moveToMeeting: function( _floor, time ){
        
        return this.moveToSocialInTheRoom( 
            waypoints.getRoomWp( 'conference', _floor || randomInt(1,2) ),
            time || randomInt( 10 * 60, 2 * 60 * 60 ),
            'идет на совещание'
        );
        
    },
    
//         пойти на совещание у директора: пойти в boss - сесть на свободное место - сидеть какое-то время - свободен. 
    moveToBossMeeting: function(){
        
        return this.moveToSocialInTheRoom(
            'boss', 
            randomInt( 10 * 60,  2 * 60 * 60 ), 
            'идет на ковер'
        );
        
    },
    
//         пойти позвонить: пошел на ближайшую лестницу - дошел, включил анимацию разговора по телефону - разговаривает какое-то время - свободен
    moveToPhoneCall: function(){
        
        var t = this;
        return t.addTask( function(){

            var time = randomInt( 10, 10 * 60 )
            // TODO: выбирать незанятый вейпоинт для звонка на любом этаже - карточка создана
            t.addTasksToFront(
                setStatusTask('идет разговаривать по телефону'),
                waypoints.getByIndex('stairsup', t.__floor, t.getNearestStairsWpId() )
                    || waypoints.getByIndex('stairsdown', t.__floor, t.getNearestStairsWpId() ),
                setStatusTask('разговаривает по телефону'),
                animationTask('phone', 1, time, 1),
                bubblesTask( phoneImages, time )
            )
            
        } );
        
        return this;
    },
    
    log: function(){
        if (debugTasks) {
            var a = Array.prototype.slice.call(arguments);
            a.unshift( "[" + this.__log.length + "] " + TIME_NOW.toFixed(2) + ' ' + this.name + ":" );
            this.__log.push(a);
            console.log.call(console, a.join(' '));
        }
    },
    
    showLog: function(){
        $each(this.__log, function(v){
            console.log.call(console, v.join(' '));
        });
    },
    
//         играть в sonyPS: пошел в подвал - дошел - сел на диван - включает анимацию игры (к-н подрагивание, шевеление руками) - играет какое-то время - свободен
    moveToPlaySonyPS: function(){
        var wpPS = waypoints.getByName('misc', 0, 'sonyPS');
        var man = this;
        var time = randomInt( 60, 2 * 60 * 60 );
        
        this.addTasks(
            setStatusTask('идет играть в sonyPS'),
            bubblesTask( sonyPSImages ),
            wpPS,
            //TODO: seatTask
            function(){
                if (isWaypointFree(wpPS)){
                    wpPS.busy.push(man);
                    var animTask = animationTask( 'play', 1, time, 0, [ function(success){
                        removeFromArray(man, wpPS.busy);
                        man.log( animTask.id, 'onFinish wpPS.busy.length', wpPS.busy.length);
                        if (!wpPS.busy.length){
                            man.pcOff(wpPS, mainScene_studio.__alias('sonyPS'));
                        }
                    } ] );
                    
                    man.log(animTask.id, 'onStart wpPS.busy.length', wpPS.busy.length);
                    man.pcOn(wpPS, mainScene_studio.__alias('sonyPS'));
                    man.addTasksToFront( setStatusTask('играет в sonyPS'), bubblesTask( sonyPSPlayImages, time, undefined, 1 ), animTask );
                }
            }    
        );
        
        return this;        
    },
    
//         играть в настолки: пошел в переговорку на первом этаже - дошел - сел на свободное место - включает анимацию рук и баблы - играет какое-то время - свободен
//     moveToPlayTableGames: function(){
//         var time = randomInt(10, 2 * 60) * 60;
//         var wpPS = waypoints.getByName('misc', 1, 'tableGame');
//         var t = animationTask( 'play', 1, time, 1 );
//         var man = this;
//         this.addTasks(
//             wpPS,
//             function(){    
//                 if (wpPS.busy.length < wpPS.maxVisitors){
//                     wpPS.busy.push(man);
//                     man.addTasksToFront( t, bubblesTask( tableGamesImages, time ));
//                     t.onFinish.push( function(success){
//                         removeFromArray(man,wpPS.busy);
//                     } );
//                 }
//             }    
//         );
//         return this;
//     },

    
//         пойти погулять по офису: выбирает три случайных отдела - перемещается между ними по цепочке - свободен
    
    moveToWalk: function(){
        
        return this.moveToRandomRoom().moveToRandomRoom().moveToRandomRoom()
        
    },
    
//         пойти погулять по этажу: перемещается от левой лестницы до правой несколько раз - свободен
    moveToFloorWalk: function(){
        
        var t  = this;
        
        t.addTask( function(){
            
            var currentFloor = t.__floor;
            if ( currentFloor > 0 ) {
                var wp1 = waypoints.getByIndex('stairsup', currentFloor, 0) || waypoints.getByIndex('stairsdown', currentFloor, 0);
                var wp2 = waypoints.getByIndex('stairsup', currentFloor, 1) || waypoints.getByIndex('stairsdown', currentFloor, 1);

                t.setStatus('гуляет');

                for (var i = 0, k = randomInt(1,4); i<k; i++)
                    t.addTasksToFront( wp1, wp2 )
                }
            }
        );
        
        return this;

    },
    
//         оплатить заказ: призывает рандомного болванчика в приемную из-за границ экрана - идет в приемную сам - включает анимацию общения - общается какое-то время -
    moveToPayOrder: function(){
        
        //- карточка создана
        //  TODO: create pizzaMan!
        // return this.moveToTheRoomToSocialWithMan('recept', 'pizzaMan', 'pizzaManPlace', 'pizzaManPlace');

        
    },
//         идет в столовую - доходит до правой стенки - включает анимацию рук - свободен.
    moveToDinner: function(){
        return this.addTasks(
            setStatusTask('идет в столовую', 'иду зачем-то в столовую'),
            waypoints.getRoomWp('dinner', 1),
            waypoints.getByName('misc', 1, 'dinnerWall'),
            setStatusTask('чего-то делает'),
            animationTask( 'gesture', 1, randomInt( 10, 60 ) ) 
        );
        
    },
//         пойти в отдел кадров: идет в fin отдел - садится за стол - включает анимацию общения - общается какое-то время - свободен
    moveToFinancial: function(){
        
        return this.moveToTheRoomToSocialWithMan('financial', { type: 'fin', state: MAN_STATE_WORKING } )

        
    },
    
//         копаться в серверной: идет в server - включает анимацию рук - копается какое-то время - свободен.
    moveToServer: function(){
        
        return this.addTasks(
            setStatusTask('идет в серверную'), 
            'server',
            setStatusTask('копается в серверах'),
            animationTask( 'gesture', 1, randomInt( 30 * 60, 60 * 60 ) )
        );
        
    },
    
//         пойти к руководству: идет в dirs - садится за стол к одному из них - включает анимацию общения - общается какое-то время - свободен
    moveToDirs: function( time ){
        
        return this.moveToTheRoomToSocialWithMan('dirs', { type: 'dir', state: MAN_STATE_WORKING } /*TODO: wps*/ );
        
    },
    
//         qc проветривание: встает в случайную точку qc - втыкивается в телефон (анимация?) - стоит какое-то время - свободен
    moveToQCAeration: function(){
        
        return this.addTasks(
            setStatusTask('проветривание!'),
            'qc', 
            setStatusTask('ждет окончания проветривания'),
            animationTask('testing', 1, randomInt( 180, 200 ) ) 
        );
        
    },
    
//         собраться в кабинете у мрака: пойти в комнату босса - дошел - встать в правой половине комнаты - стоять.
    moveToBigBoss: function(){
        
        this.moveToTheRoom('boss', undefined, undefined, 'идет к Мраку');
        // TODO: - карточка создана: 
        this.addTasks(
            setStatusTask('стоит'),
            waitingFunctionTask( 30 * 60 ) 
        );
        return this;
    },
    
    joke: function(time){
        
        var t = this;
        
        _setTimeout( function() {
            if(t.state == MAN_STATE_WORKING)
                t.tell('joke', laughingImages );
        }, convertToGameTime ( randomInt(0, 60) ) );
        
        return t;
    },
    
    hotFix: function(time){
        this.addedTimeToGoHome = lerp( this.addedTimeToGoHome, time || randomInt(1 * 60 * 60, 5 * 60 * 60), 0.7 );
        return this;
    },
    
    supportAlarm : function(){
        var t = this;
        var i = _setInterval( function(){
            if (t.state == MAN_STATE_WORKING) {
                t.tell('какая-то фигня происходит',  fireImages  );
            } else {
                _clearInterval(i);
            }
        }, convertToGameTime( randomInt(20, 30) ) );            
        
        _setTimeout( function(){ 
            _clearInterval(i);
        } , convertToGameTime( 20 * 60 ) ); 
    },
    
    addTaskForLift: function(wp1, wp2){

        if (!wp1 || !wp2)
            return;
        
        var floor1 = wp1.__floor
            , floor2 = wp2.__floor
            , t = this
            , lastStatus = t.status;
            
        t.addTasksToFront( 
                wp1,
                function(){
                    var mansHere = selectMans(mans, { waitingLift: 1, __floor: floor1 });

                    // если толпа народу, то идем пешком и на 1 минутут забываем про лифт
                    lastStatus = t.status;
                     
                    function gobylegs(){
                        var tmp = t.likeLift;
                        t.likeLift = 0;
                        t.addTaskToFront( wp2 );
                        t.setStatus( lastStatus );
                        _setTimeout(function(){ t.likeLift = tmp; }, convertToGameTime(60));
                    }
                    
                    if (chance(mansHere.length / 4)){
                        gobylegs();
                    } else {
                            
                        lift.callToTheFloor(floor1);
                        
                        t.setStatus('ждет лифт', 'жду лифт', waitingImages );
                        t.waitingLift = 1;
                        
                        //TODO: макс время ожидания лифта
                        
                        t.addTasksToFront( 
                            waitingFunctionTask( 1, function(){ 
                                if (lift.openedAtFloor == floor1) {
                                    t.setStatus(undefined, 'дождался лифт', gladImages );
                                    t.waitingLift = 0;
                                    return 1;
                                }
                            } ),
                            
                            function(){
                                
                                t.waitingLift = 0;
                                
                                if (lift.mans.length < 4){
                                    
                                    t.z = -20;
                                    t.node.__y -= 3;
                                    t.setStatus('едет в лифте');
                                    lift.mans.push(t);
                                    t.inLift = 1;
                                    
                                    t.addTasksToFront(
                                                
                                        function(){
                                            lift.callToTheFloor(floor2);
                                        },
                                        
                                        waitingFunctionTask( 1, function(){ 
                                            
                                            if ( lift.openedAtFloor == floor2 ){
                                                t.waitingLift = 0;
                                                t.inLift = 0;
                                                t.node.__y = wp2.y;
                                                t.state = MAN_STATE_IDLE;
                                                t.z = DEF_MAN_Z;
                                                removeFromArray( t, lift.mans );
                                                t.setStatus( lastStatus );
                                                return 1;
                                            }
                                        } , {  cantCanceled: 1  })
                                        
                                      );
                                    
                                } else {
                                    gobylegs();
                                }
                            }
                            
                        );
                    }
                }
            );
    
        return this;
    },
    
    moveInto: function(){
        this.node.__visible = 0;
        return this;
    },
    
    moveOut: function(wp){
        
        this.node.__visible = 1;
        if (wp) {
            this.node.__y = wp.y;
        }
        this.z = DEF_MAN_Z;
        return this;
    },
    
        
    addTasksToFrontFromArray: function(a){
        for (var i = a.length - 1; i >= 0 ; i--) {
            this.addTask( a[i], 1 );
        }
        return this;
    },
    
    addTasksFromArray: function(a){
        for (var i = 0; i < a.length; i++) {
            this.addTask( a[i] );
        }
        return this;
    },
    
    addTasksToFront: function(){
        return this.addTasksToFrontFromArray( arguments );
    },
    
    addTasks: function(){
        return this.addTasksFromArray( arguments );
    },
    
    addTaskToFront: function(f){
        return this.addTask(f, 1);
    },
    
    addTask: function(f, toFront){
        
        if (!f)
            return t;
        
        var t = this;
        
        
        // t.log('addTask', toFront ? 'to front ' :'', f);
        
        if (isArray(f)){
            if (f.__added) {
                debugger;
            }
            f.__added = 1;
            return toFront ? t.addTasksToFrontFromArray(f) : t.addTasksFromArray(f);
        } else
        if (isFunction(f)){
            f = simpleFunctionTask(f);
        } else if ( isString(f) || f.isRoom ){
            t.moveToTheRoom(f, f.isRoom ? f.__floor : undefined, toFront);
            return t;
        }   
        else if (f.isWaypoint){
            t.addTaskForWaypointMoving(f, toFront);
            return t;
        }
        
        
        if ( f instanceof ManTask ){
            
            f.man = t;
            
            // если задача раскладывается на подзадачи, и при этом сама является задачей общения
            if (t.currentStarterTask && t.currentStarterTask.startedSocialTasksWithMan && !f.startedSocialTasksWithMan)
            {
//                 debugger;
                f.startedSocialTasksWithMan = t.currentStarterTask.startedSocialTasksWithMan;
            }
            
            if (t.startedSocialTasksWithMan){
                f.startedSocialTasksWithMan = t.startedSocialTasksWithMan;
            }
            
            if (f.startedSocialTasksWithMan) {
                f.onFinish.push( function(success){
                    if(success){//задача завершена
                        //если последняя, отменить разговор с человеком
                        if(f.man && f.startedSocialTasksWithMan == f.man) {
                            f.man.currentTask.finish();
                        }
                    }
                    else { // задача отменена
                        if (!f.__tmpCanceledHack) { // чтоб не отменять рекурсивно задачи
                            f.__tmpCanceledHack = 1;
                            if ( f.startedSocialTasksWithMan ) {
                                f.startedSocialTasksWithMan.cancelTasksWithMan( this.man );
                                f.man.cancelTasksWithMan( this.startedSocialTasksWithMan );
                            }
                        }
                    }
                });
            }
            
            t.log('addTask ' + (toFront ? 'to front ' :''), f);
            
            if (toFront) {
                t.tasks.unshift(f);
            }
            else {
                t.tasks.push(f);
            }
            
            if (!t.currentTask) {
                t.runNextTask();
            }
            
            this.tasksChanged();

        } else {
            debugthis();
        }        
        return t;
    },
    
    runNextTask: function(delay, predefinedTask){
        var t = this;
        if (!t.node || !t.node.parent)
            return;
                    
        if (!t.__tkchk) {
            t.__tkchk = 1;
            if (delay) {
                _setTimeout( function(){
                    t.__tkchk = 0;
                    t.nextTask(predefinedTask);
                }, convertToGameTime( delay ) );
            } else {
                looperPost(function(){
                    t.__tkchk = 0;
                    t.nextTask(predefinedTask);
                });
            }
        }
        return t;
    },
        
    tasksChanged: function(){
        this.__tasksChanged = 1;
    },
    
    nextTask: function(predefinedTask){
//         if (debugTasks) {
//             if ( dd ) {
//                 consoleLog('tasks', this.tasks);
//             } else {
//                 return;
//             }
//         }
//         
        if (this.currentTask || this.__tkchk){
            debugthis();
        }
        
        if ( isFunction( predefinedTask ) ){
            predefinedTask.call(this);
            return;
        }
        
        if (this.tasks.length){
            var task = this.tasks[0];
            this.tasks.shift();
            task.start();
            this.tasksChanged();
        } else {
            
            while (!this.tasks.length) {
                this.onFree();
            }

        }
        return this;
    },
    
    isOnStreet: function(){
        var x = this.node.__worldPosition.x;
        return (x > 850) || (x < -850);
    },
    
    addTaskForWaypointMoving: function(wp, toFront, params){
        
        if (!wp) debugthis();
        
        if (wp.__floor != undefined) {
            (toFront ? this.addTasksToFront : this.addTasks).apply(this,
                [
                    this.moveToFloorTask(wp.__floor),
                    this.moveToWaypointTask( wp, params )
                ]
            );
        } else {
            this.addTask( this.moveToWaypointTask( wp, params ), toFront);
        }
        
        return this;
    },
    
    moveToWaypointTask : function(wp, params){
        params = params || 0;
        
        return new ManTask( mergeObj( {
            wp: wp,
            
            name:'moveToWaypoint',
            
            onFinish: [ function(s){
                
                if (this.man.movingToWpTask == this){
                    this.man.movingToWpTask = 0;
                }
            
            } ],
            
            starter: function(){
            
                var o, wp = this.wp || 0, man = this.man;
                
                if (isArray(wp)){
                    this.wp = wp = dropSomethingBy(wp);
                }
                
                if (wp) {
                    
                    if (!params.skipOnStreetCheck ){
                        
                        if ( wp.onStreet != man.onStreet ) {
                            
                            if (wp.onStreet) {
                                man.addTasksToFront( 
                                    man.moveToWaypointTask( waypoints.getByName('misc', 1, 'lobbi'), { skipOnStreetCheck: 1 } ),
                                    function(){
                                        man.z = DEF_MAN_STREET_Z;
                                        man.onStreet = 1;
                                    },
                                    man.moveToWaypointTask( waypoints.getByName('misc', 1, 'lobbi2'), { skipOnStreetCheck: 1 } ),
                                    man.moveToWaypointTask( wp, params )
                                );
                            } else {
                                man.addTasksToFront( 
                                    man.moveToWaypointTask( waypoints.getByName('misc', 1, 'lobbi2'), { skipOnStreetCheck: 1 } ),
                                    man.moveToWaypointTask( waypoints.getByName('misc', 1, 'lobbi'), { skipOnStreetCheck: 1 } ),
                                    function(){
                                        man.z = DEF_MAN_Z;
                                        man.onStreet = 0;
                                    },
                                    man.moveToWaypointTask( wp, params )
                                );
                            }
                            
                            return;
                        }
                        
                    }
                    
                    if (params && params.skipIfInWp){
                        if (man.__floor == wp.__floor){
                            var pos = man.node.__worldPosition;
                            if ( (pos.x > wp.x - wp.w) && (pos.x < wp.x + wp.w) ) {
                                return;
                            }
                        }
                    }
                    man.movingToWpTask = this;
                    return 1;
                
                }
                
            }
        }, params ) )
    },
    
    cancelTasksWithMan: function(man){
        var t = this;
        
        // хак чтобы не отменять рекурсивно связанные задачи
        if (!t.__tmpCanceledHack) {
            t.__tmpCanceledHack = 1;
                        
            t.tell('отменяю общение с ' + man.name );
            if (t.currentTask && t.currentTask.startedSocialTasksWithMan == man ){
                var ct = t.currentTask;
                t.currentTask = 0;
                ct.cancel();
            }
            
            t.tasks = $filter(t.tasks, function(t){
                return t.startedSocialTasksWithMan != man;
            });
            
            t.__tmpCanceledHack = 0;
            
            if (!t.currentTask) {
                t.runNextTask();
            }

        }
    },  
    
    cancelAllTasks: function(){
        this.log('cancelAllTasks');
        this.tasks = [];
        if (this.currentTask) {
            if (this.currentTask.cantCanceled) {
                return this;
            }
            this.currentTask.cancel();
        }
        this.setStatus('');
        this.currentTask = 0;
        this.tasksChanged();
        return this;
    },
    
    createNode: function(){
            
        var node = this.node = this.cfg.node = mainScene.__addChildBox({ __size:[ 20, 40 ]/*, __color: 0x456789, __alpha:0.2 */});
        node.man = this;
    //        node.textNode = node.__addChildBox( { __text: { __text: this.name, __fontsize:15 }, __y: -25 } );
        node.body = node.__addChildBox({
            sva: 2
        });
        this.state = MAN_STATE_IDLE;
        
        //debug
        if (debugTasks)
        this.createDebugNode();
        //undebug
        
        return this;
        
    }, 
    //debug
    createDebugNode: function(){
        if (!debugNodes)
            return;
        
        var t = this, dnod = t.debugNode = __window.debugMansNode.__addChildBox({ __color: randomInt(0, 0xffffff), __size:[100,100] });
        
        __window.debugMansNode.__childsProjectionMatrix = mainSceneCamera.__projectionMatrix;
        __window.debugMansNode.camera = mainSceneCamera;
        
        var vbuf, vlen = 0, vertices = [];
        var ibuf, ilen = 0, indeces = [];
        
        vbuf = dnod.__verticesBuffer = dnod.__addAttributeBuffer('position', 2);
        ibuf = dnod.__indecesBuffer = new MyBufferAttribute( '', Uint16Array, 1, GL_ELEMENT_ARRAY_BUFFER , [ 0, 2, 1, 2, 3, 1 ], 1 );
        gl.lineWidth(3);
        dnod.__updateGeometry = function(){
            
//             if (!t.__tasksChanged){
//                 return;
//             }
//             
//             t.__tasksChanged = 0;
            
            vlen = 0;
            vertices = [];
            ilen = 0;
            indeces = [];
            
            var klen = 0;
            var pos, pp;

            function line(x1, y1, x2, y2){
            
                vertices[vlen++] = x1;
                vertices[vlen++] = y1;
                
                vertices[vlen++] = x2;
                vertices[vlen++] = y2;
                
                indeces[ilen++] = klen++;
                indeces[ilen++] = klen++;
            
            }
            
            var prevPos = t.node.__worldPosition;
            
            function drt(t){
                if (t && t.wp) {
                    line( prevPos.x, -prevPos.y-18, t.wp.x, -t.wp.y-18);
                    prevPos = t.wp;
                }
            }
                
            drt(t.currentTask);
            $each( t.tasks,drt);
               
            vbuf.__getArrayOfSize(vlen, 1).set(vertices);
            ibuf.__getArrayOfSize(ilen, 1).set(indeces);

            return this;
        }
        
        dnod.__drawMode = 1;
        dnod.__updateGeometry();
        dnod.__render = function(){
            this.__updateGeometry();
            renderer.__draw(this, ibuf.__realsize);
            
        }
        
        
    },
    
    //undebug
    
    appear: function(spawn){
        
        var t = this;
         
        mans[t.name] = t;
        
        if (!t.node) {
            t.createNode();
        }
        
        if (!t.node.parent) {
            mainScene.__addChildBox(t.node);
        }
        
        var node = t.node;
        this.onStreet = 1;
        node.__ofs = spawn;
        t.z = DEF_MAN_STREET_Z; // TODO: распределение человеков по z
        
        node.__camera = mainSceneCamera;
        
        t.addedTimeToGoHome = randomInt( t.behavioursTable.timeMinToGoHome || 0, t.behavioursTable.timeMaxToGoHome || 0 );
        
        node.body.__minimalTapArea = 1;
        node.body.__onTap = function(){
            
            if (__window.selectedMan == t && this.lastTapTime > TIME_NOW - 1)
                t.moveToWorkInstantly();
            
            this.lastTapTime = TIME_NOW;
            __window.selectedMan = t;
            
            return 1;
            
        }

        node.body.__onTapHighlight = node.body;
        node.body.__highlightMult = 10;
        
        t.__updatable = {
            __update: moveMan.bind(t)
        }
        
        updatable.push(t.__updatable);
        
        t.tell('Вы `' + t.name + ' #` пришли сегодня в `' + rudatestr(TIME_NOW) + ' +0300` :scream_cat:', { __img: 'scream_cat' });
        
        t.cancelAllTasks();

        t.runNextTask( randomize(4, 20) );
        
        return t;
        
    },
    
    disappear: function(){
        this.cancelAllTasks();
        delete mans[this.name];
        updatable.pop(this.__updatable);
        this.node.parent.__removeChild(this.node);
        //this.node.__removeFromParent();
        return this;
    },
    
    moveToTheRoom: function(room, _floor, toFront, status) {
        room = waypoints.getRoomWp(room, _floor);
        if (!room) return;

        // TODO: карточка создана: идти к ближайшей точке в комнате, а не на рандом
        // если ты в комнате, то вообще не идти никуда
        
        this.addTask(
            setStatusTask( status, 'иду в комнату ' + room.name + ( _floor != undefined ? (' этаж ' + _floor ) : '' ) ),
            toFront
        );
        
        this.addTaskForWaypointMoving( 
            room, 
            toFront, 
            { skipIfInWp: 1 } 
        );
        return this;
    },
    
    
    startAnimation: function(animation, type, time){
        var a = animationsCfg[animation];
        if (a) {
            return a.start(this, type || 1, time);
        } else {
            debugthis();
        }
        return this;
    }
    
            
}, {
    // properties
    
    z : createSomePropertyWithGetterAndSetter( 
        function(){
            return this.node.__z
        },
        function(v) {
//             if (this == __window.selectedMan){
//                 debugger;
//             }
            this.node.__z = v;
        }
    ),
                
    __floor: createSomePropertyWithGetterAndSetter( 
        function(){ return this.onStreet || this.isOnStreet() ? 1 : floorByY(this.node.__y); }, 
        function(){} 
    ),
    
    state: createSomePropertyWithGetterAndSetter( 
        function(){ return this.__state; }, 
        function(v){
            var t = this;
            if (t.__state != v) {
                
                if (v == MAN_STATE_IDLE){
                    
                    t.lxmapRndMod = random();
                    if ( t.lxmap ) {
                        delete t.lxmap[t.name];
                        delete t.lxmap;
                    }
                    
                    if (t.node) {
//                         t.z = t.onStreet || t.isOnStreet() ? DEF_MAN_STREET_Z : DEF_MAN_Z;
                        t.node.body.__img = t.name + '_gesture_02_1';
                    }
                    
                    if (t.movingToWpTask) {
                        t.movingToWpTask.finish();
                    }
                }
                
                looperPost( function(){ 
                    if (!t.currentTask) {
                        t.runNextTask();
                    }
                });
            }
                
            t.__state = v;
            
            if (t.node) 
                t.node.__dirty = 2;
        } 
    ),
    
});


var allMans = new Man.prototype.__ArrayIterator();

function activatePeoples(){

    var waypointsNode = mainScene.__getObjectByName('waypoints');
    
    waypointsNode.update(1);
    
    function updwp(ww, f){
        ww.__visible = 1;
        ww.update(1);
        ww.__updateMatrixWorld(1);
        if (f) ww.__eachChild(f);
    }
    
    function addWaypoint(wptype, wpnode, fromWpLayers, _floor){
        
        updwp(wpnode);
        
        var wpp = wpnode.__worldPosition.clone();
        wpp.name = wpnode.name || wptype;
        
        wpp.y = wpp.name.endsWith('2') ? wpp.y - 20: normalizePeopleY(wpp.y);
        wpp.w = mmax( fromWpLayers ? wpnode.__width / 2 - 10 : 0, 0 );
        
        if (!fromWpLayers){
            //обычно это стул
            wpp.wpnode = wpnode;
        }
        
        wpp.onStreet = (wpp.x > 850) || (wpp.x < -850);
        if (wpp.onStreet)
            wpp.y = 60;
            
        wpp.type = wptype;
        
        wpp.__floor = _floor == undefined ? floorByY(wpp.y) : _floor;
        
        wpp.isWaypoint = 1;
        wpp.busy = [];
        
        //TODO: move to scene!
        wpp.maxVisitors = { sonyPS:6, tableGame:8 }[ wpp.name ] || 1;
        
        waypoints.add( wptype, wpp );
    }

    mainScene.__updateMatrixWorld(1);
    mainScene.update(1);
    mainScene.$(function(n){
        var ud = (n.__userData || 0).__waypoint || 0;
        if (ud.__eat) addWaypoint('eat', n);
        if (ud.__work) addWaypoint('work', n);
        if (ud.__social) addWaypoint('social', n);
    });
    
    waypointsNode.__eachChild( function(wplayer){
        
        var wptype = wplayer.name;
        
        updwp(wplayer, function(wpfloor, i){
            updwp(wpfloor, function(wpnode){
                addWaypoint(wptype, wpnode, 1, i);
            });
        });
        
    });

    waypoints.calculate();
    
    waypointsNode.__removeFromParent();
    
    var peoples;
    //debug
    peoples = findGetParameter('peoples');
    if (peoples) {
        peoples = explodeString(peoples);
    } else 
    //undebug
    {
        peoples = [];
        $each( workersCfg, function(cfg) {
            peoples.push(cfg.id);
        });
    }
    
    
    
    $each( workersCfg, function(cfg){
       
        if (peoples.indexOf(cfg.id) >= 0 ) {
            var man = new Man(cfg);
            allMans.push(man);
            
            man.projectTypeState = (ProjectState[ cfg.project ]||0)[cfg.type];
            if (man.projectTypeState)
                man.projectState = (ProjectState[ cfg.project ]||0);
        }
        
    });
    
    registerAnimations();
    
    lift.init();
    
    mainScene_studio.__onTap = function(){
        __window.selectedMan = 0;
        return 1;
    }
    
    //debug
    
        /*
        for (var i = 0; i < 50; i++){
            
            var y = 8 * i - 184;
            for (var k = 0; k < 7; k++ ) {
                mainScene_studio.__addChildBox( {
                    __y: y, 
                    __z: -10 - k* 10,
                    __scaleF: 0.1 + k/30,
                    __size: [120,25], 
                    __color: 0x234563, 
                    __text: k == 6 ? y + ' ' + YByFloor( floorByY(y) )  + ' ' + normalizePeopleY( YByFloor( floorByY(y) ) ) : undefined
                } );         
            }
        }
        */
        
        
        __window.debugMansNode = new Node({ __z: DEF_MAN_Z });
        scene.add(__window.debugMansNode);
      
    //undebug
}

mergeObj( Man.prototype.__ArrayIterator.prototype, {
    
    shuffle: function(){ return shuffle(this); },
          
    randomMan:function(){ return this[randomInt(0, this.length-1)]; },

    concat: function(a){
        
        var ai = new Man.prototype.__ArrayIterator();
        
        for (var i = 0; i < this.length; i++ ){
            ai.push(this[i]);
        }
            
        for (var i = 0; i < a.length; i++ ){
            if (a[i] && ai.indexOf(a[i])<0){
                ai.push(a[i]);
            }
        }
            
        return ai;
    },
    
    filterMans: function(f){
        var ai = new Man.prototype.__ArrayIterator();
        for (var i = 0; i < this.length; i++ ){
            if (this[i].match(f)) {
                ai.push(this[i]);
            }
        }
        return ai;
    },
           
    randomManWithout:function(man){ 
        var a = $filter(this, function(m){ return m != man; });
        return a[randomInt(0, a.length - 1)];
    },
    
    getCount: function(min, max){
        if (this.length < min) {
            this.length = 0;
        }
        else 
        if (this.length > max) {
            this.length = max;
        }
        return this;
    }
} );

    
function selectMans( mns, selector ) {
    
    if ( selector instanceof Man.prototype.__ArrayIterator )
        return selector;
    
    var ai = new Man.prototype.__ArrayIterator();
    if (selector) {
        $each( mns, function(man){
            if ( man.match(selector) ) ai.push(man);
        });
    } else {
        $each( mns, function(man){ ai.push(man); });
    }
    
    return ai;
    
}


 
ObjectDefineProperties( mans, {
    
    $:{
        value: function(selector){
            return selectMans(mans, selector);
        },
        enumerable: false
    }
});

function logEvent(ename){

    var a = [ convertTimeToStr(currentGameTime) + "  event: "];
    for (var i in arguments) {
        a.push(arguments[i]);
    }
    consoleLog.apply(this, a );
    
}


//ДР - 12:00 единоразово в Пт 13го все собираются в кабинете директора, директор встает, появляются шарики, появляются какие-то бабблы над персонажами в течение 30 сек, в конце все свободны, т.к. в действии не определен таймер похоже будет.
function activateBossDREvent(){
    
    logEvent("activateBossDREvent");
    
    allMans.cancelAllTasks().moveToBigBoss();
    
    addTimeListener('12:00', function() {
        
        //карточка создана:
        // TODO: все в сборе. директор встает.
        //много-много шариков появляется в кабинете (из слака картинка) и пропадают через секунду
        //появляются какие-то бабблы над персонажами в течение 30 сек
        
        /*addTimeListener('12:30', function() {
            allMans.cancelAllTasks().runNextTask();
        });*/
        
    });
    
}

//ДР сотрудника - на кухне появляется пицца, все идут есть пиццу (окончание разруливается действием “есть пиццу”).
function activateDREmployeeEvent() {

    logEvent("activateDREmployeeEvent");
    
    selectMans(mans, { chance: 'chanceToDREmployeeEvent' }).moveToEat();
    
    //карточка создана: в это время на кухне появляется еда (какие-нибудь сообщения, привлечение внимания к кухне, запах, жар от пиццы/пирогов?)    

}


//Перекур: все с шансом moveToSmoke пытаются идти курить, конец рулится действием.
function activateSmokeEvent() {

    logEvent("activateSmokeEvent");
    
    var mns = selectMans(mans, { chance: 'chanceToSmokeEvent' } );
    
    if (currentDay != 0 || currentDayTime > 44444 )
        selectMans( mns, { chance: 0.9 } ).cancelAllTasks();

    mns.moveToSmoke();
    
}

//Отключение электричества - Все работающие, не совещающиеся сотрудники свободны, шанс работы падает до 0. - запускается таймер указанный в событии - все снова свободны.
function activateElectroDisconnectEvent() {
    
    logEvent("activateElectroDisconnectEvent");
    
    var time = convertToGameTime( randomize( 60, 60 * 60 ) );
    hasElecrticity = 0;
    
    selectMans(mans, { state: MAN_STATE_WORKING }).cancelAllTasks().runNextTask();
    //карточка создана
    // TODO:  свет гаснет, компы + ?добавить резервный источник питания? (тогда может рандомно у них отключаются компы?)
    
    _setTimeout( function() {
        hasElecrticity = 1;
        // все идут работать, либо (как сейчас) постепенно подтягиваются
        // анимация включения электричества
    },  time);
    
}

function activateMeeting(selector, creator){
    
    // TODO: карточка создана: ведущий совещания выделяется как-то
    
    selectMans(mans, selector)
        .filterMans( { chance: 'chanceToMeeting' } )
        .getCount(2, 8)
        .concat([ creator ])
        .cancelAllTasks()
        .moveToMeeting( randomInt(1,2), randomInt( 10 * 60, 2 * 60 * 60 ) );
    
}


// Совещание ПМ: случайный ПМ создает совещание в одной из конференц-комнат. Пусть пока Все сотрудники проекта пм - отправляются на совещание.- сидят полчаса - свободны
function activateMeetingPMEvent() {
    
    var pm = selectMans(mans, { type:'pm' } ).randomMan();
    if (!pm || !pm.project)
        return;
    
    var mns = selectMans(mans, { project: pm.project });
    
    logEvent("activateMeetingEventPM", pm.name, pm.project );
    
    activateMeeting(mns, pm);
    
}

// Совещание Лид: случайный лид создает совещание в одной из конференц комнат. Все сотрудники Его проекта И отдела отправляются на совещание. - сидят полчаса - свободны
function activateMeetingLeadEvent() {
    
    var lead = selectMans(mans, { lead:1 } ).randomMan();
    if (!lead)
        return;
    
    var mns = lead.project ? selectMans(mans, { project: lead.project }) : 0;
    var mns2 = lead.type ? selectMans(mans, { type: lead.type }) : 0
    
    mns = mns ? mns2 ? mns.concat(mns2) : mns : mns2;
    logEvent("activateMeetingLeadEvent", lead.name, lead.project, lead.type );
    
    $each(mns, function( man ){
        console.log( man.name, man.project, man.type );
    });

    if (mns) {
        activateMeeting(mns, lead);
    }
    
    
}

//Совещание qc: все qc собираются в переговорке на первом этаже на совещание. - сидят полчаса - свободны
function activateMeetingQCEvent() {
    
    logEvent("activateMeetingQCEvent");
    activateMeeting({ type: 'qc' })
    
}

//Совещание у директора: все лиды Отделов (таких пока нет, просто lead) и pm собираются в кабинете у директора за столом. Директор при этом пока просто сидит за своим столом. - сидят час - свободны
function activateMeetingDirEvent() {
    logEvent("activateMeetingDirEvent");
    selectMans(mans, { lead: 1, chance: 'chanceToMeetingDir' } ).moveToDirs( randomInt(30 * 60, 60 * 60) );
}

//QC проветривание: все работающие qc встают со своих мест и начинают проветриваться. (поскольку переднего плана нет, просто встают в отделе)
function activateAerationEvent() {
    logEvent("activateAerationEvent");
    selectMans(mans, { type: 'qc', state: MAN_STATE_WORKING } )
        .cancelAllTasks()
        .moveToQCAeration( 3*60 );
}

//slack Юмор: все сотрудники на рабочем месте выпускают смеющийся смайлик.
function activateHumorEvent() {
    logEvent("activateHumorEvent");
    selectMans(mans, { state: MAN_STATE_WORKING, chance: 'chanceToHumorEvent' } ).joke();
}

//supportAlarm: в отделе поддержки у всех работающих появляются огненные, гневные смайлики. (пытаемся отразить пригорание от пользователей) - длится 20 минут.
function activateSupportAlarmEvent() {
    
    logEvent("activateSupportAlarmEvent");
   
    selectMans(mans, { workArea: 'support', state: MAN_STATE_WORKING, chance: 'chanceToSupportAlarmEvent'} ).supportAlarm();
     
}

//срочныйХотФикс: у всех ребят из одного проекта, шанс уйти с работы в 19.00 падает до 0. Длится от 1 до 5 часов. После все свободны.
function activateHotFixEvent() {
    
    var time = randomInt(1 * 60 * 60, 5 * 60 * 60);
    logEvent("activateHotFixEvent", round(time/60), 'мин');
    // TODO: карточка создана: надо бы это событие еще как-то обозначить.. 
    //мб смайлики (грустные лица, активность, еще что-то) + добавить изображение события этого куда-нибудь
    
    selectMans(mans, { project: randomProject(), chance: 'chanceToHotFixEvent' } ).hotFix( time );
    
}

//упалСервер: все неработающие серверные сотрудники отправляются работать на час игрового времени, после все свободны.
function activateServerDropEvent() {
    
    logEvent("activateServerDropEvent");
    
    selectMans(mans, { type: 'servDev', chance:'chanceToServerDropEvent' } ).cancelAllTasks().moveToServer();
    
}

//совместный обед: в рабочее время от 2 до 4 сотрудников одного отдела, идут обедать, и стараются сесть вместе за стол.
function activateJointLunchEvent() {
    
    logEvent("activateJointLunchEvent");
    
    selectMans(mans, function(man){
        return chance( man.behavioursTable.chanceToJointLunchEvent ) 
    }).moveToEat();
    
    // TODO: карточка создана: "стараются сесть вместе за стол", "одного отдела"
    
}

//времяНастолок: случайно, после 19.00, от 3 до 8 сотрудников отправляются играть в настолки.
function activateBoardGamesEvent() {
    
    var arr = [];
    
    logEvent("activateBoardGamesEvent");
    //     TODO: надо встроить в сцену, в пепеговорке 4 места.. может в столовку? там столы по 4 места
//     selectMans(mans, { chance: 'moveToPlayTableGames' }).shuffle().getCount( 3, 8 ).moveToPlayTableGames();
    
    
}

//Приближается выходной день, кто-то на работу :(

function activateGoToWorkHolidayEvent(){
    
    selectMans(allMans, { chance : 'chanceToHolidayWork' } ).moveToStartWorkingDay( 5 * 60 );
     
}

//Приближается рабочий день: 8.00 - все работники начинают приходить на работу, опаздывают на время lateTime

function activateGoToWorkEvent() {
    
    logEvent("activateGoToWorkEvent");
    
    allMans.moveToStartWorkingDay();
    
}

//Конец рабочего дня: работники пробуют “пойти домой”
function activateGoHomeEvent() {
    
    logEvent("activateGoHomeEvent");
    
    selectMans(mans, { chance: 'chanceGoToHomeEvent' } ).moveToHome();
    
}
 
 
