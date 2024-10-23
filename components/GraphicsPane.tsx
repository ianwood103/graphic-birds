import { GraphicProps } from "@/utils/types";
import MonthlyBirdTotal from "./MonthlyBirdTotal";
import MonthlySpeciesBreakdown from "./MonthlySpeciesBreakdown";
import MonthlyMapView from "./MonthlyMapView";
import { Select } from "@rewind-ui/core";
import { MONTHS } from "@/utils/constants";
import { useState } from "react";

const GraphicsPane: React.FC<{ data: GraphicProps["data"] }> = ({ data }) => {
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Generate array of years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-2 mb-8 pt-4">
        <div className="w-40">
          <Select
            defaultValue={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            size="sm"
          >
            {MONTHS.map((monthLabel, idx) => (
              <option key={idx} value={idx}>
                {monthLabel}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-32">
          <Select
            defaultValue={year}
            onChange={(e) => setYear(Number(e.target.value))}
            size="sm"
          >
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-10 justify-evenly">
        <MonthlyBirdTotal data={data} month={month} year={year} />
        <MonthlySpeciesBreakdown data={data} month={month} year={year} />
        <MonthlyMapView data={data} month={month} year={year} />
      </div>
    </div>
  );
};

export default GraphicsPane;
