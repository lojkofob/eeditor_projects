

if (typeof EditorWithKitten == undefinedType){
    EditorWithKitten = 1;
}

function speedUp(x){
    killAnim(options);
    
    options.__timeMultiplier = x;
    
    gui_time.$({ selected:1 }).__color = 0x3b3f56;
    var b = gui_time.$({ speedUpCoeff:x })[0];
    if (b){
        b.__color = 0x8888bb;
        if (gui_skipNight.__textString == '*1000')
            gui_skipNight.__color = 0x3b3f56;
        b.selected = 1;
    }
    
}


BUS.__addEventListener( __ON_GAME_LOADED, function(){
    
        register3D();
    
        root = new Node('scene', 1);
        addToScene(root);
        
        mainScene = root.__getObjectByName('scene');
        
        root.camera = mainSceneCamera;
        root.__childsProjectionMatrix = mainSceneCamera.__projectionMatrix;
        
        mainScene_studio = mainScene.__getObjectByName('studio');
        
        gui = new Node('gui', 1);
        addToScene(gui);
        
        gui.__x = 0.3;
        gui.__isScene = 1;
        
        gui_time = gui.__getObjectByName('_time');
        gui_time_clock = gui_time.__getObjectByName('clock');
        gui_time_date = gui_time.__getObjectByName('date');
        gui_skipNight = gui.__getObjectByName('skipNight');
        gui_manInfo = gui.__getObjectByName('manInfo');
        
        gui_PI2bar = gui.__getObjectByName('_PI2bar');
        gui_MMbar = gui.__getObjectByName('_MMbar');
        
        var mmdet = gui_MMbar.__getObjectByName('details'),
            pi2det = gui_PI2bar.__getObjectByName('details');
        
        gui_MMbar_fullPbar_bar = gui_MMbar.$('__fullPbar bar')[0];
        gui_PI2bar_fullPbar_bar = gui_PI2bar.$('__fullPbar bar')[0];
        
        gui_MMbar_details_gdPbar_bar = mmdet.$('__gdPbar bar')[0];
        gui_MMbar_details_devPbar_bar = mmdet.$('__devPbar bar')[0];
        gui_MMbar_details_artPbar_bar = mmdet.$('__artPbar bar')[0];
        gui_MMbar_details_qcPbar_bar = mmdet.$('__qcPbar bar')[0];
        
        gui_PI2bar_details_gdPbar_bar = pi2det.$('__gdPbar bar')[0];
        gui_PI2bar_details_devPbar_bar = pi2det.$('__devPbar bar')[0];
        gui_PI2bar_details_artPbar_bar = pi2det.$('__artPbar bar')[0];
        gui_PI2bar_details_qcPbar_bar = pi2det.$('__qcPbar bar')[0];
    
        //TODO: load state
        
        activateParallax(mainSceneCamera);
        activateGestures();
        activateClock();
        activatePeoples();
        activateProgressBars();
        activateSky();

        function prepareSpeedUpButton(b, coeff){
            initButton( b, { __onTap: function(){
                speedUp(coeff);
                return 1;
            }, speedUpCoeff:coeff } );
        }
        
        var x1 = gui_time.__getObjectByName('x1');
            
        x1.__color = 0x8888bb;
        x1.selected = 1;
        
        prepareSpeedUpButton( gui_time.__getObjectByName('x1'), 1 );
        prepareSpeedUpButton( gui_time.__getObjectByName('x2'), 2 );
        prepareSpeedUpButton( gui_time.__getObjectByName('x4'), 4 );
        prepareSpeedUpButton( gui_time.__getObjectByName('x8'), 8 );
        prepareSpeedUpButton( gui_time.__getObjectByName('x16'), 16 );
        prepareSpeedUpButton( gui_time.__getObjectByName('x32'), 32 );
        
        gui_skipNight.__visible = 0;
        
        updateManInfo();
        
        gui_manInfo.__onTap = 1;
        initButton( gui_manInfo.cameraFollow,{
            __onTap: function(){
                var man = __window.selectedMan;
                if (man) {
                   man.cameraFollow = !man.cameraFollow;
                }
                return 1;
            }
        } );
        
        initButton( gui_manInfo.close,{
            __onTap: function(){
                __window.selectedMan = 0;
                return 1;
            }
        } );
        
        initButton( gui_manInfo.work, {
            __onTap: function(){
                var man = __window.selectedMan;
                if (man) {
                    man.moveToWorkInstantly();
                }
                return 1;
            }
        } );
        
        initButton( gui_manInfo.tempDebug, {
            __onTap: function(){
                var man = __window.selectedMan;
                if (man) {
                    man.cancelAllTasks().moveToHR();
                }
                return 1;
            }
        } );
        
        gui.update(1);
        gui.update(1);
        return 1;
    }
);

function waitForTime(mult){
    if (options.__timeMultiplier < 40) {
        options.__lastTimeMultiplier = options.__timeMultiplier;
    }
    
    speedUp(mult);
    
    gui_skipNight.__text = '*1000';
    gui_skipNight.__color = 0x8888bb;
    gui_skipNight.__killAllAnimations().__alpha = 1;

}


function waitForTimePrepare( text, mult){

    gui_skipNight.__text = text;
    gui_skipNight.__visible = 1;
    gui_skipNight.__color = 0xc96000;
    gui_skipNight.__anim({__alpha:[1,1.1]}, 0.3, -1 );
    initButton(gui_skipNight, { __onTap: function(){
        waitForTime(mult || 1000);
        return 1;
    } });
    
}

function waitFor8(){
    waitForTimePrepare( 'Skip night' );
}

function waitFor11(){
    waitForTimePrepare( 'Wait for the working day', 200);
}

function skipHoliday(){
    cancelWaitForTime();
    waitForTimePrepare( 'Skip this day' );
}

function cancelWaitForTime(){
    if (options.__lastTimeMultiplier && options.__timeMultiplier > 40){
        speedUp(options.__lastTimeMultiplier);
    }
    gui_skipNight.__onTap =
    gui_skipNight.__visible = 0;
    gui_skipNight.__killAllAnimations();
}

var listeners = new UpdatableProto()
    , timeSpeedUpKoef = 8
    , timeStart = TIME_NOW
    , gameClockTimeStart = 8
    , currentGameTime = gameClockTimeStart * 60 * 60 
    , currentDayTime
    , currentDay;
    


function convertStrToTime(str){
    var arr = str.split(':');
    if (arr.length > 2){
        return parseFloat( arr[0] ) * 60 * 60 * 24 + parseFloat( arr[1] ) * 60 * 60 + parseFloat( arr[2] ) * 60; //(c)
    }
    return parseFloat( arr[0] ) * 60 * 60 + parseFloat( arr[1] ) * 60; //(c)
}


function convertTimeToStr(time){
    return 'day ' + floor( time / 86400 ) + ' ' + getTimeTextHHMM( time % 86400 );
}
 


function addTimeListener(time, action, opts) {
    
    if (isArray(time)){
        $each(time, function(tt) { addTimeListener(tt, action, opts) });
        return;
    }
    
    time = convertStrToTime(time);
    
    listeners.__push( mergeObj( {
        time: time,
        action: action,
        __update: function(){
            if (currentDayTime >= this.time) {
                this.action();
                return 1;
            }
        }
    }, opts ));
}

function daysChanged(){

    listeners.__a = [];
    
    activateEvents();
    
    if (currentDay == 7) {
        addTimeListener('19:00', function(){
            if (!__window.winner){
                showWindow('fail', function(wnd){
                    
                    wnd.__setAliasesData({
                        wrk: {
                            __onTap: function(){
                                window.close();
                                close();
                                _setTimeout( function(){
                                    window.open( "https://jira.game-insight.tech", '_parent' );
                                },0.1);
                                return 1;
                            },
                            __onTapHighlight: 1
                        },
                        
                        rep: {
                            __onTap: function(){
                                window.location.reload();
                                return 1;
                            },
                            __onTapHighlight: 1
                        }
                    });
                }, 0, 1);
            }
        });
    }
    
        
}

function convertToGameTime( seconds ) {
    return seconds / timeSpeedUpKoef
}

function activateClock() {
    
    //http://localhost/editor/projects/MracksOfBoom/index.html
    
    var sun = mainScene.__getObjectByName('sun');
    
    
    ObjectDefineProperty(sun, 'rot', createSomePropertyWithGetterAndSetter(
       function(){
          return this.____t;
       },
        function(v){
            this.____t = v;
            this.__x = -cos( v * DEG2RAD ) * 1700;
            this.__y = -sin( v * DEG2RAD ) * 300 - 200;
       }
    ) );

    var daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
        , startDay = 13
        , sunInitRot = gameClockTimeStart * 60 * 360 / (24 * 60) - 120;
    
    sun.__anim({ 
        rot: [sunInitRot,360]
    }, convertToGameTime(24*60*60), 1, easeLinear);
    
    function updateTime(){
        
        currentDayTime = currentGameTime % 86400; //(c)
        var day = floor( currentGameTime / 86400 );
        
        gui_time_clock.__text = getTimeTextHHMM(currentDayTime);
        gui_time_date.__text = (day + startDay) + '.07.2018 ' + daysOfWeek[(4 + day) % 7];

        if (currentDay != day) {
            currentDay = day;
            daysChanged();
        }
        
        listeners.__update();
        
    }
    
    _setInterval( updateTime, 0.1 );
    
    updateTime();
    
}


function activateEvents() {
    
    var randTime, randTimes = [];
    // - - - - 0 1 2
    // 3 4 5 6 7 - -
    
    function getRandWorkTimeInDay() {
                
        if (currentDay == 0){
            return randomInt(13,19) + ':' + randomInt(0,60);
        }

        return randomInt(11,19) + ':' + randomInt(0,60);
        
    }
    
    function getRandWorkTimeInDayWithInterval(minRandom, maxRandom) {
        
        var result = [];
        var tm = 11 * 60;
        while (tm < 19 * 60 - maxRandom) {
            tm += maxRandom;
            result.push( getTimeTextHHMM( ( randomize( minRandom, maxRandom ) + tm ) * 60 /*sec*/) );
        }
        
        return result;
    }
    
    // ДР - 12:00 единоразово в Пт 13го все собираются в кабинете директора
    if (currentDay == 0)
        addTimeListener('11:57', activateBossDREvent);

    
    //Перекур: 10:45, 12:00 , 14:00, 16:00, 18:00, 19.00  каждый день
    
    addTimeListener('10:45', activateSmokeEvent);
    addTimeListener('11:58', activateSmokeEvent);
    addTimeListener('13:58', activateSmokeEvent);
    addTimeListener('15:58', activateSmokeEvent);
    addTimeListener('17:58', activateSmokeEvent);
    addTimeListener('19:02', activateSmokeEvent);
    
    var dayNode = mainScene.__getObjectByName('day'),
        nightNode = mainScene.__getObjectByName('night');
        
    addTimeListener('06:00', function(){
        dayNode.__visible = 1;
        nightNode.__anim( {  __alpha: 0, __visible: 0 }, 1000 );
        nightNode.__effect.__disable();
    });
    
    addTimeListener('20:00', function(){
        dayNode.__visible = 0;
    });
        
    addTimeListener('22:00', function(){
        nightNode.__visible = 1;
        nightNode.__effect.__enable();
        nightNode.__anim( {  __alpha: [0, 0.2] }, 1000 );
    });
    
    
    if (!currentDay || currentDay > 2) { // рабочий день
        
        //ДР сотрудника - рандомно раз в два дня
    
        if (chance(0.5)) 
            addTimeListener(getRandWorkTimeInDay(), activateDREmployeeEvent); 
        
        
        //Отключение электричества - раз в неделю, случайно, в рабочее время

        if (chance(0.2))
            addTimeListener(getRandWorkTimeInDay(), activateElectroDisconnectEvent); 
        
        
        //Совещание ПМ: случайно, два раза в день, в рабочее время
    
        if (chance(0.7))
            addTimeListener(getRandWorkTimeInDay(), activateMeetingPMEvent );
        
        if (chance(0.7))
            addTimeListener(getRandWorkTimeInDay(), activateMeetingPMEvent ); 
        
    
        //Совещание Лид: случайно, раз в два дня, в рабочее время
        if (chance(0.5))
            addTimeListener(getRandWorkTimeInDay(), activateMeetingLeadEvent ); 
        
        
        //Совещание у qc: случайно, два раза в неделю, в рабочее время
        if (chance(0.2))
            addTimeListener(getRandWorkTimeInDay(), activateMeetingQCEvent );
        
        //Совещание у директора: случайно, раз в неделю, в рабочее время
        if (chance(0.2))
            addTimeListener(getRandWorkTimeInDay(), activateMeetingDirEvent ); 
    
        //QC проветривание: 11.55, 13.55, 15.55, 17.55
        addTimeListener('11:55', activateAerationEvent);
        addTimeListener('13:55', activateAerationEvent);
        addTimeListener('15:55', activateAerationEvent);
        addTimeListener('17:55', activateAerationEvent);
    
        //slack Юмор: случайно, каждые полчаса, в рабочее время
        addTimeListener(getRandWorkTimeInDayWithInterval(5, 30), activateHumorEvent); 
        
        
        //supportAlarm: случайно, раз в день, в рабочее время
        addTimeListener(getRandWorkTimeInDay(), activateSupportAlarmEvent);
        
        //срочныйХотФикс: случайно, раз в неделю, в 18.00
        if (chance(0.1))
            addTimeListener('18:00', activateHotFixEvent); 
    
    
        //упалСервер: случайно, раз в три дня, в рабочее время
        if (chance(0.2))
            addTimeListener(getRandWorkTimeInDay(), activateServerDropEvent); 
    
    
        //совместный обед: каждые два часа
        addTimeListener(getRandWorkTimeInDayWithInterval(60, 120), activateJointLunchEvent); 
        
        
        //времяНастолок: случайно, после 19.00
        if (chance(0.2))
            addTimeListener('18:59', activateBoardGamesEvent); 
        
        
        //Приближается рабочий день: 8.00 - все работники начинают приходить на работу, опаздывают на время timeMinForLate timeMaxForLate
        addTimeListener('8:01', activateGoToWorkEvent); 
        
        //Конец рабочего дня: работники пробуют “пойти домой”
        addTimeListener('19:00', activateGoHomeEvent);
        addTimeListener('20:00', activateGoHomeEvent);
        addTimeListener('20:30', activateGoHomeEvent);
        addTimeListener('21:00', activateGoHomeEvent);
        addTimeListener('21:15', activateGoHomeEvent);
        addTimeListener('21:30', activateGoHomeEvent);
        addTimeListener('21:45', activateGoHomeEvent);
        addTimeListener('22:00', activateGoHomeEvent);
        addTimeListener('22:15', activateGoHomeEvent);
        addTimeListener('22:30', activateGoHomeEvent);
        addTimeListener('22:45', activateGoHomeEvent);
        addTimeListener('23:00', activateGoHomeEvent);
        addTimeListener('23:15', activateGoHomeEvent);
        addTimeListener('23:30', activateGoHomeEvent);
        addTimeListener('23:45', activateGoHomeEvent);
        if (currentDay) {
            addTimeListener('00:00', activateGoHomeEvent);
            addTimeListener('00:15', activateGoHomeEvent);
            addTimeListener('00:30', activateGoHomeEvent);
            addTimeListener('00:45', activateGoHomeEvent);
            addTimeListener('01:00', activateGoHomeEvent);
            addTimeListener('02:00', activateGoHomeEvent);
            addTimeListener('03:00', activateGoHomeEvent);
            addTimeListener('04:00', activateGoHomeEvent);
            addTimeListener('05:00', activateGoHomeEvent);
            addTimeListener('06:00', activateGoHomeEvent);
            addTimeListener('07:00', activateGoHomeEvent);
        }
        
        
        addTimeListener('20:00', waitFor8);
        addTimeListener('08:00', cancelWaitForTime);
        
        addTimeListener('8:01', waitFor11 );
        addTimeListener('11:00', cancelWaitForTime );

        
    } else {
        
        addTimeListener('10:00', activateGoToWorkHolidayEvent); 
        
        addTimeListener('08:00', skipHoliday );
        
    }
    
}


function fillProgressBar2(bar, progressCount, needCount) {
    if (!bar)
         return;
    
    var txt = bar.txt || bar.__getObjectByName('txt' ) || bar
        , fll = bar.fll || bar.__getObjectByName('fll');
        
    bar.txt = txt;
    bar.fll = fll;
    progressCount = clamp(progressCount, 0, needCount);
    if (fll) fll.__size = [ progressCount / needCount, 26, 1 ];
    if (txt) txt.__text = progressCount + '/' + needCount;
    
}


//нужен стейт со временем последнего входа и прогрессами

var ProjectState = {};

var maxTotalBarWorkPoints = 20000;
var maxBarWorkPoints = 5000;

var project_mm = 'mm'
    , project_pi2 = 'pi2'
    , type_gd = 'gd'
    , type_dev = 'dev'
    , type_art = 'art'
    , type_qc = 'qc';

function _mkproj(pname){

    ProjectState[pname] = { types: [] };
    
    ObjectDefineProperties(ProjectState[pname],{
        progress:{
            get: function(){
                var t = this;
                return round( $count(this.types, function(k){ return t[k].progress; }) );
            }
        }
    } );
    
    function _mktype(tn){
        ProjectState[pname][tn] = { progress: 0 };
        ProjectState[pname].types.push(tn);
    }
    
    _mktype(type_gd);
    _mktype(type_dev);
    _mktype(type_art);
    _mktype(type_qc);
    

}

_mkproj(project_mm);
_mkproj(project_pi2);


function randomProject(){
    return dropSomethingBy(objectKeys(ProjectState));
}



function activateProgressBars() {
    
    function showOrHideProgressBar() {
        var bar = this;            
        bar.__getObjectByName('details').__visible = !bar.__getObjectByName('details').__visible;
        bar.update(1);
        bar.update(1);
        return 1;
    }
    
    initButton( gui_PI2bar, { __onTap: showOrHideProgressBar } );
    initButton( gui_MMbar, { __onTap: showOrHideProgressBar } );
    
    _setInterval( incWorkProgress, convertToGameTime( 60 ) ); 

    updateProgressBars();
    
}


function incWorkProgress(){
    var workers = selectMans( mans, { state: MAN_STATE_WORKING } );
    
    $each(workers, function(w) {
        var ps = w.projectState;
        if (ps) {
            var maximum = 0;
            switch( w.type ){
                case type_qc: maximum = lerp( (ps[type_gd].progress + ps[type_dev].progress) / 2 , maxBarWorkPoints, 0.01 ); break;
                case type_dev: maximum = lerp( (ps[type_gd].progress + ps[type_art].progress) / 2, maxBarWorkPoints, 0.1); break;
                case type_art: maximum = ps[type_gd].progress; break;
                case type_gd: maximum = lerp( (ps[type_qc].progress + ps[type_art].progress + ps[type_dev].progress) / 2, maxBarWorkPoints , 0.5); break;
            }
            
            var wpnts = w.cfg.workPoints || 1;
            //TODO: some buffs?
            if (maximum) {
                var dstMod = clamp( 1.15 - w.projectTypeState.progress / maximum, 0, 1 );
                
                w.projectTypeState.progress = mmin( w.projectTypeState.progress + wpnts * dstMod, maximum );
            }
        }
    });
    
    updateProgressBars();
    
    if (ProjectState[project_mm].progress >= maxTotalBarWorkPoints) {
        if (ProjectState[project_pi2].progress >= maxTotalBarWorkPoints){
            if (!__window.winner) {
                __window.winner = 1;
                showWindow('congrat', function(wnd){
                      wnd.__setAliasesData({
                        wrk: {
                            __onTap: function(){
                                window.close();
                                close();
                                _setTimeout( function(){
                                    window.open( "https://jira.game-insight.tech", '_parent' );
                                },0.1);
                                return 1;
                            },
                            __onTapHighlight: 1
                        }});
                    
                }, 0, 1);
            }
        }
    }
    
}

function updateProgressBars() {
    
    fillProgressBar2(gui_MMbar_fullPbar_bar, floor(ProjectState[project_mm].progress), maxTotalBarWorkPoints);
    fillProgressBar2(gui_PI2bar_fullPbar_bar, floor(ProjectState[project_pi2].progress), maxTotalBarWorkPoints);
    
    fillProgressBar2(gui_MMbar_details_gdPbar_bar, floor(ProjectState[project_mm][type_gd].progress), maxBarWorkPoints);
    fillProgressBar2(gui_MMbar_details_devPbar_bar, floor(ProjectState[project_mm][type_dev].progress), maxBarWorkPoints);
    fillProgressBar2(gui_MMbar_details_artPbar_bar, floor(ProjectState[project_mm][type_art].progress), maxBarWorkPoints);
    fillProgressBar2(gui_MMbar_details_qcPbar_bar, floor(ProjectState[project_mm][type_qc].progress), maxBarWorkPoints);
    
    fillProgressBar2(gui_PI2bar_details_gdPbar_bar, floor(ProjectState[project_pi2][type_gd].progress), maxBarWorkPoints);
    fillProgressBar2(gui_PI2bar_details_devPbar_bar, floor(ProjectState[project_pi2][type_dev].progress), maxBarWorkPoints);
    fillProgressBar2(gui_PI2bar_details_artPbar_bar, floor(ProjectState[project_pi2][type_art].progress), maxBarWorkPoints);
    fillProgressBar2(gui_PI2bar_details_qcPbar_bar, floor(ProjectState[project_pi2][type_qc].progress), maxBarWorkPoints);    
    
}


function newSky(ff){
    var z = randomize(10, 40)
        , y = randomize(-100, 180)
        , x = ff ? randomize(-1300, 1300) : randomBool() ? -1300 : 1300
        , speed = clamp( (ff ? randomSign() : (-sign(x))) * (y + 200) / z, -20, 20 ) / 10000;
        
    
    var dtMod = ([ 0, 1, 2, 3, 1, 0 ][ floor( currentDayTime / 3600 / 4 ) ] || 0)/3;
    
    var sky = mainScene.__getObjectByName('sky').__addChildBox({
        __color: clamp( random() * 0.1 + 0.7 + ((y + 160) / 1000), 0, 0.999) * clamp( 0.8 + dtMod / 3, 0.5, 1 ),
        __img: 'sky' + randomInt(1,6),
        __ofs:[ x, y, z ], 
        __updatable: {
            __update: function(t, dt){
                x += speed * dt;
                sky.__x = x;
                if (x > 1333 || x < -1333){
                    sky.__removeFromParent();
                    return 1;
                }
            }
        }
    });
    
    sky.__color.b += 0.1 + dtMod / 10;

    updatable.push(sky.__updatable);
    sky.update();
    sky.__updateMatrixWorld();
}

function activateSky(){
    
    
    for (var i = 0; i <10; i++){
        newSky(1);
    }
    
    _setInterval(newSky, convertToGameTime(1000) );
    
}
