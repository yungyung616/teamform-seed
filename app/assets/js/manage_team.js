angular.module('teamform-manage_team-app', ['firebase'])
.controller('ManageTeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	initalizeFirebase();
	var teamleader;

	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        var userPath = "/user/" + user.uid;
        var userref = firebase.database().ref(userPath);

        userref.on("value", function(snapshot) {
  				console.log(snapshot.val());
  				teamleader = snapshot.val().name;
  				console.log(teamleader);
		}, function (errorObject) {
  			console.log("The read failed: " + errorObject.code);
		});

    } 
    else {}
    });

	
	$scope.teaminfo = {TeamLeader:"", Description:"", Forward:"", Midfield:"", LeftBack:"", RightBack:"", Goalkeeper:""};
	$scope.input = {teamLeader: teamleader, forward:"", midfield:"", leftBack:"", rightBack:"", goalkeeper:""};

	$scope.teamtaginfo = {Pass_and_move:"", Give_and_go:"", The_long_through_ball:"", Triangular_movement:"", Swapping_of_the_wing_man:"", Strong_side_overloads:"", The_zone_defence:"", Depth_considerations:"", The_man_to_man_defence:""};
	$scope.teamtaginput = {pass_and_move:0, give_and_go:0, the_long_through_ball:0, triangular_movement:0, swapping_of_the_wing_man:0, strong_side_overloads:0, the_zone_defence:0, depth_considerations:0, the_man_to_man_defence:0};

	var eventName, teamName;
	eventName = getURLParameter("q");
	teamName = getURLParameter("tn");

	var eventPath ="/event/" + eventName +"/param";
	var eventref = firebase.database().ref(eventPath);
	var current_team;

	eventref.once("value",function(snapshot)
	{
		console.log(snapshot.val());
		current_team = snapshot.val().No_of_Team;
		current_team = current_team +1;
		console.log(current_team);
		eventref.update(
			{
				'No_of_Team' : current_team
			}
		);

	}, function (errorObject) {
  			console.log("The read failed: " + errorObject.code);
	});

	var ref, refPath;
	$scope.EventName = eventName;
	$scope.TeamName = teamName;

	//Get The team info
	refPath = "/event/" + eventName + "/team/" + teamName; 
	ref = firebase.database().ref(refPath);
	$scope.teaminfo = $firebaseObject(ref);

	ref.set({
		TeamName: teamName,
		TeamLeader: "",
		Description:"",
		Forward:"",
		Midfield:"",
		LeftBack:"",
		RightBack:"",
		GoalKeeper:"",
		NumMembers: 0

	});

	$scope.teaminfo.$loaded()
		.then( function(data) {
			// Fill in some initial values when the DB entry doesn't exist			
			// Enable the UI when the data is successfully loaded and synchornized
			//$('#manage_team_page_controller').show(); 
			$scope.teaminfo.TeamLeader = $scope.input.teamLeader;
			$scope.teaminfo.Description = $scope.input.description;
			$scope.teaminfo.Forward = $scope.input.forward;
			$scope.teaminfo.Midfield = $scope.input.midfield;
			$scope.teaminfo.LeftBack = $scope.input.leftBack;
			$scope.teaminfo.RightBack = $scope.input.rightBack;
			$scope.teaminfo.Goalkeeper = $scope.input.goalkeeper;
		}) 
		.catch(function(error) {
			// Database connection error handling...
			//console.error("Error:", error);
		});
	
	//Get the  team tag info
	var tagRef, tagRefPath;
	tagRefPath = "/event/" + eventName + "/team/" + teamName + "/tag";
	tagRef = firebase.database().ref(tagRefPath);
	$scope.teamtaginfo = $firebaseObject(tagRef);

	tagRef.set({
		Pass_and_move:"",
		Give_and_go:"",
		The_long_through_ball:"",
		Triangular_movement:"",
		Swapping_of_the_wing_man:"",
		Strong_side_overloads:"",
		The_zone_defence:"",
		Depth_considerations:"",
		The_man_to_man_defence:""
	})

	$scope.teamtaginfo.$loaded()
		.then( function(data) {
			/*
			$scope.teamtaginfo.Pass_and_move = $scope.teamtaginput.pass_and_move;
			$scope.teamtaginfo.Give_and_go = $scope.teamtaginput.give_and_go;
			$scope.teamtaginfo.The_long_through_ball = $scope.teamtaginput.the_long_through_ball;
			$scope.teamtaginfo.Triangular_movement = $scope.teamtaginput.triangular_movement;
			$scope.teamtaginfo.Swapping_of_the_wing_man = $scope.teamtaginput.swapping_of_the_wing_man;
			$scope.teamtaginfo.Strong_side_overloads = $scope.teamtaginput.strong_side_overloads;
			$scope.teamtaginfo.The_zone_defence = $scope.teamtaginput.the_zone_defence;
			$scope.teamtaginfo.Depth_considerations = $scope.teamtaginput.depth_considerations;
			$scope.teamtaginfo.The_man_to_man_defence = $scope.teamtaginput.the_man_to_man_defence;
			*/
			$scope.teamtaginfo.Pass_and_move = 0;
			$scope.teamtaginfo.Give_and_go = 0;
			$scope.teamtaginfo.The_long_through_ball = 0;
			$scope.teamtaginfo.Triangular_movement = 0;
			$scope.teamtaginfo.Swapping_of_the_wing_man = 0;
			$scope.teamtaginfo.Strong_side_overloads = 0;
			$scope.teamtaginfo.The_zone_defence = 0;
			$scope.teamtaginfo.Depth_considerations = 0;
			$scope.teamtaginfo.The_man_to_man_defence = 0;
		})
		.catch(function(error) {

		});

	$scope.saveFunc = function() {
		$scope.teaminfo.$save();
		$scope.teamtaginfo.$save();
		// Finally, go back to the front-end
		window.location.href= "team.html?q=" + eventName +"&tn=" + teamName;
	}


	$scope.processRequest = function(r) {
		//$scope.test = "processRequest: " + r;
		
		if ( 
		    $scope.param.teamMembers.indexOf(r) < 0 && 
			$scope.param.teamMembers.length < $scope.param.currentTeamSize  ) {
				
			// Not exists, and the current number of team member is less than the preferred team size
			$scope.param.teamMembers.push(r);
			
			$scope.saveFunc();
			$scope.saveFuncTeamTag();
		}
	}
	
	$scope.removeMember = function(member) {
		
		var index = $scope.param.teamMembers.indexOf(member);
		if ( index > -1 ) {
			$scope.param.teamMembers.splice(index, 1); // remove that item
			
			$scope.saveFunc();
			$scope.saveFuncTeamTag();
		}
		
	}

	}
]);