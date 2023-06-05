import React, { useState } from 'react';
import Pie from '@visx/shape/lib/shapes/Pie';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from '@react-spring/web';
import './PieChart.css';

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };
const donutThickness = 50;

export default function PieChart({
  data,
  itemIdentifierKey,
  itemValueKey,
  width,
  height,
  margin = defaultMargin,
  getColor,
  animate = true,
  onItemSelect,
  defaultSelectedElement = null,
}) {
  const [selectedElement, setSelectedElement] = useState(
    defaultSelectedElement
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const innerRadius = 80;

  // display the selected element's label and value in the center of the pie
  const selectedElementLabel =
    selectedElement && selectedElement[itemIdentifierKey];

  const selectedElementJSX = (
    <text
      style={{
        fontSize: '1.35em',
      }}
      is="x3d"
      fill="white"
      x={centerX - margin.left}
      y={centerY + margin.top}
      dy=".33em"
      textAnchor="middle"
      pointerEvents="none">
      {selectedElementLabel}
    </text>
  );

  return (
    <svg width={width} height={height}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={data}
          pieValue={(item) => item[itemValueKey]}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
          innerRadius={innerRadius}
          cornerRadius={6}>
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={animate}
              radius={radius}
              getKey={({ data }) => data[itemIdentifierKey]}
              selectedElement={selectedElement}
              itemIdentifierKey={itemIdentifierKey}
              onClickDatum={(arc) => {
                onItemSelect(arc.data);
                setSelectedElement(arc.data);
              }}
              getColor={getColor}
            />
          )}
        </Pie>
      </Group>
      {selectedElement && selectedElementJSX}
    </svg>
  );
}

function AnimatedPie({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
  selectedElement,
  itemIdentifierKey,
  radius,
}) {
  const fromLeaveTransition = ({ endAngle }) => {
    return {
      // enter from 360° if end angle is > 180°
      padAngle: endAngle > Math.PI ? 0.01 : 0.005,
      startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
      endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
      opacity: 0,
      outerRadius: radius - donutThickness * 1.3, // Default outer radius
    };
  };

  const enterUpdateTransition = ({ startAngle, endAngle, data }) => {
    // const isSelected =
    //   selectedElement &&
    //   selectedElement[itemIdentifierKey] === getKey({ data });

    // const padAngle = isSelected ? 0.1 : 0.02; // Reduce the pad angle for the selected slice
    // const angleOffset = isSelected ? 0.1 : 0.0; // Increase the angle offset for a larger selected slice

    return {
      startAngle,
      endAngle,
      opacity: 1,
    };
  };

  const transitions = useTransition(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });

  return transitions((props, arc, { key }) => {
    const isSelected =
      selectedElement &&
      selectedElement[itemIdentifierKey] === getKey({ data: arc.data });

    return (
      <g key={key} is="x3d">
        <animated.path
          is="x3d"
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle, props.padAngle],
            (startAngle, endAngle, padAngle) => {
              return path({
                ...arc,
                padAngle,
                startAngle,
                endAngle,
              });
            }
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
          class={`slice${isSelected ? '--selected' : ''}`}
        />
        {/* <>
          {hasSpaceForLabel && (
            <animated.g style={{ opacity: props.opacity }}>
              <text
                is="x3d"
                fill="white"
                x={centroidX}
                y={centroidY}
                dy=".33em"
                fontSize={9}
                textAnchor="middle"
                pointerEvents="none">
                {key}
              </text>
            </animated.g>
          )}
        </> */}
      </g>
    );
  });
}
