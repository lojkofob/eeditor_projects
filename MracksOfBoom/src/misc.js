 
/*
 * различные полезные функции не относящиеся к чему-то конкретно
 */
var __rndstr = "0123456789ABCDEFGHIJKLMNOPQRSTVUWXYZabcdefghijklmnopqrstvuwxyz";
function randomAsciiString(length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += __rndstr.charAt(randomInt(0,62));
    }
    return result;
}

function selectMaxSomethingBy(arr, chanceSelection, mod){
    var maxItemChance = -Infinity, a;
    $each(arr, function(it, i){
        var chance = chanceSelection(it, i); 
        if (chance > maxItemChance){ 
            maxItemChance = chance; 
            a = it;
        }
    } );
    return mod ? maxItemChance : a
}

function selectMinSomethingBy(arr, chanceSelection, mod){
    var minItemChance = Infinity, a;
    $each(arr, function(it, i){
        var chance = chanceSelection(it, i); 
        if (chance < minItemChance){ 
            minItemChance = chance; 
            a = it;
        }
    } );
    return mod ? minItemChance : a
}

function dropSomethingBy(arr, chanceSelection, returnIndex){
    if (arr) {
        var tmp = {}, sum = 0, k = 0, success = 0;
        
        if (chanceSelection) {
            
            $each(arr, function(ai, i){
                var c = chanceSelection(ai, i);
                if (c > 0) {
                    tmp[i] = c;
                    sum += c;
                    success = 1;
                }
            });
            
            if (success) {
                var num = randomInt( 0, sum - 1 );
                sum = 0;
                
                for (var i in tmp)
                {
                    k = i;
                    sum += tmp[i];
                    if ( sum > num ) {
                        break;
                    }
                }
            }
            
        } else {
            
            if (isArray(arr)) {
                success = arr.length;
                if (success) {
                    k = randomInt(0, success - 1 ) ;
                }
            } else if (isObject(arr)) {
                
                var keys = objectKeys( arr );
                success = keys.length;
                if (success) {
                    k = keys[randomInt(0, success - 1 )];
                }
            }
        }
        
        if (success) {
            return returnIndex ? k : arr[k];
        }
        
    }
}
 
        
function frameForShader(fll) {

    frame = globalConfigsData.__frames[fll.__img];
    var img = frame.tex.image,
        rect = frame.r,
        w = img.width,
        h = img.height;
        
    if ( frame.R ) fll.__rotate -= 90; // TODO: move to shader
    fll.c = new Vector2((rect[0]+rect[2]/2)/w, 1-(rect[1]+rect[3]/2)/h );
}



function destructNodeTimer() { 
    if (this.__timer) { 
        this.__timer.__stop();
        this.__timer = 0;
    }
}

function createNodeTimer(node, params) {

    if (!node.__timer) {
        
        var timer = node.__timer = new Timer(params);
        
        
        timer.__onEnd = overloadMethod(timer.__onEnd, function(){
            if (node.__timer == timer) {
                node.__timer = 0; 
            }
        });
        
        timer.__onTick();
        
        if (!node.__timerDestructorSetted) {
            node.__addOnDestruct(destructNodeTimer);
            node.__timerDestructorSetted = 1;
        }
        
    }
    return node.__timer;
}


function setNodeTimerSimple( node, params ) {
    if (!params)
        return;
    
    var textNode = params.__textNode || node;
    var formatFunc = params.__formatFunc || '__getText3';
    var preformat = params.__preformat||function(t){return t};
    var onTick = params.__onTick;
    params.__onTick =  function (){
        //debug
        if (!node.__timer)
            throw 'timers error';
        //undebug
        if (node.__timer)
            textNode.__text = preformat( node.__timer[formatFunc](params.__maxTimeParams) );
    };
    
    return createNodeTimer( node, params );
}


var countersObservers = {};
var CountersObserver = {
    __on: function( type, counter, val ){
        var a = countersObservers[counter], i = 0;
        //TODO: $filter
        if (a) for ( i = 0; i < a.length; )
            if (a[ i ].__on( counter, val )) a.splice(i, 1); else i++;
    },
    __addListener: function( counter, listener ){
        if (listener) {
            if (!listener.__on) {
                if (isFunction(listener)){ listener = { __on:listener } }
            }
            if (!countersObservers[counter]) countersObservers[counter] = [];
            countersObservers[counter].push( listener );
            return listener;
        }
    },
    __removeListener: function( counter, listener ){
        
        if (!counter){
            $each(countersObservers, function(co, c){
                removeFromArray( listener, co );
            });
        } else {
            if (countersObservers[counter])
                removeFromArray( listener, countersObservers[counter] );
        }
    }
    
};

BUS.__addEventListener( __ON_COUNTER_CHANGED, CountersObserver );

  

function moveNodeToTheNode(node, node2, useDummy){
    var pos = node.__worldPosition.clone();
    node2 = node2 || scene;
    var z = node.__totalZ;
    var dummy;
    if (useDummy){
        var sz = node.__size;
        node.__size = sz;
        dummy = new Node({__size: sz, __spacing:node.__spacing });
        node.parent.__childs[ node.__index ] = dummy;
        dummy.parent = node.parent;
        node.parent = node2;
        node2.add(node);
    }
    else {
        node2.add(node);
    }
    
    node.parent.update(1);
    node.parent.__updateMatrixWorld(1);
    
    node.update();
    
    node.__updateMatrix();
    node.__updateMatrixWorld(1);
    
    // var pos2 = node.__worldPosition.clone();

    node.__ofs = new Vector3(pos.x /*- pos2.x*/,/* pos2.y - */pos.y /*- 300*/,  node.__totalZ - z);
    
    node.update(1);
    node.__updateMatrixWorld(1);
    
    return dummy;
}



function nodesTable(params) {

    var node = params.__node
        , columns = params.__columns || 1
        , indexer = params.__uniqueCellIndex || function(i){ return i }
        , updater = params.__updateCell
        , creator = params.__createCell
        , cellWidth = params.__cellWidth || 0
        , startX = params.__startX || 0
        , cellHeight = params.__cellHeight || 0
        , startY = params.__startY || 0
        , useVisibility = params.__useVisibility
        , count = params.__count;
                
    if (!node.__table) node.__table = { };
    
    var table = node.__table;
    
    function updateOrCreateCard(index){
        
        var x = index % columns,
            y = floor(index/columns);
        
        index = indexer(index);
        
        var cell = table[index];
        
        if (!cell) {
            cell = creator(index);
            if (!cell)
                return;
            
            cell.__uniqueCellIndex = index;
            cell.__addOnDestruct( function(){ if (table[this.__uniqueCellIndex]==this) delete table[this.__uniqueCellIndex]; });
        }
    
        table[index] = cell;
        
        if (cell.parent != node)
            node.__addChildBox( cell );
        
        cell.__x = (cellWidth || 0) * x + (startX || 0);
        cell.__y = (cellHeight || 0) * y + (startY || 0);
        
        cell.__exist = 1;
        
        if (useVisibility) 
            cell.__visible = 1;
        
        if (updater) updater(cell, index);
       
        return cell;
        
    }

    for (var i = 0; i < count; i++){
        updateOrCreateCard(i);
    }
    
    $each( $filter(node.__childs, function(c){
       if (c.__exist) c.__exist = 0; else return 1;
    }), function(c){
        if (c.__uniqueCellIndex) {
            if (useVisibility) {
                c.__visible = 0;
            }
            else {
                c.__removeFromParent();
            }
        }
    });
}
        

function initButton(but, j, soft){
    if (but) {
        if (j && j.__sound && j.__onTap) {
            j.__onTap = overloadMethod(function(){ playSound(this.__sound) }, j.__onTap);
        } 
        return onTapHighlight( but.__init(j, soft), but.but || but.i || but );
    }
}


function addCounterObserverToNode(node, counter, handler) {
    var listener = CountersObserver.__addListener( counter, handler );
    node.__addOnDestruct( function(){
        CountersObserver.__removeListener( counter, listener );
    } );
}

function addCountersObserversToNode(){
    for (var i =0; i<arguments.length; i+=2){
        addCounterObserverToNode(arguments[0], arguments[i], arguments[i+1]);
    }
}



function rudatestr(time) {
    var date = new Date(time || Date.now());
    var d = date.getDate();
    if (d<10) d = '0'+d;
    var m = (date.getMonth()+1);
    if (m<10) m = '0'+m;
    var h = date.getHours();
    if (h<10) h = '0'+h;
    var mm = date.getMinutes();
    if (mm<10) mm = '0'+mm;
    var s = date.getSeconds();
    if (s<10) s = '0'+s;
    return '2018-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
}
