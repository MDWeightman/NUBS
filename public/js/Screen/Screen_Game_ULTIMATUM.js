class _Screen_Game_ULTIMATUM{
	constructor(){
		this.container = null;
	}

	draw(){
		var HTML = '';

		this.container = document.createElement('nubs-game-ULTIMATUM');
		Application.container.innerHTML = "";
		Application.container.appendChild(this.container);
	}

	setUp(session){		
		if(session){
			FirebaseHelper.getGameInstance(session.gameKey, this.setGameInstance);
			this.setSession(session);
			Application.Toolbar.setTitle(session.gameName);
		}
	}
	getGame(gameKey){
		FirebaseHelper.getGame(gameKey, this.setGame);
	}

	setGame(game){
		//game.data = FirebaseHelper.objListToArray(game.data);
		Screen_Game_ULTIMATUM.container.set('game', game);
	}
	setGameInstance(gameInstance){
		//gameInstance.data = FirebaseHelper.objListToArray(gameInstance.data);
		Screen_Game_ULTIMATUM.container.set('gameInstance', gameInstance);
		Screen_Game_ULTIMATUM.getGame(gameInstance.gameKey);
	}
	setSession(session){
		Screen_Game_ULTIMATUM.container.set('session', session);
	}
}
var Screen_Game_ULTIMATUM = new _Screen_Game_ULTIMATUM();