export const html = (data: any) => {
  return `<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dagre-d3/0.4.17/dagre-d3.min.js"></script>
    <style>
      body {
        margin: 30px;
      }
      .graph {
        border: solid 1px #ddd;
      }
      .graph text,
      .graph .node.root div {
        fill: #333;
        font-weight: 300;
        font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial,
          sans-serif;
        font-weight: 400;
        font-size: 14px;
      }
      .graph .node rect {
        stroke: #ccc;
        fill: #fff;
        stroke-width: 2px;
      }
      .graph .node.root rect {
        stroke: none;
      }
      .graph .node.disabled rect {
        stroke-dasharray: 5, 5;
      }
      .graph .node.disabled text {
        fill: #ccc;
      }
      .graph .edgePath path {
        stroke: #aaa;
        fill: #aaa;
        stroke-width: 2px;
      }
      /* Arrowhead */
      .graph .edgePath marker path {
        stroke: none;
      }
    </style>
    <script>
      window.addEventListener('DOMContentLoaded', () => {
        var dagre = dagreD3.dagre;
        var graphlib = dagreD3.graphlib;
        var render = dagreD3.render();

        var PADDING = 120;

        var data = ${data};

        data.nodes = data.nodes.map(node => {
          return {
            ...node,
            value: {
              width: 100,
              height: 10,
              label: ""
            }
          };
        });

        data.edges = data.edges.map(edge => {
          return {
            ...edge,
            value: {
              label: \`\${edge.v}, \${edge.w}\`
            }
          };
        });
        // Create a new directed graph
        window.g = graphlib.json.read(data);
        console.log(g);
        // Set an object for the graph label
        g.setGraph({
          ranksep: 40
        });

        // Default to assigning a new object as a label for each new edge.
        g.setDefaultEdgeLabel(function() {
          return {};
        });

        // Render

        // Set up an SVG group so that we can translate the final graph.
        var svg = d3.select("svg"),
          svgGroup = svg.append("g");

        // Run the renderer. This is what draws the final graph.
        render(d3.select("svg g"), g);

        // Size the container to the graph
        svg.attr("width", g.graph().width + PADDING);
        svg.attr("height", g.graph().height + PADDING);

        // Center the graph
        var offset = PADDING / 2;
        svgGroup.attr("transform", "translate(" + offset + ", " + offset + ")");

        // Inline styles are necessary so dagre can compute dimensions.
        function getNumber(n, color) {
          return (
            '<span style="width: 20px; height: 20px; margin-right: 6px; background: ' +
            color +
            '; display: inline-block; text-align: center; border-radius: 10px; color: #fff; line-height: 21px;">' +
            n +
            "</span>"
          );
        }
      });
    </script>
  </head>
  <body>
    <svg class="graph"></svg>
  </body>
</html>`;
};
