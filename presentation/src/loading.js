/*
 * операции по инициаизации загрузки игры, по загрузке ресурсов игры, конфигов
 * различные харкодные конфиги
 */



function gameLoaded() {
    BUS.__post(__ON_GAME_LOADED);
    loadEditorExtension();
}

//debug


function loadEditorExtension() {
    var path = '../../eeditor/';
    __window.__debugEvents = 0;
    var c = 0, nc = 1;
    function chk() {
        if (c++ == nc) {

            $each(globalConfigsData, (v, k) => {
                k.replace(/\/\.\.\/\.\.\/\eeditor\/shaders\/(.+\.\w+)/, (a, s) => {
                    globalConfigsData['shaders/' + s] = v;
                });
            });

            consoleLog('Editor loaded!');
            Editor.setOpts({
                options: {
                    __allServerPath: path,
                },
                //                 inspectorMode: 1,
                enableLayoutStateInInspectorMode: 1
            });

            //                 StateWithKitten.disableOpenActiveLayouts = 1;

            BUS.__addEventListener({
                EDITOR_PREPARED: function () {

                    invokeEventWithKitten('Project.open', 'presentation');
                    Editor.currentProject.options.__allServerPath = "../" + Editor.currentProject.options.__allServerPath;

                    Editor.ui.__z = -5000;
                    Editor.ui.__onTap = function () { gestures.tap(); }

                }
            });

            Editor.createView();

            BUS.__post(__ON_GAME_LOADED);
        }
    }

    createXHRRequest(path + '?editorShaders', 0, {
        onload: r => {

            r = $replace(JSON.parse(r.target.response), function (e) {
                return '//' + path + e + '?rnd=' + floor(TIME_NOW);
            });

            TASKS_RUN([
                [TASKS_SHADERS].concat(r)
            ], chk, 0, 1);
        }
    });

    createXHRRequest(path + '?editorScripts', 0, {
        onload: r => {

            r = $replace(JSON.parse(r.target.response), function (e) {
                return '//' + path + e + '?rnd=' + floor(TIME_NOW);
            });

            var js = $filter(r, s => s.indexOf('.js?') > 0);
            var css = $filter(r, s => s.indexOf('.css?') > 0);
            TASKS_RUN([
                [TASKS_SCRIPT].concat(js),
                [TASKS_CSS].concat(css)
            ], chk, 0, 1);

        }
    });
    return 1;
}

//undebug

function beginLoadGameResources() {

    options.__disableCache = findGetParameter('disableCache');

    consoleLog('beginLoadGameResources');

    //     console.log("loading ", options.__projectData.res);
    //     console.log("options ", options );

    var toload = options.__projectData.res || [];
    $each(window.loadlists, function (l, c) {
        toload.push([c].concat(l));
    });

    TASKS_RUN(toload, function () {

        globalConfigsData = $map(globalConfigsData, function (d) {
            return d ? d.packed ? repackJson(d.packed) : d.pkd ? unpackJson(d.pkd) : d : d;
        });

        gameLoaded();

    })

}

window.$INIT$ = wrapFunctionInTryCatch(function (conf) {

    document.body.innerHTML = "<div id='gameDiv' style='position:absolute; left:0; top:0;'></div>";

    options.__projectData = window.$projectData$ || {};

    mergeObjectDeep(options, options.__projectData.options);

    createGame({
        element: document.getElementById('gameDiv'),

        onCreate: function () {

            scene.onResize = function () {
                scene.__eachChild(function (c) {
                    c.update(1);
                });
            };
            beginLoadGameResources();
            //debug
            gestures.__onKeyUp = function (keyCode, key, ctrl, shift, alt, e) {
                if (shift && key == 'i' && typeof Editor == undefinedType) {
                    gestures.__onKeyUp = 0;
                    loadEditorExtension();
                }
            }
            //undebug
        }
    });

});

