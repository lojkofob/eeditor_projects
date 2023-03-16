//debug
var ooui = {
    __baseLayoutsFolder: 'ui/'
};

function activateLayoutOptions() {
    if (isFunction(window.activateOptions)) {
        if (Editor.currentLayout) {
            Editor.currentLayout.activateOptions();
            activateOptions(ooui);
        } else {
            activateProjectOptions();
            activateOptions(ooui);
        }
    }
}


function deactivateLayoutOptions() {
    if (isFunction(window.deactivateOptions)) {
        if (Editor.currentLayout) {
            Editor.currentLayout.deactivateOptions();
            deactivateOptions(ooui);
        } else {
            deactivateProjectOptions();
            deactivateOptions(ooui);
        }
    }
}

//undebug

var I = makeSingleton({}, {

    run(name) {
        //debug
        if (!Editor.currentLayout) {
            BUS.__addEventListener({
                LAYOUT_ACTIVATED() {
                    looperPost(() => { I.run(name); });
                    return 1;
                }
            })
            return;
        }
        name = name || Editor.currentLayout.name;
        //undebug
        consoleLog("run", name);
        if (I.v) return;

        //debug
        var v = Editor.currentLayout.layoutView
            , j = v.toJson();
        delete j.__margin;
        v.__visible = 0;
        if (0)
            //undebug
            j = getLayoutByName(name);

        consoleLog("layout", j);
        I.name = name;
        j.name = 'view';
        I.v = new Node(j);
        consoleLog("addToScene");
        addToScene(I.v);
        consoleLog("traverse");
        I.v.__traverse(function (n) {
            if (n.name) { __window[n.name] = n; }
        });
        I.runScript();
    },

    stop() {
        if (!I.v) return;
        I.v = I.v.__removeFromParent();
        //debug
        var v = Editor.currentLayout.layoutView;
        v.__visible = 1;
        //undebug
    },

    runScript() {
        consoleLog("runScript");
        if (!I.v) return;
        activateLayoutOptions();
        loadDataTxt("../src/ui/" + I.name + ".js", s => {
            eval(s);
        }, null, 1);
        deactivateLayoutOptions();
    },

    //debug

}, {
    playMode: {
        set(v) { invokeEventWithKitten(v ? 'Editor.hideInterface' : 'Editor.showInterface'); },
        get() { return !Editor.ui.__visible; }
    }

    //undebug
});

//debug
BUS.__addEventListener({

    ALL_READY() {

        activateProjectOptions();

        Editor.buildTopPanelMenu({
            'project open': 0,
            'project close': 0,
            'project settings': 0,
            'layout export': 1
        });

        addKeyboardMap({
            '`': 'Editor.toggleInterface',
            ']': 'Editor.toggleInterface', // ` на русской раскладке на mac
            'ё': 'Editor.toggleInterface', // ` на русской раскладке
            'escape': 'Editor.toggleInterface'
        });

        deactivateProjectOptions();

    },

    EDITOR_UI_TOGGLED() {
        if (I.playMode) {
            selectNode();
            invokeEventWithKitten('Editor.disableSelect');
            I.run();
        } else {
            I.stop();
            invokeEventWithKitten('Editor.enableSelect');
        }
    },

    LAYOUT_ACTIVATED(t, l) {
        if (l.layoutView) {
            if (!l.layoutView.ASdJLASDYEN) {
                ObjectDefineProperties(l.layoutView, { __viewable: { get() { return !I.playMode } } });
                l.layoutView.ASdJLASDYEN = 1;
            }
        }
    }

});

//undebug

