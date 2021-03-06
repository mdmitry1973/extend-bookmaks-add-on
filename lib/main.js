// The main module of the mdmitry1973 Add-on.

exports.main = function(options, callbacks) {

    console.log(options.loadReason);

	var tabs = require("sdk/tabs");
    var contexMenu = require('sdk/context-menu');
    var ss = require("sdk/simple-storage");
	var _ = require("sdk/l10n").get;
	var sp = require("sdk/simple-prefs");
	var self = require("sdk/self");
	var notifications = require("sdk/notifications");
	var { ToggleButton }  = require("sdk/ui/button/toggle");
	var panels = require("sdk/panel");
	var { Frame } = require("sdk/ui/frame");
	var	menuitemManager = require("menuitem");
	
	var button = ToggleButton({
	  id: "Advanced-bookmarks-Button",
	  label: "Advanced bookmarks",
	  icon: {
		"16": self.data.url("bookmarks.png"),
		"32": self.data.url("bookmarks32.png"),
		"64": self.data.url("bookmarks64.png")
	  },
	   onChange: handleClickButton
	});
	
	 

	function handleClickButton(state) {
	   
	  console.log("handleClickButton Advanced bookmarks");
	  
	  if (state.checked) {
	  
		var panelAdvancedBookmarksButton = panels.Panel({
		contentURL: self.data.url("AdvList.html"),
		contentScriptFile: self.data.url("AdvList.js"),
		onHide: handleHideButton
	});
	
		 panelAdvancedBookmarksButton.port.on("RequestListOfLinks", function(text) {
				console.log("port.on RequestListOfLinks=" + text);
                console.log("text == SetListOfLinks");
				
				var strNoItems = _("No items");
               
				var message = { bookmarks:   ss.storage.bookmarks, 
								NoItems: strNoItems
				};
        
                var jsonString = JSON.stringify(message);
                panelAdvancedBookmarksButton.port.emit("SetListOfLinks", jsonString);
        });
		
		panelAdvancedBookmarksButton.port.on("RequestOpenLink", function(text) {
				console.log("port.on RequestOpenLink=" + text);
				
				panelAdvancedBookmarksButton.hide();
				itemAction(text);
        });
		
		panelAdvancedBookmarksButton.port.on("RequestBookmarksManager", function(text) {
				console.log("port.on RequestBookmarksManager=" + text);
                console.log("text == RequestBookmarksManager");
				
				itemBookMarksManager(0);
        });
		
		panelAdvancedBookmarksButton.show({
		  position: button
		});
	  }
	}
	
	function handleHideButton() {
	  button.state('window', {checked: false});
	}
    
    //create empty urls store
    if (!ss.storage.bookmarks)
    {
        console.log("empty bookmarks");
        ss.storage.bookmarks = [];
    }
	
	sp.on("BackupData", function() {
        console.log("BackupData");
		console.log(sp.prefs.storeFile);
		var fileSDK = require("sdk/io/file");
		var jsonString = JSON.stringify(ss.storage.bookmarks);
		//console.log(jsonString);
		var stream = fileSDK.open(sp.prefs.storeFile, "w");
		console.log("stream");
		stream.write(jsonString);
		console.log("write");
		stream.close();
	});
		
	sp.on("RestoreData", function() {
        console.log("RestoreData");
		console.log(sp.prefs.storeFile);
		var fileSDK = require("sdk/io/file");
		if (fileSDK.exists(sp.prefs.storeFile))
		{
			var data = fileSDK.read(sp.prefs.storeFile, "b");
			//console.log(data);
			
			if (data.length)
			{
				console.log("RestoreData2");
				ss.storage.bookmarks = [];
				
				var jsObject = JSON.parse(data);
			
				for (var i = 0; i < jsObject.length; i++)
				{
					console.log(jsObject[i]);
					ss.storage.bookmarks.push(jsObject[i]);
				}
				
				ReInitMenu();
				
				console.log("ReInitMenu");
			}
		}
	});
	
	//add Advanced-bookmarks menu in bookmarks menu
	
	var menusep = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-sep",
		menuid: "bookmarksMenuPopup",
		menuItemType: "menuseparator",
		label: "Advanced menuseparator",
		className: 'pizazz',
		disabled: false,
		checked: false,
	  });
	  
	  
	  
	  //bookmarksToolbarFolderMenu 
	  //organizeBookmarksSeparator 
	  //unsortedBookmarks 
	 // bookmarksShowAll
	  //iewBookmarksToolbar
	  //BMB_bookmarksPopup done
	  //personal-bookmarks done
	  //appmenu_bookmarkThisPage
	  //appmenu_bookmarksToolbar
	  
	 
	
	var menubookmaks = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-Menu",
		menuid: "bookmarksMenuPopup",
		menuItemType: "menu",
		label: _("Advanced bookmarks"),
		image: self.data.url("bookmarks.png"),
		className: 'pizazz',
		disabled: false,
		checked: false,
	});
	  
	var menubookmaksmenupopupItem = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-menupopup",
		menuid: "Advanced-bookmarks-Menu",
		label: "Advanced bookmaks item",
		menuItemType: "menupopup",
		className: 'pizazz',
		disabled: false,
		checked: false,
	});
	
	//second bookmarks menu
	
	var menusep2 = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-sep-2",
		menuid: "BMB_bookmarksPopup",
		label: "Advanced menuseparator",
		menuItemType: "menuseparator",
		className: 'pizazz',
		disabled: false,
		checked: false,
	  });
	  
	var menubookmaks2 = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-Menu-2",
		menuid: "BMB_bookmarksPopup",
		menuItemType: "menu",
		label: _("Advanced bookmarks"),
		image: self.data.url("bookmarks.png"),
		className: 'pizazz',
		disabled: false,
		checked: false,
	});
	  
	var menubookmaksmenupopupItem2 = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-menupopup-2",
		menuid: "Advanced-bookmarks-Menu-2",
		label: "Advanced bookmaks item",
		menuItemType: "menupopup",
		className: 'pizazz',
		disabled: false,
		checked: false,
	});
	
	//third bookmarks menu
	  
	var menusep3 = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-sep-3",
		menuid: "appmenu_bookmarksPopup",
		label: "Advanced menuseparator",
		menuItemType: "menuseparator",
		className: 'pizazz',
		disabled: false,
		checked: false,
	  });
	  
	var menubookmaks3 = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-Menu-3",
		menuid: "appmenu_bookmarksPopup",
		menuItemType: "menu",
		label: _("Advanced bookmarks"),
		image: self.data.url("bookmarks.png"),
		className: 'pizazz',
		disabled: false,
		checked: false,
	});
	  
	var menubookmaksmenupopupItem3 = menuitemManager.Menuitem({
		id: "Advanced-bookmarks-menupopup-3",
		menuid: "Advanced-bookmarks-Menu-3",
		label: "Advanced bookmaks item",
		menuItemType: "menupopup",
		className: 'pizazz',
		disabled: false,
		checked: false,
	});
	
	//select BookMarksManager
	function itemBookMarksManager(id)
    {
		var panel = require("sdk/panel").Panel({
                height: 400,
                width: 600,
                contentURL: self.data.url("BookmarksManager.html"),
                contentScriptFile: self.data.url("BookmarksManager.js")
            });
			
		panel.port.on("RequesBookMarks", function(text) {
				//console.log("port.on RequesBookMarks=" + text);
                
				var jsObject = JSON.parse(text);
				var arrLocalizeStrings = [];
			
				for (var i = 0; i < jsObject.length; i++)
				{
					console.log("jsObject[i]=" + jsObject[i]);
				   var new_text = _(jsObject[i]);
				   console.log("new_text=" + new_text);
				   arrLocalizeStrings.push(new_text);
				}
                
				var message = { bookmarks:   ss.storage.bookmarks,  
                            arrLocalizeStrings:   arrLocalizeStrings
				};
        
                var jsonString = JSON.stringify(message);
                panel.port.emit("SendBookMarks", jsonString);
        });
        
         panel.port.on("StoreData", function(text) {
            //console.log("port.on StoreData=" + text);
            
            ss.storage.bookmarks = [];
            
            var jsObject = JSON.parse(text);
        
            for (var i = 0; i < jsObject.length; i++)
            {
                ss.storage.bookmarks.push(jsObject[i]);
            }
            
            resetAdvancedbookmarksMenu();
        });
        
        panel.port.on("ShowToolTip", function(text) {
            //console.log("port.on ShowToolTip=" + text);
            
            notifications.notify({
                        text: text
                });
        });
		
        panel.show();
	}
	
	//select bookmark
	function itemAction(id)
    {    
        console.log("itemAction=" + id);
		
		var index = id.replace("Advanced-bookmarks-item-", "");
		
		console.log("index=" + index);
		
		if (index < ss.storage.bookmarks.length)
		{
			var objectData = ss.storage.bookmarks[index];
			
			console.log("objectData.label=" +  objectData.label);
			console.log("objectData.url=" +  objectData.url);
			console.log("objectData.type=" +  objectData.type);
			
			if (objectData.url.legnth != 0)
            {
				var currentIndex = tabs.activeTab.index;
				var length = tabs.length;
                
				tabs.open({
					  url: objectData.url,
					  onOpen: function onOpen(tab) {
						console.log("onOpen");
						//tab.attach({
						//contentScriptFile: self.data.url("bookmarks_scroll.js"),
					 // });
					  
					  },
					  onActivate : function onActivate(tab) {
						console.log("onActivate");
					//	tab.attach({
					//	contentScriptFile: self.data.url("bookmarks_scroll.js"),
					  //});
					  },
					  onReady  : function onReady(tab) {
						console.log("onReady");
						
						if (objectData.type == "position")
						{
							var strScript = "\n";
							
							strScript = strScript + 'window.onload = function() {\n';
							strScript = strScript + 'console.log("window.onload");\n';
							strScript = strScript + 'window.scroll(' + objectData.scrollX + ', ' + objectData.scrollY + ');\n';
							strScript = strScript + '};\n';
							
							console.log("strScript=" + strScript);
							
							tab.attach({
								contentScript: strScript,
								//contentScriptFile: self.data.url("bookmarks_scroll.js"),
							});
						}
						else
						{
							console.log("objectData.selection=" + objectData.selection);
							//selection.text = objectData.selection;
							
							var strScript = "\n";
							
							strScript = strScript + 'window.onload = function() {\n';
							strScript = strScript + 'console.log("window.onload");\n';
							//strScript = strScript + 'window.scroll(' + objectData.scrollX + ', ' + objectData.scrollY + ');\n';
							strScript = strScript + 'window.find("' + objectData.selection + '", true, false, false, true, true, false);\n';
							strScript = strScript + '};\n';
							
							console.log("strScript=" + strScript);
							
							var worker = tab.attach({
								contentScript: strScript,
								//contentScriptFile: self.data.url("bookmarks_scroll.js"),
							});
							
							//worker.port.on('iniWindow', function(tab) {
							//	  console.log(' worker iniWindow ');
							//	});
						}
					  }
					});
				
				if (sp.prefs.nextCurrent)
				{
					tabs[length].index = currentIndex + 1;
				}
            }
		}
    }  
	  
	function resetAdvancedbookmarksMenu()
    { 
		menubookmaksmenupopupItem.destroy();
		menubookmaksmenupopupItem2.destroy();
		menubookmaksmenupopupItem3.destroy();
	
		menubookmaksmenupopupItem = menuitemManager.Menuitem({
			id: "Advanced-bookmarks-menupopup",
			menuid: "Advanced-bookmarks-Menu",
			label: "Advanced bookmaks item",
			menuItemType: "menupopup",
			className: 'pizazz',
			disabled: false,
			checked: false,
		});
		
		menubookmaksmenupopupItem2 = menuitemManager.Menuitem({
			id: "Advanced-bookmarks-menupopup-2",
			menuid: "Advanced-bookmarks-Menu-2",
			label: "Advanced bookmaks item",
			menuItemType: "menupopup",
			className: 'pizazz',
			disabled: false,
			checked: false,
		});
		
		menubookmaksmenupopupItem3 = menuitemManager.Menuitem({
			id: "Advanced-bookmarks-menupopup-3",
			menuid: "Advanced-bookmarks-Menu-3",
			label: "Advanced bookmaks item",
			menuItemType: "menupopup",
			className: 'pizazz',
			disabled: false,
			checked: false,
		});
		
		
		menuitemManager.Menuitem({
				id: "BookmaksManager",
				menuid: "Advanced-bookmarks-menupopup",
				label: _("Bookmarks Manager"),
				className: 'pizazz',
				disabled: false,
				checked: false,
				onCommand: function() {
					itemBookMarksManager();
				}
			 });
			 
		menuitemManager.Menuitem({
				id: "BookmaksManager-2",
				menuid: "Advanced-bookmarks-menupopup-2",
				label: _("Bookmarks Manager"),
				className: 'pizazz',
				disabled: false,
				checked: false,
				onCommand: function() {
					itemBookMarksManager();
				}
			 });
			 
		menuitemManager.Menuitem({
				id: "BookmaksManager-3",
				menuid: "Advanced-bookmarks-menupopup-3",
				label: _("Bookmarks Manager"),
				className: 'pizazz',
				disabled: false,
				checked: false,
				onCommand: function() {
					itemBookMarksManager();
				}
			 });
		
		for (var i = 0; i < ss.storage.bookmarks.length; i++)
		{
			menuitemManager.Menuitem({
				id: "Advanced-bookmarks-item-" + i,
				menuid: "Advanced-bookmarks-menupopup",
				label: ss.storage.bookmarks[i].label,
				className: 'pizazz',
				disabled: false,
				checked: false,
				onCommand: function(data) {
					console.log("data=" +  data.id);
					itemAction(data.id);
				}
			 });
			 
			menuitemManager.Menuitem({
				id: "Advanced-bookmarks-item-" + i,
				menuid: "Advanced-bookmarks-menupopup-2",
				label: ss.storage.bookmarks[i].label,
				className: 'pizazz',
				disabled: false,
				checked: false,
				onCommand: function(data) {
					console.log("data=" +  data.id);
					itemAction(data.id);
				}
			 });
			 
			menuitemManager.Menuitem({
				id: "Advanced-bookmarks-item-" + i,
				menuid: "Advanced-bookmarks-menupopup-3",
				label: ss.storage.bookmarks[i].label,
				className: 'pizazz',
				disabled: false,
				checked: false,
				onCommand: function(data) {
					console.log("data=" +  data.id);
					itemAction(data.id);
				}
			 });
		}
	}
	
	resetAdvancedbookmarksMenu();
	
	function addAdvancedbookmarks(objectData)
    { 
		if (objectData.label == "")
		{
			objectData.label = objectData.url;
		}
		
		var index = 0;
		
		for (var i = 0; i < ss.storage.bookmarks.length; i++)
		{
			//console.log("ss.storage.bookmarks[i].label=" +  ss.storage.bookmarks[i].label);
			
			if (index ==0 &&
				ss.storage.bookmarks[i].label == objectData.label)
			{
				console.log("index found=" +  index);
				index++;
				i = -1;
			}
			else
			if (ss.storage.bookmarks[i].label == (objectData.label + " " + index))
			{
				console.log("index found=" +  index);
				index++;
				i = -1;
			}
		}
		
		if (index)
		{
			objectData.label = objectData.label + " " + index;
		}
		
		console.log("index=" +  index);
		console.log("objectData.label=" +  objectData.label);
		console.log("objectData.url=" +  objectData.url);
		console.log("objectData.type=" +  objectData.type);
		
		ss.storage.bookmarks.push(objectData);
		
		resetAdvancedbookmarksMenu();
	}
	
	//action for text context menu
	var searchMenuBySelectText = contexMenu.Item({
        label: _("Advanced bookmarks by select text"),
		image: self.data.url("bookmarks.png"),
		context: contexMenu.SelectionContext(),
		contentScript: 'self.on("click", function (node, data) {' +
                'console.log("click by select text");' +
                'console.log("document.title=" +  document.title);' +
				'var objectData = {' + 
						'label: document.title, ' +
						'url: document.URL, ' +
						'type: "text",' +
						'selection: window.getSelection().toString()};' +   
						'self.postMessage(objectData);' +
				'});',
				
				onMessage: function(objectData)
				{
					addAdvancedbookmarks(objectData);
				}
    });
    
	//action for position context menu
    var searchMenu = contexMenu.Item({
        label: _("Advanced bookmarks by position"),
		image: self.data.url("bookmarks.png"),
        context: contexMenu.PageContext(),
        contentScript: 'self.on("click", function (node, data) {' +
                'console.log("click by position");' +
				'console.log("document.title=" +  document.title);' +
				'console.log("window.scrollX=" +  window.scrollX);' +
				'console.log("window.scrollY=" +  window.scrollY);' +
				'console.log("window.innerHeight=" +  window.innerHeight);' +
				'var objectData = {' + 
						'label: document.title, ' +
						'url: document.URL, ' +
						'scrollX: window.scrollX, ' +
						'scrollY: window.scrollY,' +
						'type: "position"};' +   
						'self.postMessage(objectData);' +
        '});',
        
        onMessage: function(objectData)
        {
            addAdvancedbookmarks(objectData);
        }
    });
};
