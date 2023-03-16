
let RenderDeerPlugin = (() => {

    let plugin = makeSingleton({

    }, {

    });


    consoleLog('RenderDeerPlugin!');
    /*
   
    function rot(l, node) {

        var opts = getDeepFieldFromObject(node, '__userData', 'rd');
            if (!opts)
                return;

        function getSize() {
            switch (opts.szType) {
                default: return __realScreenSize; break;
                case 1: return l.layoutView.__size; break;
                case 2: return __screenSize; break;
                case 3: return node.__size; break;
            }
        }

        var sz = getSize();
        var rt = new WebGLRenderTarget(sz.x, sz.y, { __dynamic: 1 });
        var nod = new Node({
            __size: { x: 1, y: 1 },
            __shader: 'base',
            map: rt.__texture,
            __busObservers: {
                __ON_RESIZE: function () {
                    nod.update(1);
                    sz = getSize();
                    rt.__setSize(sz.x, sz.y);
                }
            }
        });

        node.__defaultUVSBuffer = new MyBufferAttribute('uv2', Float32Array, 2, GL_ARRAY_BUFFER, [0, 1, 1, 1, 0, 0, 1, 0], 1);
        var tmpb = defaultUVSBuffer;

        node.__updateUVS = function () {

            defaultUVSBuffer = node.__defaultUVSBuffer;

            NodePrototype.__updateUVS.apply(this, arguments);

            defaultUVSBuffer = tmpb;

            var uvs = node.__uvsBuffer;
            if (uvs && !uvs.__kk) {
                uvs.__name = 'uv2';
                node.__uvsBuffer2 = uvs;
            }


            node.__updateMatrixWorld();
            node.__removeAttributeBuffer('uv');
            uvs = node.__uvsBuffer = node.__addAttributeBuffer('uv', 2);
            if (node.__uvsBuffer2) {

                node.__uvsBuffer.__passToGL = function (pa) {
                    if (opts.useUV1) {
                        node.__uvsBuffer2.__array = node.__uvsBuffer.__array;
                        node.__uvsBuffer2.__changed = 1;
                    }
                    if (opts.swapUV) {
                        node.__uvsBuffer2.__name = 'uv';
                        node.__uvsBuffer.__name = 'uv2';
                    } else {
                        node.__uvsBuffer2.__name = 'uv2';
                        node.__uvsBuffer.__name = 'uv';
                    }

                    MyBufferAttribute.prototype.__passToGL.call(node.__uvsBuffer2, pa);
                    MyBufferAttribute.prototype.__passToGL.call(node.__uvsBuffer, pa);

                };
            }

            uvs.__kk = 1;
            var nsz = node.__size.__divideScalar(2);

            function getVec(x, y) {
                var v = new Vector3(x * nsz.x, y * nsz.y, 0).__applyMatrix4(node.mw).__applyMatrix4(l.camera.pm).__toVector2();
                v.x = (v.x + 1) / 2;
                v.y = (v.y + 1) / 2;
                return v;
            }

            var p1 = getVec(-1, +1);
            var p2 = getVec(+1, +1);
            var p3 = getVec(-1, -1);
            var p4 = getVec(+1, -1);

            uvs.__getArrayOfSize(8, 1).set([p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y]);

            return this;
        }
        var pass = 0;

        if (opts.deep) {
            // node.__traverseChilds(n => {
            //     n.__visible = 0;
            // });
        }

        var dropRT = node.$("dropRT");
        dropRT = dropRT ? dropRT[0] : 0;
        if (dropRT) {
            var rt2 = new WebGLRenderTarget(sz.x, sz.y, { __dynamic: 1 });
            node.__render = function () {
                renderer.__setRenderTarget(rt2);
                renderer.__clear();
            };

            dropRT.__render = function () {
                renderer.__setRenderTarget(0);
                renderer.__render(nod, camera);

                if (opts.swapMap) {
                    node.map2 = rt.__texture;
                    node.map = rt2.__texture;
                } else {
                    node.map = rt.__texture;
                    node.map2 = rt2.__texture;
                }
                NodePrototype.__render.apply(node, arguments);
            };

        }
        else {
            node.__render = function () {

                renderer.__setRenderTarget(0);

                renderer.__render(nod, camera);

                if (node.map != rt.__texture) {
                    node.map2 = node.map;
                }

                node.map = rt.__texture;

                NodePrototype.__render.apply(this, arguments);

                if (node.map2)
                    node.map = node.map2;

            }
        }

    }
    */

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
                            plugin.pass = 1;
                            (plugin.outNode_rt1||0).____visible = 0;
                            (plugin.outNode_rt2||0).____visible = 0;
                            renderNodeToTexture(view, { __size: n.__size, __target: plugin.rt });
                            (plugin.outNode_rt1||0).____visible = 1;
                            (plugin.outNode_rt2||0).____visible = 1;

                            renderer.__setRenderTarget(0);
                            plugin.pass = 0;
                            renderer.__render(view, layout.camera || camera);
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
