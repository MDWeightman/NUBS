class _Screen_GamesList{
	constructor(){
		this.container = null;
	}

	draw(){
		var HTML = '';

		this.container = document.createElement('nubs-games-list');
		FirebaseHelper.getGamesList(this.setGames);

		Application.container.innerHTML = "";
		Application.container.appendChild(this.container);
		Application.Toolbar.setTitle("Games List");
	}

	setGames(gamesList){
		Screen_GamesList.container.gamesList = gamesList;
	}
}
var Screen_GamesList = new _Screen_GamesList();