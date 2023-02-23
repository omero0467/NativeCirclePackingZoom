async function draw (){
    // Set up the dimensions of the chart
  const width = 900;
  const height = 900;
const data = await d3.json('data.json')

  const pack = data => d3.pack()
    .size([width, height])
    .padding(2)
    .radius(d=>
      // d.children?d.children.length:
      5)
  (d3.hierarchy({children:[data]})
    // .sum(d => d.value)
    // .sort((a, b) => b.value - a.value)
    )

    const zoomConfig = d3.zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zoom)
    // .on("scroll", zoom);

    const root = pack(data);
    let focus = root;
    let view;

const color = d3.scaleLinear()
.domain([0, root.height])
.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
.interpolate(d3.interpolateHsl)

  const svg = d3.select('#chart')
  .append('svg')
      .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`)
      .attr('height',height)
      .attr('width',width)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", color(0))
      .style("cursor", "pointer")

  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .style("fill-opacity", d => {
        // console.log("Dd",d.depth);
        if(d.parent === focus)
        { 
          return 1}
      else if(d.parent.depth === focus.depth-1){
        return 1
      } else if(d.depth === focus.depth-1){
        return 1
      }
      else{ return 0}})
    //   .style("display", d => d.depth === focus.depth+1 ? 'block' : "block")
      // .attr("pointer-events", d => !d.children ? "none" : null)
      .attr("pointer-events", d => {if(!d.children){
        return 'none'
      } else if (d.depth >= focus.depth+2){
        return 'none'
      } else { return null}
    })
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
      .on("mouseout", function() { d3.select(this).attr("stroke", null); })
      // .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
// console.log(node.datum());
    node.call(zoomConfig)

  const label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);

  zoomTo([root.x, root.y, root.r *5]); 

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
  }

  function zoom1(event, d) {
    console.log(this)
    const focus0 = focus;
    focus = d;
    
    
    console.log(`focus is ${d.data.name}`,focus);

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        // console.log("focusD",focus);
        node
      .attr("pointer-events", d => {if(!d.children){
        return 'none'
      } else if (d.depth >= focus.depth+2){
        return 'none'
      } else { return null}
    })
        .style("fill-opacity", d => {
          // console.log("Dd",d.depth);
          if(d.parent === focus)
          { 
            return 1
          }
        else if(d.parent.depth === focus.depth-1){
          return 1
        } else if(d.depth === focus.depth-1){
          return 1
        }
        else{ return 0}})


        
  }
  function zoom(event, d) {
    const focus0 = focus;
    event.sourceEvent.stopPropagation()
   if (focus !==d) {
     focus = d;
   } else if(!d.children){
    focus=d.parent
   } 
   else {
    focus=d.parent
   }
    
    
    
    console.log(`focus is ${d.data.name}`,focus);

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        // console.log("focusD",focus);
        node
      .attr("pointer-events", d => {if(!d.children){
        return 'none'
      } else if (d.depth >= focus.depth+2){
        return 'none'
      } else { return null}
    })
    .transition(transition)
        .style("fill-opacity", d => {
          // console.log("Dd",d.depth);
          if(d.parent === focus)
          { 
            return 1}
        else if(d.parent.depth === focus.depth-1){
          return 1
        } else if(d.depth === focus.depth-1){
          return 1
        }
        else{ return 0}})


        
  }



  }
  draw()