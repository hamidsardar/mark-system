'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('ZPLAddController', function($scope, $rootScope, $state, $http, $timeout, API_URL, customers){
  $scope.customers = [];
  
  if (customers){
    $scope.customers = customers;
  }
  
	$("form").submit(function(){
		$scope.submitZPL();
		return false;
	});
	$scope.submitZPL = function(){
		$scope.lock_form = true;
		
		if (!$rootScope.currentUser.isAdmin){
      $scope.zpl.customerID = $rootScope.currentUser.userID;
    }
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/zpl/add?callback=JSON_CALLBACK",
			data: $scope.zpl,
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
				
				$state.go('app.zpl-manager-zpl-list', {}, { reload: true });
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
		$scope.zpl = {};
		
		$scope.lock_form = false;
	}

	$scope.resetDefaults();
	
	var adjustCustomerSelect = function(){
    $("#ddl_customer").select2({
      placeholder: 'Select Customer...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
	$timeout(adjustCustomerSelect, 100);
}).
controller('ZPLEditController', function($scope, $http, $state, $timeout, API_URL, data, customers){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.zpl-manager-zpl-list', {}, { reload: true });
	}
	
	$scope.customers = [];
  
  if (customers){
    $scope.customers = customers;
  }
	
	var zpl = data.node;
	
	$scope.zpl = zpl;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitZPL();
		return false;
	});
	$scope.submitZPL = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/zpl/edit/" + $scope.zpl.zplID + "?callback=JSON_CALLBACK",
			data: $scope.zpl,
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
			
			$state.go('app.zpl-manager-zpl-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.zpl = {};
		
		$scope.lock_form = false;
	}
	
	var adjustCustomerSelect = function(){
    $("#ddl_customer").select2({
      placeholder: 'Select Customer...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  $timeout(adjustCustomerSelect, 100);
}).
controller('ZPLListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteZPL = function(zpl){
		var zplID = zpl.zplID;
		if (!zplID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/zpl/" + zplID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
				  //update the list
				  zpl.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting ZPL");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editZPL = function(zplID){
		if (!zplID)
			return;
		$state.go('app.zpl-manager-edit-a-zpl', {zplID: zplID});
	}
})