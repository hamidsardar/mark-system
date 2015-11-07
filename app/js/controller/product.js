'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('ProductAddController', function($scope, $rootScope, $state, $http, $timeout, API_URL, customers, producttypes, departments){
  $scope.customers = customers;
  $scope.producttypes = producttypes;
  $scope.departments = departments;
  
	$("form").submit(function(){
		$scope.submitProduct();
		return false;
	});
	$scope.submitProduct = function(){
		$scope.lock_form = true;
		
		if (!$rootScope.currentUser.isAdmin){
      $scope.product.customerID = $rootScope.currentUser.userID;
    }
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/product/add?callback=JSON_CALLBACK",
			data: $scope.product,
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
				
				$state.go('app.product-manager-product-list', {}, { reload: true });
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
		$scope.product = {};
		
		$scope.lock_form = false;
	}

	$scope.resetDefaults();
	
	if ($rootScope.currentUser.isAdmin){
    $scope.$watch('product.customerID', function(newVal, oldVal){
      $scope.module_options = [];
      $http.get(API_URL + '/producttype/customer/' + newVal).then(
          function success(response) {
            if (response.data){
              $scope.producttypes = response.data;
              $timeout(adjustProductTypeSelect, 100);
            }
          },function error(reason) {
            try{
              alert("Failed in loading customer's product types");
            }catch(error){
            }
          }
      );
      $http.get(API_URL + '/department/customer/' + newVal).then(
          function success(response) {
            if (response.data){
              $scope.departments = response.data;
              $timeout(adjustDepartmentSelect, 100);
            }
          },function error(reason) {
            try{
              alert("Failed in loading customer's departments");
            }catch(error){
            }
          }
      );
    });
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
	var adjustProductTypeSelect = function(){
    $("#ddl_producttype").select2({
      placeholder: 'Select Product Type...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  var adjustDepartmentSelect = function(){
    $("#ddl_department").select2({
      placeholder: 'Select Department...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  $timeout(adjustCustomerSelect, 100);
  $timeout(adjustProductTypeSelect, 100);
  $timeout(adjustDepartmentSelect, 100);
}).
controller('ProductEditController', function($scope, $rootScope, $http, $state, $timeout, API_URL, data, customers, producttypes, departments){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.product-manager-product-list', {}, { reload: true });
	}
	
	$scope.customers = customers;
	$scope.producttypes = producttypes;
	$scope.departments = departments;
	
	$scope.product = data.node;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitProduct();
		return false;
	});
	$scope.submitProduct = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/product/edit/" + $scope.product.productID + "?callback=JSON_CALLBACK",
			data: $scope.product,
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
			
			$state.go('app.product-manager-product-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.product = {};
		
		$scope.lock_form = false;
	}
	
	if ($rootScope.currentUser.isAdmin){
    $scope.$watch('product.customerID', function(newVal, oldVal){
      $scope.module_options = [];
      $http.get(API_URL + '/producttype/customer/' + newVal).then(
          function success(response) {
            if (response.data){
              $scope.producttypes = response.data;
              $timeout(adjustProductTypeSelect, 100);
            }
          },function error(reason) {
            try{
              alert("Failed in loading customer's product types");
            }catch(error){
            }
          }
      );
      $http.get(API_URL + '/department/customer/' + newVal).then(
          function success(response) {
            if (response.data){
              $scope.departments = response.data;
              $timeout(adjustDepartmentSelect, 100);
            }
          },function error(reason) {
            try{
              alert("Failed in loading customer's departments");
            }catch(error){
            }
          }
      );
    });
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
	var adjustProductTypeSelect = function(){
    $("#ddl_producttype").select2({
      placeholder: 'Select Product Type...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
	var adjustDepartmentSelect = function(){
    $("#ddl_department").select2({
      placeholder: 'Select Department...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  $timeout(adjustCustomerSelect, 100);
  $timeout(adjustProductTypeSelect, 100);
  $timeout(adjustDepartmentSelect, 100);
}).
controller('ProductListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteProduct = function(product){
		var productID = product.productID;
		if (!productID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/product/" + productID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
				  //update the list
				  product.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Product");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editProduct = function(productID){
		if (!productID)
			return;
		$state.go('app.product-manager-edit-a-product', {productID: productID});
	}
})