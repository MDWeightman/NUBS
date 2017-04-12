// Initialize Firebase
var config = {
	apiKey: "AIzaSyBItAyW3tMMZiqunfq_4RLGyT42DPYafHU",
	authDomain: "nubs-25474.firebaseapp.com",
	databaseURL: "https://nubs-25474.firebaseio.com",
	projectId: "nubs-25474",
	storageBucket: "nubs-25474.appspot.com",
	messagingSenderId: "243967935673"
};
firebase.initializeApp(config);


class _User {
	constructor() {
		this.id = null;
		this.data = null;
		this.accessToken = null;
	}

	setId(id) {
		this.id = id;
	}
	setData(data) {
		this.data = data;
	}

	getFb() {
		FB.api('/me', { fields: 'id,name,birthday,gender,religion,picture,email', access_token: App.user.accessToken }, function(data) {
			console.log(data);
			App.user.update(data);
		});
	}
	getDb(id) {
		App.user.setId(id);
		App.database.ref(`user/${App.user.id}`).on('value', function(snapshot) {
			App.user.setData(snapshot.val());
			App.user.draw();
		});
	}

	update(fbUser) {
		if (fbUser.picture && fbUser.picture.data && fbUser.picture.data.url) {
			fbUser.picture = fbUser.picture.data.url;
		}
		var user = App.database.ref(`user/${App.user.id}`).set(fbUser);
		console.log(user);
	}

	draw() {
		var HTML = `
		<ul class="collection">
			<li class="collection-item avatar ${this.data.gender}">
				<img src="${this.data.picture}" alt="" class="circle">
				<span class="title">${this.data.name}</span>
				<p>
					${this.data.birthday}
					<br/>
					${this.data.religion}
				</p>
			</li>
		</ul>`
		document.getElementById("container").innerHTML = HTML;
	}
}

class _App {

	constructor() {
		this.database = firebase.database();
		this.user = new _User();
	}

	login() {
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			App.accessToken = result.credential.accessToken;
			App.user.getDb(result.user.uid);
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
		});
	}

}

var App = new _App();

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		App.user.getDb(user.uid);
	} else {}
});