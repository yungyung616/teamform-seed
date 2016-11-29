angular.module('teamform-team-app', ['firebase'])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window',
    function($scope, $firebaseObject, $firebaseArray, $window) {
		
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();

	var refPath = "";
	var eventName = getURLParameter("q");	
	var teamName = getURLParameter("tn");

	refPath = "/event/" + eventName + "/team/" + teamName; 
	ref = firebase.database().ref(refPath);
	$scope.teaminfo = $firebaseObject(ref);


	var userid,username,userPath,userref,userObj;





	$scope.jointeam = function()
	{

	    var user = firebase.auth().currentUser;
	    console.log(user);

		if (user != null) {
	        var userPath ="/user/" + user.uid;
	        var userref = firebase.database().ref(userPath);
	        var name;
	        var position;
	        var isPositionEmpty = true;
			var teamPath ="/event/" + eventName +"/team/" + teamName;
			var teamref = firebase.database().ref(teamPath);
			
			var current_team;

	teamref.once("value",function(snapshot)
	{
		console.log(snapshot.val());
		current_team = snapshot.val().NumMembers;
		current_team = current_team +1;
		console.log(current_team);
		teamref.update(
			{
				'NumMembers' : current_team
			}
		);
	})
		
			

	        userref.once("value", function(data) {
	        	console.log(data.val());
	        	name = data.val().name;
	        	position = data.val().position;

	        	if(position=="Forward")
	        	{
	        		if($scope.teaminfo.Forward=="")
	        		{
	        			//Forward position is emtpy
	        		}
	        		else
	        		{
	        			isPositionEmpty = false;
	        		}
	        	}
	        	if(position=="Midfield")
	        	{
	        		if($scope.teaminfo.Midfield=="")
	        		{
	        			//Forward position is emtpy
	        		}
	        		else
	        		{
	        			isPositionEmpty = false;
	        		}
	        	}
	        	if(position=="LeftBack")
	        	{
	        		if($scope.teaminfo.LeftBack=="")
	        		{
	        			//Forward position is emtpy
	        		}
	        		else
	        		{
	        			isPositionEmpty = false;
	        		}
	        	}
	        	if(position=="RightBack")
	        	{
	        		if($scope.teaminfo.RightBack=="")
	        		{
	        			//Forward position is emtpy
	        		}
	        		else
	        		{
	        			isPositionEmpty = false;
	        		}
	        	}        	
	        	if(position=="GoalKeeper")
	        	{
	        		if($scope.teaminfo.GoalKeeper=="")
	        		{
	        			//Forward position is emtpy
	        		}
	        		else
	        		{
	        			isPositionEmpty = false;
	        		}
	        	}

	        	if(isPositionEmpty==true)
	        	{
		        	var eventPath ="/event/" + eventName + "/team/"+teamName+"/members/"+ user.uid;
		        	var eventref = firebase.database().ref(eventPath);

		        	eventref.update({	
		        		'joined' : true, 
		        		'username' : name,
		        		'position' : position
		        	})

		        	if(position!=null)
		        	{
		        		position = position.toString();
		        	}
		        	var positionPath = "/event/"+eventName+"/team/"+teamName;
		        	var positionRef = firebase.database().ref(positionPath);
		        	if(position=="Forward")
		        	{
		        		positionRef.update({	
		        			'Forward' : name
		        		})
		        	}
		        	if(position=="Midfield")
		        	{
		        		positionRef.update({	
		        			'Midfield' : name
		        		})
		        	}
		        	if(position=="LeftBack")
		        	{
		        		positionRef.update({	
		        			'LeftBack' : name
		        		})
		        	}
		        	if(position=="RightBack")
		        	{
		        		positionRef.update({	
		        			'RightBack' : name
		        		})
		        	}        	
		        	if(position=="GoalKeeper")
		        	{
		        		positionRef.update({	
		        			'GoalKeeper' : name
		        		})
		        	}
				}
				else
				{
					//Failure of joining team
					$window.alert("Your position is occupied by other player!!!");
          		    console.log('Your position is occupied by other player!!!');
				}

			});
		} else 
		{
	  			// No user is signed in.
		}

	}

	refPath = "/event/" + eventName + "/team/"+teamName+"/members";
	$scope.members = [];
	$scope.members = $firebaseArray(firebase.database().ref(refPath));

	refPath =  eventName + "/admin";
	retrieveOnceFirebase(firebase, refPath, function(data) {	

		if ( data.child("param").val() != null ) {
			$scope.range = data.child("param").val();
			$scope.param.currentTeamSize = parseInt(($scope.range.minTeamSize + $scope.range.maxTeamSize)/2);
			$scope.$apply(); // force to refresh
			$('#team_page_controller').show(); // show UI
			
		} 
	});

	$scope.input = {
			title: "",
			comment: "",
			date: "",
			likes: 0
		}

	// sync with firebaseArray
	var commentref = firebase.database().ref("/event/"+eventName+"/team/"+teamName+"/comment");
	$scope.comment = $firebaseArray(commentref);

	//Get the data from team tag
	var teamtagPath = "/event/"+eventName+"/team/"+teamName+"/tag";
	var teamtagRef = firebase.database().ref(teamtagPath);
	$scope.teamtag = $firebaseObject(teamtagRef);

	$scope.addComment = function() {
		//Do the team tag function!!!
		var current_number;
		if($scope.input.comment.indexOf('Pass')>= 0||$scope.input.comment.indexOf('pass')>=0||$scope.input.comment.indexOf('Move')>=0||$scope.input.comment.indexOf('move')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().Pass_and_move;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'Pass_and_move' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Give')>= 0||$scope.input.comment.indexOf('give')>=0||$scope.input.comment.indexOf('Go')>=0||$scope.input.comment.indexOf('go')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().Give_and_go;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'Give_and_go' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Long')>= 0||$scope.input.comment.indexOf('long')>=0||$scope.input.comment.indexOf('Through')>=0||$scope.input.comment.indexOf('through')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().The_long_through_ball;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'The_long_through_ball' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Triangular')>= 0||$scope.input.comment.indexOf('triangular')>=0||$scope.input.comment.indexOf('Movement')>=0||$scope.input.comment.indexOf('movement')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().Triangular_movement;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'Triangular_movement' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Swap')>= 0||$scope.input.comment.indexOf('swap')>=0||$scope.input.comment.indexOf('Wing')>=0||$scope.input.comment.indexOf('wing')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().Swapping_of_the_wing_man;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'Swapping_of_the_wing_man' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Side')>= 0||$scope.input.comment.indexOf('side')>=0||$scope.input.comment.indexOf('Overload')>=0||$scope.input.comment.indexOf('overload')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().Strong_side_overloads;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'Strong_side_overloads' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Zone')>= 0||$scope.input.comment.indexOf('zone')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().The_zone_defence;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'The_zone_defence' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Depth')>= 0||$scope.input.comment.indexOf('depth')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().Depth_considerations;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'Depth_considerations' : current_number
				});

			});
		}
		if($scope.input.comment.indexOf('Man')>= 0||$scope.input.comment.indexOf('man')>=0){
			teamtagRef.once("value",function(snapshot)
			{
				console.log(snapshot.val());
				current_number = snapshot.val().The_man_to_man_defence;
				current_number = current_number+1;
				console.log(current_number);
				teamtagRef.update({
						'The_man_to_man_defence' : current_number
				});

			});
		}



		// update the date
		if ( /*$scope.input.title != "" && */$scope.input.comment != "" ) {
			$scope.input.date = new Date().toString();
			$scope.input.likes = 0;
			// add a comment
			$scope.comment.$add($scope.input);
		}
	}
	
		
}]);
function functionName()
{
    $("#output").val("");
};
