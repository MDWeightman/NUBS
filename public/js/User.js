class _User{
	constructor(){
		this.accessToken = null;
		this.fbUid = null;
		this.uid = null;
		this.data = null;
		this.admin = false;
	}

	setUser(user){
		User.setUid(user.uid);
		User.setFbUid(user.providerData[0].uid);
		user.getToken().then(function(data) {
			User.setAccessToken(data);
		});
		FirebaseHelper.getUser(User.uid, User.setUserData);
		this.setAppUser(user);
		User.isAdmin();
	}
	setUserData(user){
		User.data = user;
	}
	isAdmin(callback){
		FirebaseHelper.isAdmin(this.uid, this.setIsAdmin);
	}

	setIsAdmin(admin){
		User.admin = admin;
		document.getElementById("nubs-toolbar").set("admin", admin);
	}
	setUid(uid){
		User.uid = uid;
	}
	setFbUid(uid){
		User.fbUid = uid;
	}
	setAccessToken(token){
		User.accessToken = token;
		User.getFbUser();
	}
	setAppUser(user){
		if(document.querySelector("nubs-drawer-login")){
			document.querySelector("nubs-drawer-login").set("user", user);
		}
		if(document.querySelector("nubs-toolbar-login")){		
			document.querySelector("nubs-toolbar-login").set("user", user);
		}
	}

	getFbUser(){		
			FB.api('/'+this.fbUid, { fields: 'id,name', access_token: User.accessToken }, function(data) {
					User.update(data);
			});
	}

	update(user){
			if (user && user.picture && user.picture.data && user.picture.data.url) {
					user.photoUrl = user.picture.data.url;
					delete(user.picture);
			}
			//var user = App.database.ref(`user/${user.uid}`).set(user);
			console.log(user);
	}

}

var User = new _User();