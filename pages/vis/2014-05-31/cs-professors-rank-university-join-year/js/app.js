function curves(){var a=vis.transition().duration(500);ice&&(a.delay(1e3),icicle()),a.call(chart.tension(.5))}function iceTransition(a){return a.transition().duration(1e3)}function ribbonPath(a,b,c){var d=a.node.x0+a.x0,e=b.node.x0+b.x0,f=a.dimension.y0,g=b.dimension.y0;return(1===c?["M",[d,f],"L",[e,g],"h",b.dx,"L",[d+a.dx,f],"Z"]:["M",[d,f],"C",[d,m0=c*f+(1-c)*g]," ",[e,m1=c*g+(1-c)*f]," ",[e,g],"h",b.dx,"C",[e+b.dx,m1]," ",[d+a.dx,m0]," ",[d+a.dx,f],"Z"]).join("")}function stopClick(){d3.event.stopPropagation()}function truncateText(a,b){return function(c,d){var e=this.textContent=a(c,d),f=b(c,d);if(this.getComputedTextLength()<f)return e;this.textContent="\u2026"+e;for(var i,g=0,h=e.length+1;h>g;){var j=g+h>>1;(i=this.getSubStringLength(0,j))<f?g=j+1:h=j}return g>1?e.substr(0,g-2)+"\u2026":""}}var chart=d3.parsets().dimensions(["Rank","JoinYear","Subfield","Doctorate","University"]),vis=d3.select("#vis").append("svg").attr("width",chart.width()).attr("height",chart.height()),partition=d3.layout.partition().sort(null).size([chart.width(),5*chart.height()/4]).children(function(a){return a.children?d3.values(a.children):null}).value(function(a){return a.count}),ice=!1;d3.csv("data/data.csv",function(a,b){vis.datum(b).call(chart),curves(),window.icicle=function(){var a=this.checked,c=chart.tension();if(a!==ice)if(ice=a){var d=[];vis.selectAll("g.dimension").each(function(a){d.push(a)}),d.sort(function(a,b){return a.y-b.y});var e=d3.parsets.tree({children:{}},b,d.map(function(a){return a.name}),function(){return 1}),f=partition(e),g={};f.forEach(function(a){for(var b=a.data.name,c=a;(c=c.parent)&&c.data.name;)b=c.data.name+"\0"+b;b&&(g[b]=a)});var h=[];vis.on("mousedown.icicle",stopClick,!0).select(".ribbon").selectAll("path").each(function(a){var b=g[a.path],c=a.source,d=a.target;c.node.x0=d.node.x0=0,c.x0=d.x0=b.x,c.dx0=c.dx,d.dx0=d.dx,c.dx=d.dx=b.dx,h.push(a)}),iceTransition(vis.selectAll("path")).attr("d",function(a){var b=a.source,d=a.target;return ribbonPath(b,d,c)}).style("stroke-opacity",1),iceTransition(vis.selectAll("text.icicle").data(h).enter().append("text").attr("class","icicle").attr("text-anchor","middle").attr("dy",".3em").attr("transform",function(a){return"translate("+[a.source.x0+a.source.dx/2,a.source.dimension.y0+a.target.dimension.y0>>1]+")rotate(90)"}).text(function(a){return a.source.dx>15?a.node.name:null}).style("opacity",1e-6)).style("opacity",1),iceTransition(vis.selectAll("g.dimension rect, g.category").style("opacity",1)).style("opacity",1e-6).each("end",function(){d3.select(this).attr("visibility","hidden")}),iceTransition(vis.selectAll("text.dimension")).attr("transform","translate(0,-5)"),vis.selectAll("tspan.sort").style("visibility","hidden")}else vis.on("mousedown.icicle",null).select(".ribbon").selectAll("path").each(function(a){var b=a.source,c=a.target;b.node.x0=b.node.x,b.x0=b.x,b.dx=b.dx0,c.node.x0=c.node.x,c.x0=c.x,c.dx=c.dx0}),iceTransition(vis.selectAll("path")).attr("d",function(a){var b=a.source,d=a.target;return ribbonPath(b,d,c)}).style("stroke-opacity",null),iceTransition(vis.selectAll("text.icicle")).style("opacity",1e-6).remove(),iceTransition(vis.selectAll("g.dimension rect, g.category").attr("visibility",null).style("opacity",1e-6)).style("opacity",1),iceTransition(vis.selectAll("text.dimension")).attr("transform","translate(0,-25)"),vis.selectAll("tspan.sort").style("visibility",null)},d3.select("#icicle").on("change",icicle).each(icicle)}),d3.select("#file").on("change",function(){var a=this.files[0],b=new FileReader;b.onloadend=function(){var a=d3.csv.parse(b.result);vis.datum(a).call(chart.value(a[0].hasOwnProperty("Number")?function(a){return+a.Number}:1).dimensions(function(a){return d3.keys(a[0]).filter(function(a){return"Number"!==a}).sort()}))},b.readAsText(a)});