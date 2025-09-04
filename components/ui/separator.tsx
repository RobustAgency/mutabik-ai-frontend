import React from "react";

export const Separator: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      width: "100%",
      height: 1,
      background: "#eee",
      margin: "1rem 0",
      ...style,
    }}
  />
);
