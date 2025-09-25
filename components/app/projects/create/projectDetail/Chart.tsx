"use client";
import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const chartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    height: 300,
    width: "100%",
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  fill: {
    type: "solid",
    opacity: 0.02,
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  grid: {
    borderColor: "#F2F4F7",
    strokeDashArray: 0,
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: { colors: "#344054", fontSize: "12px" },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 1000,
    tickAmount: 5,
    labels: {
      style: { colors: "#344054", fontSize: "12px" },
    },
  },
  tooltip: {
    theme: "light",
  },
  legend: {
    show: false,
  },
  colors: ["#4FD58F", "#6ee7b7"],
};

const chartSeries = [
  {
    name: "Top Line",
    data: [700, 720, 740, 730, 760, 790, 780, 800, 830, 820, 840, 880],
  },
  {
    name: "Bottom Line",
    data: [450, 460, 480, 470, 500, 550, 530, 560, 580, 570, 600, 620],
  },
];

const Chart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: ApexCharts | null = null;
    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, {
        ...chartOptions,
        series: chartSeries,
      });
      chart.render();
    }
    return () => {
      chart?.destroy();
    };
  }, []);

  return (
    <div
      style={{
        background: "#fff",
      }}
    >

      <div ref={chartRef} />
    </div>
  );
};

export default Chart;
