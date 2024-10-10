import { GraphicProps } from "@/utils/types";
import MonthlyBirdTotal from "./MonthlyBirdTotal";
import MonthlySpeciesBreakdown from "./MonthlySpeciesBreakdown";
import MonthlyMapView from "./MonthlyMapView";

const GraphicsPane: React.FC<GraphicProps> = ({ data }) => {
  return (
    <div className="flex flex-row flex-wrap gap-10 justify-evenly mt-20">
      <MonthlyBirdTotal data={data} />
      <MonthlySpeciesBreakdown data={data} />
      <MonthlyMapView data={data} />
    </div>
  );
};

export default GraphicsPane;
