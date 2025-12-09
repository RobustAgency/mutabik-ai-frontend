"use client";
import React, { useEffect, useRef, useState } from "react";

const chartOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
    zoom: { enabled: false },
    height: 250,
    width: "100%",
  },
  stroke: {
    curve: "straight",
    width: 2,
    colors: ["#252DAE"],
  },
  markers: {
    size: 4,
    colors: ["#252DAE"],
    strokeColors: "#fff",
    strokeWidth: 1,
    shape: "circle",
    hover: { size: 8 },
  },
  fill: {
    type: "solid",
    opacity: 1,
    colors: ["#ECF3FF"],
  },
  grid: {
    borderColor: "#eee",
    row: { colors: ["#fff", "transparent"], opacity: 0.5 },
  },
  xaxis: {
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    labels: {
      style: { colors: "#737373", fontSize: "12px" },
    },
  },
  yaxis: {
    min: 2000,
    max: 10000,
    tickAmount: 8,
    labels: {
      style: { colors: "#737373", fontSize: "12px" },
      formatter: (val: number) => val.toLocaleString(),
    },
  },
  legend: {
    show: true,
    position: "bottom",
    fontSize: "14px",
    fontWeight: 500,
    markers: { size: 16, strokeWidth: 0 },
    labels: { colors: "#222" },
  },
  colors: ["#252DAE"],
  tooltip: {
    theme: "light",
    x: { show: false },
  },
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #ECECEE",
  boxShadow: "0px 0px 0px 1px #ECECEE",
  padding: "1.5rem",
  margin: "30px 0px",
  flex: 1,
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflow: "hidden",
};

const titleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "18px",
  marginBottom: "0.5rem",
  color: "#171717",
  paddingBottom: "20px",
  borderBottom: "1px solid #E5E5E5",
};

const TotalCustomersChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [ApexCharts, setApexCharts] = useState<any>(null);
  const series = React.useMemo(() => [
    {
      name: "Customers",
      data: [2500, 4000, 5200, 3400, 5600, 6300, 7200, 7600, 5400, 8500, 7300, 7800],
    },
  ], []);

  useEffect(() => {
    // Dynamically import ApexCharts only when needed
    import('apexcharts').then((mod) => {
      setApexCharts(() => mod.default);
    });
  }, []);

  useEffect(() => {
    if (!ApexCharts || !chartRef.current) return;

    const chart = new ApexCharts(chartRef.current, {
      ...chartOptions,
      series,
      chart: {
        ...chartOptions.chart,
        height: '100%',
        width: '100%',
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 200 },
            legend: { fontSize: '12px' },
            xaxis: { labels: { fontSize: '10px' } },
            yaxis: { labels: { fontSize: '10px' } },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 150 },
            legend: { fontSize: '10px' },
            xaxis: { labels: { fontSize: '8px' } },
            yaxis: { labels: { fontSize: '8px' } },
          },
        },
      ],
    });
    chart.render();

    return () => {
      chart?.destroy();
    };
  }, [ApexCharts, series]);

  return (
    <div style={{ ...cardStyle, width: '100%', maxWidth: '100%' }}>
      <div style={titleStyle}>Total customers</div>
      {!ApexCharts ? (
        <div style={{ width: '100%', minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#737373', fontSize: '14px' }}>Loading chart...</div>
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', minHeight: 150, overflow: 'hidden' }} />
      )}
    </div>
  );
};

export default TotalCustomersChart;
