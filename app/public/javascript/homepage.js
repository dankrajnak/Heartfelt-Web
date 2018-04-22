
const continueButton = document.getElementById('overlayContinue');
const overlay = document.getElementById('overlay');

continueButton.addEventListener('click', (e)=>{
  console.log(overlay);
  overlay.style.opacity =  0;
  setTimeout(()=>{
    overlay.style.display = 'none';
  }, 500);
});

// let width = window.innerWidth;
// let height = window.innerHeight;

// let svg = d3.select("svg"),
//     angles = d3.range(0, 2* Math.PI, Math.PI / 400);
//
// svg.attr('width', width).attr('height', height);
//
// let path = svg.append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
//     .attr("fill", "none")
//     .attr("stroke-width", 10)
//     .attr("stroke-linejoin", "round")
//   .selectAll("path")
//   .data(["#EA0000", "#00F000", "#0000EC"])
//   .enter().append("path")
//     .attr("stroke", function(d) { return d; })
//     .style("mix-blend-mode", "lighten")
//     .datum(function(d, i) {
//       return d3.radialLine()
//           .curve(d3.curveLinearClosed)
//           .angle(function(a) { return a; })
//           .radius(function(a) {
//             var t = d3.now() / 1000;
//             a += Math.PI/3
//             return 100 + Math.cos(a * 2 - i * Math.PI/9 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 120;
//           });
//     });
//
// d3.timer(function() {
//   path.attr("d", function(d) {
//     return d(angles);
//   });
// });
