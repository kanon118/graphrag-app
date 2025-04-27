import React, { useEffect } from 'react';
import * as d3 from 'd3';

function GraphView() {
  useEffect(() => {
    fetch('http://localhost:7474') // Visa bara en dummy nu
  }, []);

  return (
    <div className="p-4">
      <h2>Kunskapsgraf</h2>
      <div id="graph" className="border p-4 h-96"></div>
    </div>
  );
}

export default GraphView;
