"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@rewind-ui/core";
import { Card } from "@rewind-ui/core";

interface SeasonGraphicCardProps {
  graphic: string;
  title: string;
  downloadGraphic: (graphic: string, monthly: boolean) => void;
  season: string;
  year: number;
  downloading: boolean;
  setDownloading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SeasonGraphicCard: FC<SeasonGraphicCardProps> = ({
  graphic,
  title,
  downloadGraphic,
  season,
  year,
  downloading,
  setDownloading,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Card className="text-darkPrimary w-fit bg-gray-50">
      <Card.Header className="font-bold bg-darkPrimary text-white">
        <div className="flex items-center gap-2">{title}</div>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col items-center w-full gap-4">
          <div className="relative w-full">
            <Image
              src={`/graphics/${graphic}.jpg`}
              alt={title}
              height={200}
              width={200}
              className="w-full h-auto"
              priority
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              Template
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <Button
              className="bg-darkPrimary w-full"
              onClick={async () => {
                setLoading(true);
                setDownloading(true);
                await downloadGraphic(graphic, false);
                setLoading(false);
                setDownloading(false);
              }}
              loading={loading}
              disabled={downloading}
            >
              Download Graphic
            </Button>
            <div className="text-sm text-gray-600 mb-2">
              Downloading graphics for{" "}
              {season.charAt(0).toUpperCase() + season.slice(1)} {year}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SeasonGraphicCard;
