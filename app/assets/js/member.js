/*// inject firebase service
var app = angular.module("position", ["firebase"]); 

app.controller("positionSubmit", 

  // Implementation the todoCtrl 
  function($scope, $firebaseArray) {

    $scope.input = {
      title: "Testing the Position",
      position: ""
    }
    // sync with firebaseArray
    var ref = firebase.database().ref("position");
    $scope.questions = $firebaseArray(ref);

    $scope.addPosition = function() {
      
      // update the date
      if ( $scope.input.title != "") {
        
      }
    }

  }
);

// Choose the position
$(function () {
    $('#buttonFoward').on('click', function () {
        var text = $('#text');
        text.val('Forward');    
    });

    $('#buttonMidfield').on('click', function () {
        var text = $('#text');
        text.val('Midfield');    
    });

    $('#buttonBack').on('click', function () {
        var text = $('#text');
        text.val('Back');    
    });

    $('#buttonGoalkeeper').on('click', function () {
        var text = $('#text');
        text.val('Goalkeeper');    
    });
});
*/


angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
  
  // TODO: implementation of MemberCtrl
  
  
  // Call Firebase initialization code defined in site.js
  initalizeFirebase();
  
  $scope.userID = "";
  $scope.userName = ""; 
  $scope.teams = {};
  $scope.param = {};
  
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var userPath = "/user/" + user.uid;
        var userref = firebase.database().ref(userPath);
		$scope.userID = user.uid;
        $scope.userObj = $firebaseObject(userref);
		
		 userref.on("value", function(snapshot) {
  				console.log(snapshot.val());
  				teamleader = snapshot.val().name;
  				console.log(teamleader);
		}, function (errorObject) {
  			console.log("The read failed: " + errorObject.code);
		});
		
		$(document).ready(function(){
		$("#hide").click(function(){
				$("p").hide();
			});
			$("#show").click(function(){
				$("p").show();
			});
		});

    } else {
    // No user is signed in.
    }
    });

    $scope.addPosition = function()
    {
<<<<<<< HEAD
		var user = firebase.auth().currentUser;
	    console.log(user);
      var userPath ="/user/" + userID;
=======
      var userPath ="/user/" + $scope.userID;
>>>>>>> 1efe056dc144dbdfc06bdad74f386b3d0ecc523a
      var userRef = firebase.database().ref(userPath);

      userRef.update({
        'position' : position
    })
    }
	
	/*$scope.addPosition = function()
    {
		var user = firebase.auth().currentUser;
      var refPath ="/user/" + ;
      var userRef = firebase.database().ref(userPath);
		
		//var userRef = firebase.database().ref(userPath);

userRef.update({
  position : $scope.position
}).then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
});
    }
	
	var name;
	
	if eventName.team.member.userName="Obj.name"
	
	var reffPath, ref, eventName;

	eventName = getURLParameter("q");
	reffPath = "/event/" + eventName + "/param";	
	ref = firebase.database().ref(reffPath);
		$scope.param = $firebaseObject(ref);

	$scope.param.$loaded()
		.then( function(data) {
			// Fill in some initial values when the DB entry doesn't exist			
			
			// Enable the UI when the data is successfully loaded and synchornized
			$('#member_controller').show(); 

			var user = firebase.auth().currentUser;
			
			$scope.param.EventName = eventName;		
		}) 
		.catch(function(error) {
			// Database connection error handling...
			//console.error("Error:", error);
		}); */
 
  $scope.loadFunc = function() {
    var userID = $scope.userID;
    if ( userID !== '' ) {
      
      var refPath ="/user/" + userID;
      retrieveOnceFirebase(firebase, refPath, function(data) {
                
        if ( data.child("name").val() != null ) {
          $scope.userName = data.child("name").val();
        } else {
          $scope.userName = "";
        }
        
         console.log($scope.userName);
        if (data.child("selection").val() != null ) {
          $scope.selection = data.child("selection").val();
        }
        else {
          $scope.selection = [];
        }
        $scope.$apply();
      });
    }
  }
  
  $scope.saveFunc = function() {
    var userID = $.trim( $scope.userID );
    var userName = $.trim( $scope.userName );
    
    if ( userID !== '' && userName !== '' ) {
                  
      var newData = {       
        'name': userName,
        'selection': $scope.selection
      };
      
      var refPath = getURLParameter("q") + "/member/" + userID; 
      var ref = firebase.database().ref(refPath);
      
      ref.set(newData, function(){
        // complete call back
        //alert("data pushed...");
        
        // Finally, go back to the front-end
        window.location.href= "index.html";
      });    
    }
  }
  
  $scope.refreshTeams = function() {
    var refPath = getURLParameter("q") + "/team"; 
    var ref = firebase.database().ref(refPath);
    
    // Link and sync a firebase object
    $scope.selection = [];    
    $scope.toggleSelection = function (item) {
      var idx = $scope.selection.indexOf(item);    
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      else {
        $scope.selection.push(item);
      }
    }
  
    $scope.teams = $firebaseArray(ref);
    $scope.teams.$loaded()
      .then( function(data) {      
      }) 
      .catch(function(error) {
        // Database connection error handling...
        //console.error("Error:", error);
      });
  }
  
  $scope.refreshTeams(); // call to refresh teams...
    
}]);
