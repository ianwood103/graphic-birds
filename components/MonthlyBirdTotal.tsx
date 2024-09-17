import { ParsedData } from "@/types";

interface MonthlyBirdTotalProps {
  data: ParsedData[];
}

const MonthlyBirdTotal: React.FC<MonthlyBirdTotalProps> = ({ data }) => {
  return (
    <div className="w-40 h-80 bg-white rounded-md box-shadow">
      <h1>October of 2022</h1>
      <span>208 deaths</span>
    </div>
  );
};

export default MonthlyBirdTotal;
