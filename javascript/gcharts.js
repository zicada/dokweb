google.load('visualization', '1', {'packages':['corechart']});

$("document").ready(function() {
    getSensorNames();
    $('#btnSet').bind('click', function() {
	drawChart();
    });

// Grab the sensornames and populate the <select> element
function getSensorNames() {
    $.ajax({
      url: "scripts/getsensors.py",
      type: "POST",
      dataType:"json",
      success: function(response) {
         $(response).each(function() {
           var option = $('<option />');
           option.attr('value', this).text(getRealName(this.slice(0,-4))); 
           $('#selectSensor').append(option);
         });
      }
    });
}

// Return the real name of a given sensorname
function getRealName(name) {
    if (name == "statsbygg-remmen-c1140e28") {
      return "Aud max - Oppe";
    } else if (name == "statsbygg-remmen-209adfaf") {
      return "Aud max - Nede";
    } else if (name == "statsbygg-remmen-00175c3c") {
      return "FU1-042 - Dramarom";
    } else if (name == "statsbygg-remmen-e5fb2deb") {
      return "A1-022 - Stipendiatrom";
    } else if (name == "statsbygg-remmen-4b1c8e6b") {
      return "FU1-041 - Sminkerom";
    }
}

// Send the name of the selected sensor and the amt of lines we want returned, then create a new visualization object and draw it.
function drawChart() {
  var jsonData = $.ajax({
      url: "scripts/ajaxpost.py",
      dataType:"json",
      type: "POST",
      data: {'linesToGet' : $("#linesToGet").val(), 'sensor' : $("#selectSensor").val() },
      async: false
      }).responseText;
   var data = new google.visualization.DataTable(jsonData);

   // All options for LineChart go here.
   var options = {
      title: getRealName($("#selectSensor").val().slice(0,-4)),
      hAxis: {
        format: 'dMMM HH:ms'
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('visualization'));
    chart.draw(data, options);
}
});

