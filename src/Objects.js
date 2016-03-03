(function(win) {
    //Checks if the Classes exist on the page
    if (!win.Object_Document_flag) {
        win.Object_Document_flag = true;
        win.Object_Document = Object_Document;
        win.New = New;
    }
    
    //Used to combine/extend objects
    function extend(destination, source) {
      for (var k in source) {
        if (source.hasOwnProperty(k)) {
          destination[k] = source[k];
        }
      }
      return destination; 
    }
    
    function ShaiObject() {
        var id = parseInt(Math.random()*10000);
        Object.defineProperty(this,'id',{
            get: function () {
                return id;
            }
        });

        this.children = [];
        this.dispatched_list = [];
        this.listener_list = [];
        this.callback_list = [];
        this.stop = false;     
    }

    ShaiObject.prototype.New = New;
    ShaiObject.prototype.Dispatch = Dispatch;
    ShaiObject.prototype.Detach = Detach;
    ShaiObject.prototype.Listen = Listen;
    ShaiObject.prototype.listener_list = Listen;
    ShaiObject.prototype.addChild = addChild;
    ShaiObject.prototype.stopBubble = function() {
        this.stop = true;
    }
    
    //Main Document Class
    function Object_Document() {
        ShaiObject.call(this);
    }
    Object_Document.prototype = Object.create(ShaiObject.prototype);
    
    Object_Document.prototype.Logger = function() {
        var s;
        for (var i in arguments ) {                
            s =  arguments[i];
            var s= new Date().toLocaleString()+" : " +s;
            this.log = (this.log ? this.log+"<br/>"+(s.toString()) : s);            
        }
    }

    //Object_Document.prototype = Object.create(ShaiObject.prototype);

    //Objec creation Class
    function New(_obj){
        //var T = this;
        _obj.prototype = Object.create(ShaiObject.prototype);
        _obj.prototype.Document = (this.constructor == Object_Document ? this : this.Document);
        /*_obj.prototype.New = this.New;
        _obj.prototype.id = parseInt(Math.random()*10000);  
        _obj.prototype.children = [];
        extend(_obj.prototype,Eventor.prototype);*/
        /*T.Obj = new (Function.prototype.bind.apply(_obj, arguments));
        return T.Obj;*/     
        var o = new (Function.prototype.bind.apply(_obj, arguments));
        ShaiObject.call(o);
     
        return o;
    }
    
    //Methods
    function Dispatch(event_name,args) {      
        this.dispatched_list.push(event_name+"."+this.id);
        var idx = this.listener_list.indexOf(event_name+"."+this.id);
        while (idx!=-1) {
            //this.callback_list[idx]();            
            this.callback_list[idx].apply(this,[args]);
            idx = this.listener_list.indexOf(event_name+"."+this.id,idx+1);
        }
        //trigger event on parent unless the "stop" flag is raised from inside the child hadler
        if (this.parent && !this.stop)
            this.parent.Dispatch(event_name,args);
        else 
            this.stop = false;
    }
    
    function Detach(event_name) {
        var idx = this.listener_list.indexOf(event_name+"."+this.id);
        while (idx!=-1) {
            this.listener_list.splice(idx,1);
            this.callback_list.splice(idx,1);
            idx = this.listener_list.indexOf(event_name+"."+this.id,idx+1);
        }
    }

    function Listen(event_name,callback) {        
        this.listener_list.push(event_name+"."+this.id)
        this.callback_list.push(callback)        
    }

     function addChild(_obj) { 
        //this.children=[];
        _obj.parent = this;  
        this.children.push(_obj);
     
    }

})(window);