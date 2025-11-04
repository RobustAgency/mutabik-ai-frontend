"use client";
import React, { useEffect, useRef, useState } from 'react';

const chartOptions = {
  chart: {
   type: 'area',
          height: 350,
    toolbar: { show: false },
    zoom: { enabled: false },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 250 },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: { height: 180 },
        },
      },
    ],
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#2D4EF5'],
  },
  markers: {
    size: 5,
    colors: ['#2D4EF5'],
    strokeColors: '#fff',
    strokeWidth: 2,
    shape: 'circle',
    hover: { size: 7 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: '#737373',
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 2000,
    max: 10000,
    tickAmount: 8,
    labels: {
      style: {
        colors: '#737373',
        fontSize: '12px',
        fontFamily: 'inherit',
      },
      formatter: (val: number) => val.toLocaleString(),
    },
  },
  colors: ['#2D4EF5'],
  fill: {
    type: 'solid',
    colors: ['#ECF3FF'],
    opacity: 5, 
  },
  grid: {
    borderColor: '#E5E5E5',
    strokeDashArray: 0,
    row: { colors: ['#fff', 'transparent'], opacity: 0 },
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    x: { show: true },
    y: { formatter: (val: number) => val.toLocaleString() },
  },
};

const chartSeries = [
  {
    name: 'Projects',
    data: [2500, 4000, 5200, 3900, 6000, 6700, 7200, 6100, 8500, 7600, 7800, 8000],
  },
];

export default function ProjectsPerMonthChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [ApexCharts, setApexCharts] = useState<any>(null);

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
      series: chartSeries,
    });
    chart.render();

    return () => {
      chart?.destroy();
    };
  }, [ApexCharts]);

  return (
    <div style={{ width: '100%', minHeight: 320, maxHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {!ApexCharts ? (
        <div style={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#737373', fontSize: '14px' }}>Loading chart...</div>
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', height: 320 }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
 
      </div>
    </div>
  );
}
