'use strict';

/**
 * Author: Batu Date: 2015/10/11
 */
app.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $sessionStorage, $firebaseAuth, FIREBASE_URL, users)
{
	$rootScope.isLoginPage        = true;
	$rootScope.isLightLoginPage   = false;
	$rootScope.isLockscreenPage   = false;
	$rootScope.isMainPage         = false;
	
	$scope.user = {username:"", password:""};
	
	var ref = new Firebase(API_URL);
	var auth = $firebaseAuth(ref);
	
	if ($rootScope.currentUser)
		delete $rootScope.currentUser;
	
	// Reveal Login form
	setTimeout(function(){ $(".fade-in-effect").addClass('in'); }, 1);

	// Validation and Ajax action
	$("form#login").validate({
		rules: {
			username: {
				required: true
			},

			passwd: {
				required: true
			}
		},

		messages: {
			username: {
				required: 'Please enter your username.'
			},

			passwd: {
				required: 'Please enter your password.'
			}
		},

		// Form Processing via AJAX
		submitHandler: function(form)
		{
			showLoadingBar(70); // Fill progress bar to 70% (just a given value)

			var opts = {
				"closeButton": true,
				"debug": false,
				"positionClass": "toast-top-full-width",
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "5000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			};
			
			auth.$authWithPassword($scope.user)
				.then(function(authData){
					alert(authData.uid);
				})
				.catch(function(error){
					switch(error.code){
					case "AUTHENTICATION_DISABLED":
						alert(error.message);
						break;
					case "INVALID_PASSWORD":
						alert(error.message);
						break;
					case "INVALID_USER":
						break;
					}
					console.log(error);
				});

		}
	});

	// Set Form focus
	$("form#login .form-group:has(.form-control):first .form-control").focus();
	
}).controller('LoginLightCtrl', function($scope, $rootScope){
	$rootScope.isLoginPage        = true;
	$rootScope.isLightLoginPage   = true;
	$rootScope.isLockscreenPage   = false;
	$rootScope.isMainPage         = false;
}).controller('LogoutCtrl', function($state, $rootScope, $sessionStorage){
	delete $sessionStorage.currentUser;
	$state.go('login', {}, {reload: true});
})