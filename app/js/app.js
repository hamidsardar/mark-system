'use strict';

var app = angular.module('xenon-app', [
	'ngCookies',

	'ui.router',
	'ui.bootstrap',

	'oc.lazyLoad',

	// Added in v1.3
	'FBAngular',
	
	'ngStorage',
	'firebase'
]);

app.run(function($rootScope, $state, $sessionStorage)
{
	// Page Loading Overlay
	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

	jQuery(window).load(function()
	{
		public_vars.$pageLoadingOverlay.addClass('loaded');
	})
	
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		var freePage = false;
		if (toState.data && toState.data.freePage)
			freePage = toState.data.freePage;
		
		if (!freePage && typeof $sessionStorage.currentUser === 'undefined') {
    	event.preventDefault();

    	$state.go('login');
    }
		
		var adminOnly = false;
		if (toState.data && toState.data.adminOnly)
			adminOnly = toState.data.adminOnly;
		
		if ($sessionStorage.currentUser){
			$rootScope.currentUser = $sessionStorage.currentUser;
			
			switch ($rootScope.currentUser.userRole){
			case "Administrator":
				$rootScope.currentUser.isAdmin = true;
				break;
			case "Customer":
				$rootScope.currentUser.isAdmin = false;
				break;
			case "User":
				$rootScope.currentUser.isAdmin = false;
				$rootScope.currentUser.isUser = true;
				break;
			}
		}
		
		if (adminOnly && !$rootScope.currentUser.isAdmin){
			event.preventDefault();
			
			alert("You are not allowed to access!");
			$state.go('app/dashboard');
		}
	});
});


app.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, ASSETS){
//    $httpProvider.defaults.useXDomain = true;
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/xml";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/xml";

	$urlRouterProvider.otherwise('/app/dashboard');
	
	/**
	 * Added by Batu 2015/10/12 -- BEGINS
	 */
	var getModuleList = function($http, API_URL){
		return $http.get(API_URL + '/module').then(
			function success(response) {
				var modules = response.data;
				var module_options = new Array();
				
				if (modules && modules.length > 0){
					for (var i=0; i<modules.length; i++){
						var option = {id:modules[i]._id, value:modules[i].name};
						
						if (typeof option.id == "undefined" || !option.id || !option.value) continue;

						module_options[module_options.length] = option;
					}
				}
				return module_options;
			},function error(reason) {
				return new Array();
			}
		);
	}
	//Added by Batu 2015/10/12 -- ENDS

	$stateProvider.
		// Main Layout Structure
		state('app', {
			abstract: true,
			url: '/app',
			templateUrl: appHelper.templatePath('layout/app-body'),
			controller: function($rootScope){
				$rootScope.isLoginPage        = false;
				$rootScope.isLightLoginPage   = false;
				$rootScope.isLockscreenPage   = false;
				$rootScope.isMainPage         = true;
			}
		}).

		// Dashboards
		state('app.dashboard', {
			url: '/dashboard',
			templateUrl: appHelper.templatePath('dashboard'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
						ASSETS.extra.toastr,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.system-config', {
			url: '/system-config',
			templateUrl: appHelper.templatePath('system-config'),
		}).
//		state('app.profile', {
//			url: '/profile',
//			templateUrl: appHelper.templatePath('profile'),
//			resolve: {
//				jqui: function($ocLazyLoad){
//					return $ocLazyLoad.load({
//						files: ASSETS.core.jQueryUI
//					});
//				},
//				select2: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.select2,
//					]);
//				},
//				selectboxit: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.selectboxit,
//					]);
//				},
//				tagsinput: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.tagsinput,
//					]);
//				},
//				multiSelect: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.multiSelect,
//					]);
//				},
//				typeahead: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.typeahead,
//					]);
//				},
//				datepicker: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.datepicker,
//					]);
//				},
//				timepicker: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.timepicker,
//					]);
//				},
//				daterangepicker: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.core.moment,
//						ASSETS.forms.daterangepicker,
//					]);
//				},
//				colorpicker: function($ocLazyLoad){
//					return $ocLazyLoad.load([
//						ASSETS.forms.colorpicker,
//					]);
//				},
//			}
//		}).
		state('app.profile', {
			url: '/profile',
			templateUrl: appHelper.templatePath('customers/customer-edit'),
			controller: 'customerEditController',
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				data: function($http, $rootScope, API_URL){
					if ($rootScope.currentUser.userRole == "Customer"){
						return $http.get(API_URL + '/customer/' + $rootScope.currentUser.customerID).then(
								function success(response) { return response.data; },
								function error(reason) { return false; }
						);
					}else{
						return false;
					}
				},
				modules: getModuleList,
			}
		}).
		state('app.reports-current-inventory', {
			url: '/reports-current-inventory',
			templateUrl: appHelper.templatePath('reports/current-inventory'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
			}
		}).
		/**
		 * Modifed by Batu 2015/10/11
		 */
		state('app.customers-customer-list', {
			url: '/customers-customer-list',
			templateUrl: appHelper.templatePath('customers/customer-list'),
			controller: 'CustomerListController',
			data: {
				adminOnly: true,
			},
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
				data: function($http, API_URL){
					return $http.get(API_URL + '/customer').then(
							function success(response) { return response.data; },
							function error(reason) { return false; }
					);
				}
			}
		}).
		/**
		 * Modifed by Batu 2015/10/11
		 */
		state('app.customers-customer-edit', {
			url: '/customers-customer-edit/:customerID',
			templateUrl: appHelper.templatePath('customers/customer-edit'),
			controller: 'customerEditController',
			data: {
				adminOnly: true,
			},
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				data: function($http, $stateParams, API_URL){
					return $http.get(API_URL + '/customer/' + $stateParams.customerID).then(
							function success(response) { return response.data; },
							function error(reason) { return false; }
					);
				},
				modules: getModuleList,
			}
		}).
		/**
		 * Modifed by Batu 2015/10/11
		 */
		state('app.customers-add-customer', {
			url: '/customers-add-customer',
			templateUrl: appHelper.templatePath('customers/customer-add'),
			controller: 'CustomerAddController',
			data: {
				adminOnly: true,
			},
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				modules: getModuleList,
			}
		}).
		/**
		 * Modifed by Batu 2015/10/11
		 */
		state('app.user-manager-user-list', {
			url: '/user-manager-user-list',
			templateUrl: appHelper.templatePath('user-manager/user-list'),
			controller: 'UserListController',
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
				data: function($http, $rootScope, API_URL){
				  switch ($rootScope.currentUser.userRole){
				  case "Administrator":
				    return $http.get(API_URL + '/user').then(
	              function success(response) { return response.data; },
	              function error(reason) { return false; }
	          );
				  case "Customer":
				    return $http.get(API_URL + '/user/customer/' + $rootScope.currentUser.userID).then(
	              function success(response) { return response.data; },
	              function error(reason) { return false; }
	          );
				  default:
				    return [];
				  }
				}
			}
		})
		/**
		 * Modifed by Batu 2015/10/11
		 */
		.state('app.user-manager-add-a-user', {
			url: '/user-manager-add-a-user',
			templateUrl: appHelper.templatePath('user-manager/user-add'),
			controller: 'UserAddController',
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				modules: getModuleList,
				customers: function($http, $rootScope, API_URL){
					if ($rootScope.currentUser.isAdmin){
						return $http.get(API_URL + '/customer').then(
								function success(response) { return response.data; },
								function error(reason) { return false; }
						);
					}else{
						return false;
					}
				},
				sites: function($http, $rootScope, API_URL){
          return $http.get(API_URL + '/site/customer/' + $rootScope.currentUser.userID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
			}
		})
		/**
		 * Added by Batu 2015/10/11
		 */
		.state('app.user-manager-edit-a-user', {
			url: '/user-manager-edit-a-user/:userID',
			templateUrl: appHelper.templatePath('user-manager/user-edit'),
			controller: 'UserEditController',
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				data: function($http, $stateParams, API_URL){
					return $http.get(API_URL + '/user/' + $stateParams.userID).then(
							function success(response) { return response.data; },
							function error(reason) { return false; }
					);
				},
				modules: getModuleList,
				customers: function($http, $rootScope, API_URL){
					if ($rootScope.currentUser.isAdmin){
						return $http.get(API_URL + '/customer').then(
								function success(response) { return response.data; },
								function error(reason) { return false; }
						);
					}else{
						return false;
					}
				},
        customer_sites: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Customer":
            return $http.get(API_URL + '/site/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          default:
            return [];
          }
        },
				user_sites: function($http, $rootScope, $stateParams, API_URL){
          return $http.get(API_URL + '/site/user/' + $stateParams.userID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
			}
		}).
		/**
		 * Modified by Batu 2015/10/11
		 */
		state('app.module-manager-module-list', {
			url: '/module-manager-module-list',
			templateUrl: appHelper.templatePath('module-manager/module-list'),
			controller: 'ModuleListController',
			data: {
				adminOnly: true,
			},
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
				data: function($http, API_URL){
					return $http.get(API_URL + '/module').then(
							function success(response) { return response.data; },
							function error(reason) { return false; }
					);
				}
			}
		}).
		/**
		 * Modified by Batu 2015/10/11
		 */
		state('app.module-manager-add-module', {
			url: '/module-manager-add-module',
			templateUrl: appHelper.templatePath('module-manager/module-add'),
			controller: 'ModuleAddController',
			data: {
				adminOnly: true,
			},
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				//sssss
			}
		})
		/**
		 * Added by Batu 2015/10/11
		 */
		.state('app.module-manager-edit-a-module', {
			url: '/module-manager-edit-a-module/:moduleID',
			templateUrl: appHelper.templatePath('module-manager/module-edit'),
			controller: 'ModuleEditController',
			data: {
				adminOnly: true,
			},
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				data: function($http, $stateParams, API_URL){
					return $http.get(API_URL + '/module/' + $stateParams.moduleID).then(
							function success(response) { return response.data; },
							function error(reason) { return false; }
					);
				}
				//sssss
			}
		}).
		/**
     * Modified by Batu 2015/10/21
     */
    state('app.region-manager-region-list', {
      url: '/region-manager-region-list',
      templateUrl: appHelper.templatePath('region-manager/region-list'),
      controller: 'RegionListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/region').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          case "Customer":
            return $http.get(API_URL + '/region/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          default:
            return false;
          }
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/21
     */
    state('app.region-manager-add-region', {
      url: '/region-manager-add-region',
      templateUrl: appHelper.templatePath('region-manager/region-add'),
      controller: 'RegionAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Added by Batu 2015/10/21
     */
    .state('app.region-manager-edit-a-region', {
      url: '/region-manager-edit-a-region/:regionID',
      templateUrl: appHelper.templatePath('region-manager/region-edit'),
      controller: 'RegionEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/region/' + $stateParams.regionID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/21
     */
    .state('app.department-manager-department-list', {
      url: '/department-manager-department-list',
      templateUrl: appHelper.templatePath('department-manager/department-list'),
      controller: 'DepartmentListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/department').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          case "Customer":
            return $http.get(API_URL + '/department/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          }
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/21
     */
    state('app.department-manager-add-department', {
      url: '/department-manager-add-department',
      templateUrl: appHelper.templatePath('department-manager/department-add'),
      controller: 'DepartmentAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Added by Batu 2015/10/21
     */
    .state('app.department-manager-edit-a-department', {
      url: '/department-manager-edit-a-department/:departmentID',
      templateUrl: appHelper.templatePath('department-manager/department-edit'),
      controller: 'DepartmentEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/department/' + $stateParams.departmentID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/21
     */
    .state('app.sitetype-manager-sitetype-list', {
      url: '/sitetype-manager-sitetype-list',
      templateUrl: appHelper.templatePath('sitetype-manager/sitetype-list'),
      controller: 'SitetypeListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, API_URL){
          return $http.get(API_URL + '/sitetype').then(
            function success(response) { return response.data; },
            function error(reason) { return false; }
          );
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/21
     */
    state('app.sitetype-manager-add-sitetype', {
      url: '/sitetype-manager-add-sitetype',
      templateUrl: appHelper.templatePath('sitetype-manager/sitetype-add'),
      controller: 'SitetypeAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Added by Batu 2015/10/21
     */
    .state('app.sitetype-manager-edit-a-sitetype', {
      url: '/sitetype-manager-edit-a-sitetype/:sitetypeID',
      templateUrl: appHelper.templatePath('sitetype-manager/sitetype-edit'),
      controller: 'SitetypeEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/sitetype/' + $stateParams.sitetypeID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/21
     */
    .state('app.zonetype-manager-zonetype-list', {
      url: '/zonetype-manager-zonetype-list',
      templateUrl: appHelper.templatePath('zonetype-manager/zonetype-list'),
      controller: 'ZonetypeListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, API_URL){
          return $http.get(API_URL + '/zonetype').then(
            function success(response) { return response.data; },
            function error(reason) { return false; }
          );
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/21
     */
    state('app.zonetype-manager-add-zonetype', {
      url: '/zonetype-manager-add-zonetype',
      templateUrl: appHelper.templatePath('zonetype-manager/zonetype-add'),
      controller: 'ZonetypeAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
      }
    })
    /**
     * Added by Batu 2015/10/21
     */
    .state('app.zonetype-manager-edit-a-zonetype', {
      url: '/zonetype-manager-edit-a-zonetype/:zonetypeID',
      templateUrl: appHelper.templatePath('zonetype-manager/zonetype-edit'),
      controller: 'ZonetypeEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/zonetype/' + $stateParams.zonetypeID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
      }
    })
    /**
     * Modified by Batu 2015/10/23
     */
    .state('app.site-manager-site-list', {
      url: '/site-manager-site-list',
      templateUrl: appHelper.templatePath('site-manager/site-list'),
      controller: 'SiteListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/site').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          case "Customer":
            return $http.get(API_URL + '/site/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/23
     */
    .state('app.site-manager-add-site', {
      url: '/site-manager-add-site',
      templateUrl: appHelper.templatePath('site-manager/site-add'),
      controller: 'SiteAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        regions: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/region').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          case "Customer":
            return $http.get(API_URL + '/region/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          default:
            return false;
          }
        },
        sitetypes: function($http, API_URL){
          return $http.get(API_URL + '/sitetype').then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
      }
    })
    /**
     * Added by Batu 2015/10/23
     */
    .state('app.site-manager-edit-a-site', {
      url: '/site-manager-edit-a-site/:siteID',
      templateUrl: appHelper.templatePath('site-manager/site-edit'),
      controller: 'SiteEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/site/' + $stateParams.siteID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        regions: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/region').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          case "Customer":
            return $http.get(API_URL + '/region/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          default:
            return false;
          }
        },
        sitetypes: function($http, API_URL){
          return $http.get(API_URL + '/sitetype').then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
      }
    })
    /**
     * Modified by Batu 2015/10/23
     */
    .state('app.zone-manager-zone-list', {
      url: '/zone-manager-zone-list',
      templateUrl: appHelper.templatePath('zone-manager/zone-list'),
      controller: 'ZoneListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/zone/').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          case "Customer":
            return $http.get(API_URL + '/zone/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/23
     */
    .state('app.zone-manager-add-zone', {
      url: '/zone-manager-add-zone',
      templateUrl: appHelper.templatePath('zone-manager/zone-add'),
      controller: 'ZoneAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        sites: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/site').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          case "Customer":
            return $http.get(API_URL + '/site/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          }
        },
        zonetypes: function($http, API_URL){
          return $http.get(API_URL + '/zonetype').then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
      }
    })
    /**
     * Added by Batu 2015/10/23
     */
    .state('app.zone-manager-edit-a-zone', {
      url: '/zone-manager-edit-a-zone/:zoneID',
      templateUrl: appHelper.templatePath('zone-manager/zone-edit'),
      controller: 'ZoneEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/zone/' + $stateParams.zoneID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        sites: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/site').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          case "Customer":
            return $http.get(API_URL + '/site/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
            break;
          }
        },
        zonetypes: function($http, API_URL){
          return $http.get(API_URL + '/zonetype').then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
      }
    })
    /**
     * Modified by Batu 2015/10/26
     */
    .state('app.producttype-manager-producttype-list', {
      url: '/producttype-manager-producttype-list',
      templateUrl: appHelper.templatePath('producttype-manager/producttype-list'),
      controller: 'ZPLListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/producttype').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          case "Customer":
            return $http.get(API_URL + '/producttype/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          }
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/26
     */
    state('app.producttype-manager-add-producttype', {
      url: '/producttype-manager-add-producttype',
      templateUrl: appHelper.templatePath('producttype-manager/producttype-add'),
      controller: 'ProducttypeAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Added by Batu 2015/10/26
     */
    .state('app.producttype-manager-edit-a-producttype', {
      url: '/producttype-manager-edit-a-producttype/:producttypeID',
      templateUrl: appHelper.templatePath('producttype-manager/producttype-edit'),
      controller: 'ProducttypeEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/producttype/' + $stateParams.producttypeID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/26
     */
    .state('app.zpl-manager-zpl-list', {
      url: '/zpl-manager-zpl-list',
      templateUrl: appHelper.templatePath('zpl-manager/zpl-list'),
      controller: 'ZPLListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/zpl').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          case "Customer":
            return $http.get(API_URL + '/zpl/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          }
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/26
     */
    state('app.zpl-manager-add-zpl', {
      url: '/zpl-manager-add-zpl',
      templateUrl: appHelper.templatePath('zpl-manager/zpl-add'),
      controller: 'ZPLAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Added by Batu 2015/10/26
     */
    .state('app.zpl-manager-edit-a-zpl', {
      url: '/zpl-manager-edit-a-zpl/:zplID',
      templateUrl: appHelper.templatePath('zpl-manager/zpl-edit'),
      controller: 'ZPLEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/zpl/' + $stateParams.zplID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        }
      }
    })
    /**
     * Modified by Batu 2015/10/26
     */
    .state('app.product-manager-product-list', {
      url: '/product-manager-product-list',
      templateUrl: appHelper.templatePath('product-manager/product-list'),
      controller: 'ProductListController',
      resolve: {
        deps: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.tables.datatables,
          ]);
        },
        data: function($http, $rootScope, API_URL){
          switch($rootScope.currentUser.userRole){
          case "Administrator":
            return $http.get(API_URL + '/product').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          case "Customer":
            return $http.get(API_URL + '/product/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
              );
          }
        }
      }
    }).
    /**
     * Modified by Batu 2015/10/26
     */
    state('app.product-manager-add-product', {
      url: '/product-manager-add-product',
      templateUrl: appHelper.templatePath('product-manager/product-add'),
      controller: 'ProductAddController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        },
        producttypes: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Customer":
            return $http.get(API_URL + '/producttype/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          default:
            return false;
          }
        },
        departments: function($http, $rootScope, API_URL){
          switch ($rootScope.currentUser.userRole){
          case "Customer":
            return $http.get(API_URL + '/department/customer/' + $rootScope.currentUser.userID).then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          default:
            return false;
          }
        }
      }
    })
    /**
     * Added by Batu 2015/10/26
     */
    .state('app.product-manager-edit-a-product', {
      url: '/product-manager-edit-a-product/:productID',
      templateUrl: appHelper.templatePath('product-manager/product-edit'),
      controller: 'ProductEditController',
      resolve: {
        datepicker: function($ocLazyLoad){
          return $ocLazyLoad.load([
            ASSETS.forms.datepicker,
            ASSETS.forms.multiSelect,
            ASSETS.forms.select2,
          ]);
        },
        data: function($http, $stateParams, API_URL){
          return $http.get(API_URL + '/product/' + $stateParams.productID).then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        customers: function($http, $rootScope, API_URL){
          if ($rootScope.currentUser.isAdmin){
            return $http.get(API_URL + '/customer').then(
                function success(response) { return response.data; },
                function error(reason) { return false; }
            );
          }else{
            return false;
          }
        },
        producttypes: function($http, API_URL){
          return $http.get(API_URL + '/producttype').then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        },
        departments: function($http, API_URL){
          return $http.get(API_URL + '/department').then(
              function success(response) { return response.data; },
              function error(reason) { return false; }
          );
        }
      }
    })
		.state('logout',{
			url: '/logout',
			controller: 'LogoutCtrl',
		})

		// Logins and Lockscreen
		.state('login', {
			url: '/login',
			templateUrl: appHelper.templatePath('login'),
			controller: 'LoginCtrl',
			data: {
				freePage: true
			},
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		}).
		state('login-light', {
			url: '/login-light',
			templateUrl: appHelper.templatePath('login-light'),
			controller: 'LoginLightCtrl',
			data: {
				freePage: true
			},
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
					]);
				},
			}
		}).
		state('lockscreen', {
			url: '/lockscreen',
			templateUrl: appHelper.templatePath('lockscreen'),
			controller: 'LockscreenCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		});
});


app.constant('ASSETS', {
	'core': {
		'bootstrap': appHelper.assetPath('js/bootstrap.min.js'), // Some plugins which do not support angular needs this

		'jQueryUI': [
			appHelper.assetPath('js/jquery-ui/jquery-ui.min.js'),
			appHelper.assetPath('js/jquery-ui/jquery-ui.structure.min.css'),
		],

		'moment': appHelper.assetPath('js/moment.min.js'),

		'googleMapsLoader': appHelper.assetPath('app/js/angular-google-maps/load-google-maps.js')
	},

	'charts': {

		'dxGlobalize': appHelper.assetPath('js/devexpress-web-14.1/js/globalize.min.js'),
		'dxCharts': appHelper.assetPath('js/devexpress-web-14.1/js/dx.chartjs.js'),
		'dxVMWorld': appHelper.assetPath('js/devexpress-web-14.1/js/vectormap-data/world.js'),
	},

	'xenonLib': {
		notes: appHelper.assetPath('js/xenon-notes.js'),
	},

	'maps': {

		'vectorMaps': [
			appHelper.assetPath('js/jvectormap/jquery-jvectormap-1.2.2.min.js'),
			appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-world-mill-en.js'),
			appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-it-mill-en.js'),
		],
	},

	'icons': {
		'meteocons': appHelper.assetPath('css/fonts/meteocons/css/meteocons.css'),
		'elusive': appHelper.assetPath('css/fonts/elusive/css/elusive.css'),
	},

	'tables': {
		'rwd': appHelper.assetPath('js/rwd-table/js/rwd-table.min.js'),

		'datatables': [
			appHelper.assetPath('js/datatables/dataTables.bootstrap.css'),
			appHelper.assetPath('js/datatables/datatables-angular.js'),
		],

	},

	'forms': {

		'select2': [
			appHelper.assetPath('js/select2/select2.css'),
			appHelper.assetPath('js/select2/select2-bootstrap.css'),

			appHelper.assetPath('js/select2/select2.min.js'),
		],

		'daterangepicker': [
			appHelper.assetPath('js/daterangepicker/daterangepicker-bs3.css'),
			appHelper.assetPath('js/daterangepicker/daterangepicker.js'),
		],

		'colorpicker': appHelper.assetPath('js/colorpicker/bootstrap-colorpicker.min.js'),

		'selectboxit': appHelper.assetPath('js/selectboxit/jquery.selectBoxIt.js'),

		'tagsinput': appHelper.assetPath('js/tagsinput/bootstrap-tagsinput.min.js'),

		'datepicker': appHelper.assetPath('js/datepicker/bootstrap-datepicker.js'),

		'timepicker': appHelper.assetPath('js/timepicker/bootstrap-timepicker.min.js'),

		'inputmask': appHelper.assetPath('js/inputmask/jquery.inputmask.bundle.js'),

		'formWizard': appHelper.assetPath('js/formwizard/jquery.bootstrap.wizard.min.js'),

		'jQueryValidate': appHelper.assetPath('js/jquery-validate/jquery.validate.min.js'),

		'dropzone': [
			appHelper.assetPath('js/dropzone/css/dropzone.css'),
			appHelper.assetPath('js/dropzone/dropzone.min.js'),
		],

		'typeahead': [
			appHelper.assetPath('js/typeahead.bundle.js'),
			appHelper.assetPath('js/handlebars.min.js'),
		],

		'multiSelect': [
			appHelper.assetPath('js/multiselect/css/multi-select.css'),
			appHelper.assetPath('js/multiselect/js/jquery.multi-select.js'),
		],

		'icheck': [
			appHelper.assetPath('js/icheck/skins/all.css'),
			appHelper.assetPath('js/icheck/icheck.min.js'),
		],

		'bootstrapWysihtml5': [
			appHelper.assetPath('js/wysihtml5/src/bootstrap-wysihtml5.css'),
			appHelper.assetPath('js/wysihtml5/wysihtml5-angular.js')
		],
	},

	'uikit': {
		'base': [
			appHelper.assetPath('js/uikit/uikit.css'),
			appHelper.assetPath('js/uikit/css/addons/uikit.almost-flat.addons.min.css'),
			appHelper.assetPath('js/uikit/js/uikit.min.js'),
		],

		'codemirror': [
			appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.js'),
			appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.css'),
		],

		'marked': appHelper.assetPath('js/uikit/vendor/marked.js'),
		'htmleditor': appHelper.assetPath('js/uikit/js/addons/htmleditor.min.js'),
		'nestable': appHelper.assetPath('js/uikit/js/addons/nestable.min.js'),
	},

	'extra': {
		'tocify': appHelper.assetPath('js/tocify/jquery.tocify.min.js'),

		'toastr': appHelper.assetPath('js/toastr/toastr.min.js'),

		'fullCalendar': [
			appHelper.assetPath('js/fullcalendar/fullcalendar.min.css'),
			appHelper.assetPath('js/fullcalendar/fullcalendar.min.js'),
		],

		'cropper': [
			appHelper.assetPath('js/cropper/cropper.min.js'),
			appHelper.assetPath('js/cropper/cropper.min.css'),
		]
	}
});