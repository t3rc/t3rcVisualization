
	var dataSource;
	var stringTicks;
 	//var path = null;
 	var time_array = null;
 	var addresses = null;
	var maxNumberOfEvents = 0;

// initializa Timeplot
    var timeplot = null;
    var timeplot_eventSource = new Array();
    var plot;
    var max_number_event = 0; 
// initiate variables map 
  	var map;
  	var markers = [];
// initiate variables for info box element
  	var infoWindows = [];
  	var heat_infoWindows = [];  	
    var points = [];
  	var heat_points = [];
  	
  	//filter by category
    var cat_heat_points = [];
  	var cat_heat_infoWindows = [];
  	
	var speed = 500;
	
	
	var _object = {"dates":
	[{	"date":"",
	    "dh" : "",
	    "objDate":"",
  		"category":[{
  			"name":"",
  			"_event":
  				[{
  					"latLong":"",
  					"htmlString":"",
  					"dateEvent":"",
  					"app_name":"",
  					"duration":0
  				}],
  			"num_evt":0,
  			"total_duration":0,
  		}]	
	}]
	};
	
	var cat_object = {};
	
	
   	var poly;
    
  	var markerClusterer;
	var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png';  
  	var imageUrlOrange = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FF8040,FF8040,000000&ext=.png';  
  	var imageUrlRed = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FF0000,FF0000,000000&ext=.png';
	var iDate = 0;
	var iCat = 0;


function reset_objects()
{

_object = {"dates":
	[{	"date":"",
	    "dh" : "",
	    "objDate":"",
  		"category":[{
  			"name":"",
  			"_event":
  				[{
  					"latLong":"",
  					"htmlString":"",
  					"dateEvent":"",
  					"app_name":"",
  					"duration":0
  				}],
  			"num_evt":0,
  			"total_duration":0,
  		}]	
	}]
	};
	
	cat_object = {};
}
				     
   function initializeMashUpMap() { 

        var myLatlng = new google.maps.LatLng(60.1698, 24.9382);
        
        var myOptions = {
        zoom: 15,
        center: myLatlng,
		scrollwheel: false,
        panControl : false,
        zoomCotrol : true,
        zoomControlOptions : { style : google.maps.ZoomControlStyle.SMALL },
        scaleControl : false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        }
          
        map = new google.maps.Map(document.getElementById("mash-up-map"), myOptions);
		
		//Initiate object poly
		//poly = new google.maps.Polyline();
        var timeplot_eventSource = new Array();
        console.debug("eeeee"+timeplot_eventSource.length);
		initializeTimeplot(timeplot_eventSource);
        drawChart();
          
          $("#my-timeplot").bind("plotclick", function(event, pos, item){
                        
                        if (item)
                        {
                            //alert(item.datapoint[0]);
                            display_apps(item.datapoint[0]);
                        }
                   });
				   

   }
   

function display_apps(tim)
{

        $("#infoBox").accordion('destroy');
        $("#infoBox").html("");
        var curr_objects = {};
        
        if (document.selectedCategory == "allevents")
        {
            curr_objects = jQuery.extend(true, {}, _object);
        }
        else
        {
            curr_objects = jQuery.extend(true, {}, cat_object);
        }

        console.log("currrrr");
        console.log(curr_objects);

    	for (var v=0; v< curr_objects.dates.length; v++)
		{
		  if (curr_objects.dates[v].dh == tim)
		  {
                for(var b=0; b < curr_objects.dates[v].category.length; b++)
                {
                    if (curr_objects.dates[v].category[b].name == "application")
                    {

                        var hs = "";
                        var apps = [];
                        for (var k=0; k< curr_objects.dates[v].category[b]._event.length; k++ )
                        {
                            
                            if (apps.length > 0)
                            {
                                var evt = {};
                                evt["latLong"] = curr_objects.dates[v].category[b]._event[k].latLong;
                                evt["dateEvent"] = curr_objects.dates[v].category[b]._event[k].dateEvent;
                                evt["duration"] = curr_objects.dates[v].category[b]._event[k].duration;
                                
                                var index = -1;
                                for (var z=0; z < apps.length; z++)
                                {
                                    if (apps[z].name == curr_objects.dates[v].category[b]._event[k].app_name)
                                    {
                                        index = z;
                                        break;
                                    }
                                }
                                if (index == -1)
                                {
                                    var a = {};
                                    a["name"] = curr_objects.dates[v].category[b]._event[k].app_name;
                                    a["details"] = [];
                                    a["details"].push(evt); 
                                    a["nr_events"] = 1;
                                    apps.push(a);
                                }
                                else
                                {
                                    apps[index].details.push(evt);
                                    apps[index].nr_events += 1;
                                }
                                
                            } 
                            else
                            {
                                var a = {};
                                a["name"] = curr_objects.dates[v].category[b]._event[k].app_name;
                                a["details"] = [];
                                var evt = {};
                                evt["latLong"] = curr_objects.dates[v].category[b]._event[k].latLong;
                                evt["dateEvent"] = curr_objects.dates[v].category[b]._event[k].dateEvent;
                                evt["duration"] = curr_objects.dates[v].category[b]._event[k].duration;
                                a["details"].push(evt); 
                                a["nr_events"] = 1;
                                apps.push(a);
                            }
                            
                        }
                        
                        //console.debug("aaaa");
                        //console.debug(apps);
                        
                        for(var y=0; y < apps.length; y++)
                        {
							if(apps[y].name.slice(0,20) != "")	
                            hs += "<h3><a href='#'>"+apps[y].name.slice(0,20)+" <span class='anumber'>"+apps[y].nr_events+"</span></a></h3>";
							else
							hs += "<h3><a href='#'>"+"Unknown"+" <span class='anumber'>"+apps[y].nr_events+"</span></a></h3>";
                            //hs += "<h3><a href='#'>"+apps[y].name+"</a></h3>";
                            hs += "<div>";
                            for (var z=0; z < apps[y].details.length; z++)
                            {
                                //hs += "<div><i>Time:"+apps[y].details[z].dateEvent+"</i>";
                                hs += "<a href='javascript:void(0)' onclick='showLocation("+apps[y].details[z].latLong.lat()+","+apps[y].details[z].latLong.lng()+")'>show location on map</a>";
                                hs += "<br>";
                                hs += "Time:&nbsp;"+apps[y].details[z].dateEvent;
                                hs += "<br>";
                                hs += "Duration in seconds:&nbsp;"+apps[y].details[z].duration;
                                hs += "<br>";
                                hs += "<br>";
                                
                            }
                            hs +="</div>";
                        }
                        if (document.selectedCategory != "allevents"){
                            $("#infoBox").accordion('destroy');
                            $("#infoBox").html(hs);
                        }
                        else
                        {
                            $("#infoBox").append(hs);
                            
                        }
                        
                        
                    }
                    else // category is not application
                    {
                            var hs = "";
                    
                            hs += "<h3><a href='#'>"+curr_objects.dates[v].category[b].name+" <span class='anumber'>"+curr_objects.dates[v].category[b].num_evt+"</span></a></h3>";
                            
                            hs += "<div>";
                            for (var k=0; k< curr_objects.dates[v].category[b]._event.length; k++ )
                            {
                                //hs += "<div><i>Time:"+apps[y].details[z].dateEvent+"</i>";
                                hs += "<a href='javascript:void(0)' onclick='showLocation("+curr_objects.dates[v].category[b]._event[k].latLong.lat()+","+curr_objects.dates[v].category[b]._event[k].latLong.lng()+")'>show location on map</a>";
                                hs += "<br>";
                                hs += "Time:&nbsp;"+curr_objects.dates[v].category[b]._event[k].dateEvent;
                                hs += "<br>";
                                hs += "Duration in seconds:&nbsp;"+curr_objects.dates[v].category[b]._event[k].duration;
                                hs += "<br>";
                                //hs += "Details:"
                                //hs += "<br>";
                                //hs += curr_objects.dates[v].category[b]._event[k].htmlString;
                                //hs += "<br>";
                                hs += "<br>";
                            }
                            hs +="</div>";
                           
                            if (document.selectedCategory != "allevents"){
                                $("#infoBox").accordion('destroy');
                                $("#infoBox").html(hs);
                            }
                            else
                            {
                                $("#infoBox").append(hs);
                                
                            }
                            
                    }
                    
                }
                
                $("#infoBox").accordion();
                break;
          }
		}

}

function showLocation(lat, lng){

    latLng = new google.maps.LatLng(lat, lng);
    map.setCenter(latLng);
	map.setZoom(18);

}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function checkPointExistance(heat_points,latlng)
{
	for(var i=0; i<heat_points.length; i++) 
	{
        if(heat_points[i].equals(latlng)) {
            
            return i;
        }
    }
    return -1;            

}

function AddDescriptionToInfoWindow(heat_infoWindows, i, contentHTML)
{
	heat_infoWindows[i] = heat_infoWindows[i] + "<br/>" + contentHTML;
}
 
// Display Mash-up map with data filtered
function addMarkersFromXML(xml) {

    reset_objects();
		//clear marker cluster 
		if (markerClusterer) 
			 markerClusterer.clearMarkers();
		
    var current_selected_period = zokemDateObject(document.dateRange);

	var lat = null;
	var lon = null;
	var time = null;
	var address = null;
	var category = null;
	
	
		
	var latLng  =  new google.maps.LatLng(60.1698, 24.9382);

    timeplot_eventSource = new Array();
    var index = 0;  
    var prev_date = null;
    var number_of_events = 0; 
       
    time_array = [];
    addresses = [];
    points = [];
    heat_points = [];
    heat_infoWindows = [];
    infoWindows = [];
    //path = poly.getPath();
    markers = [];
  	var cjson = {};
  	var numBrowsing = 0;
  	var numLocation = 0;	
  	var numVoice = 0;
  	var numCommunication = 0;
  	var numApplication = 0;
  	var numBattery = 0;
  	var currentDateIndex = 0;
  	var currentCateIndex = 0;
  	var currentEventIndex = 0;
  	var prev_category = null;


	iDate = 0;
	iCat = 0;
	$(xml).find("event").each(function(){
        //debugger;   
        var app_name = "";
     	  var app_duration = -1;

    
        var htmlString = "<br/>";
            //the api has other format for location and the rest of
            //categories
		if (document.selectedCategory == "location")
			{
				//edited with category variable
				category = location;
				lat = $(this).attr("lat");
				lon = $(this).attr("lon");
				time = $(this).attr("time");
				htmlString += "<span class='event_time'>"+  time + "</span><br/><br/>";
			}
		else
			{
				lat = $(this).children("latitude").text();
				lon = $(this).children("longitude").text();
				time = $(this).children("starttime").text();
				address = $(this).children("address").text();
			  
				if ($(this).attr("type")!=null && $(this).attr("type").length > 0)
				{
					category = $(this).attr("type");
				}
				else
				{
					category = document.selectedCategory;
				}

					htmlString += "<span class='event_time'>"+  time + "</span><br/><br/>";
					htmlString += "<span class='first_element'>Category:</span> &nbsp;<span class='event_category'>"+  category.charAt(0).toUpperCase() + category.slice(1)+"</span><br/>";
					htmlString += "<span class='first_element'>Address:</span> &nbsp;"+ address + "<br/>";
				
				if (category == "friends")
				{
				     category = "phone";
				}
				
					$(this).find("customvalue").each(function()
					{
    						if ($(this).attr("value").length > 0)
    						{	
        							var customName = $(this).attr("name");
        							var customValue = $(this).attr("value");
        							var add_detail = true;
        							var detail = "<span class='first_element'>"+ customName.charAt(0).toUpperCase() + customName.slice(1) +": </span> &nbsp;" + customValue +"<br/>";
        							  
        							if (category == "phone" && customName == "type" && customValue== "out") 
        							{
        								detail = "<span class='first_element'>Type:</span> &nbsp; Outgoing call <br/>"
        							}
        							else if (category == "phone" && customName == "type" && customValue== "in") 
        							{
        								detail = "<span class='first_element'>Type:</span> &nbsp; Incoming call <br/>"
        							}
        							else if (category == "phone" && customName == "type" && customValue== "out_missed") 
        							{
        								detail = "<span class='first_element'>Type:</span> &nbsp; No answer call <br/>"
        							}
        							else  if (category == "phone" && customName == "type" && customValue== "in_missed") 
        							{
        								detail = "<span class='first_element'>Type:</span> &nbsp; Missed call <br/>"
        							}
        							else if (customName == "dursec")
        							{
        								add_detail = false;
        							}
        							  
        							if (add_detail)
        							{
        								htmlString = htmlString + detail;
        							}
        							
                      //get application duration        							
        							if ( customName == "dursec")
        							{
        								app_duration = parseInt(customValue);
        							}
        							
        							//currently in application there are embeded web browsing, calls, messaging, etc
        							if (category == "application" && customName == "name")
        							{
        								app_name = customValue;
        								if (app_name == "web")
        								{
        								    category = "web";
                        }
                        else if (app_name == "voice")
                        {
                            category = "phone";
                        }
                        else if (app_name == "messaging")
                        {
                            category = "messaging";
                        }
                        
        							}
    						}
					}); //end each custom value
						
			}
		
            //console.debug(time);
     	    var dateEvent = new Date(time);
			//get rid of empty and 0,0 latitude longitude
            if (lat != "" && parseFloat(lat) != 0 && lon != "" && parseFloat(lon) != 0)
			{
				latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
				//add point to line
				//path.insertAt(0,latLng);
				points.splice(0,0, latLng);
				time_array.splice(0, 0, dateEvent);
				addresses.splice(0, 0, address);
				infoWindows.splice(0, 0, htmlString);
			
				var htmlStringFirst = htmlString;
				var pointIndex = checkPointExistance(heat_points, latLng);
				
				if (pointIndex == -1 )
				{
					heat_points.push(latLng);
					heat_infoWindows.push(htmlStringFirst);
				}
				else
				{
					AddDescriptionToInfoWindow(heat_infoWindows, pointIndex, '<br/>'+htmlString);
				}
			}
			
            if (prev_date == null)
      			prev_date =  dateEvent;
      				
				//debugger;
      			//check if the new event is in the same day 
      			if (document.range == "m" || document.range == "w")
      			{
					var min = "";
					if(dateEvent.getMinutes()<10){
						min = "0" + dateEvent.getMinutes();
					}
					else
					{
					   min = dateEvent.getMinutes();
                    }
          			if (prev_date.getDate() == dateEvent.getDate() && 
                    prev_date.getMonth() == dateEvent.getMonth() &&
                    prev_date.getFullYear() == dateEvent.getFullYear() )                 
      					{
          						//the event is in the same day with the previous one
          						number_of_events = number_of_events + 1;
          						//push event into json object
          						var _month = dateEvent.getMonth() + 1;
          						fullDate = dateEvent.getDate() + "/" + _month + "/" + dateEvent.getFullYear();
          						
          						if(prev_category == null)
          						{	
									console.debug("the minute: " + min);
									_object.dates[iDate].objDate = dateEvent;
          							_object.dates[iDate].date = fullDate;
          							_object.dates[iDate].dh = dateEvent.getDate();
          							_object.dates[iDate].category[iCat].name = category;
          							_object.dates[iDate].category[iCat]._event[0].latLong = latLng;
          							_object.dates[iDate].category[iCat]._event[0].htmlString = htmlString;
          							_object.dates[iDate].category[iCat]._event[0].dateEvent = dateEvent.getHours()+":"+min;
          							_object.dates[iDate].category[iCat]._event[0].app_name = app_name;
          							_object.dates[iDate].category[iCat]._event[0].duration = app_duration;
          							
          							
          							_object.dates[iDate].category[iCat].num_evt = 1;
          							if ( app_duration != -1){
          							    _object.dates[iDate].category[iCat].total_duration = app_duration;
          							}
          							prev_category = category;
          							
          						}
          						else if(prev_category == category)
          						{
          							var evt = {};
          							evt["latLong"] = latLng;
          							evt["htmlString"] = htmlString;
          							evt["dateEvent"] = dateEvent.getHours()+":"+min;
          							evt["app_name"] = app_name;
          							evt["duration"] = app_duration;
          							_object.dates[iDate].category[iCat]._event.push(evt);
          							_object.dates[iDate].category[iCat].num_evt = _object.dates[iDate].category[iCat]._event.length;
          							
          							if ( app_duration != -1){
          							    _object.dates[iDate].category[iCat].total_duration += app_duration;
          							}    
          						}
          						else
          						{
          							var evt = {};
          							evt["latLong"] = latLng;
          							evt["htmlString"] = htmlString;
          							evt["dateEvent"] = dateEvent.getHours()+":"+min;
          							evt["app_name"] = app_name;
          							evt["duration"] = app_duration;
          							//check if category already exists in array
          							var existing_cat_index = -1;
          							for (var v=0; v< _object.dates[iDate].category.length; v++)
          							{
          								if (_object.dates[iDate].category[v].name == category)
          								{
          									existing_cat_index = v;
          									iCat = v;
          									break;
          								}
          							}
          							if (existing_cat_index == -1)
          							{
          								var cat = {};
          								cat["name"] = category;
          								cat["_event"] = [];
          								cat["_event"].push(evt);
          								cat["num_evt"] = cat["_event"].length;
          								
          								if ( app_duration != -1){
          							    cat["total_duration"] = app_duration;
          							  }  
          								
          								_object.dates[iDate].category.push(cat);
          								iCat++;
          							}
          							else
          							{
          								_object.dates[iDate].category[iCat]._event.push(evt);
          								_object.dates[iDate].category[iCat].num_evt = _object.dates[iDate].category[iCat]._event.length;
          								if ( app_duration != -1){
                              _object.dates[iDate].category[iCat].total_duration += app_duration;
                          }
          							}
          							prev_category = category;
          						}
    					}                                      
    					else //The previous date is different from today
    					{
        						var evt = {};
        						evt["latLong"] = latLng;
        						evt["htmlString"] = htmlString;
        						evt["dateEvent"] = dateEvent.getHours()+":"+min;
        						evt["app_name"] = app_name;
        						evt["duration"] = app_duration;
        						var cat = {};
        						cat["name"] = category;
        						cat["_event"] = [];
        						cat["_event"].push(evt);
        						cat["num_evt"] = cat["_event"].length;
        						if ( app_duration != -1){
        							    cat["total_duration"] = app_duration;
        					  } 
        						
        						var date = {};
        						var _month = dateEvent.getMonth() + 1;
          					fullDate = dateEvent.getDate() + "/" + _month + "/" + dateEvent.getFullYear();
          					
          					date["objDate"] = dateEvent;
        						date["date"] = fullDate;
        						date["dh"]  = dateEvent.getDate();
        						date["category"] = [];
        						date["category"].push(cat);
        						_object.dates.push(date);
        						iDate+=1;
        						iCat=0;
        						
        						prev_category = category;
        						
        						
        						//Timeplot chart
        						timeplot_eventSource.push([prev_date, number_of_events]);
        						
        						//check max number of events
        						if (number_of_events > maxNumberOfEvents)
        							maxNumberOfEvents = number_of_events;
        						
        						prev_date = dateEvent;
        						number_of_events = 1;
        						
        						//create a new date in json
					   }
				}
				else if (document.range == "d") 
				{
					if (prev_date.getHours() == dateEvent.getHours())
					{
					     //the event is in the same day with the previous one
					     number_of_events = number_of_events + 1;		
					
					}                                          
					else
					{
    					timeplot_eventSource.push([prev_date, number_of_events]);
    					//check max number of events
    					if (number_of_events > maxNumberOfEvents)
    						maxNumberOfEvents = number_of_events;
    						
    					prev_date = dateEvent;
    					number_of_events = 1;
					}
				}
			 
  	  }); //end for each event

	    //console.debug(_object);
      //add last date with the number of events
      if (prev_date != null)
      {
        timeplot_eventSource.push([prev_date, number_of_events]);
        //check max number of events
        if (number_of_events > maxNumberOfEvents)
            maxNumberOfEvents = number_of_events;
      }
  
      
     draw_graph_and_markers(heat_points, heat_infoWindows, timeplot_eventSource);
       
}

function filter_events(category_name)
{
    console.log("filter events function ->" + category_name);
    var cat_heat_points = [];
  	var cat_heat_infoWindows = [];
  	var cat_timeplot_eventSource = [];
  	
  	//clone all events object
  	cat_object = jQuery.extend(true, {}, _object);

  	
    for (var v=0; v< _object.dates.length; v++){
    
        var rem_cat = new Array();
        for(var b=0; b < _object.dates[v].category.length; b++){
            if (_object.dates[v].category[b].name == category_name)
            {
            
                cat_timeplot_eventSource.push([_object.dates[v].objDate, _object.dates[v].category[b].num_evt]);
                
                for (var k=0; k< _object.dates[v].category[b]._event.length; k++ )
                {
                    var evt = {};
                    evt["latLong"] = _object.dates[v].category[b]._event[k].latLong;
                    evt["dateEvent"] = _object.dates[v].category[b]._event[k].dateEvent;
                    evt["duration"] = _object.dates[v].category[b]._event[k].duration;
                    evt["htmlString"] = _object.dates[v].category[b]._event[k].htmlString;
                    
    				var pointIndex = checkPointExistance(cat_heat_points, evt["latLong"]);
	
    				if (pointIndex == -1 )
    				{
    					cat_heat_points.push(evt["latLong"]);
    					cat_heat_infoWindows.push(evt["htmlString"]);
    				}
    				else
    				{
    					AddDescriptionToInfoWindow(cat_heat_infoWindows, pointIndex, '<br/>'+evt["htmlString"]);
    				}
                 }
           }
           else
           {
                console.log(_object.dates[v].date+" "+b+" "+_object.dates[v].category[b].name);
                rem_cat.push(b);
                
           }
           
         }
         
         //remove unused categories from cat_object 
         
         for(var n = rem_cat.length-1 ; n >=0  ; n--)
         {
            //console.log(rem_cat[n]+" "+cat_object.dates[v].date+" "+cat_object.dates[v].category[rem_cat[n]].name);
            console.log("rem cur cat"+rem_cat[n]);
            cat_object.dates[v].category.splice(rem_cat[n], 1);
         }                         
    }
    
    console.log("cat object");
    console.log(cat_object);
    console.log("object");
    console.log(_object);

    //display data after it was filtered by selected category
    draw_graph_and_markers(cat_heat_points, cat_heat_infoWindows, cat_timeplot_eventSource);
    
}


function draw_graph_and_markers(heat_points, heat_infoWindows, timeplot_eventSource)
{
    
      //clear all markers and clusters 
	if (markerClusterer) 
		 markerClusterer.clearMarkers();
			 
      //link markers to info windonw
      LinkMarkersToInfoWindows(imageUrl, new google.maps.Size(24, 32), heat_points, heat_infoWindows);

     //add clusters
     if ($("#toggleheatmap").attr('checked'))
     {
        addClusterMarkers();
     }
  
  
      initializeTimeplot(timeplot_eventSource);
      
      //if there is no data for the chart hide chart
      // if allevents then there is enough data
      if (document.selectedCategory == "allevents")
      {
        drawChart();
      }
      else
      {
         hideChart();
      }
      map.setCenter(heat_points[heat_points.length-1]);
      
      clearPlayer();

}




function initializeTimeplot(timeplot_eventSource)
{
    
    if (timeplot_eventSource === undefined)
        timeplot_eventSource = new Array();
    
   var mess = "Total events per day";
   var nr_ticks;
   dataSource = new Array();
   stringTicks = new Array(); 
   var current_selected_period = zokemDateObject(document.dateRange);
      
      if (document.range == "m")
      {
         var fd = current_selected_period;
         nr_ticks = daysInMonth( fd.getMonth()+1, fd.getYear());
         for (var i = 1; i <= nr_ticks; i++)
         {
               dataSource.push([i,0]);
         }
         for (var i = 0; i < timeplot_eventSource.length; i++)
         {
              var cd = timeplot_eventSource[i][0];
              dataSource[cd.getDate()-1][1] = timeplot_eventSource[i][1];
              
         }
      }
      else if (document.range == "w")
      {
         nr_ticks = 6;
         var curr = new Date();
         curr.setFullYear(current_selected_period.getFullYear(), current_selected_period.getMonth(), current_selected_period.getDate());
         //console.debug("current_selected_period " + current_selected_period + " >>>>>> curr " + curr);
         for (var i = nr_ticks; i >=0 ; i--)
         {
               curr.setFullYear(current_selected_period.getFullYear(), current_selected_period.getMonth(), current_selected_period.getDate());
               curr.setDate(curr.getDate()-i);
               dataSource.push([nr_ticks-i,0]);
               stringTicks.push([nr_ticks-i, curr.getDate().toString()]);
         }
         
         for (var i = 0; i < timeplot_eventSource.length; i++)
         {
              var cd = timeplot_eventSource[i][0];
              //console.debug(cd+">>"+cd.getDate()+" >> " + timeplot_eventSource[i][1]);
              for (var j=0; j < stringTicks.length; j++ )
              {
                  //console.debug("stringTicks[j][0] "+ stringTicks[j][0]);
                  if (stringTicks[j][1] == cd.getDate().toString())
                        dataSource[j][1] =  timeplot_eventSource[i][1];
              }
         }
      }
      else if (document.range == "d")
      {
         mess = "Total events per hour";
         nr_ticks = 24;
         for (var i = 0; i <= 24; i++)
         {
               dataSource.push([i,0]);
         }
         
         for (var i = 0; i < timeplot_eventSource.length; i++)
         {
              var cd = timeplot_eventSource[i][0];
              dataSource[cd.getHours()][1] = timeplot_eventSource[i][1];
              //console.debug(cd+ " >>"+ cd.getHours() +"  "+ timeplot_eventSource[i][1]);
         }
      }

      $(".pointValue").each(function(){
          $(this).remove();
      });
        
      
        
     if (document.range == "w")
     {
                   plot = $.plot($("#my-timeplot"),
                   [ { data: dataSource, label: mess} ], {
                       series: {
                                lines: { show: true },
                                points: { show: true/*,symbol : displayPoint*/  }
                       },
                       grid: { hoverable: true, clickable: true,  },
                       yaxis: { 
                           max: maxNumberOfEvents + 20, 
    					             min: 0,
                       },
                       xaxis: {
                           ticks : stringTicks,
                       }
                    }); 
     }
     else
     {  
                  plot = $.plot($("#my-timeplot"),
                           [ { data: dataSource, label: mess} ], {
                               series: {
                                        lines: { show: true },
                                        points: { show: true/*,symbol : displayPoint*/  }
                               },
                               grid: { hoverable: true, clickable: true,  },
                               yaxis: { 
                                   max: maxNumberOfEvents + 20, 
            					             min: 0,
                               },
                               xaxis: {
                                   ticks : nr_ticks,
                                   tickDecimals : 0,
                       }
                   }); 

     }          
      function showTooltip(x, y, contents) {
          $('<div id="tooltip">' + contents + '</div>').css( {
              position: 'absolute',
              display: 'none',
              top: y - 28,
              left: x - 5.5,
              padding: '2px',
              opacity: 0.80
          }).appendTo("body").fadeIn(200);
      }    
               
      function displayPoint(ctx, x, y, radius, shadow, contents) {
      
           
           var canvas_x = $("#my-timeplot").offset().left;
           var canvas_y = $("#my-timeplot").offset().top;

           ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
           
           if (!shadow)
           {
               $('<div class="pointValue">' + contents + '</div>').css( {
               position: 'absolute',
               top: canvas_y + y - 35,
               left: canvas_x + x - 7,
               border: '1px solid #fdd',
               padding: '2px',
               'background-color': '#fee',
               opacity: 0.80
               }).appendTo("body");
           }
       }

       
       var previousPoint = null;
       $("#my-timeplot").bind("plothover", function (event, pos, item) {
             $("#x").text(pos.x.toFixed(2));
             $("#y").text(pos.y.toFixed(2));
            

             if (item) {
                 if (previousPoint != item.dataIndex) {
                     previousPoint = item.dataIndex;
                    
                     $("#tooltip").remove();
                     var x = item.datapoint[0].toFixed(0),
                     y = item.datapoint[1].toFixed(0);
                    
                     showTooltip(item.pageX, item.pageY,
                     y );
                 }
             }
             else {
                $("#tooltip").remove();
                previousPoint = null;            
            }

      });                

}

//************************************************************************
//   PLAYER
//************************************************************************

    positionIcon0 = new google.maps.MarkerImage('http://smartmob.zokem.com/vu/markers/position.png', new google.maps.Size(42, 39), new google.maps.Point(0,0), new google.maps.Point(16, 23));
      
    positionMarker = new google.maps.Marker({
       position: new google.maps.LatLng(0,0),
       icon: positionIcon0,
       title: 'your estimated position during the day',
       map: map,
       clickable: false
    });
    
    pathLine = new google.maps.Polyline({
       strokeColor: "#9b0d18",
       strokeOpacity: 0.8,
       strokeWeight: 3,
    });
    
   var currentIndex =-1;
   var currentPosition = null;
    
   var animationPlaying = false;
   var animationHandle = false;
   
   function togglePlay() {
      animationPlaying = !animationPlaying;
      animationUpdate();
   }

   function play(event)
   {
      var step = event.data.param;
      var curr = currentIndex + step;
      //console.debug("step "+ step +" currentIndex "+ currentIndex +" cur+step=" +curr );
      if ( (currentIndex + step) >= 0 && (currentIndex + step) <= (points.length-1))
      {  
		//Handle the player's steps
        currentIndex =  currentIndex + step;
        currentPosition = points[currentIndex];
        updateMap();

      }
      
      if (currentIndex + step < 0)
      {
          $('#prevbtn').attr("disabled", true);
      }
      else
      {
          $('#prevbtn').attr("disabled", false);
      }
      
      
      if (currentIndex + step > points.length-1)
      {
          $('#nextbtn').attr("disabled", true);
      }
      else
      {
          $('#nextbtn').attr("disabled", false);
      }
   }
   
   //*******************************************************
   // reset
   //*******************************************************
   function clearPath()
   {
       currentIndex = 0;
	   var p = pathLine.getPath();
	   while(p.getLength()>0) p.pop();
	   pathLine.setMap(null);
       
       if (points.length > 0)
       {
           currentPosition = points[currentIndex];
           positionMarker.setPosition(currentPosition);
           positionMarker.setMap(map);
           map.setCenter(currentPosition);
           $('#prevbtn').attr("disabled", true);
           $('#nextbtn').attr("disabled", false);
           $('#btnplaypause').attr("disabled", false);
           displayInfoOfEvent(1);
       }
       else
       {       
           $('#prevbtn').attr("disabled", true);
           $('#nextbtn').attr("disabled", true);
           $('#btnplaypause').attr("disabled", true);
       }
   }
   
   function clearPlayer()
   {
        clearPath();
        positionMarker.setMap(null);
   }
   
   function reset()
   {
       if (animationPlaying)
       {
          clearInterval(animationHandle);
          animationHandle = false;
          document.getElementById('btnplaypause').innerHTML = "Play";
          animationPlaying = false;
       } 
	   
       clearPath();
       
    }

    function animationUpdate() {
      
	  //append the html value for id playButton
      var playButton = animationPlaying ? "Pause" : "Play";
      
      //disable prev and next if playing
      if (animationPlaying)
      {
          $('#prevbtn').attr("disabled", true);
          $('#nextbtn').attr("disabled", true);
      }
      else
      { 
          $('#prevbtn').attr("disabled", false);
          $('#nextbtn').attr("disabled", false);  
      }
      
      if (playButton != document.getElementById('btnplaypause').innerHTML) 
          document.getElementById('btnplaypause').innerHTML = playButton;
          
      if (animationPlaying) {
         if (!animationHandle) 
              animationHandle = setInterval(stepAnimation, speed);
      } else {
         if (animationHandle) {
            clearInterval(animationHandle);
            animationHandle = false;
         }
      }

   }

   function stepAnimation() {
   
       if (currentIndex >= points.length-1)
       {
         if (animationPlaying)
			{
			alert("Animation reached end of time interval. Click reset to start from the beginning.");
			clearInterval(animationHandle);
			animationHandle = false;
			document.getElementById('btnplaypause').innerHTML = "Play";
			animationPlaying = false;
			} 
       }
       else 
       {
          if (currentIndex < points.length-1)
          {
              currentPosition = points[currentIndex];
			  currentIndex =  currentIndex + 1;
          }
          
          updateMap();
       }
   }
  
   function updateMap() {
            
      console.debug("current index is: " + currentIndex + " current position is: " + currentPosition);
	  //var nextPosition;
      var nextIndex;

	  var p = pathLine.getPath();
	
      //currentPosition = points[currentIndex];
		p.push(currentPosition);
		
      //nextPosition = currentPosition;
      
      //console.debug("currentindex: "+currentIndex + " currentPosition: "+ currentPosition);
       nextIndex = currentIndex - 1;

      //pathLine.setPath(p);

      // Positioniere Marker
      positionMarker.setPosition(currentPosition);    
      
      positionMarker.setMap(map);
      pathLine.setMap(map);
      
      // Positioniere Karte
      map.setCenter(currentPosition);

      //set info details
      displayInfoOfEvent(nextIndex);
   }

function displayInfoOfEvent(nextIndex)
{
    if ( currentIndex <= infoWindows.length-1)
    {    
        var info = infoWindows[currentIndex] + "<span class='first_element'>Event#:</span> &nbsp;"+ nextIndex ;  
        $("#infoBox").html(info);
    }
    else
        $("#infoBox").html("");
}

function LinkMarkersToInfoWindows(markerIcon, size, heat_points, heat_infoWindows)
{
  	var marker;
  	//clear markers
  	markers = [];
  	for(var i=0; i<heat_points.length; i++) 
  	{
  	    var markerImage = new google.maps.MarkerImage(markerIcon,size);
  	    var eventNumber =  heat_infoWindows[i].split("Category");
  	
	      if (eventNumber.length >= 3)
	      {
             markerImage = new google.maps.MarkerImage(imageUrlOrange,size);
        }
        
        if (eventNumber.length >= 5)
	      {
            markerImage = new google.maps.MarkerImage(imageUrlRed,size);
        }

  		  marker = null;
  		  p = null;
  		  var p = heat_points[i]; 
  		  marker = new google.maps.Marker({
  							 position: p,
  							 icon: markerImage
  							 });
  		  displayInfo(i, marker);
  		  markers.push(marker);
    }
}   

function displayInfo(i, marker) {
	   
	   google.maps.event.addListener(marker, 'click', function() {
      		$("#infoBox").html(heat_infoWindows[i]);
 	   });

}

function toogleHeatMap()
{
    if ($("#toggleheatmap").attr('checked'))
    {
        addClusterMarkers();
    }
    else
    {
        removeClusterMarkers();
        //reset();
    }
}

function removeClusterMarkers()
{
   if (markerClusterer) 
		    markerClusterer.clearMarkers();
}

function addClusterMarkers()
{
		markerClusterer = new MarkerClusterer(map, markers, {
		                        	 maxZoom: null
		                   });
}
