import { ParsedData } from "@/types";
import MonthlyBirdTotal from "./MonthlyBirdTotal";

interface GraphicsPaneProps {
  data: ParsedData[];
}

const GraphicsPane: React.FC<GraphicsPaneProps> = ({ data }) => {
  return (
    <div className="flex flex-row flex-wrap gap-10 justify-evenly">
      <MonthlyBirdTotal data={data} />
    </div>
  );
};

export default GraphicsPane;
