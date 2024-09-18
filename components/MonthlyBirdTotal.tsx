import { ParsedData } from "@/types";
import { useEffect, useState } from "react";

interface MonthlyBirdTotalProps {
  data: ParsedData[];
}

const MonthlyBirdTotal: React.FC<MonthlyBirdTotalProps> = ({ data }) => {
  const [total, setTotal] = useState<number>();

  useEffect(() => {
    const fetchBirdTotal = async () => {
      const response = await fetch("/api/monthlybirdtotal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          month: 10,
          year: 2022,
        }),
      });

      const json = await response.json();
      setTotal(json.total);
    };

    fetchBirdTotal();
  }, [data]);

  return (
    <div className="w-40 h-80 bg-white rounded-md box-shadow">
      <h1>October of 2022</h1>
      <span>{total} deaths</span>
    </div>
  );
};

export default MonthlyBirdTotal;
