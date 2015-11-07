'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('SitetypeAddController', function($scope, $state, $http, API_URL, customers){
  $scope.customers = [];
  
  if (customers){
    for (var i=0; i<customers.length; i++){
      var option = {id: customers[i].customerID, value: customers[i].company};
      $scope.customers[i] = option;
    }
  }
  
	$("form").submit(function(){
		$scope.submitSitetype();
		return false;
	});
	$scope.submitSitetype = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/sitetype/add?callback=JSON_CALLBACK",
			data: $scope.sitetype,
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
				
				$state.go('app.sitetype-manager-sitetype-list', {}, { reload: true });
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
		$scope.sitetype = {};
		
		$scope.lock_form = false;
	}

	$scope.resetDefaults();
}).
controller('SitetypeEditController', function($scope, $http, $state, API_URL, data, customers){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.sitetype-manager-sitetype-list', {}, { reload: true });
	}
	
	$scope.customers = [];
  
  if (customers){
    for (var i=0; i<customers.length; i++){
      var option = {id: customers[i].customerID, value: customers[i].company};
      $scope.customers[i] = option;
    }
  }
	
	var sitetype = data.node;
	
	$scope.sitetype = sitetype;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitSitetype();
		return false;
	});
	$scope.submitSitetype = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/sitetype/edit/" + $scope.sitetype.sitetypeID + "?callback=JSON_CALLBACK",
			data: $scope.sitetype,
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
			
			$state.go('app.sitetype-manager-sitetype-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.sitetype = {};
		
		$scope.lock_form = false;
	}
}).
controller('SitetypeListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteSitetype = function(sitetype){
		var sitetypeID = sitetype.sitetypeID;
		if (!sitetypeID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/sitetype/" + sitetypeID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
				  //update the list
				  sitetype.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Sitetype");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editSitetype = function(sitetypeID){
		if (!sitetypeID)
			return;
		$state.go('app.sitetype-manager-edit-a-sitetype', {sitetypeID: sitetypeID});
	}
})