
var win = document.defaultView;
console.log("win=" + win); 
console.log("win.content=" + win.content);
console.log("win.name=" + win.name);
console.log("win.content.name=" + win.content.name);
console.log("win.document.title=" + win.document.title);
console.log("window.window=" + window.window);
var obj = XPCNativeWrapper.unwrap(window.window);
console.log("obj=" + obj);
//win.content.scroll(0, 1000);
//obj.c(0,1000);

window.onclick = function() {
  //window.alert("You clicked me 1");
  console.log("You clicked me 1");
  
  self.port.emit("iniWindow", "iniWindow");	
  
   console.log("send window.onload")
};

window.onload = function() {
  //window.alert("You clicked me 1");
  console.log("window.onload");
  //window.scroll(0, 1000);\\
  
  self.port.emit("iniWindow", "iniWindow");	
  
   console.log("send window.onload");
   
   window.find("The Page Context", true, false, false, true, true, false);
  //self.emit("iniWindow", "iniWindow");	
};

function init() {
        console.log("body load");

	  self.port.emit("iniWindow", "iniWindow");	
};

if (document)
{
	if (document.documentElement)
	{
		document.documentElement.addEventListener("load", function(event) {
		  console.log("load" + event.detail);
		  
		}, false);

		document.documentElement.addEventListener("onload", function(event) {
		  console.log("onload" + event.detail);
		  
		}, false);
	}
	
	document.body.addEventListener("load", init, false);
}
