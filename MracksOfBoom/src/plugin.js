
var animationsCfg = { };

//Matrix4.prototype.__multiplyMatrices = Matrix4.prototype.__multiplyMatrices4;

var ManAnimation = makeClass(function(name){
    var t = this;
    t.name = name;
    var rgexp1 = new RegExp( '(.*)_' + name + '_(\\d*)' );
    var rgexp2 = new RegExp( '(.*)_' + name + '_(\\d*)_(\\d)');
    t.mans = { };
    
    t.anims = {};
    
    $each( globalConfigsData.__frames, function(f, fname) {
        
        fname.replace(rgexp1, function(fn, manname, type){

            if (!t.mans[manname]) {
                t.mans[manname] = { types: { } }
            }
            
            var itype = parseInt(type);
            
            if (!t.mans[manname].types[itype]) {
                t.mans[manname].types[itype] = { 
                    type: type,
                    count: 0
                };
            }
            
            fname.replace(rgexp2, function(fn, manname, type, i){
            
                t.mans[manname].types[itype].count = mmax( t.mans[manname].types[itype].count, parseInt(i) );
            });
            
        });
    });
    
    $each(t.mans, function(man, manname){
        $each(man.types, function(type){
            if (type.count) {
                t.anims[ manname  + '_' + name + '_' + type.type ] =
                // [ count, fps, frames, actions, padFormat, preparedFames, reverseLoop ]
                    [ type.count, 4, manname + '_' + name + '_' + type.type + '_{0}', 0,0,0,1 ]
            }
                
        });
    });
    
    registerSpriteSheetAnimations(t.anims)
    
}, {
    
    start: function(man, type, time){
        
        var t = this;
        man.currentAnimation = t;
        var mna = t.mans[man.name];
        if ( mna ) {
            type = mna.types[type];
            if (type) {
                man.node.body.__img = man.name + '_' + t.name + '_' + type.type;
                if (time){
                    _setTimeout( this.stop.bind(this, man), convertToGameTime( time )  );
                }
            }
            
        } 
        return this;
    },
    
    stop: function(man){
        
    }
    
});


function registerAnimations() {
    
    $each( [ 'draw','eat', 'huray', 'phone', 'play', 'point', 'seat', 'smoke', 'testing', 'walk', 'gesture', 'tipe' ],
        function(i){
            animationsCfg[i] = new ManAnimation(i);
        } );
    
    
    
    // commands to convert any gif to sprite frames
    
    // convert optimized gif to not optimized
    // node /var/www/html/editor/eeditor/tools/file-iterate.js --command="convert -layers Composite -coalesce {file} null:{file} {file}" --log=debug *.gif
    
    // extract frames
    // node /var/www/html/editor/eeditor/tools/file-iterate.js --command="mkdir -p {index} && convert -alpha off -resize 14x18! -quality 100 -coalesce -transparent black -fill black -opaque none {file} ./{index}/frame.png" --log=debug *.gif


    var rgexp1 = new RegExp( 'pc_anim_(\\d+)_frame-(\\d+)' );
    var cc = {}, anims = {};
    $each( globalConfigsData.__frames, function(f, fname) {
        fname.replace(rgexp1, function(fn, dd, frames){
            cc[dd] = mmax(cc[dd]||0, parseInt( frames ) );
        });
    });
    
    $each(cc, function(count, d){
        anims[ 'pc_anim_' + d ] =
        // [ count, fps, frames, actions, padFormat, preparedFames, reverseLoop ]
           [ count, 20, 'pc_anim_' + d + '_frame-{0}', 0, 0, 0, 0 ]
    });
    
    registerSpriteSheetAnimations(anims);
    
    
    
    //anims check
    //debug
    if (typeof workersCfg != undefinedType) {
        var mmmf = {};
        
        $each( animationsCfg, function(cfg, animname){
            $each( workersCfg, function(man, manname){
                if (!cfg.anims[manname + '_' + animname + '_01']){
                    if (!globalConfigsData.__frames[manname + '_' + animname + '_01']){
                        mmmf [manname] = (mmmf[manname]||'') +  animname + ' ';
                    }
                }
            });
        });
        consoleLog('animations not exist:', mmmf);
    }
    //undebug
        
}



function activateParallax(cam){
    
    cam.__fov = 5;
    cam.__updateProjectionMatrix = function( ) {

        var t = this
            , left = t.__left
            , right = t.__right
            , top = t.__top
            , bottom = t.__bottom
            , zoom = t.____zoom
            , far = t.__far
            , near = t.__near
            , pm = this.pm
            , te = pm.e
            , w = zoom / ( right - left )
            , h = zoom / ( top - bottom )
            , p = 1.0 / ( far - near )
            , x = ( right + left ) * w
            , y = ( top + bottom ) * h
            , z = ( far + near ) * p;
        
        te[ 0 ] = 2 * w;    te[ 4 ] = 0;        te[ 8 ] = 0;            te[ 12 ] = - x;
        te[ 1 ] = 0;        te[ 5 ] = 2 * h;    te[ 9 ] = 0;            te[ 13 ] = - y;
        te[ 2 ] = 0;        te[ 6 ] = 0;        te[ 10 ] = - 2 * p;     te[ 14 ] = - z;
        te[ 3 ] = 0;        te[ 7 ] = 0;        te[ 11 ] = -0.001 * t.__fov;      te[ 15 ] = 1;
        
        pm.__is3D = 1;
        pm.__isScrollMatrix = 1;
        pm.im = pm.__getInverseMatrix();
        pm.htc = 0; 
        return this;

    };
    
    cam.__updateProjectionMatrix();
    
}

function updateQuaternion(q, x, y, z){
    
    x = x || 0;
    y = y || 0;
    z = z || 0;

    // var order = 'XYZ';

    // http://www.mathworks.com/matlabcentral/fileexchange/
    // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
    //	content/SpinCalc.m

    var c1 = cos( x / 2 );
    var c2 = cos( y / 2 );
    var c3 = cos( z / 2 );

    var s1 = sin( x / 2 );
    var s2 = sin( y / 2 );
    var s3 = sin( z / 2 );

    // if ( order === 'XYZ' ) {

        q.x = s1 * c2 * c3 + c1 * s2 * s3;
        q.y = c1 * s2 * c3 - s1 * c2 * s3;
        q.z = c1 * c2 * s3 + s1 * s2 * c3;
        q.w = c1 * c2 * c3 - s1 * s2 * s3;
    //
    // } else if ( order === 'YXZ' ) {
    //
    //     q.x = s1 * c2 * c3 + c1 * s2 * s3;
    //     q.y = c1 * s2 * c3 - s1 * c2 * s3;
    //     q.z = c1 * c2 * s3 - s1 * s2 * c3;
    //     q.w = c1 * c2 * c3 + s1 * s2 * s3;
    //
    // } else if ( order === 'ZXY' ) {
    //
    //     q.x = s1 * c2 * c3 - c1 * s2 * s3;
    //     q.y = c1 * s2 * c3 + s1 * c2 * s3;
    //     q.z = c1 * c2 * s3 + s1 * s2 * c3;
    //     q.w = c1 * c2 * c3 - s1 * s2 * s3;
    //
    // } else if ( order === 'ZYX' ) {
    //
    //     q.x = s1 * c2 * c3 - c1 * s2 * s3;
    //     q.y = c1 * s2 * c3 + s1 * c2 * s3;
    //     q.z = c1 * c2 * s3 - s1 * s2 * c3;
    //     q.w = c1 * c2 * c3 + s1 * s2 * s3;
    //
    // } else if ( order === 'YZX' ) {
    //
    //     q.x = s1 * c2 * c3 + c1 * s2 * s3;
    //     q.y = c1 * s2 * c3 + s1 * c2 * s3;
    //     q.z = c1 * c2 * s3 - s1 * s2 * c3;
    //     q.w = c1 * c2 * c3 - s1 * s2 * s3;
    //
    // } else if ( order === 'XZY' ) {
    //
    //     q.x = s1 * c2 * c3 - c1 * s2 * s3;
    //     q.y = c1 * s2 * c3 - s1 * c2 * s3;
    //     q.z = c1 * c2 * s3 + s1 * s2 * c3;
    //     q.w = c1 * c2 * c3 + s1 * s2 * s3;
    //
    // }
    //
}

function updateNodeMatrix3d(){
    var t = this;
    
    if (!t.__quaternion){
        t.__stableZ = 1;
        t.____scale.z = 1;
        t.__quaternion = { x:0, y:0, z:0, w:1 };
    }
    
    updateQuaternion(t.__quaternion, (t.____rotation_z ||0) * DEG2RAD, (t.____rotation_y||0) * DEG2RAD, t.____rotation );
            
    var m = t.__matrix
        , te = m.e
        , q = t.__quaternion
        , x = q.x, y = q.y, z = q.z, w = q.w
        , x2 = x + x,  y2 = y + y, z2 = z + z
        , xx = x * x2, xy = x * y2, xz = x * z2
        , yy = y * y2, yz = y * z2, zz = z * z2
        , wx = w * x2, wy = w * y2, wz = w * z2
        , s = t.____scale
        , sx = s.x, sy = s.y, sz = s.z || 0
        , po = t.__offsetByParent
        , o = t.__offset
        , S = t.____skew;

    m.__is3D = 1;

    te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
    te[ 1 ] = tan(S.y) + ( xy + wz ) * sx;
    te[ 2 ] = ( xz - wy ) * sx;
    te[ 3 ] = 0;

    te[ 4 ] = tan(S.x) + ( xy - wz ) * sy;
    te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
    te[ 6 ] = ( yz + wx ) * sy;
    te[ 7 ] = 0;

    te[ 8 ] = ( xz + wy ) * sz;
    te[ 9 ] = ( yz - wx ) * sz;
    te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
    te[ 11 ] = 0;

    te[ 12 ] = po.x + o.x;
    te[ 13 ] = po.y - o.y;
    te[ 14 ] = -o.z + yy;
    te[ 15 ] = 1;
    t.__matrixWorldNeedsUpdate = 1;
}

function register3D(){

    mergeObj( NodePrototype.__nodeToJsonPropertiesList__, {
        __rotation_z: [0],
        __rotation_y: [0],
        __scale_z : [1],
        __omod: [0],
        __omod2: [0],
        __omodx: [0],
        __omody: [0]
    } );
    
    ObjectDefineProperties( NodePrototype, {
        
        __rotation_z: createSomePropertyWithGetterAndSetter(function(){
            return this.____rotation_z || 0;
        }, function(v){
            this.____rotation_z = v;
            this.__dirty = 1;
            this.__updateMatrix = updateNodeMatrix3d;
        }),
        
        __rotation_y: createSomePropertyWithGetterAndSetter(function(){
            return this.____rotation_y || 0;
        }, function(v){
            this.____rotation_y = v;
            this.__dirty = 1;
            this.__updateMatrix = updateNodeMatrix3d;
        }),
        
        __scale_z: createSomePropertyWithGetterAndSetter(function(){
            return this.____scale.z;
        }, function(v){
            this.____scale.z = v;
            this.__dirty = 1;
            this.__updateMatrix = updateNodeMatrix3d;
        }),

        z: createSomePropertyWithGetterAndSetter(function(){
            var t = this, pm = t.__projectionMatrix ||0, im = pm.im||0;
            if (im.__is3D) {
                var mw = t.mw.e;
                var cameray = im.e[13], y = mw[13];
                var camerax = im.e[12], x = mw[12];
                if (t.__omodx) {

                    if (t.____rotation_y>0) {
                        return (t.__omodx + (x < camerax ? t.__omod : t.__omod2))||0;
                    } else {
                        return (t.__omodx + (x < camerax ? t.__omod2 : t.__omod))||0;
                    }
                }

                if (t.__omody) {
                    return (y < cameray ? t.__omod : t.__omod2) || 0;
                }

            }
            return  t.____Z;

        }, function(v){
            this.____Z = v;
        })
        
    } );
}

BUS.__addEventListener( {
    
    PROJECT_OPENED: function(t,p){
        if (p && p.name == 'MracksOfBoom'){
            registerAnimations();
            register3D();

            $each( globalConfigsData.__frames, function (f, k) {
                if (k.startsWith('build_res')) {
                    f.tex.__init({
                        __magFilter: GL_NEAREST,
                        __minFilter: GL_NEAREST
                    });
                }
            } ) ;

            return 1;
        }
    },
    
    LAYOUT_ACTIVATED: function(t,p){
        if (p && p.name == 'scene'){
            p.__scenePrepared = 1;

            activateParallax(p.camera);

            
            EditorEventsWithKitten.invokeEvent( 'Editor.showCustomPanel', { 
                name: 'userData',
                unique: 1,
                properties: {
                    __rotation_z: { type:'number', step: 1 },
                    __rotation_y: { type:'number', step: 1 },
                    __scale_z: { type:'number', step: 1 },
                    __omod: { type:'number', step: 1 },
                    __omod2: { type:'number', step: 1 },
                    __omodx: { type:'number', step: 1 },
                    __omody: { type:'number', step: 1 },
                    __userData: {
                        type: 'object',
                        label: '',
                        properties: {
                            __waypoint: {
                                type: 'object',
                                label: 'waypoint chair sets',
                                properties: {
                                    __eat: { type:'b' },
                                    __work: { type:'b' },
                                    __social: { type:'b' }
                                }
                            }
                        }
                    }
                }
            });
            
            
            return 1;
        }
    }
    
} );
