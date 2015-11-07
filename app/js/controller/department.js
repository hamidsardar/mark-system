'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('DepartmentAddController', function($scope, $rootScope, $state, $http, $timeout, API_URL, customers){
  $scope.customers = [];
  
  if (customers){
    for (var i=0; i<customers.length; i++){
      var option = {id: customers[i].userID, value: customers[i].company};
      $scope.customers[i] = option;
    }
  }
  
	$("form").submit(function(){
		$scope.submitDepartment();
		return false;
	});
	$scope.submitDepartment = function(){
		$scope.lock_form = true;
		
		if (!$rootScope.currentUser.isAdmin){
      $scope.user.customerID = $rootScope.currentUser.userID;
    }
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/department/add?callback=JSON_CALLBACK",
			data: $scope.department,
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
				
				$state.go('app.department-manager-department-list', {}, { reload: true });
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
		$scope.department = {};
		
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
controller('DepartmentEditController', function($scope, $http, $state, $timeout, API_URL, data, customers){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.department-manager-department-list', {}, { reload: true });
	}
	
	$scope.customers = [];
  
  if (customers){
    for (var i=0; i<customers.length; i++){
      var option = {id: customers[i].userID, value: customers[i].company};
      $scope.customers[i] = option;
    }
  }
	
	var department = data.node;
	
	$scope.department = department;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitDepartment();
		return false;
	});
	$scope.submitDepartment = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/department/edit/" + $scope.department.departmentID + "?callback=JSON_CALLBACK",
			data: $scope.department,
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
			
			$state.go('app.department-manager-department-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.department = {};
		
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
controller('DepartmentListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteDepartment = function(department){
		var departmentID = department.departmentID;
		if (!departmentID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/department/" + departmentID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
				  //update the list
				  department.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Department");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editDepartment = function(departmentID){
		if (!departmentID)
			return;
		$state.go('app.department-manager-edit-a-department', {departmentID: departmentID});
	}
})