class _FirebaseHelper{

	constructor(){
		this.database = firebase.database();
	}

	getGamesList(callback){
			FirebaseHelper.database.ref(`game`).once('value', function(snapshot) {
					callback(FirebaseHelper.objListToArray(snapshot.val()));
			});
	}
	getGame(gameKey, callback){
			FirebaseHelper.database.ref(`game/${gameKey}`).once('value', function(snapshot) {
					callback(snapshot.val());
			});
	}
	getGameInstance(gameKey, callback){
			FirebaseHelper.database.ref(`game_instance/${gameKey}`).once('value', function(snapshot) {
					callback(snapshot.val());
			});
	}
	getGameSessions(gameKeys, callback){
			FirebaseHelper.database.ref(`session`).once('value', function(snapshot) {
					var obj = {};
					for(var key in gameKeys){
						obj[key] = snapshot.val()[key];
						obj[key].player = gameKeys[key];
					}
					callback(FirebaseHelper.objListToArray(obj));
			});
	}
	getUser(uid, callback){
			return FirebaseHelper.database.ref(`authentication/users/${uid}`).once('value', function(snapshot) {
					callback(snapshot.val());
			});
	}
	getUsers(callback){
			FirebaseHelper.database.ref(`authentication/users`).once('value', function(snapshot) {
					callback(FirebaseHelper.objListToArray(snapshot.val()));
			});
	}
	isAdmin(uid, callback){
			var ref = FirebaseHelper.database.ref('authentication/admins/'+uid).once('value').then(function(snapshot) {
				callback(snapshot.val());
			});
	}
	getFbUser(uid){		
		FB.api('/me', { fields: 'id,name,first_name,last_name,link,gender,birthday,locale,likes,picture,timezone,updated_time,verified' }, function(data) {
			User.update(data);
		});
	}

	notifyFaceBookUser(){
		FB.api('10154274837596681/notifications', {		
			//access_token: '1758235390857038|c568abc88bd94a9dfef7de0283653e52',
			access_token: User.accessToken,
			href: 'google.com', 
			template: 'You have people waiting to play with you, play now!'
		},function (response) {
			console.log(response);
		});

	}

	signIn(){
		// var provider = new firebase.auth.FacebookAuthProvider();
		// provider.addScope('user_birthday');
		// firebase.auth().signInWithRedirect(provider)

		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			//User.setAccessToken(result.credential.accessToken);
			//var user = result.user;
			User.setUser(result.user);
			setTimeout(function(){
				Application.start();
			},3000);
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
		});
	}
	
	createuser(o){
			this.database.ref(`authentication/users`).push().set({
				"birthday":o.birthday,
				"email":o.email,
				"gender":o.gender,
				"id":"10154274837596681",
				"name":o.name,
				"photoUrl":"https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-1/c165.44.550.550/s160x160/625540_10100486035140478_1694508461_n.jpg?oh=60284e04035565f4f2c8629390226174&oe=5991A701",
				"religion":"Christian",
				"sessions":{"KhiCGwRjRkWTMczaqwX":"B"},
			});
	}
	
	updateUser(uid, user){
		return FirebaseHelper.database.ref('/authentication/users/' + uid).update(user);
	}

	createGameInstance(game){
				var updates = {};
				var gameInstance = FirebaseHelper.database.ref('/game_instance').push(); console.log("gameInstance", gameInstance);
				var sessions = {}
				var timestamp = new Date().getTime();

				for(var p = 0; p < game.playersA.length; p++){
						var playerA = game.playersA[p];
						var playerB = game.playersB[p];
						var session = FirebaseHelper.database.ref('/session').push();
						sessions[session.key] = session.key;
						updates['/session/' + session.key] = {
								gameKey: gameInstance.key,
								gameName: game.name,
								complete: false,
								turn: "A",
								timestamp: timestamp,
								players: {
										A: playerA.key,
										B: playerB.key
								}
						};
						updates['/authentication/users/' + playerA.key + '/sessions/pending/'+ session.key] = "A";
						updates['/authentication/users/' + playerB.key + '/sessions/pending/'+ session.key] = "B";
				}
				
			updates['/game_instance/' + gameInstance.key] = {
						gameKey: game.gameKey,
						gameName: game.name,
						data: game.data,
						timestamp: timestamp,
						sessions: sessions,
						complete: false
				};

				
			return FirebaseHelper.database.ref().update(updates);
		}

		playerPlayTurn(turn){
				var updates = {};
				var player = turn.session.players[turn.session.player];
				var nextPlayer = null; 
				var timestamp = new Date().getTime();
				switch(turn.session.player){
					case "A":
							nextPlayer = "B"
						break;
					case "B":
						if(turn.game.players > 2){
							nextPlayer = "C"
						}
						break;
					case "C":
						if(turn.game.players > 3){
							nextPlayer = "D"
						}
						break;
				}
				if(nextPlayer){
					updates[`/session/${turn.session.key}/turn`] = nextPlayer;
				}
				else{
					updates[`/session/${turn.session.key}/complete`] = true;
				}

				updates[`/session/${turn.session.key}/outcome/${turn.session.player}`] = turn.outcome;
				
				updates[`/authentication/users/${player}/sessions/pending/${turn.session.key}`] = null;
				updates[`/authentication/users/${player}/sessions/played/${turn.session.key}`] = {
					timestamp: timestamp,
					player: turn.session.player
				}
				FirebaseHelper.database.ref().update(updates).then(function(){						
					FirebaseHelper.getUser(User.uid, User.setUserData).then(function(){
						Application.Screen.set(Screen_PlayerGames);
					});
				});
		}

	objListToArray(objList){
		var arr = [];
		for(var key in objList){
			var obj = objList[key];
			obj.key = key;
			arr.push(obj);
		}
		return arr;
	}
	
	arrayListToObject(arr){
        var obj = {};
        for(var i = 0; i < arr.length; i++){
            var item = arr[i];
            var key = item.key;
            delete item.key;
            obj[key] = item;
        }
        return obj;
    }

	shuffleArray(arr) {
			for (var i = arr.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
			}
			return arr;
	}

	getDate(timestamp) {
			var date = new Date(timestamp);
			var seconds = Math.floor((new Date() - date) / 1000);
			if (seconds < 3600) {
					var minutes = Math.floor(seconds / 60)
					return (minutes > 1) ? minutes + " minutes ago" : "1 minute ago";
			} else if (seconds < 86400) {
					var hours = Math.floor(seconds / 3600)
					return (hours > 1) ? hours + " hours ago" : "1 hour ago";
			} else {
					var day = date.getDate();
					var monthIndex = date.getMonth();
					var year = date.getFullYear();
					return day + ' ' + monthNames[monthIndex] + ' ' + year;
			}
	}

	// checkLoginState(event) {
	// 	if (event.authResponse) {
	// 		// User is signed-in Facebook.
	// 		var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
	// 			unsubscribe();
	// 			// Check if we are already signed-in Firebase with the correct user.
	// 			if (!isUserEqual(event.authResponse, firebaseUser)) {
	// 				// Build Firebase credential with the Facebook auth token.
	// 				var credential = firebase.auth.FacebookAuthProvider.credential(
	// 						event.authResponse.accessToken);
	// 				// Sign in with the credential from the Facebook user.
	// 				firebase.auth().signInWithCredential(credential).catch(function(error) {
	// 					// Handle Errors here.
	// 					var errorCode = error.code;
	// 					var errorMessage = error.message;
	// 					// The email of the user's account used.
	// 					var email = error.email;
	// 					// The firebase.auth.AuthCredential type that was used.
	// 					var credential = error.credential;
	// 					// ...
	// 				});
	// 			} else {
	// 				// User is already signed-in Firebase with the correct user.
	// 			}
	// 		});
	// 	} else {
	// 		// User is signed-out of Facebook.
	// 		firebase.auth().signOut();
	// 	}
	// }

}

var FirebaseHelper = new _FirebaseHelper();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
		User.setUser(user);
  }
	
	setTimeout(function(){
		Application.start();
	},5000);
});