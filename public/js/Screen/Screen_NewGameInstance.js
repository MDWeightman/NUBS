class _Screen_NewGameInstance{
	constructor(){
		this.container = null;
		this.gameKey = null;
	}

	draw(){
		var HTML = '';

		this.container = document.createElement('nubs-game');
		FirebaseHelper.getGame(this.gameKey, this.setGame);
		FirebaseHelper.getUsers(this.setUsers);

		Application.container.innerHTML = "";
		Application.container.appendChild(Screen_NewGameInstance.container);
		Application.Toolbar.setTitle("New Game");
	}

	setGameKey(gameKey){
		this.gameKey = gameKey;
	}

	setGame(game){
		game.data = FirebaseHelper.objListToArray(game.data);
		Screen_NewGameInstance.container.set('game', game);
	}
	setUsers(users){
		Screen_NewGameInstance.container.set('players', users);
	}
}
var Screen_NewGameInstance = new _Screen_NewGameInstance();