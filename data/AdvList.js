
self.port.on("SetListOfLinks", function(text) {
            console.log("self.port.on SetListOfLinks=" + text);
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent("SetListOfLinks", true, true, text);
            document.documentElement.dispatchEvent(event);
        });

document.documentElement.addEventListener("RequestListOfLinks", function(event) {
  console.log("RequestListOfLinks=" + event.detail);
  self.port.emit("RequestListOfLinks", event.detail);
  
}, false);

document.documentElement.addEventListener("RequestOpenLink", function(event) {
  console.log("RequestOpenLink=" + event.detail);
  self.port.emit("RequestOpenLink", event.detail);
  
}, false);

document.documentElement.addEventListener("RequestBookmarksManager", function(event) {
  console.log("RequestBookmarksManager=" + event.detail);
  self.port.emit("RequestBookmarksManager", event.detail);
  
}, false);
