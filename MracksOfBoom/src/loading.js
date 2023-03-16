/*
 * операции по инициаизации загрузки игры, по загрузке ресурсов игры, конфигов
 * различные харкодные конфиги
 */

var workersCfg, behavioursCfg, ready;

var root
, mainScene
, mainScene_studio

, gui
, gui_time
, gui_time_clock
, gui_time_date
, gui_skipNight
, gui_manInfo
, gui_PI2bar
, gui_MMbar

, gui_MMbar_fullPbar_bar 
, gui_PI2bar_fullPbar_bar

, gui_MMbar_details_gdPbar_bar
, gui_MMbar_details_devPbar_bar
, gui_MMbar_details_artPbar_bar
, gui_MMbar_details_qcPbar_bar

, gui_PI2bar_details_gdPbar_bar
, gui_PI2bar_details_devPbar_bar
, gui_PI2bar_details_artPbar_bar
, gui_PI2bar_details_qcPbar_bar
        
, mainSceneCamera = new Camera();

mainSceneCamera.__init({ 
    __tx: 0,
    __ty: 0,
    __tzoom: 1,
    __animSpeed: 1
});

            
// !!! do not touch it
updateTimeNow = function(){ }

main( wrapFunctionInTryCatch( function(conf){
    
    document.body.innerHTML = "<div id='gameDiv' style='position:absolute; left:0; top:0;'></div>";

    options.__projectData = globalConfigsData['build_res/opts.json'] || conf || {};
    
    mergeObjectDeep(options, options.__projectData.options);
    
    var ddtt = 0, realt = 0, llatt = 0, ltmn = 0;
    var __onFrame = function(t) {
        
        var timeNow = t / ONE_SECOND;
        if (__lastUpdatedTime__ != timeNow) {
            __lastUpdatedTime__ = timeNow;
            
            if (ltmn) {
                var dt = mmin( timeNow - ltmn, 1 ) * options.__timeMultiplier;
                TIME_NOW += dt;
                currentGameTime += dt * timeSpeedUpKoef;
            }
            
            ltmn = timeNow;
        }
        
        realt += mmin( t-llatt, 1000 );
        llatt = t;
        
        if (updateFramesRoutine(realt)){
            
            if (scene.__childs.length) {
                renderer.__setRenderTarget( 0 );
                renderer.__clear();
                for (var i = 0; i < scene.__childs.length; i++){
                    renderer.__render( scene.__childs[i], scene.__childs[i].camera || camera );
                }
                renderer.__finishRender();
            
            } 
                /*
            if (ready == 1) {
                renderer.__render(loaderNode, camera);
            } else {
                renderer.__render(mainScene, mainSceneCamera);
                //debug
                if (__window.debugMansNode) renderer.__render(window.debugMansNode, mainSceneCamera, 0, 0);
                //undebug         
                renderer.__render(gui, camera,0,0);
                
            } */
        
        }
        
        requestAnimFrame(__onFrame);
        
    };
        
    options.__goodResolution = { x:1024, y:512 },
    options.__minimalTapArea = 20;
    
    createGame( { 
        element: document.getElementById('gameDiv'),
        __onFrame: __onFrame,
        onCreate:function(){
            
            GL_LINEAR = GL_NEAREST;
            
            BUS.__addEventListener( {
                __ON_RESIZE: function(){
                    updateCamera(__screenSize.x, __screenSize.y, mainSceneCamera, mainSceneCamera.__x, mainSceneCamera.__y );
                }
            });
            
            TASKS_RUN( options.__projectData.res, function(){
                            
                workersCfg = getDataTable('workers', 1);
                behavioursCfg = getDataTable('behaviours', 1);
                
                BUS.__post( __ON_GAME_LOADED );
                BUS.__post( __ON_RESIZE );
                
                showWindow('welcomeWindow', function(wnd){
                    
                    wnd.__setAliasesData({
                        ok: {
                            __onTap: function(){
                                wnd.__close();
                                return 1;
                            },
                            __onTapHighlight: 1
                        },
                        
                        authors: {
                            
                            __childs: "eshpengler,ddanilko,eparkhimovich,dsheremet,vnesterenko,yatsenko,idmitriev".split(',').map(function(a){
                                
                                return {
                                    __size: [ 40, 80 ],
                                    __childs: [ { 
                                        __img: a + '_testing_02',
                                        __scaleF: 2
                                    }, {
                                        __text: { __text: a, __fontsize: 18 },
                                        __y: 55
                                    }
                                ] }
                                
                            })
                            
                        }
                    })
                }, 0, 1);
                
                ready = 1;
                _setTimeout( function(){
                    ready++;
                }, 1 );
            })
                    
        }
    });
    
} ) );

