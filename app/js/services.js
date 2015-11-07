'use strict';

app.
	service('$menuItems', function($rootScope)
	{
		this.menuItems = [];

		var $menuItemsRef = this;

		var menuItemObj = {
			parent: null,

			title: '',
			link: '', // starting with "./" will refer to parent link concatenation
			state: '', // will be generated from link automatically where "/" (forward slashes) are replaced with "."
			icon: '',

			isActive: false,
			label: null,

			menuItems: [],

			setLabel: function(label, color, hideWhenCollapsed)
			{
				if(typeof hideWhenCollapsed == 'undefined')
					hideWhenCollapsed = true;

				this.label = {
					text: label,
					classname: color,
					collapsedHide: hideWhenCollapsed
				};

				return this;
			},

			addItem: function(title, link, icon)
			{
				var parent = this,
					item = angular.extend(angular.copy(menuItemObj), {
						parent: parent,

						title: title,
						link: link,
						icon: icon
					});

				if(item.link)
				{
					if(item.link.match(/^\./))
						item.link = parent.link + item.link.substring(1, link.length);

					if(item.link.match(/^-/))
						item.link = parent.link + '-' + item.link.substring(2, link.length);

					item.state = $menuItemsRef.toStatePath(item.link);
				}

				this.menuItems.push(item);

				return item;
			}
		};

		this.addItem = function(title, link, icon)
		{
			var item = angular.extend(angular.copy(menuItemObj), {
				title: title,
				link: link,
				state: this.toStatePath(link),
				icon: icon
			});

			this.menuItems.push(item);

			return item;
		};

		this.getAll = function()
		{
			return this.menuItems;
		};

		this.prepareSidebarMenu = function()
		{
		  var dashboard       = this.addItem('Dashboard',     '/app/dashboard',       'linecons-note');
		  var customers, reports, user_manager, module_manager, region_manager, department_manager, sitetype_manager, zonetype_manager;
		  var site_manager, zone_manager;
		  var producttype_manager, product_manager;
		  var zpl_manager;
		  
		  switch ($rootScope.currentUser.userRole){
		      case "admin":
		        customers       = this.addItem('Customers', '/app/customers', 'linecons-user');
		        reports         = this.addItem('Reports',         '/app/reports',             'linecons-doc');
		        user_manager    = this.addItem('Users',      '/app/user-manager',    'linecons-user');
		        module_manager  = this.addItem('Modules',  '/app/module-manager',    'linecons-params');
		        region_manager  = this.addItem('Regions',  '/app/region-manager',    'linecons-params');
		        site_manager  = this.addItem('Sites',  '/app/site-manager',    'linecons-params');
		        zone_manager  = this.addItem('Zones',  '/app/zone-manager',    'linecons-params');
		        sitetype_manager  = this.addItem('Site Types',  '/app/sitetype-manager',    'linecons-params');
		        zonetype_manager  = this.addItem('Zone Types',  '/app/zonetype-manager',    'linecons-params');
		        department_manager  = this.addItem('Departments',  '/app/department-manager',    'linecons-params');
		        producttype_manager  = this.addItem('Product Types',  '/app/producttype-manager',    'linecons-params');
		        product_manager  = this.addItem('Products',  '/app/product-manager',    'linecons-params');
		        zpl_manager  = this.addItem('ZPL',  '/app/zpl-manager',    'linecons-params');
		        
		        // Subitems of Customers
		        customers.addItem('Customers',    '-/customer-list');
		        customers.addItem('Add Customer',     '-/add-customer');
		        
		        // Subitems of Reports
		        reports.addItem('Current Inventory',          '-/current-inventory');
		        reports.addItem('Back-to-Front Replenishment',  '-/back-to-front-replenishment');
		        reports.addItem('Encoding',                   '-/encoding');
		        reports.addItem('Recieving',                  '-/recieving');
		        reports.addItem('Missing',                    '-/missing');
		        reports.addItem('EPCs',                     '-/epcs');
		
		        // Subitems of Users
		        user_manager.addItem('Users',     '-/user-list');
		        user_manager.addItem('Add a User',    '-/add-a-user');
		        
		        module_manager.addItem('Modules',     '-/module-list');
		        module_manager.addItem('Add Module',    '-/add-module');
		        
		        region_manager.addItem('Regions',     '-/region-list');
		        region_manager.addItem('Add Region',    '-/add-region');
		        
		        product_manager.addItem('Products',     '-/product-list');
		        product_manager.addItem('Add Product',    '-/add-product');
		        
		        site_manager.addItem('Sites',     '-/site-list');
		        site_manager.addItem('Add Site',    '-/add-site');
		        
		        zone_manager.addItem('Zones',     '-/zone-list');
		        zone_manager.addItem('Add Zone',    '-/add-zone');
		        
		        department_manager.addItem('Departments',     '-/department-list');
		        department_manager.addItem('Add Department',    '-/add-department');
		        
		        sitetype_manager.addItem('Site Types',     '-/sitetype-list');
		        sitetype_manager.addItem('Add Site Type',    '-/add-sitetype');
		        
		        zonetype_manager.addItem('Zone Types',     '-/zonetype-list');
		        zonetype_manager.addItem('Add Zone Type',    '-/add-zonetype');
		        
		        producttype_manager.addItem('Product Types',     '-/producttype-list');
		        producttype_manager.addItem('Add Product Type',    '-/add-producttype');
		        
		        zpl_manager.addItem('ZPL',     '-/zpl-list');
		        zpl_manager.addItem('Add ZPL',    '-/add-zpl');
		        break;
		      case "judge":
		        reports         = this.addItem('Reports',         '/app/reports',             'linecons-doc');
		        user_manager    = this.addItem('Users',      '/app/user-manager',    'linecons-user');
		        region_manager  = this.addItem('Regions',  '/app/region-manager',    'linecons-params');
		        site_manager  = this.addItem('Sites',  '/app/site-manager',    'linecons-params');
		        zone_manager  = this.addItem('Zones',  '/app/zone-manager',    'linecons-params');
		        product_manager  = this.addItem('Products',  '/app/product-manager',    'linecons-params');
		        department_manager  = this.addItem('Departments',  '/app/department-manager',    'linecons-params');
		        zpl_manager  = this.addItem('ZPL',  '/app/zpl-manager',    'linecons-params');
		        
		        // Subitems of Reports
		        reports.addItem('Current Inventory',          '-/current-inventory');
		        reports.addItem('Back-to-Front Replenishment',  '-/back-to-front-replenishment');
		        reports.addItem('Encoding',                   '-/encoding');
		        reports.addItem('Receiving',                  '-/receiving');
		        reports.addItem('Missing',                    '-/missing');
		        reports.addItem('EPCs',                       '-/epcs');
		
		        // Subitems of Users
		        user_manager.addItem('Users',     '-/user-list');
		        user_manager.addItem('Add a User',    '-/add-a-user');
		        
		        region_manager.addItem('Regions',     '-/region-list');
		        region_manager.addItem('Add Region',    '-/add-region');
		        
		        product_manager.addItem('Products',     '-/product-list');
		        product_manager.addItem('Add Product',    '-/add-product');
		        
		        site_manager.addItem('Sites',     '-/site-list');
		        site_manager.addItem('Add Site',    '-/add-site');
		        
		        zone_manager.addItem('Zones',     '-/zone-list');
		        zone_manager.addItem('Add Zone',    '-/add-zone');
		        
		        department_manager.addItem('Departments',     '-/department-list');
		        department_manager.addItem('Add Department',    '-/add-department');
		        
		        zpl_manager.addItem('ZPL',     '-/zpl-list');
		        zpl_manager.addItem('Add ZPL',    '-/add-zpl');
		        break;
		      case "User":
		        break;
		      }
			return this;
		};

		this.prepareHorizontalMenu = function()
		{
			var dashboard       = this.addItem('Dashboard', 		'/app/dashboard', 			'linecons-note');
			var customers       = this.addItem('customers', 	    '/app/customers', 		    'linecons-user');
			var reports         = this.addItem('Reports',	        '/app/reports',	            'linecons-doc');
			var user_manager    = this.addItem('Users', 	    '/app/user-manager', 		'linecons-user');
			var module_manager  = this.addItem('Modules', 	'/app/module-manager', 		'linecons-params');


            // Subitems of Customers
            customers.addItem('Customers', 		'-/customer-list');
            customers.addItem('Add Customer', 		'-/add-customer');


            // Subitems of Reports
            reports.addItem('Current Inventory', 	'-/current-inventory');
            reports.addItem('Back-to-Front Replenishment', '-/back-to-front-replenishment');
            reports.addItem('Encoding', 	'-/encoding');
            reports.addItem('Recieving', 	'-/recieving');
            reports.addItem('Missing', 		'-/missing');
            reports.addItem('EPCs', 		'-/epcs');

            // Subitems of Users
            user_manager.addItem('Users', 		'-/user-list');
            user_manager.addItem('Add a User', 		'-/add-a-user');

            module_manager.addItem('Add Module', 		'-/add-module');

			return this;
		}

		this.instantiate = function()
		{
			return angular.copy( this );
		}

		this.toStatePath = function(path)
		{
			return path.replace(/\//g, '.').replace(/^\./, '');
		};

		this.setActive = function(path)
		{
			this.iterateCheck(this.menuItems, this.toStatePath(path));
		};

		this.setActiveParent = function(item)
		{
			item.isActive = true;
			item.isOpen = true;

			if(item.parent)
				this.setActiveParent(item.parent);
		};

		this.iterateCheck = function(menuItems, currentState)
		{
			angular.forEach(menuItems, function(item)
			{
				if(item.state == currentState)
				{
					item.isActive = true;

					if(item.parent != null)
						$menuItemsRef.setActiveParent(item.parent);
				}
				else
				{
					item.isActive = false;
					item.isOpen = false;

					if(item.menuItems.length)
					{
						$menuItemsRef.iterateCheck(item.menuItems, currentState);
					}
				}
			});
		}
	});