
let RenderDeerPlugin = (() => {

    let plugin = makeSingleton({

    }, {

    });

    consoleLog('RenderDeerPlugin!');
   
    BUS.__addEventListener({
        LAYOUT_ACTIVATED: function (t, layout) {
            var view = (layout||0).layoutView;
            if (view) {
                if (layout.render)
                    return;

                view.__setAliasesData({
                    deer1(n) {

                        var program1 = renderer.__getWebGLProgram('base');
                        var program2 = renderer.__getWebGLProgram('__parallaxMappingOcclusion2');

                        
                        var sz = n.__size.__divideScalar(2.0);
                        plugin.rt = new WebGLRenderTarget(sz.x, sz.y);
                        plugin.rt2 = new WebGLRenderTarget(sz.x, sz.y);

                        var d1;
                        var d2;
                        var d3;
                        var ln;
                        updatable.__push({
                            __update(){
                                var mm =  mouse.__clone().__divide(__screenSize);
                                d3 = 4 * mm.__distanceTo({x: 0.0, y: 0.8});
                                d2 = 4 * mm.__distanceTo({x: 1.0, y: 0.5});
                                d1 = 4 * mm.__distanceTo({x: 0.7, y: 0.0});
                                ln = 4 * mm.__distanceTo({x: 0.5, y: 0.5});
                            }
                        });

                        n.$(n => {
                            if ((n.name||'').startsWith('depth')){
                                n.__isdepth = 1;                            
                                n.__render = function(){
                                    if (plugin.pass){
                                        renderer.__setRenderTarget(plugin.rt2);
                                        NodePrototype.__render.apply(this, arguments);
                                        renderer.__setRenderTarget(plugin.rt);
                                    } else {
                                        NodePrototype.__render.apply(this, arguments);
                                    }
                                }
                            } else {
                                n.__render = function(){
                                    n.__program = plugin.pass ? program2 : program1;
                                    NodePrototype.__render.apply(this, arguments);
                                };
                                n.map2 = plugin.rt2.__texture;

                                if ((n.name||'').startsWith('light3')){
                                    updatable.__push({
                                        __update(){
                                            n.__alpha = clamp(1.0 / d3, 0, 1.2);
                                        }
                                    });
                                } else 
                                if ((n.name||'').startsWith('light2')){
                                    updatable.__push({
                                        __update(){
                                            n.__alpha = clamp(1.0 / d2, 0, 1.2);
                                        }
                                    });
                                } else 
                                if ((n.name||'').startsWith('light1')){
                                    updatable.__push({
                                        __update(){
                                            n.__alpha = clamp(1.0 / d1, 0, 1.2);
                                        }
                                    });
                                } else 
                                if ((n.name||'').startsWith('line')){
                                    updatable.__push({
                                        __update(){
                                            n.__alpha = clamp(1.0 / ln, 0, 1.2);
                                        }
                                    });

                                }

                            }
                        });

                        
                        view.render = function () {
                            plugin.outNode_rt1.__width = __screenSize.y * 1920 / 1600;
                            plugin.outNode_rt1.__height = __screenSize.y;

                            plugin.pass = 1;
                            (plugin.outNode_rt1||0).____visible = 0;
                            (plugin.outNode_rt2||0).____visible = 0;
                            renderNodeToTexture(view, { __size: n.__size, __target: plugin.rt });
                            (plugin.outNode_rt1||0).____visible = 1;
                            (plugin.outNode_rt2||0).____visible = 1;

                            renderer.__setRenderTarget(0);
                            plugin.pass = 0;
                            renderer.__render(Editor.ui.__visible ? view : plugin.outNode_rt1, layout.camera || camera);
                            

                        }                        
                    },

                    light_roga: {
                        __uniforms: {
                            uvfilter: 1
                        },
                        __blending: 1
                    },
  
  
                    output_rt1(n){
                        plugin.outNode_rt1 = n;
                        _setTimeout(()=>{
                            if (!n.__shader || n.__shader=='c') n.__shader = 'base';
                            n.u_texture = plugin.rt.__texture;                            
                        }, 0.01);
                    },

                    output_rt2(n){
                        plugin.outNode_rt2 = n;
                        _setTimeout(()=>{
                            if (!n.__shader || n.__shader=='c') n.__shader = 'base';
                            n.u_texture = plugin.rt2.__texture;
                        }, 0.01);
                    }
                });

            }
        }
    });


    
    addEditorEvents('RenderDeerPlugin', {

    });

    addEditorBehaviours({ });

    return plugin;

})();
