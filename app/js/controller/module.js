'use strict';

/**
 * Author: Batu
 * Date: 2015/10/11
 */

app.controller('ModuleAddController', function($scope, $state, $http, API_URL){
	$("form").submit(function(){
		$scope.submitModule();
		return false;
	});
	$scope.submitModule = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/module/add?callback=JSON_CALLBACK",
			data: $scope.module,
			crossDomain : true,
		    xhrFields: {
		        withCredentials: true
		    }
		}).success(function(data, status, headers, cfg){
			if (data.status == 0){
				try{
					alert("Successfully Added");
				}catch(error){
				}
				
				$state.go('app.module-manager-module-list', {}, { reload: true });
			}else{
				try{
					alert(data.message);
				}catch(error){
				}
			}
			
			$scope.lock_form = false;
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.module = {};
		
		$scope.lock_form = false;
	}

	$scope.resetDefaults();
}).
controller('ModuleEditController', function($scope, $http, $state, API_URL, data){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.module-manager-module-list', {}, { reload: true });
	}
	
	var module = data.node;
	
	$scope.module = module;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitModule();
		return false;
	});
	$scope.submitModule = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/module/edit/" + $scope.module.moduleID + "?callback=JSON_CALLBACK",
			data: $scope.module,
			crossDomain : true,
		    xhrFields: {
		        withCredentials: true
		    }
		}).success(function(data, status, headers, cfg){
			if (data.status == 0){
				try{
					alert("Successfully Edited");
				}catch(error){
				}
			}else{
				try{
					alert(data.message);
				}catch(error){
				}
			}
			
			$state.go('app.module-manager-module-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.module = {};
		
		$scope.lock_form = false;
	}
}).
controller('ModuleListController', function($state, $scope, $http, data, API_URL){
	$scope.data = data;
	
	$scope.deleteModule = function(module){
		var moduleID = module.moduleID;
		if (!moduleID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/module/" + moduleID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
					//update the list
					module.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Module");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editModule = function(moduleID){
		if (!moduleID)
			return;
		$state.go('app.module-manager-edit-a-module', {moduleID: moduleID});
	}
})