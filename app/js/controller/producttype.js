'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('ProducttypeAddController', function($scope, $rootScope, $state, $http, $timeout, API_URL, customers){
  $scope.customers = [];
  
  if (customers){
    $scope.customers = customers;
  }
  
	$("form").submit(function(){
		$scope.submitProducttype();
		return false;
	});
	$scope.submitProducttype = function(){
		$scope.lock_form = true;
		
		if (!$rootScope.currentUser.isAdmin){
      $scope.producttype.customerID = $rootScope.currentUser.userID;
    }
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/producttype/add?callback=JSON_CALLBACK",
			data: $scope.producttype,
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
				
				$state.go('app.producttype-manager-producttype-list', {}, { reload: true });
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
		$scope.producttype = {};
		
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
controller('ProducttypeEditController', function($scope, $http, $state, $timeout, API_URL, data, customers){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.producttype-manager-producttype-list', {}, { reload: true });
	}
	
	$scope.customers = [];
  
  if (customers){
    $scope.customers = customers;
  }
	
	var producttype = data.node;
	
	$scope.producttype = producttype;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitProducttype();
		return false;
	});
	$scope.submitProducttype = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/producttype/edit/" + $scope.producttype.producttypeID + "?callback=JSON_CALLBACK",
			data: $scope.producttype,
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
			
			$state.go('app.producttype-manager-producttype-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.producttype = {};
		
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
controller('ProducttypeListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteProducttype = function(producttype){
		var producttypeID = producttype.producttypeID;
		if (!producttypeID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/producttype/" + producttypeID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
				  //update the list
				  producttype.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Producttype");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editProducttype = function(producttypeID){
		if (!producttypeID)
			return;
		$state.go('app.producttype-manager-edit-a-producttype', {producttypeID: producttypeID});
	}
})