class _User{
	constructor(){
		this.accessToken = null;
		this.uid = null;
	}

	setUid(uid){
		User.uid = uid;
	}
	setAccessToken(token){
		User.accessToken = token;
		User.getFbUser();
	}

	getFbUser(){		
			FB.api('/'+this.uid, { fields: 'id,name,birthday,gender,religion,picture,email', access_token: User.accessToken }, function(data) {
					User.update(data);
			});
	}

	update(user){
			if (user.picture && user.picture.data && user.picture.data.url) {
					user.photoUrl = user.picture.data.url;
					delete(user.picture);
			}
			//var user = App.database.ref(`user/${user.uid}`).set(user);
			console.log(user);
	}

}

var User = new _User();