$("document").ready(function() {

    //Fyller inn sensor menyen
    getSensorNames();
    
    //lytter til museklikk på submit knappen og kjører begge tegne funksjonene
    $('#btnSet').click(function() {

        drawGraf();
        drawBars();

    });













  
    //Hovedfunksjon for tegning av grafen
    function drawGraf(){

        var graph;
        var xPadding = 30;
        var yPadding = 30;

        //Henter inn canvas elementet etter ID og setter konteksten vi skal bruke som er 2D
        graph = $("#can2");
        var c = graph[0].getContext('2d');
             
        var tmp = getSensorData(1440);
        var tid = new Array();
        var data = new Array();
        var data2 = new Array();
        var data3 = new Array();
        var data4 = new Array();
        var data5 = new Array();
        var data6 = new Array();
    
        var increment = 200
        
        //distribuerer dataen fra den 2dimensjonale arrayen til egene arrayer og runder av verdiene. Strengt tatt ikke nødvendig, men gjorde det lettere å arbeide med.
        for(var i = 0; i < tmp[0].length -1; i += increment) {
            data[i] = Math.round(tmp[0][i]);
            data2[i] = Math.round(tmp[1][i]/10);
            data3[i] = Math.round(tmp[2][i]);
            data4[i] = Math.round(tmp[3][i]);
            data5[i] = Math.round(tmp[4][i]);
            data6[i] = Math.round(tmp[5][i]);

            tid[i] = timeConverter(tmp[6][i], 2);
        }

        //finner maksverdien i alle data arrayene sånn at grafen kan endre seg dynamisk
        function getMaxY() {
            var max = 0;
         
            for(var i = 0; i < data.length; i += increment) {
                if(data[i] > max) {
                    max = data[i];
                }
                if(data2[i] > max) {
                    max = data2[i];
                }
                if(data3[i] > max) {
                    max = data3[i];
                }
                if(data4[i] > max) {
                    max = data4[i];
                }
                if(data5[i] > max) {
                    max = data5[i];
                }
                if(data6[i] > max) {
                    max = data6[i];
                }
            }
            
            max += 10;
            
            return max;
        }
     
        //hjelpe funksjon som finner riktig X pixel verdi på bakgrunn av data array verdi
        function getXPixel(val) {
            return ((graph.width() - xPadding) / data.length) * val + (xPadding * 1.5);
        }
        //hjelpe funksjon som finner riktig Y pixel verdi på bakgrunn av data array verdi
        function getYPixel(val) {
            return graph.height() - (((graph.height() - yPadding) / getMaxY()) * val) - yPadding;
        }
 
        //resetter canvasen så ny graf kan tegnes.
        c.clearRect(0, 0, graph[0].width, graph[0].height);

        //Bytter ut h2 tittelen med navnet på rommet brukeren har valgt
        $("#tittel").empty();
        $("#tittel").append(getRealName($("#selectSensor").val().slice(0,-4)));

        //setter div instillinger på c
        c.lineWidth = 2;
        c.strokeStyle = '#333';
        c.font = 'italic 8pt sans-serif';
        c.textAlign = "center";

        c.beginPath();
        c.moveTo(xPadding, 0);
        c.lineTo(xPadding, graph.height() - yPadding);
        c.lineTo(graph.width(), graph.height() - yPadding);
        c.stroke();

        //Fyller inn tidspunktet for målingen som representeres
        for(var i = 0; i < tid.length; i += increment) {
            c.fillText(tid[i], getXPixel(i), graph.height() - yPadding + 20);
        }

        c.textAlign = "right"
        c.textBaseline = "middle";
        
        //skriver inn Y verdiene til grafen
        for(var i = 0; i < getMaxY(); i += 10) {
            c.fillText(i, xPadding - 10, getYPixel(i));
        }


        c.strokeStyle = '#f00';
        c.beginPath();
        c.moveTo(getXPixel(0), getYPixel(data[0]));
        
        //endrer farge og sender alle datasettene til draw funksjonen
        draw(data);
        c.strokeStyle = 'blue';
        draw(data2);
        c.strokeStyle = 'black';
        draw(data3);
        c.strokeStyle = 'yellow';
        draw(data4);
        c.strokeStyle = 'green';
        draw(data5);
        c.strokeStyle = 'orange';
        draw(data6);

        //funksjonen som tegner opp alle linjene
        function draw(tegneData){

            c.beginPath();
            c.moveTo(getXPixel(0), getYPixel(tegneData[0]));

            for(var i = 1; i < tegneData.length; i ++) {
                c.lineTo(getXPixel(i), getYPixel(tegneData[i]));
            }
            c.stroke();

            c.fillStyle = '#333';
         
            for(var i = 0; i < tegneData.length; i ++) {  
                c.beginPath();
                c.arc(getXPixel(i), getYPixel(tegneData[i]), 4, 0, Math.PI * 2, true);
                c.fill();
            }
        }
    }


























    //Funksjonen som tegner søylediagrammet 
    //arg1 = maxVerdi (taket på grafen), arg2 = VerdiSteg (intervalene opp til taket)
    function drawBars() {

    	var minVal, maxVal,
        xScalar, yScalar,
        numSamples, y;

        //Henter inn canvas elementet etter ID og setter konteksten vi skal bruke som er 2D
        var can = document.getElementById("can");
        var ctx = can.getContext("2d");

        var resultat = new Array();
        var dataArr = new Array();
        var dataName = new Array();
        var dataValue = new Array();
        var dataArr = getSensorData(1);
        var tid;

        //Runder av alle verdiene til 2 desimaler
        for (var i=0;i < dataArr.length;i++){
            resultat[i] = Math.floor(dataArr[i][0] * 100) / 100;

        }

        //Deler co2 verdien på 10 så den kommer på nivå med de andre romverdiene.
        resultat[1] = resultat[1]/10;
        
        //Konverterer timestampen fra tinymesh over til et mennesklig lesbart tidspunkt (via timeConverter funksjonen)
        //Argumenter: unix timestamp, return format (1 = long, 2 = short)
        tid = timeConverter(resultat[6],1);

        //finner maksverdien i alle data arrayene sånn at grafen kan endre seg dynamisk
        function getMaxY(){
            var max = 0;
         
            for(var i = 0; i < resultat.length-1; i ++) {
                if(resultat[i] > max) {
                    max = resultat[i];
                }
            }
            
            max += 10;
            
            max = Math.round(max);

            return max;
        }

        //oppdaterer tittelen til den nylig konverterte timestampen
        $("#tittel2").empty();
        $("#tittel2").append(tid);
        //fyller inn arrayene som holder overskrift og dataen hentet fra CSV filene via AJAX
        dataName = [ "Audio", "co2", "Light", "Moist", "Move", "Temp", "Time"];
        dataValue = resultat;

        
        //Setter variabler som brukes i utregningen av scope til grafen.
        numSamples = dataName.length;
        maxVal = getMaxY();
        var stepSize = Math.round(maxVal/10);
        var colHead = 50;
        var rowHead = 60;
        var margin = 10;

        //sletter canvasen sånn at vi kan skrive ny data til den
        ctx.clearRect(0, 0, can.width, can.height);

        //setter div verdier på ctx og ferdigsatte scalaer til X og Y
        ctx.fillStyle = "black"
        yScalar = (can.height - colHead - margin) / (maxVal);
        xScalar = (can.width - rowHead) / (numSamples);
        ctx.strokeStyle = "rgba(128,128,255, 0.5)";
        ctx.beginPath();

        //Skriver rad verdier og tegner horisontale linjer
        ctx.font = "12pt Helvetica"
        var count =  0;
        for (scale = maxVal; scale >= 0; scale -= stepSize) {
            y = colHead + (yScalar * count * stepSize);
            ctx.fillText(scale, margin,y + margin);
            ctx.moveTo(rowHead, y)
            ctx.lineTo(can.width, y)
            count++;
        }
        ctx.stroke();

        //Klargjør labels i toppen og over barene
        ctx.font = "14pt Helvetica";
        ctx.textBaseline = "bottom";
        
        //Løkke som skriver verdiene over barene
        for (i = 0; i < numSamples -1; i++) {
            calcY(dataValue[i]);
            ctx.fillText(dataValue[i], xScalar * (i + 1), y - margin);
        }
        //løkke som skriver datatypen over grafen
        for (i = 0; i < numSamples -1; i++) {
            calcY(maxVal);
            ctx.fillText(dataName[i], xScalar * (i + 1), y - margin);
        }

        //Setter farge og skygge effekt
        ctx.fillStyle = "red";
        ctx.shadowColor = 'rgba(128,128,128, 0.5)';
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 5;

        //Bruker transform funksjonen til å sette utgangspunktet for tegning til til bunnen av grafen og skalerer x og y til å matche dataen.
        ctx.translate(0, can.height - margin);
        ctx.scale(xScalar, -1 * yScalar);

        //Tegner barene
        for (i = 0; i < numSamples -1; i++) {
            ctx.fillRect(i + 1, 0, 0.5, dataValue[i]);
        }
        
        //Hjelpe funksjon for y scalering som brukes i forløkkene over.
        function calcY(value) {
            y = can.height - value * yScalar;
        }

        //Resetter alle transformasjoner og setter alfa verdien på skygge effekten til 0 sånn at ikek alle ellementer får dropshadow
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.shadowColor = 'rgba(128,128,128, 0.0)';
    }























    //Funksjon som henter ut og populerer sensor listen med rom nummer
    function getSensorNames() {
        $.ajax({
          url: "scripts/getsensors.py",
          type: "POST",
          dataType:"json",
          success: function(response) {
             $(response).each(function() {
               var option = $('<option />');
               option.attr('value', this).text(getRealName(this.slice(0,-4))); // cuts off .csv
               $('#selectSensor').append(option);
             });
          }
        });
    }



















    //Funksjon som gjør om tinymesh sitt romnavn med navn folk på bygget forstår.
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
















    //Funksjon som henter ut daten via AJAX og gir tilbake en 2dimensjonal array med alle verdier
    function getSensorData(antallLinjer){
        
        //lagrer JSON dataen som vi henter med AJAX fra jsajax.js i variabelen jsonData
        var jsonData = $.ajax({
            
            type: 'POST',
            url: "scripts/jsajax.py",
            dataType:"json",
            data: {'linesToGet' : antallLinjer, 'sensor' : $("#selectSensor").val() },
            async: false

        }).responseText;

        //parser jsonData til JSON objekter
        var data = JSON.parse(jsonData);

        var audio = new Array();
        var luft = new Array();
        var lys = new Array();
        var fukt = new Array();
        var move = new Array();
        var temp = new Array();
        var time = new Array();

        var res = new Array();

        //overfører JSON dataen til flere arrayer
        for (var i=0;i<data.length;i++){

            audio[i] = data[i].audio;
            luft[i] = data[i].co2;
            lys[i] = data[i].light;
            fukt[i] = data[i].moist;
            move[i] = data[i].movement;
            temp[i] = data[i].temp;
            time[i] = data[i].timestamp;

        }

        //lager en 2dimensjonal array kalt res
        res[0] = audio;
        res[1] = luft;
        res[2] = lys;
        res[3] = fukt;
        res[4] = move;
        res[5] = temp;
        res[6] = time;


        //Returnerer res med alle verdiene for videre arbeid
        return res;

    }

















    //Funksjon som gjør om UNIX timestamp som vi får fra tinymesh
    function timeConverter(timeStamp, format){
        var a = new Date(timeStamp*1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        if (a.getHours() < 10) {
		  var hour = "0" + a.getHours();
        }
        else {
		  var hour = a.getHours();
        }
        if (a.getMinutes() < 10) {
		  var min = "0" + a.getMinutes();
        }
        else {
		  var min = a.getMinutes();
        }
        if (a.getSeconds() < 10) {
        	var sec = "0" + a.getSeconds();
        }
        else {
		  var sec = a.getSeconds();
        }
        var time

        //sjekker hva slags format som var ønsket og lagrer det i variabelen time som senere returneres.
        if(format == 1){
            time = date + ' ' + month+' '+ year + ' kl: ' + hour + ':' + min + ':' + sec;
        }
        if(format == 2){
            time = date+month+' ' + hour + ':' + min + ':' + sec;
        }
        return time;
    }
});
