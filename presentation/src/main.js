
BUS.__addEventListener({
    __ON_GAME_LOADED: function(){
        
        consoleLog('GAME_LOADED');
        
        return 1;
    },
    
    EDITOR_PREPARED: function(){
         
        
    },
    
    PROJECT_OPENED: function(){
        BUS.__post('ALL_READY');
    }
    
} );


        
        
