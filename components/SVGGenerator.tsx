import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

type BackgroundType = "blob" | "wave" | "hills" | "radial" | "slanted";

const SVGBackgroundGenerator = () => {
  const [background, setBackground] = useState<BackgroundType>("blob");
  const [primaryColor, setPrimaryColor] = useState("#6E00FF");
  const [secondaryColor, setSecondaryColor] = useState("#0096FF");
  const [width, setWidth] = useState(1440);
  const [height, setHeight] = useState(320);
  const [customClass, setCustomClass] = useState("w-full h-60");
  const svgRef = useRef<SVGSVGElement>(null);

  const getBackgroundSVG = () => {
    switch (background) {
      case "blob":
        return (
          <path
            d="M71,-54.3C85.7,-38.6,85.2,-9.3,74.8,13.2C64.4,35.6,43.9,51.2,20.7,63.7C-2.5,76.2,-28.3,85.5,-48.5,76.4C-68.7,67.3,-83.2,39.8,-80.1,15.3C-77,-9.3,-56.3,-30.6,-37.4,-46.6C-18.5,-62.5,-1.3,-73.1,19.3,-76C39.9,-78.8,63.8,-73.5,71,-54.3Z"
            fill="url(#gradient)"
            transform="translate(720 160) scale(2.5)"
          />
        );
      case "wave":
        return (
          <path
            d="M0,160L80,138.7C160,117,320,75,480,74.7C640,75,800,117,960,122.7C1120,128,1280,96,1360,80L1440,64V320H1360C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320H0Z"
            fill="url(#gradient)"
          />
        );
      case "hills":
        return (
          <path
            d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,229.3C672,245,768,235,864,208C960,181,1056,139,1152,112C1248,85,1344,75,1392,69.3L1440,64V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
            fill="url(#gradient)"
          />
        );
      case "radial":
        return (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width, height) / 2}
            fill="url(#radialGradient)"
          />
        );
      case "slanted":
        return (
          <polygon
            points={`0,100 ${width},0 ${width},${height} 0,${height}`}
            fill="url(#gradient)"
          />
        );
      default:
        return null;
    }
  };

  const downloadSVG = () => {
    const svgElement = svgRef.current!;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "background.svg";
    link.click();
  };

  const downloadPNG = async () => {
    const svgWrapper = document.getElementById("svg-wrapper");
    if (!svgWrapper) return;

    const canvas = await html2canvas(svgWrapper);
    const img = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = img;
    link.download = "background.png";
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 p-2 max-w-6xl mx-auto">
      {/* Controls */}
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <label className="font-semibold">Background Type</label>
        <select
          value={background}
          onChange={(e) => setBackground(e.target.value as BackgroundType)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="blob">Blob Mesh</option>
          <option value="wave">Wave</option>
          <option value="hills">Layered Hills</option>
          <option value="radial">Radial Glow</option>
          <option value="slanted">Slanted Divider</option>
        </select>

        <div>
          <label className="font-semibold">Primary Color</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="ml-2"
          />
        </div>

        <div>
          <label className="font-semibold">Secondary Color</label>
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="ml-2"
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="font-semibold">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-24 ml-2 md:ml-0 p-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-24 ml-2 md:ml-0 p-1 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold">Tailwind CSS Class Preview</label>
          <input
            type="text"
            value={customClass}
            onChange={(e) => setCustomClass(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={downloadSVG}
            className="bg-purple-600 text-sm text-white px-2 cursor-pointer py-2 rounded hover:bg-purple-700 transition"
          >
            Download SVG
          </button>
          <button
            onClick={downloadPNG}
            className="bg-blue-600 text-sm text-white px-2 cursor-pointer py-2 rounded hover:bg-blue-700 transition"
          >
            Download PNG
          </button>
        </div>
      </div>

      {/* Preview */}
      <div
        id="svg-wrapper"
        className={`bg-gray-100 mt-5 border border-gray-300 rounded w-full md:w-2/3 overflow-hidden flex items-center justify-center ${customClass}`}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
            <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </radialGradient>
          </defs>
          {getBackgroundSVG()}
        </svg>
      </div>
    </div>
  );
};

export default SVGBackgroundGenerator;
