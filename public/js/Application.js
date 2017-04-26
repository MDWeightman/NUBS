class _Application{

	constructor(){
		this.container = document.getElementById('main-content');
		this.Screen = new _Screen();
		this.Toolbar = document.getElementById('nubs-toolbar');
	}

	start(){
		if(User.admin){
			this.Screen.set(Screen_GamesList);
		}
		else if(!User.uid){
			this.Screen.set(Screen_Login);
		}
	}

}

var Application = new _Application();
setTimeout(function(){
	Application.start();
},3000);