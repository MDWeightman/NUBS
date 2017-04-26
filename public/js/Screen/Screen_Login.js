class _Screen_Login{
	constructor(){
		this.container = null;
	}

	draw(){
		var HTML = '';

		this.container = document.createElement('nubs-login');

		Application.container.innerHTML = "";
		Application.container.appendChild(this.container);
		Application.Toolbar.setTitle("");
	}
}
var Screen_Login = new _Screen_Login();