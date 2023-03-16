/*
 * операции по инициаизации загрузки игры, по загрузке ресурсов игры, конфигов
 * различные харкодные конфиги
 */



function gameLoaded() {
    BUS.__post(__ON_GAME_LOADED);
}


function beginLoadGameResources() {
    options.__disableCache = findGetParameter('disableCache');
    consoleLog('beginLoadGameResources');
    var toload = options.__projectData.res || [];
    $each(__window.loadlists, function (l, c) {
        toload.push([c].concat(l));
    });
    TASKS_RUN(toload, function () {
        globalConfigsData = $map(globalConfigsData, function (d) {
            return d ? d.packed ? repackJson(d.packed) : d.pkd ? unpackJson(d.pkd) : d : d;
        });

        gameLoaded();

    });
}

__window.$INIT$ = wrapFunctionInTryCatch(function (conf) {

    document.body.innerHTML =
        "<div id='gameDiv' style='position:absolute; left:0; top:0;'></div>"
        + "<button id='randomize' style='position:fixed;top:1em;left:1em;padding:1em'>randomize</button>"
        + "<audio id='audio' controls style='position:fixed;left:10px;bottom:10px;'></audio>";

    html.__addClickHandler(__document.getElementById('randomize'), () => {
        RND();
        updateView();
    });

    options.__projectData = __window.$projectData$ || {};
    mergeObjectDeep(options, options.__projectData.options);
    createGame({
        element: __document.getElementById('gameDiv'),
        onCreate: function () {
            scene.onResize = function () {
                scene.__eachChild(function (c) {
                    c.update(1);
                });
            };
            beginLoadGameResources();

        }
    });

});

