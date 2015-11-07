'use strict';

/**
 * Author: Batu Date: 2015/10/11
 * Date: 2015/10/12
 */

app.controller('CustomerAddController', function($scope, $http, $state, $timeout, API_URL, modules){
	$scope.module_options = modules;
	
	$("form").submit(function(){
		$scope.saveChange();
		return false;
	});
	$scope.saveChange = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/customer/add?callback=JSON_CALLBACK",
			data: $scope.customer,   
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
								
			//	$scope.resetDefaults();
				$state.go('app.customers-customer-list', {}, { reload: true });	
			}else{
				try{
					alert(data.message);
				}catch(error){
				}
			}
			
			$scope.lock_form = false;
		})
	};
	
	var visual = function(){
		$("#multi-select").multiSelect({
			afterInit: function()
			{
				// Add alternative scrollbar to list
				this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar();
			},
			afterSelect: function()
			{
				// Update scrollbar size
				this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar('update');
			}
		});
	}
	
	$scope.resetDefaults = function(){
		$scope.customer = {};
		
		$scope.customer.module = [];
		$scope.customer.country = "";
		
		$scope.lock_form = false;
	}
	
	$timeout(visual, 100);	
	$scope.resetDefaults();

})
.controller('customerEditController', function($scope, $rootScope, $http, $timeout, $state, $stateParams, API_URL, data, modules){
	$scope.module_options = modules;
	
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.dashboard', {}, { reload: true });
	}
	
	var customer = data.node;
	customer.password = "";
	
	$scope.customer = customer;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitCustomer();
		return false;
	});
	$scope.submitCustomer = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/customer/edit/" + $scope.customer.userID + "?callback=JSON_CALLBACK",
			data: $scope.customer,
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
			
			$state.go('app.customers-customer-list', {}, { reload: true });
		})
	};
	
	var adjustMultiSelect = function(){
		$("#multi-select").multiSelect({
			afterInit: function()
			{
				// Add alternative scrollbar to list
				this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar();
			},
			afterSelect: function()
			{
				// Update scrollbar size
				this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar('update');
			}
		});
	}
	
	var adjustCountrySelect = function(){
		$("#s2example-1").select2({
			placeholder: 'Select your country...',
			allowClear: true
		}).on('select2-open', function()
		{
			// Adding Custom Scrollbar
			$(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
		});
	}

	$timeout(adjustMultiSelect, 100);
	$timeout(adjustCountrySelect, 100);
	
	$scope.resetDefaults = function(){
		$scope.customer = {};
		
		$scope.lock_form = false;
	}
})
.controller('CustomerListController', function($state, $scope, $http, $stateParams,filterFilter, data, API_URL){
	//holds the ids of the selected checkbox
	$scope.array = [];
	
	//holds the list of users
	$scope.data = data;	
	

	$scope.deleteCustomer = function(customer){
		var userID = customer.userID;
		
		if (!userID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/customer/" + userID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
					// update the list
					customer.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				try{
					alert("Failed in Deleting Customer");
				}catch(error){
				}
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editCustomer = function(userID){
		if (!userID)
			return;
		$state.go('app.customers-customer-edit', {customerID: userID});
	}
	
	$scope.selectedCount = function() {
		return $scope.array.length;
    };
})