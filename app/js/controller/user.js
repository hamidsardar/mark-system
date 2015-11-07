'use strict';

/**
 * Author: Batu
 * Date: 2015/10/11
 */

app.controller('UserAddController', function($rootScope, $scope, $state, $http, $timeout, API_URL, modules, customers, countryGen, sites){
	$scope.customers = customers;
	$scope.countries = countryGen.getCountryList();
	$scope.sites = sites;
	
	$scope.user = {};
	
	if (!$rootScope.currentUser.isAdmin){
    $scope.user.customerID = $rootScope.currentUser.userID;
  }
	
	$("form").submit(function(){
		$scope.submitUser();
		return false;
	});
	$scope.submitUser = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/user/add?callback=JSON_CALLBACK",
			data: $scope.user,
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
				$state.go('app.user-manager-user-list', {}, { reload: true });
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
		$scope.user = {};
		
		$scope.user.module = [];
		$scope.user.country = "";
		if (!$rootScope.currentUser.isAdmin)
	    $scope.user.customerID = $rootScope.currentUser.userID;
		else
		  $scope.user.customerID = "";
		
		$scope.lock_form = false;
		
		$timeout(adjustMultiSelect1, 100);
		$timeout(adjustMultiSelect2, 100);
		$timeout(adjustCountrySelect, 100);
		$timeout(adjustCustomerList, 100);
	}

	var adjustMultiSelect1 = function(){
		var aaa = $("#multi-select1").multiSelect({
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
	
	var adjustMultiSelect2 = function(){
    var aaa = $("#multi-select2").multiSelect({
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
		$("#ddl_country").select2({
			placeholder: 'Select your country...',
			allowClear: true
		}).on('select2-open', function()
		{
			// Adding Custom Scrollbar
			$(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
		});
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

	if ($rootScope.currentUser.isAdmin){
		$scope.$watch('user.customerID', function(newVal, oldVal){
			$scope.module_options = [];
			$http.get(API_URL + '/customer/' + newVal).then(
					function success(response) {
						if (response.data && response.data.node && response.data.node.module){
							//customer's module ids
							var res_module = response.data.node.module;
							for (var i=0; i<modules.length; i++){
								var bFound = false;
								for (var j=0; j<res_module.length; j++){
									if (Number(modules[i].id) == Number(res_module[j])){
										bFound = true;
										break;
									}
								}
								if (bFound)
									$scope.module_options[$scope.module_options.length] = modules[i];
							}
							$("#ms-multi-select1").remove();
							$timeout(adjustMultiSelect1, 100);
						}
					},function error(reason) {
						try{
							alert("Failed in loading customer's modules");
						}catch(error){
						}
					}
			);
			$http.get(API_URL + '/site/customer/' + newVal).then(
          function success(response) {
            if (response.data){
              $scope.sites = response.data;
              $("#ms-multi-select2").remove();
              $timeout(adjustMultiSelect2, 100);
            }
          },function error(reason) {
            try{
              alert("Failed in loading customer's sites");
            }catch(error){
            }
          }
      );
	    });
	}else{
		var cur_module = $rootScope.currentUser.module;
		
		$scope.module_options = [];
		
		for (var i=0; i<modules.length; i++){
			var bFound = false;
			for (var j=0; j<cur_module.length; j++){
				if (Number(cur_module[j]) == Number(modules[i].id)){
					bFound = true;
					break;
				}
			}
			if (bFound)
				$scope.module_options[$scope.module_options.length] = modules[i];
		}
	}
	
	$scope.resetDefaults();
}).
controller('UserEditController', function($rootScope, $scope, $http, $timeout, $state, $stateParams, API_URL, countryGen, data, modules, customers, customer_sites, user_sites){
	$scope.module_options = modules;
	$scope.countries = countryGen.getCountryList();
	
	$scope.customers = customers;
	
	$scope.user = {};
	
	if (!$rootScope.currentUser.isAdmin){
		$scope.user.customerID = $rootScope.currentUser.userID;
		$("#ddl_customer").val($scope.user.customerID);
	}
	
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.user-manager-user-list', {}, { reload: true });
	}
	
	var user = data.node;
	user.password = "";
	
	$scope.user = user;
	
	$scope.sites = customer_sites;
	$scope.user.site = [];
	for (var i=0; i<user_sites.length; i++){
	  $scope.user.site[i] = user_sites[i].siteID;
	}
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitUser();
		return false;
	});
	$scope.submitUser = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/user/edit/" + $scope.user.userID + "?callback=JSON_CALLBACK",
			data: $scope.user,
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
			
			$state.go('app.user-manager-user-list', {}, { reload: true });
		})
	};
	
	var adjustMultiSelect1 = function(){
		$("#multi-select1").multiSelect({
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
	
	var adjustMultiSelect2 = function(){
    $("#multi-select2").multiSelect({
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
		$("#ddl_country").select2({
			placeholder: 'Select your country...',
			allowClear: true
		}).on('select2-open', function()
		{
			// Adding Custom Scrollbar
			$(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
		});
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

	$timeout(adjustMultiSelect1, 100);
	$timeout(adjustMultiSelect2, 100);
	$timeout(adjustCountrySelect, 100);
	$timeout(adjustCustomerList, 100);
	
	if ($rootScope.currentUser.isAdmin){
		$scope.$watch('user.customerID', function(newVal, oldVal){
			$scope.module_options = [];
			$http.get(API_URL + '/customer/' + newVal).then(
					function success(response) {
						if (response.data && response.data.node && response.data.node.module){
							//customer's module ids
							var res_module = response.data.node.module;
							for (var i=0; i<modules.length; i++){
								var bFound = false;
								for (var j=0; j<res_module.length; j++){
									if (Number(modules[i].id) == Number(res_module[j])){
										bFound = true;
										break;
									}
								}
								if (bFound)
									$scope.module_options[$scope.module_options.length] = modules[i];
							}
							$("#ms-multi-select1").remove();
							if (newVal != oldVal)
							  $scope.user.module = [];
							$timeout(adjustMultiSelect1, 100);
						}
					},function error(reason) {
						try{
							alert("Failed in loading customer's modules");
						}catch(error){
						}
					}
			);
			$http.get(API_URL + '/site/customer/' + newVal).then(
          function success(response) {
            $("#ms-multi-select2").remove();
            if (response.data && response.data.length){
              $scope.sites = response.data;
            }else{
              $scope.sites = [];
            }
            if (newVal != oldVal)
              $scope.user.site = [];
            $timeout(adjustMultiSelect2, 100);
          },function error(reason) {
            try{
              alert("Failed in loading customer's sites");
            }catch(error){
            }
          }
      );
	    });
	}else{
		var cur_module = $rootScope.currentUser.module;
		
		$scope.module_options = [];
		
		for (var i=0; i<modules.length; i++){
			var bFound = false;
			for (var j=0; j<cur_module.length; j++){
				if (Number(cur_module[j]) == Number(modules[i].id)){
					bFound = true;
					break;
				}
			}
			if (bFound)
				$scope.module_options[$scope.module_options.length] = modules[i];
		}
	}
	
	$scope.resetDefaults = function(){
		$scope.use = {};
		
		$scope.lock_form = false;
	}
}).
controller('UserListController', function($state, $scope, $rootScope, $http, $stateParams, countryGen, data, API_URL){
	//holds the ids of the selected checkbox
	$scope.array = [];
	
	$scope.data = data;
	
	$scope.deleteUser = function(user){
		var userID = user.userID;
		if (!userID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/user/" + userID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
					//update the list
					user.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				try{
					alert("Failed in Deleting User");
				}catch(error){
				}
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editUser = function(userID){
		if (!userID)
			return;
		$state.go('app.user-manager-edit-a-user', {userID: userID});
	}
	
	$scope.selectedCount = function() {
		return $scope.array.length;
  };
  
  $scope.getCountryName = function(countryCode){
    return countryGen.getCountryNameByCode(countryCode);
  }
})