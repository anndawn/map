    // var width = 900,
    //     height = 600;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        height=width/9*6
        
    console.log(width,height);
       
    var svg = d3.select('#map').append('svg')
                .attr('width', width)
                .attr('height', height);

    var projection = d3.geoMercator()
                       .center([26,-28])
                       .translate([width/2, height/2]);   

    var geoGenerator = d3.geoPath().projection(projection);

    // load in csv headcount data
    d3.csv("finaluse.csv").then(
        function(dataset) {

    // load in geojson
        d3.json("newmap2.json").then(function(sa) {
            svg.append('g').attr('class', 'map YlGnBu')
            projection.fitExtent([[0, 0], [900, 600]], sa);

    function update(key,sector) {
            var [arrpub,arrpri,arrtotal]=[[],[],[]]
            var [objpub,objpri,objtotal,nameofd] = [{},{},{},{}];

        // filter out other services
            let result = dataset.filter(obj => {return obj.Service === key})
            let newdataset = result.map(obj => {let rObj = {}; 
                                    rObj[obj['District_Code']+"_"+obj['Sector']] = obj['headcount']-0;
                                    return rObj})
            let merged = Object.assign(...newdataset);

        // get District Name from District Code

        let resultforname=dataset.filter(obj => {return obj.Service === "Medical_practitioners"& obj.Sector==="public"})
        resultforname.map(d=>{nameofd[d['District_Code']] = d['District']; return nameofd})
    
        // use three objects to store the Public, private, and total headcount, put their range into seperate arrays
            for (const i in merged) {  
                if (i.includes("public")) {
                    objpub[i.slice(0,-7)]=merged[i]
                    objtotal[i.slice(0,-7)]=merged[i]
                    arrpub.push(merged[i])
                }else if (i.includes("private")) {
                    objpri[i.slice(0,-8)]=merged[i]
                    objtotal[i.slice(0,-8)]+=merged[i]
                    arrpri.push(merged[i])
                    arrtotal.push(objtotal[i.slice(0,-8)])
                }}
            console.log(objpub,objpri,objtotal);
        
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