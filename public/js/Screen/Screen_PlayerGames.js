class _Screen_PlayerGames{
	constructor(){
		this.container = null;
	}

	draw(){
		var HTML = '';

		this.container = document.createElement('nubs-games-player');
		if(User.data.sessions && User.data.sessions.pending){
			FirebaseHelper.getGameSessions(User.data.sessions.pending, this.setPending);
		}
		else{
			this.setPending([]);
		}
		if(User.data.sessions && User.data.sessions.played){
			FirebaseHelper.getGameSessions(User.data.sessions.played, this.setPlayed);
		}
		else{
			this.setPlayed([]);
		}

		Application.container.innerHTML = "";
		Application.container.appendChild(this.container);
		Application.Toolbar.setTitle("Games");
	}

	setPending(games){
		Screen_PlayerGames.container.set('pending', games);
	}
	setPlayed(games){
		Screen_PlayerGames.container.set('played', games);
	}
}
var Screen_PlayerGames = new _Screen_PlayerGames();