var lastPinchPanCoords, mainSceneSize;

var mainSceneTargetPos = new Vector2(0,0);

updatable.__push({
    
    __update: function(t, dt) {
        t = clamp(mainSceneCamera.__animSpeed * dt / 50, 0, 1);
        
        if (__window.selectedMan && __window.selectedMan.cameraFollow && __window.selectedMan.node && __window.selectedMan.node.__visible) {
            var wp = __window.selectedMan.node.__worldPosition;
            mainSceneCamera.__tx = wp.x;
            mainSceneCamera.__ty = -wp.y;
        }


        mainSceneCamera.__fov = lerp( mainSceneCamera.__fov,  mainSceneCamera.__tzoom / 1.42 - 0.3, t / 5 );
        
        mainSceneCamera.__setViewOffset(
            lerp( mainSceneCamera.__x, mainSceneCamera.__tx, t ),
            lerp( mainSceneCamera.__y, mainSceneCamera.__ty, t ),
            lerp( mainSceneCamera.__zoom, mainSceneCamera.__tzoom, t )
        )
        
    }
});

function fixZoom(zoom){
    zoom = zoom ||  mainSceneCamera.__tzoom;
    return mmax( mmin(zoom, sqrt(zoom * 4)), 
                        mmax( __screenSize.x / mainSceneSize.x, __screenSize.y / mainSceneSize.y ) );
}

function updateSceneCamera(scaleTo, zoom, withPan){
    
    if (mainSceneSize) {
   
        var currentZoom = fixZoom(mainSceneCamera.__zoom);

        if (scaleTo && zoom){
            zoom = fixZoom(zoom);
            if (!zoom) return;
//             mainSceneTargetScale = currentZoom;
            scaleTo = toNodeCoords(scaleTo, 1);
            
            var cx = ( scaleTo.x ) * abs( currentZoom - zoom  ) / zoom
              , cy = ( -scaleTo.y ) * abs( currentZoom - zoom  ) / zoom
              , dxpan = 0
              , dypan = 0;
         /*       
            if (withPan){
                if ( lastPinchPanCoords ) {
                    dxpan = currentZoom * ( scaleTo.x - lastPinchPanCoords.x ) / tmp * 4;
                    dypan = currentZoom * ( scaleTo.y - lastPinchPanCoords.y ) / tmp * 4;
                }
                lastPinchPanCoords = scaleTo;
            }*/
            
            mainSceneCamera.__tx += sign(cx) * sqrt(abs(cx)) * 2 + dxpan;
            mainSceneCamera.__ty += sign(cy) * sqrt(abs(cy)) * 2 + dypan;
            
        }
        
        if (zoom) {
            mainSceneCamera.__tzoom = fixZoom( clamp( zoom, 0.5, 5 ) );
        } else {
            mainSceneCamera.__tzoom = mainSceneCamera.__zoom = fixZoom( mainSceneCamera.__zoom );
        }
        
        
        var rs = mainSceneSize.clone().__multiplyScalar( 0.5 * pow( mainSceneCamera.__tzoom, mainSceneCamera.__tzoom  > 1 ? 0.2 : 2 ));
        var xbord = clamp( -__screenCenter.x + rs.x, 0, 100000 );
        var ybord = clamp( -__screenCenter.y + rs.y, 0, 100000 );
        mainSceneCamera.__tx = clamp( mainSceneCamera.__tx, -xbord, xbord );
        mainSceneCamera.__ty = clamp( mainSceneCamera.__ty, -ybord, ybord );
    
    }
    
}

function activateGestures(){
    
    mainSceneSize = mainScene.__size;
    
    gestures.pinch = function(e,c,d,dd) {
        mainSceneCamera.__animSpeed = 0.5;
        updateSceneCamera(c, mainSceneCamera.__zoom - dd / 200, 1);
    };
    
    gestures.pinchEnd = 
    gestures.pinchStart = function(){
        lastPinchPanCoords = 0;
        if (__window.selectedMan && __window.selectedMan.cameraFollow)
            __window.selectedMan.cameraFollow = 0;
    };
    
    gestures.wheel = function(m, d) {
        mainSceneCamera.__animSpeed = 2;
        updateSceneCamera(mouse, mainSceneCamera.__zoom - d / 200 );
        return 1;
    };
    
    gestures.__drag = function(dx, dy){
        
        if (__window.selectedMan && __window.selectedMan.cameraFollow)
            __window.selectedMan.cameraFollow = 0;
        
        var  z = mainSceneCamera.__zoom;
        dx /= z;
        dy /= z;
        
        mainSceneCamera.__tx -= dx / layoutsResolutionMult;
        mainSceneCamera.__ty += dy / layoutsResolutionMult;
        
        mainSceneCamera.__animSpeed = 4;
        updateSceneCamera();
        
    };
    
    
}

BUS.__addEventListener([__ON_RESIZE, __ON_GAME_LOADED], updateSceneCamera);
