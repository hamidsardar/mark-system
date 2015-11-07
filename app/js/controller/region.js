'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('RegionAddController', function($scope, $rootScope, $state, $http, $timeout, API_URL, customers){
  $scope.customers = [];
  
  if (customers){
    for (var i=0; i<customers.length; i++){
      var option = {id: customers[i].userID, value: customers[i].company};
      $scope.customers[i] = option;
    }
  }
  
	$("form").submit(function(){
		$scope.submitRegion();
		return false;
	});
	$scope.submitRegion = function(){
		$scope.lock_form = true;
		
		if (!$rootScope.currentUser.isAdmin){
      $scope.region.customerID = $rootScope.currentUser.userID;
    }
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/region/add?callback=JSON_CALLBACK",
			data: $scope.region,
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
				
				$state.go('app.region-manager-region-list', {}, { reload: true });
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
		$scope.region = {};
		
		$scope.lock_form = false;
	}
	
	var adjustCustomerList = function(){
    $("#ddl_customer").select2({
      placeholder: 'Select the customer...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  $timeout(adjustCustomerList, 100); 

	$scope.resetDefaults();
}).
controller('RegionEditController', function($scope, $http, $state, $timeout, API_URL, data, customers){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.region-manager-region-list', {}, { reload: true });
	}
	
	$scope.customers = [];
  
  if (customers){
    for (var i=0; i<customers.length; i++){
      var option = {id: customers[i].userID, value: customers[i].company};
      $scope.customers[i] = option;
    }
  }
	
	var region = data.node;
	
	$scope.region = region;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitRegion();
		return false;
	});
	$scope.submitRegion = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/region/edit/" + $scope.region.regionID + "?callback=JSON_CALLBACK",
			data: $scope.region,
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
			
			$state.go('app.region-manager-region-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.region = {};
		
		$scope.lock_form = false;
	}
	
	var adjustCustomerList = function(){
    $("#ddl_customer").select2({
      placeholder: 'Select the customer...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  $timeout(adjustCustomerList, 100); 
}).
controller('RegionListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteRegion = function(region){
		var regionID = region.regionID;
		if (!regionID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/region/" + regionID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
					//update the list
					region.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Region");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editRegion = function(regionID){
		if (!regionID)
			return;
		$state.go('app.region-manager-edit-a-region', {regionID: regionID});
	}
})