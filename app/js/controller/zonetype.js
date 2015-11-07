'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('ZonetypeAddController', function($scope, $state, $http, API_URL){
	$("form").submit(function(){
		$scope.submitZonetype();
		return false;
	});
	$scope.submitZonetype = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/zonetype/add?callback=JSON_CALLBACK",
			data: $scope.zonetype,
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
				
				$state.go('app.zonetype-manager-zonetype-list', {}, { reload: true });
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
	  $scope.zonetype = {replenSource:1};
		
		$scope.lock_form = false;
	}

	$scope.resetDefaults();
}).
controller('ZonetypeEditController', function($scope, $http, $state, API_URL, data){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.zonetype-manager-zonetype-list', {}, { reload: true });
	}
	
	$scope.zonetype = data.node;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitZonetype();
		return false;
	});
	$scope.submitZonetype = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/zonetype/edit/" + $scope.zonetype.zonetypeID + "?callback=JSON_CALLBACK",
			data: $scope.zonetype,
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
			
			$state.go('app.zonetype-manager-zonetype-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.zonetype = {};
		
		$scope.lock_form = false;
	}
}).
controller('ZonetypeListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteZonetype = function(zonetype){
		var zonetypeID = zonetype.zonetypeID;
		if (!zonetypeID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/zonetype/" + zonetypeID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
				  //update the list
				  zonetype.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Zonetype");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editZonetype = function(zonetypeID){
		if (!zonetypeID)
			return;
		$state.go('app.zonetype-manager-edit-a-zonetype', {zonetypeID: zonetypeID});
	}
})