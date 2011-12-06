google.load('visualization', '1', {'packages':['motionchart']});

google.setOnLoadCallback(drawChart);

function drawChart() {
  
    var gvdata = new google.visualization.DataTable();
	gvdata.addColumn('string', 'Event Category');
	gvdata.addColumn('date', 'Date');
	gvdata.addColumn('number', 'Movement');
	gvdata.addColumn('number', 'Nr of Events');
	gvdata.addColumn('number', 'Duration');
	
	
	  if (_object.dates.length > 1)
    {
    
        //console.debug(_object);
	      for (var v=_object.dates.length-1; v>=0; v--){
           var date = _object.dates[v].objDate;
           //console.debug(date);
      
           //nr of places
           var nr_places = 0;
           
           var nr_web  = 0;
           var dur_web = 0;
           
           var nr_application = 0;
           var dur_app = 0;
           
           var nr_calendar = 0;
           var dur_cal = 0;
       

           //nr of places
           for (var i=0; i < _object.dates[v].category.length; i++)
           {
                 if(nr_places && nr_web && nr_application && nr_calendar)
                      break;
           
                 if  (_object.dates[v].category[i].name == "places")
                 {
                      nr_places = _object.dates[v].category[i].num_evt;
                 }
                 else if (_object.dates[v].category[i].name == "web")
                 {
                      nr_web = _object.dates[v].category[i].num_evt;
                      dur_web = _object.dates[v].category[i].total_duration;
                 }
                 else if (_object.dates[v].category[i].name == "calendar")
                 {
                      nr_calendar = _object.dates[v].category[i].num_evt;
                      dur_cal = _object.dates[v].category[i].total_duration;
                 }
                 else if(_object.dates[v].category[i].name == "application")
                 {
                      nr_application = _object.dates[v].category[i].num_evt;
                      dur_app = _object.dates[v].category[i].total_duration;
                 }
           
           }
           
           
           gvdata.addRow(['Web', date, nr_places, nr_web, dur_web] );
           gvdata.addRow(['Application', date, nr_places, nr_application, dur_app] );
           gvdata.addRow(['Calendar', date, nr_places, nr_calendar, dur_cal] );

       }    
       
       

       
    }   
		
    var chart = new google.visualization.MotionChart(document.getElementById('chart_div'));
    chart.draw(gvdata, {width: 880, height:600, playDuration:15 });
    $("#chart_div").show();
}

function hideChart(){
    $("#chart_div").hide();
    
}
