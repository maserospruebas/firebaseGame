//Login
var provider = new firebase.auth.GoogleAuthProvider();

$('#login').click(function(){
	$(this).hide();
  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
    	var user = {
    		uid:result.user.uid,
    		displayName:result.user.displayName,
    		photoURL:result.user.photoURL,
    		puntos:0
    	}
    	//data["users"].push(user)
    	console.log(result.user.photoURL);
    	root.show();
    	puchame.show();
    	//DB
    	guardarUser(user);
    	//local:
    	localUser = user;

  });
});

//guardar en base de datos
function guardarUser(user){
	firebase.database().ref("hub/" + user.uid)
	.set(user)
	.then(s=>{
		console.log("guardé", s);
	});
}

//Leer de la base de datos
firebase.database().ref("hub")
.on("child_added", traerUsuarios);

firebase.database().ref("hub")
.on("child_changed", traerUsuarios);

function traerUsuarios(s){
	var user = s.val();
	var nueva = data["users"].filter(function(u){
		return u.uid !== user.uid; 
	});
	nueva.push(user);
	data["users"] = nueva.reverse();
	root.html(compile(data));
}



//cambiar puntos y actualizar lista
$("#puchame").click(function(){

	if(localUser.puntos >= 100) return;
	localUser["puntos"]+=1;
	firebase.database().ref("hub/" + localUser.uid)
	.set(localUser);
	if(localUser.puntos >= 100){
		setGanador(localUser);
	}
});

//ganador
function setGanador(user){
	firebase.database().ref("ganador")
	.set(user);
	console.log("llegue");
}

firebase.database().ref("ganador")
.on("value", function(s){
	console.log("added", s.val());
	$("#ganador").append("<img src='"+s.val().photoURL+"'/>");
	$("#puchame").hide();
});

$("#reset").click(function(){
	firebase.database().ref("ganador").set(null);
});

//Template
var root = $("#root");
var template = $("#template").html();
var compile = Handlebars.compile(template);
var data = {
	users : [
		{
	uid:0,
	displayName:"Fred Flintstone",
  	photoURL:"http://elpopular.mx/archivos/fotos/notas/2017/10/12/eduardo-yanez-se-disculpa-por-agredir-a-reportero-093084cd41be125f94b78451cbad5ab5.jpg",
    puntos:50,
				}
			]
		}
var puchame = $("#puchame").hide();
var localUser = {};

//Main
root.append(compile(data));
root.hide();