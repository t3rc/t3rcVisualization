
	var dataSource;
	var stringTicks;
 	var path = null;
 	var time_array = null;
 	var addresses = null;
	var maxNumberOfEvents = 0;

// initializa Timeplot
    var timeplot = null;
    var timeplot_eventSource = [];
    var plot;
    var max_number_event = 0; 
// initiate variables map 
  	var map;
  	var markers = [];
  	var infoWindows = [];
  	var heat_infoWindows = [];
  	var user_points = [];
  	
    var points = [];
  	var heat_points = [];
  	var markersArray = [];
  	var ddate = [];
	
	var homeplaces = [
	['22, 25, 30', 60.1876808, 24.8365655, 99999],
	['26', 60.1884519, 24.8349674, 99999],
	['27, 29', 60.1876879, 24.8347394, 99999],
	['28', 60.2374682, 24.8207472, 99999],
	['23, 50', 60.1883760, 24.8379305, 99999],
	['55', 60.1696449, 24.7272059, 99999],
	['42', 60.1935415, 24.9594662, 99999],
	['Innopoli 2', 60.185852, 24.8128913, 99999],
	['Kielikeskus', 60.1867395, 24.8303378, 99999]
	]
	
	var _object = {"dates":
	[{	"date":"",
	    "dh" : "",
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
		}]	
	}]
	};
	
	var users = {"users":
                    [{ "userid" : "",
                       "location" : 
                            [{ "latLong":""
                            }]
                    }] 
                };
   	var poly;
   	var individual = false;
    
  	var markerClusterer;
	var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png';  
	//var imageUrl = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=FFFFFF,008CFF,000000&ext=.png';
	
  	var imageUrlOrange = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FF8040,FF8040,000000&ext=.png';  
  	var imageUrlRed = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FF0000,FF0000,000000&ext=.png'; 
	
	var iDate = 0;
	var iCat = 0;
				
	
   google.load("visualization", "1", {packages:["corechart"]});

				     
   function initializeMashUpMap () { 


          var myLatlng = new google.maps.LatLng(60.1698, 24.9382);
        
        	var myOptions = {
            zoom: 15,
            center: myLatlng,
            panControl : false,
            zoomCotrol : true,
            zoomControlOptions : { style : google.maps.ZoomControlStyle.SMALL },
            scaleControl : false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            }
          
          map = new google.maps.Map(document.getElementById("mash-up-map"), myOptions);
          
          var polyOptions = {
               strokeColor: '#000000',
               strokeOpacity: 1.0,
               strokeWeight: 3
          }
          poly = new google.maps.Polyline(polyOptions);
          //poly.setMap(map);
        
          initializeTimeplot();
		  setHomes(map, homeplaces);
          
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
    	for (var v=0; v< _object.dates.length; v++)
		{
		  if (_object.dates[v].dh == tim)
		  {
		        //alert("gaseste data");
                for(var b=0; b < _object.dates[v].category.length; b++)
                {
                    if (_object.dates[v].category[b].name == "application")
                    {
                        //alert("gaseste application");
                        var hs = "";
                        var apps = [];
                        for (var k=0; k< _object.dates[v].category[b]._event.length; k++ )
                        {
                            if (apps.length > 0)
                            {
                                var evt = {};
                                evt["latLong"] = _object.dates[v].category[b]._event[k].latLong;
                                evt["dateEvent"] = _object.dates[v].category[b]._event[k].dateEvent;
                                evt["duration"] = _object.dates[v].category[b]._event[k].duration;
                                
                                var index = -1;
                                for (var z=0; z < apps.length; z++)
                                {
                                    if (apps[z].name == _object.dates[v].category[b]._event[k].app_name)
                                    {
                                        index = z;
                                        break;
                                    }
                                }
                                if (index == -1)
                                {
                                    var a = {};
                                    a["name"] = _object.dates[v].category[b]._event[k].app_name;
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
                                a["name"] = _object.dates[v].category[b]._event[k].app_name;
                                a["details"] = [];
                                var evt = {};
                                evt["latLong"] = _object.dates[v].category[b]._event[k].latLong;
                                evt["dateEvent"] = _object.dates[v].category[b]._event[k].dateEvent;
                                evt["duration"] = _object.dates[v].category[b]._event[k].duration;
                                a["details"].push(evt); 
                                a["nr_events"] = 1;
                                apps.push(a);
                            }
                           
                            
                        }
                        
                        console.debug(apps);
                        
                        for(var y=0; y < apps.length; y++)
                        {
                            hs += "<h3><a href='#'>"+apps[y].name+" <span class='anumber'>"+apps[y].nr_events+"</span></a></h3>";
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
                        //alert(hs);
                        $("#infoBox").accordion('destroy');
                        $("#infoBox").html(hs);
                        $("#infoBox").accordion();
                        break;
                    }
                    
                }
                break;
          }
		}

}

function showLocation(lat, lng){

    latLng = new google.maps.LatLng(lat, lng);
    map.setCenter(latLng);

}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function checkPointExistance(latlng)
{
	for(var i=0; i<heat_points.length; i++) 
	{
        if(heat_points[i].equals(latlng)) {
            
            return i;
        }
    }
    return -1;            

}

function AddDescriptionToInfoWindow(i, contentHTML)
{
	heat_infoWindows[i] = heat_infoWindows[i] + "<br/>" + contentHTML;
}
 
function clearMarkersFromMap()
{
    for (i in markers) {
      markers[i].setMap(null);
    }

} 

 
// Display Mash-up map with data filtered
function addMarkersFromXML(xml) {

    
   clearMarkersFromMap();
   
        //clear marker cluster 
    	if (markerClusterer) 
    			 markerClusterer.clearMarkers();
		
    var current_selected_period = zokemDateObject(document.dateRange);

	var lat = null;
	var lon = null;
	var time = null;
	var address = null;
	var category = null;
	var usr = null;
	
		
	var latLng  =  new google.maps.LatLng(60.1698, 24.9382);

    timeplot_eventSource = new Array();
    var index = 0;  
    var prev_date = null;
    var number_of_events = 0; 
       
    time_array = [];
    addresses = [];
    points = [];
    heat_points = [];
    user_points = [];
    heat_infoWindows = [];
    infoWindows = [];
    path = poly.getPath();
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

		lat = $(this).attr("lat");
		lon = $(this).attr("lon");
		time = $(this).attr("time");
		usr = $(this).attr("uid");

        //console.debug(time);
     	var dateEvent = new Date(time);
        
        if (lat != "" && lon != "")
		{
			latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
			//add point to line
			path.insertAt(0,latLng);
			points.splice(0,0, latLng);
			time_array.splice(0, 0, dateEvent);
			//infoWindows.splice(0, 0, htmlString);
		
			
			htmlString = "User id="+usr+" Time="+time;
			var htmlStringFirst = htmlString;
			
			var pointIndex = checkPointExistance(latLng);
			
			if (pointIndex == -1 )
			{
				heat_points.push(latLng);
				heat_infoWindows.push(htmlStringFirst);
				user_points.push(usr);
				
				//console.debug("heat_points.len:"+heat_points.length+"   user_points.len:"+user_points.length);
				
			}
			else
			{
				AddDescriptionToInfoWindow(pointIndex, '<br/>'+htmlString);
				
			}
		}
		
        if (prev_date == null)
  			prev_date =  dateEvent;
  				
			//debugger;
  			//check if the new event is in the same day 
  			if (document.range == "m" || document.range == "w")
  			{
      			if (prev_date.getDate() == dateEvent.getDate() && 
                prev_date.getMonth() == dateEvent.getMonth() &&
                prev_date.getFullYear() == dateEvent.getFullYear() )                 
				{
					//the event is in the same day with the previous one
					number_of_events = number_of_events + 1;
					//push event into json object
					var _month = dateEvent.getMonth() + 1;
					fullDate = dateEvent.getDate() + "/" + _month + "/" + dateEvent.getFullYear();
				
					
					
				}                                      
				else //The previous date is different from today
				{
					/*var evt = {};
					evt["latLong"] = latLng;
					evt["htmlString"] = htmlString;
					evt["dateEvent"] = dateEvent.getHours()+":"+dateEvent.getMinutes();
					evt["app_name"] = app_name;
					evt["duration"] = app_duration;
					var cat = {};
					cat["name"] = category;
					cat["_event"] = [];
					cat["_event"].push(evt);
					cat["num_evt"] = cat["_event"].length;
					
					var date = {};
					date["date"] = dateEvent;
					date["dh"]  = dateEvent.getDate();
					date["category"] = [];
					date["category"].push(cat);
					_object.dates.push(date);
					iDate+=1;
					iCat=0;*/
					
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
  
      
      //add clusters
    	LinkMarkersToInfoWindows(imageUrl,new google.maps.Size(24, 32));
// Temporary get rid of this
//		markerClusterer = new MarkerClusterer(map, markers, {
//		    maxZoom: null
//		});
	//if ($("#toggleheatmap").attr('checked'))
    //{
    if (!individual)
    {
        addClusterMarkers();
    }
    //}
  
  
      initializeTimeplot();
      map.setCenter(latLng);
      //initializeMap();
      clearPlayer();
       
}

function initializeTimeplot()
{
    
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

    
      $("#my-timeplot").bind("plotclick", function (event, pos, item) {
             if (item) {
                        //$("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
                        //alert (item.datapoint[1]);
                        //plot.highlight(item.series, item.datapoint);
             }
      }); 
}

function displayAllMarkersOnMap()
{
    var ds = poly.getPath();
    for(var i=0; i< ds.length; i++)
    {
    
       var marker = new google.maps.Marker({
            position: ds.getAt(i),
            map: map
          });
    }
  
    //poly.setMap(map);

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
       path: [],
       strokeColor: "#9b0d18",
       //strokeOpacity: 0.2,
       //strokeColor: '#000000',
       strokeOpacity: 0.8,
       strokeWeight: 3,
       map: map
    });

    
   var currentIndex =-1;
   var currentPosition = null;
    
   var animationPlaying = false;
   var animationStep = 0;
   var animationTime = 0;
   var animationHandle = false;
   
   function togglePlay() {
      animationPlaying = !animationPlaying;
      animationUpdate();
   }

   function play(event)
   {
      var step = event.data.param;
      var curr = currentIndex + step;
      console.debug("step "+ step +" currentIndex "+ currentIndex +" cur+step=" +curr );
      if ( (currentIndex + step) >= 0 && (currentIndex + step) <= (points.length-1))
      {  
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
          
      if (animationPlaying ) {
         if (!animationHandle) 
              animationHandle = setInterval(stepAnimation, 500);
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
          alert("Animation reached end of time interval");
          reset();
       }
       else 
       {
          if (currentIndex < points.length-1)
          {
              currentIndex =  currentIndex + 1;
              currentPosition = points[currentIndex];
          }
          
          updateMap();
       }
   }
  
   function updateMap() {
            
      var nextPosition;
      var nextIndex;
      pathLine.setPath([]);

      var p = [];

      
      //add some previous dots
      for (i=0;currentIndex-i >= 0;i++ )
      {
          p.push(points[currentIndex-i]);
      }
      
      //currentPosition = points[currentIndex];
      p.push(currentPosition);
      //nextPosition = currentPosition;
      
      console.debug("currentindex: "+currentIndex + " currentPosition: "+ currentPosition);
       nextIndex = currentIndex;

     
            
      pathLine.setPath(p);
            
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

function LinkMarkersToInfoWindows(markerIcon, size)
{
  	var marker;
  	for(var i=0; i<heat_points.length; i++) 
  	{
  	    var markerImage = new google.maps.MarkerImage(markerIcon,size);
  	    //var eventNumber =  heat_infoWindows[i].split("Category");
  	
		/*if (eventNumber.length >= 3)
		{
			markerImage = new google.maps.MarkerImage(imageUrlOrange,size);
		}
        
        if (eventNumber.length >= 5)
	    {
            markerImage = new google.maps.MarkerImage(imageUrlRed,size);
        }
		*/
		
  		  //debugger;
  		  
  		  marker = null;
  		  p = null;
  		  var p = heat_points[i]; 
  		  
  		  if(individual)
  		  {
            markerImage = "http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld="+user_points[i].substring(3)+"|FFFF42|000000";
            //markerImage = "http://chart.apis.google.com/chart?chst=d_map_spin&chld=1.1|0|FFFF42|10|b|"+user_points[i];
            //console.debug("mark"+markerImage);
            marker = new google.maps.Marker({
  							 position: p,
  							 icon: markerImage,
  							 map : map
  							 });
  		  }
  		  else
  		  {
            marker = new google.maps.Marker({
  							 position: p,
  							 icon: markerImage
  							 });
          }
  		  
  		  
  		  displayInfo(i, marker);
  		  markers.push(marker);
    }
}   

function displayInfo(i, marker) {
	   var infowindow = new google.maps.InfoWindow({
            content: heat_infoWindows[i]
        });

	   google.maps.event.addListener(marker, 'click', function() {
      		//$("#infoBox").html(heat_infoWindows[i]);
      		infowindow.open(map,marker);
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
	
	 //for(var i=0; i<markers.length; i++)
	 //{
   //    markers[i].setMap(null);
   //}
  	    
}

function addClusterMarkers()
{
		markerClusterer = new MarkerClusterer(map, markers, {
		                        	 maxZoom: null
		                   });
}

function setHomes(map, locations){
	var home_image = new google.maps.MarkerImage('img/homes.png',
      // This marker is 30 pixels wide by 30 pixels tall.
      new google.maps.Size(30, 30),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(15, 30));
	  
	var work_image = new google.maps.MarkerImage('img/works.png',
      // This marker is 30 pixels wide by 30 pixels tall.
      new google.maps.Size(30, 30),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(15, 30));
	  
	for (var i = 0; i < locations.length; i++) {
		var home = locations[i];
		var myLatLng = new google.maps.LatLng(home[1], home[2]);
		if(home[0] == 'Innopoli 2' || home[0] == 'Kielikeskus'){
			var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: work_image,
			title: home[0],
			zIndex: home[3]
			});
		};
		if(home[0] != 'Innopoli 2' && home[0] != 'Kielikeskus'){
			var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: home_image,
			title: home[0],
			zIndex: home[3]
			});
		};
  }
}