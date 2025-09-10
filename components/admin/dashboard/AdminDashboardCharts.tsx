"use client";
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';



const chartOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false },
    height: 250,
    width: '100%',
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#252DAE'],
  },
  markers: {
    size: 4,
    colors: ['#252DAE'],
    strokeColors: '#fff',
    strokeWidth: 1,
    shape: 'circle',
    hover: { size: 8 },
  },
  fill: {
    type: 'solid',
    opacity: 1,
    colors: ['#ECF3FF'],
  },
  grid: {
    borderColor: '#eee',
    row: { colors: ['#fff', 'transparent'], opacity: 0.5 },
  },
  xaxis: {
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    labels: {
      style: { colors: '#737373', fontSize: '12px' },
    },
  },
  yaxis: {
    min: 2000,
    max: 10000,
    tickAmount: 8,
    labels: {
      style: { colors: '#737373', fontSize: '12px' },
      formatter: (val: number) => val.toLocaleString(),
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '14px',
    fontWeight: 500,
    markers: { size: 16, strokeWidth: 0 },
    labels: { colors: '#222' },
  },
  colors: ['#252DAE'],
  tooltip: {
    theme: 'light',
    x: { show: false },
  },
};

const chartDataArray = [
  {
    title: 'Projects per month',
    series: [
      {
        name: 'Projects',
        data: [2500, 4000, 5200, 3400, 5600, 6300, 7200, 7600, 5400, 8500, 7300, 7800],
      },
    ],
  },
  {
    title: 'Total customers',
    series: [
      {
        name: 'Customers',
        data: [2500, 4000, 5200, 3400, 5600, 6300, 7200, 7600, 5400, 8500, 7300, 7800],
      },
    ],
  },
];

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  border: '1px solid #ECECEE',
  boxShadow: '0px 0px 0px 1px #ECECEE',
  padding: '1.5rem',
  margin: '30px 0px',
  flex: 1,
  minWidth: 280,
  maxWidth: '',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
  alignItems: 'stretch',
  width: '100%',
};

const titleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '18px',
  marginBottom: '0.5rem',
  color: '#171717',
  paddingBottom: '20px',
  borderBottom: '1px solid #E5E5E5',
};
type ChartSeries = {
  name: string;
  data: number[];
};

const ChartCard: React.FC<{ title: string; series: ChartSeries[] }> = ({ title, series }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: ApexCharts | null = null;
    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, {
        ...chartOptions,
        series,
      });
      chart.render();
    }
    return () => {
      chart?.destroy();
    };
  }, [series]);
  return (
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

const AdminDashboardCharts: React.FC = () => (
  <div style={containerStyle}>
    {chartDataArray.map((chart, idx) => (
      <React.Fragment key={idx}>
        <ChartCard title={chart.title} series={chart.series} />
        
      </React.Fragment>
    ))}
  </div>
);

export default AdminDashboardCharts;

// box-shadow: 0px 0px 0px 1px #ECECEE;

// box-shadow: 0px 1px 3px 0px #0000000F;

