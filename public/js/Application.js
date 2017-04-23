class _Application{

	constructor(){
		this.container = document.getElementById('main-content');
		this.Screen = new _Screen();
		this.Toolbar = document.getElementById('nubs-toolbar');
	}

	start(){
		this.Screen.set(Screen_GamesList);
	}

}

var Application = new _Application();
setTimeout(function(){
	Application.start();
},400);