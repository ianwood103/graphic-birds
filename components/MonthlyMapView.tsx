import { GraphicProps, Coordinate } from "@/utils/types";
import { MONTHS } from "@/utils/constants";
import { downloadImage } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { Select, Button } from "@rewind-ui/core";
import { MdOutlineFileDownload } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MonthlyMapView: React.FC<GraphicProps> = ({ data }) => {
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  const graphicRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      const response = await fetch("/api/monthlymapview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          month,
          year,
        }),
      });

      const json = await response.json();
      setCoordinates(json.coordinates);
    };

    fetchMapData();
  }, [data, month, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  return (
    <div className="flex flex-col w-80 h-80 border-none shadow-sm">
      <div
        ref={graphicRef}
        className="flex flex-col w-80 min-h-80 bg-white relative"
      >
        <div className="w-full h-80 relative">
          {coordinates && (
            <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
              <MapContainer
                center={[33.786, -84.386]}
                zoom={12}
                style={{
                  height: "calc(100% + 20px)",
                  width: "100%",
                  marginBottom: "-20px",
                }}
                zoomControl={false}
                dragging={false}
                touchZoom={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                boxZoom={false}
                keyboard={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="grayscale"
                />
                {coordinates.map((coord, index) => (
                  <Marker
                    key={index}
                    position={[coord.y, coord.x]}
                    icon={
                      new L.Icon({
                        iconUrl: "/pin.png",
                        iconSize: [12, 20],
                        iconAnchor: [6, 20],
                        popupAnchor: [0, -15],
                        shadowSize: [20, 20],
                      })
                    }
                  >
                    <Popup>
                      Bird collision at ({coord.x}, {coord.y})
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row rounded-b-md bg-white p-2 w-full gap-2 z-10">
        <div className="w-1/2">
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
        <div className="w-1/3">
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
        <div className="w-1/6">
          <Button
            className="h-full bg-primary"
            onClick={() => downloadImage(graphicRef)}
          >
            <MdOutlineFileDownload className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyMapView;
