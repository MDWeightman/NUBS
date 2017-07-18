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
		else{
			this.Screen.set(Screen_PlayerGames);
		}
	}

}

var Application = new _Application();