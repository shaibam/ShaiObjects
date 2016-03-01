//children constructors
function test(a,b) {
    this.Document.Logger("test"+arguments);
    this.New(innerTest)
}

function innerTest() {     
    this.Document.Logger("innerTest")
}

var inner_player = function() {
    this.Document.Logger("Player")
    this.New(test,"from inner_player","not using array");
}

//main Document level Consstructors
var Player = function() {
    var T = new Object_Document();
    T.Logger("Player")
    T.child = T.New(inner_player);
    return T;
}

var SpecialPlayer = function() {
    var T = new Object_Document();
    T.Logger("Player")
    T.child = T.New(test,"from special player",1,2,3);
    return T;
}

var _player = new Player();
var _special_player = new SpecialPlayer();


function Parent() {
    var T = new Object_Document();
    T.addChild(T.New(ChildA));
    return T;
}

function ChildA() {
    this.addChild(this.New(ChildB));
}

function ChildB() {    
    this.Test = function() {
        this.Dispatch("SOME_EVENT","string_argument");
    }

}

var _parent = new Parent();
var _ca = _parent.children[0];
var _cb = _ca.children[0];

_parent.Listen("SOME_EVENT",function(event_arguments) {
    console.log(this);
    console.log(event_arguments);
})