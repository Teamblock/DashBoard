import { useMemo, useState } from "react";

import LineGraph from "../../components/LineGraph";
import { classNames, formatDate, formatNumber } from "../../functions";
import ColoredNumber from "./ColoredNumber";

interface ChartCardProps {
  header: string;
  subheader: string;
  figure: number;
  change: number;
  chart: {
    x: Date;
    y: number;
  }[];
  defaultTimespan?: string;
  timespans: {
    text: string;
    length: number;
  }[];
}

export default function ChartCard({
  header,
  subheader,
  figure,
  change,
  chart,
  defaultTimespan,
  timespans,
}: ChartCardProps): JSX.Element {
  const [timespan, setTimespan] = useState(
    timespans?.find((t) => t.text === defaultTimespan)
  );

  const chartFiltered = useMemo(() => {
    const currentDate = Math.round(Date.now() / 1000);
    return chart?.reduce((acc, cur) => {
      const x = cur.x.getTime();
      // @ts-ignore TYPE NEEDS FIXING
      if (Math.round(x / 1000) >= currentDate - timespan?.length) {
        acc.push({
          // @ts-ignore TYPE NEEDS FIXING
          x,
          // @ts-ignore TYPE NEEDS FIXING
          y: cur.y,
        });
      }

      return acc;
    }, []);
  }, [chart, timespan?.length]);

  const [selectedIndex, setSelectedIndex] = useState(chartFiltered?.length - 1);
  // @ts-ignore TYPE NEEDS FIXING
  const overrideFigure = useMemo(
    () => chartFiltered?.[selectedIndex]?.y,
    [chartFiltered, selectedIndex]
  );
  // @ts-ignore TYPE NEEDS FIXING
  const overrideDate = useMemo(
    () => chartFiltered?.[selectedIndex]?.x,
    [chartFiltered, selectedIndex]
  );

  return (
    <div className="w-full p-4 space-y-4 font-bold">
      <div className="flex justify-between">
        <div>
          <div className="text-xs text-secondary">{subheader}</div>
          <div className="text-black">{header}</div>
        </div>
        <div>
          <div className="flex justify-end text-2xl text-primary">
            {formatNumber(overrideFigure ?? figure, true, false)}
          </div>
          <div className="flex flex-row items-center justify-end">
            {selectedIndex === chartFiltered?.length - 1 && (
              <ColoredNumber number={change} percent={true} />
            )}
            <div className="ml-3 font-normal">
              {overrideDate
                ? formatDate(new Date(overrideDate))
                : "Past 24 Hours"}
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 h-36">
        {chartFiltered && (
          <LineGraph
            data={chartFiltered}
            stroke={{ solid: "#0FB871" }}
            setSelectedIndex={setSelectedIndex}
          />
        )}
      </div>
      <div className="flex flex-row justify-end space-x-4">
        {timespans.map((t, i) => (
          <button
            key={i}
            className={classNames(
              t === timespan
                ? "text-white bg-primary rounded-2xl font-bold"
                : "text-secondary",
              "text-sm px-4 py-[0.3rem]"
            )}
            onClick={() => setTimespan(t)}
          >
            {t.text}
          </button>
        ))}
      </div>
    </div>
  );
}
