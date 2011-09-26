var timeline = null;
var eventSource = null;
var urls = null;

function showTimeline(){
    //debugger;
    eventSource = new Timeline.DefaultEventSource();
    var bandInfos = [
                     Timeline.createBandInfo({
                                   eventSource:    eventSource,
                                   width:          "80%", 
                                   intervalUnit:   Timeline.DateTime.HOUR, 
                                   intervalPixels: 100
                                                       }),
                     Timeline.createBandInfo({
                                   showEventText:  false,
                                   eventSource:    eventSource,
                                   width:          "20%", 
                                   intervalUnit:   Timeline.DateTime.DAY, 
                                   intervalPixels: 100,
                                   trackHeight:    0.75,
                                   trackGap:       0.2
                                                       })
    ];
    // synchronise bands
    bandInfos[1].syncWith = 0;
    bandInfos[1].highlight = true;
    timeline = Timeline.create(document.getElementById("timeline"), bandInfos);
    // load xml
    Timeline.loadXML("http://smartmob.zokem.com/cv/lib/timeline.xml", function(xml, url) { eventSource.loadXML(xml, url); });

    // hijack popup window callback to show earthquake
    Timeline.DurationEventPainter.prototype._showBubble = function(x, y, evt) {
        GEvent.trigger(evt.marker, 'click');
        map.panTo(evt.marker.getPoint());
    }
    // add callback for window resize
    // here instead of the html file, to conform with XHTML 1.0
    window.onresize = onResize;
    }
    

function parseInfo (item) {
    
}
