    // var width = 900,
    //     height = 600;
    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
    if (window.mobilecheck()==true) {
        var width = screen.width-20;
    }else{var width = window.innerWidth>900?900:window.innerWidth; }
    
    height=width/9*6
    svgh=600;
    $("#map").width=width;
    $("#map").height=svgh>height?svgh:height
    console.log(window.mobilecheck(),width,height);
       
    var svg = d3.select('#map').append('svg')
                .attr('width', width)
                .attr('height', svgh);

    var projection = d3.geoMercator()
                       .center([26,-28])
                       .translate([width/2, height/2]);   

    var geoGenerator = d3.geoPath().projection(projection);

    // load in csv headcount data
    d3.csv("final3.csv").then(
        function(dataset) {

    // load in geojson
        d3.json("newmap2.json").then(function(sa) {
            svg.append('g').attr('class', 'map YlGnBu')
            projection.fitExtent([[0, 0], [(width-30), height]], sa);

    function update(key,sector) {
            var [arrpub,arrpri,arrtotal]=[[],[],[]]
            var [objpub,objpri,objtotal,nameofd] = [{},{},{},{}];

        // filter out other services
            let result = dataset.filter(obj => {return obj.Service === key})
            let newdataset = result.map(obj => {let rObj = {}; 
                                    rObj[obj['District_Code']+"_"+obj['Sector']] = obj['headcount']-0;
                                    return rObj})
            console.log(newdataset);
            
            let merged = Object.assign(...newdataset);

        // get District Name from District Code

        let resultforname=dataset.filter(obj => {return obj.Service === "Medical_practitioners"& obj.Sector==="public"})
        resultforname.map(d=>{nameofd[d['District_Code']] = d['District']; return nameofd})
        console.log(merged);
        
        // use three objects to store the Public, private, and total headcount, put their range into seperate arrays
            for (const i in merged) {  
                if (i.includes("private")) {
                    objpri[i.slice(0,-8)]=merged[i];
                    arrpri.push(merged[i]);
                    (objtotal.hasOwnProperty(i.slice(0,-8)))?objtotal[i.slice(0,-8)]=+merged[i]:objtotal[i.slice(0,-8)]=merged[i]         
                }else if (i.includes("public")) {
                    objpub[i.slice(0,-7)]=merged[i];
                    arrpub.push(merged[i]);        
                    (objtotal.hasOwnProperty(i.slice(0,-7)))?(objtotal[i.slice(0,-7)]=(objtotal[i.slice(0,-7)]+merged[i]).toFixed(1)-0):objtotal[i.slice(0,-7)]=merged[i]
                }
            }
            for(var ty in objtotal){
                arrtotal.push(objtotal[ty]) 
                }
              
      
        
         // define the content of tooltip
            var tip;
            tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([25,-4])
                .html(
                    function(d) { 
                    let name=nameofd[d.properties["DISTRICT"]];
                    headcountpub=objpub[d.properties["DISTRICT"]];
                    headcountpri=objpri[d.properties["DISTRICT"]];
                    totalheadcount= (headcountpub+headcountpri).toFixed(1);
                    return `${name} , ${key}<br/>public sector: ${headcountpub} , private sector: ${headcountpri},<br/>Total per 100000 population: ${totalheadcount}`
                    })
            console.log(key);
            
            svg.call(tip);
            
            var qaScale = d3.scaleQuantile()
                            .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }))

            // define domain of the color class scale according to sector                
            if (sector=="public") {
                qaScale.domain(arrpub)
            }else if (sector=="private") {
                qaScale.domain(arrpri)
            }else{
                qaScale.domain(arrtotal)
            }

        // add a legend
            svg.append("g")
                .attr("class", "legendQuant YlGnBu")
                .attr("transform", "translate(20,20)");

            var legend = d3.legendColor()
                            .labelFormat(d3.format(".1f"))
                            .useClass(true)
                            .title("Medical Personnel per 100000 population")
                            .titleWidth(300)
                            .scale(qaScale);
                if (window.mobilecheck()==true){
                    legend.orient('horizontal').shapePadding(20) .labelWrap(30)
                    d3.select(".legendQuant").attr("transform","translate("+5+","+(height+30)+")")
                }
                svg.select(".legendQuant")
                   .call(legend);
                d3.select(".legendTitle").select("tspan").attr("dy","0.7em")

            var u = d3.select('.map')
                    .selectAll('path')
                    .data(sa.features,(d)=>console.log(d));

                u.enter()
                .append('path')
                .attr('d', geoGenerator)       
                .attr('class', function(d) {
                    if (sector=='public') {return qaScale(objpub[d.properties["DISTRICT"]]);}
                    else if (sector=='private') {return qaScale(objpri[d.properties["DISTRICT"]]);}
                    else {return qaScale(objtotal[d.properties["DISTRICT"]]);}
                    })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }

    // execute the defalut value
    update("Medical_practitioners","total")

    // User changing choice
    $(".choice").change(
        function(){
          let service= $("#choice1 option:selected").val();      
          let sector= $("#choice2 option:selected").val();
          update(service,sector)
          })
    })
})