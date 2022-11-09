import React, { useState } from "react";

import { NmpButton } from "features/nmp-ui";

import { DFormSteps } from "./DFormSteps";

export default {
  title: "DForm/Steps",
  component: DFormSteps,
};

const Template = (props) => {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([
    {
      title: "Section 1",
      status: "process",
      percent: 0,
      disabled: false,
    },
    {
      title: "Section 2",
      status: "wait",
      percent: 0,
      disabled: true,
    },
    {
      title: "Section 3",
      status: "wait",
      percent: 0,
      disabled: true,
    },
    {
      title: "Section 4",
      status: "wait",
      percent: 0,
      disabled: true,
    },
  ]);

  const onChange = (value: number) => {
    setCurrent(value);
    setItems((prev) =>
      prev.map((item, index) => {
        if (value === index) {
          return { ...item, status: "process" };
        }
        if (current === index) {
          return { ...item, status: item.percent < 100 ? "wait" : "finish" };
        }
        return item;
      })
    );

    props.onChange && props.onChange(value);
  };

  const onNextButtonClick = () => {
    const item = items[current];

    if (item.percent < 100) {
      setItems((prev) =>
        prev.map((item, index) => {
          if (current === index) {
            return { ...item, percent: item.percent + 20 };
          }
          return item;
        })
      );
    } else {
      const next = current + 1;

      setCurrent((prev) => prev + 1);
      setItems((prev) =>
        prev.map((item, index) => {
          if (current === index) {
            return { ...item, status: "finish" };
          }
          if (next === index) {
            return { ...item, status: "process", disabled: false };
          }
          return item;
        })
      );
    }
  };

  return (
    <>
      <DFormSteps {...props} items={items} current={current} percent={items[current].percent} onChange={onChange} />

      <NmpButton type="nmp-ghost" onClick={onNextButtonClick}>
        {items[current].percent < 100 ? "Add progress" : "Next"}
      </NmpButton>
    </>
  );
};

export const Base = Template.bind({});
Base.args = {};
