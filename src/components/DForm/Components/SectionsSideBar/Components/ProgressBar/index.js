import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const ProgressBar = props => {
  const [offset, setOffset] = useState(98);
  const circleRef = useRef(null);
  const {
    size,
    progress,
    strokeWidth,
    circleTwoStroke,
    index,
    completed,
  } = props;

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);

    circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';

  }, [setOffset, progress, circumference, offset]);

  return (
    <div className={`section-progress-bar ${(progress >= 100 || completed) ? "complete" : ""}`}>
      <svg
        className="svg"
        width={size}
        height={size}
      >
        <circle
          className="svg-circle"
          ref={circleRef}
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        {progress < 100 && !completed && (
          <text
            x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
            className="svg-circle-text">
            {index}
          </text>
        )}
      </svg>
    </div>
  );
};

ProgressBar.propTypes = {
  size: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  circleOneStroke: PropTypes.string.isRequired,
  circleTwoStroke: PropTypes.string.isRequired
};

export default ProgressBar;
