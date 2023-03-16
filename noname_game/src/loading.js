/*
 * операции по инициаизации загрузки игры, по загрузке ресурсов игры, конфигов
 * различные харкодные конфиги
 */



function gameLoaded(){
    BUS.__post( __ON_GAME_LOADED );
}
 
function beginLoadGameResources(){
    consoleLog('beginLoadGameResources');
    
//     console.log("loading ", options.__projectData.res);
//     console.log("options ", options );
    TASKS_RUN( options.__projectData.res, function(){
        
        globalConfigsData = $map(globalConfigsData, function(d){
            return d.packed ? repackJson(d.packed) : d.pkd ? unpackJson(d.pkd) : d;
        });
        
        gameLoaded();
            
    })
    
}

window.$INIT$ = wrapFunctionInTryCatch( function(conf){
    
    document.body.innerHTML = "<div id='gameDiv' style='position:absolute; left:0; top:0;'></div>";

    options.__projectData = window.$projectData$ || {};
    
    mergeObjectDeep(options, options.__projectData.options);
    
    createGame( { 
        element: document.getElementById('gameDiv'),
        onCreate:function(){
            scene.onResize = function(){
                scene.__eachChild(function(c){ 
                    c.update(1); 
                });
            };
            beginLoadGameResources();
        }
    });
    
} );

