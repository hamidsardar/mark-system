'use strict';

/**
 * Author: Batu
 * Date: 2015/10/23
 */

app.controller('ZoneAddController', function($scope, $rootScope, $state, $http, $timeout, API_URL, sites, zonetypes){
  $scope.sites = sites;
  $scope.zonetypes = zonetypes;
  
	$("form").submit(function(){
		$scope.submitZone();
		return false;
	});
	$scope.submitZone = function(){
		$scope.lock_form = true;
		
		if (!$rootScope.currentUser.isAdmin){
      $scope.zone.customerID = $rootScope.currentUser.userID;
    }
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/zone/add?callback=JSON_CALLBACK",
			data: $scope.zone,
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
				
				$state.go('app.zone-manager-zone-list', {}, { reload: true });
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
		$scope.zone = {};
		
		$scope.lock_form = false;
	}
	
	var adjustSiteList = function(){
    $("#ddl_site").select2({
      placeholder: 'Select the site...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
	var adjustZonetypeList = function(){
    $("#ddl_zonetype").select2({
      placeholder: 'Select the Zone Type...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  $timeout(adjustZonetypeList, 100);
  $timeout(adjustSiteList, 100); 

	$scope.resetDefaults();
}).
controller('ZoneEditController', function($scope, $http, $state, $timeout, API_URL, data, sites, zonetypes){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.zone-manager-zone-list', {}, { reload: true });
	}
	
	$scope.sites = sites;
  $scope.zonetypes = zonetypes;
	
	$scope.zone = data.node;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitZone();
		return false;
	});
	$scope.submitZone = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/zone/edit/" + $scope.zone.zoneID + "?callback=JSON_CALLBACK",
			data: $scope.zone,
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
			
			$state.go('app.zone-manager-zone-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.zone = {};
		
		$scope.lock_form = false;
	}
	
	var adjustSiteList = function(){
    $("#ddl_site").select2({
      placeholder: 'Select the site...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  var adjustZonetypeList = function(){
    $("#ddl_zonetype").select2({
      placeholder: 'Select the zonetype...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  $timeout(adjustZonetypeList, 100);
  $timeout(adjustSiteList, 100); 
}).
controller('ZoneListController', function($state, $scope, $rootScope, $http, data, API_URL){
  $scope.data = data;
	
	$scope.deleteZone = function(zone){
		var zoneID = zone.zoneID;
		if (!zoneID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/zone/" + zoneID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
					//update the list
					zone.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Zone");
			})
		} else {
		    // Do nothing!
		}
		
	}
	
	$scope.editZone = function(zoneID){
		if (!zoneID)
			return;
		$state.go('app.zone-manager-edit-a-zone', {zoneID: zoneID});
	}
})