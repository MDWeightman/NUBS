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


class _App {

	constructor() {
		this.database = firebase.database();
		this.userId = null;
		this.user = null;
		this.accessToken = null;
	}

	getFBUser() {
		FB.api('/me', {fields: 'id,name,birthday,gender,religion,picture,email', access_token: App.accessToken}, function(data) {
			console.log(data);
			App.updateUser(data);
		});
	}
	getUser() {
		this.database.ref(`user/${this.userId}`).on('value', function(snapshot) {
			App.user = snapshot.val();
			App.drawUser();
		});
	}

	updateUser(fbUser){
		if(fbUser.picture && fbUser.picture.data && fbUser.picture.data.url){
			fbUser.picture = fbUser.picture.data.url;
		}
		var user = this.database.ref(`user/${this.userId}`).set(fbUser);
		console.log(user);
	}

	login() {
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			App.accessToken = result.credential.accessToken;
			App.userId = result.user.uid;
			App.displayName = result.user.displayName;
			App.getUser();
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
		});
	}

	drawUser(){		
		var HTML = `
		<ul class="collection">
			<li class="collection-item avatar ${this.user.gender}">
				<img src="${this.user.picture}" alt="" class="circle">
				<span class="title">${this.user.name}</span>
				<p>
					${this.user.birthday}
					<br/>
					${this.user.religion}
				</p>
			</li>
		</ul>`
		document.getElementById("container").innerHTML = HTML;
	}

	sendInvitation(userId){

	}

}

var App = new _App();