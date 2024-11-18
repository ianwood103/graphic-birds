"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@rewind-ui/core";
import { Card } from "@rewind-ui/core";

interface MonthlyGraphicCardProps {
  graphic: string;
  title: string;
  downloadGraphic: (graphic: string) => void;
}

const MonthlyGraphicCard: FC<MonthlyGraphicCardProps> = ({
  graphic,
  title,
  downloadGraphic,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Card className="text-darkPrimary w-[500px] bg-gray-50">
      <Card.Header className="font-bold bg-darkPrimary text-white">
        {title}
      </Card.Header>
      <Card.Body>
        <div className="flex flex-row items-center justify-between w-full">
          <Image
            src={`/graphics/${graphic}.jpg`}
            alt={title}
            height={200}
            width={200}
            className="max-h-[200px] w-auto"
          />
          <div className="w-full flex flex-row justify-center">
            <Button
              className="bg-darkPrimary"
              onClick={async () => {
                setLoading(true);
                await downloadGraphic(graphic);
                setLoading(false);
              }}
              loading={loading}
            >
              Download
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MonthlyGraphicCard;
