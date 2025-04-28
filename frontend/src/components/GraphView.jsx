import { useEffect, useRef } from "react";
import axios from "axios";
import { Network } from "vis-network/standalone";

function GraphView() {
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchGraph = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/graph", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nodes, edges } = res.data;

        const network = new Network(containerRef.current, { nodes, edges }, {
          nodes: {
            shape: "dot",
            size: 16,
            font: { size: 14 },
          },
          edges: {
            arrows: { to: { enabled: true } },
            color: "gray",
          },
          physics: {
            stabilization: true,
          },
        });

      } catch (error) {
        console.error("Graph fetch error:", error);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div ref={containerRef} style={{ height: "500px", background: "white" }} />
  );
}

export default GraphView;
