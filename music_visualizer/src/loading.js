/*
function js_StorageQuerySettings(cb){
    try {
        sets = _localStorage.getItem('s');
        if (sets)
        sets = JSON.parse( sets ) || {};
    } catch(e){
        //debug
        throw(e)
        //undebug
    }
    cb();
}
function StorageUpdate(){
    try {
         _localStorage.setItem('s', JSON.stringify(sets || {}) );
    } catch(e) {
        //debug
        throw(e)
        //undebug
    }
}*/
//debug
if (typeof main == undefinedType)
//undebug
    main = function(f){ 
        window.onload=f 
    };

console.log("© Shpengler Edgar 2018. lojkofob@gmail.com. Own js engine. Google closure compiler");
   
main( wrapFunctionInTryCatch( function(){
    
    __document.body.innerHTML = "<div id='gameDiv' style='position:absolute; left:0; top:0;'></div>";
    var pt = "build_res/";
    createGame( { 
        element: __document.getElementById('gameDiv'),
        onCreate:function(){
            options.__disableCacheByVer = 0;
//             TASKS_RUN( [[ TASKS_PLAYER ]], function(){
            
                TASKS_RUN( [
                    [TASKS_SHADERS, 'base.f', 'base.v', 'part.f', 'part.v', 'partnc.f', 'partnc.v', 'c.f', 'super1.f', 'super2.f'],
                    [TASKS_LAYOUT, 'main.json'],
                    
                    [TASKS_ATLAS, pt + "atlas-0.png",  pt + "atlas-0.json"]
                ], function(){
                    BUS.__post( __ON_GAME_LOADED );
                });
//             });
        }
    });
    
} ) );

