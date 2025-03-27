import React from 'react';
import { MapItem, MapSide } from '../types';


const slopeColourMap = {
    green:  'rgb(0,150,65)',
    blue: 'rgb(0,159,227)',
    red: 'rgb(227,6,19)',
    black: 'rgb(15,15,15)',
}
interface SlopeMapProps {
  mapSide: MapSide;
  mapItems: MapItem[];
}

const SlopeMap: React.FC<SlopeMapProps> = ({ mapSide, mapItems }) => {
  // const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  // const [selectedSlope, setSelectedSlope] = useState<string>('');

  // const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
  //   const rect = e.currentTarget.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;
  //
  //   if (selectedSlope) {
  //     setCoordinates([...coordinates, { x, y, id: selectedSlope }]);
  //     setSelectedSlope('');
  //   }
  // };

  // const handleCopyCoordinates = () => {
  //   const coordsText = coordinates
  //     .map(coord => `{ id: "${coord.id}", x: ${coord.x.toFixed(2)}, y: ${coord.y.toFixed(2)} }`)
  //     .join(',\n');
  //   navigator.clipboard.writeText(`[\n${coordsText}\n]`);
  //   alert('Coordinates copied to clipboard!');
  // };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">{mapSide.name}</h2>
      
      {/* Coordinate Picker Controls */}
      {/*<div className="mb-4 p-4 bg-gray-100 rounded-lg">*/}
      {/*  <h3 className="text-lg font-semibold mb-2">Coordinate Picker Tool</h3>*/}
      {/*  <select*/}
      {/*    value={selectedSlope}*/}
      {/*    onChange={(e) => setSelectedSlope(e.target.value)}*/}
      {/*    className="mb-2 p-2 border rounded"*/}
      {/*  >*/}
      {/*    <option value="">Select a slope/lift</option>*/}
      {/*    {mapItems.map((slope) => (*/}
      {/*      <option key={slope.fullName} value={slope.fullName}>*/}
      {/*        {slope.fullName}*/}
      {/*      </option>*/}
      {/*    ))}*/}
      {/*  </select>*/}

        {/*<button*/}
        {/*  onClick={handleCopyCoordinates}*/}
        {/*  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"*/}
        {/*>*/}
        {/*  Copy All Coordinates*/}
        {/*</button>*/}

        {/*<button*/}
        {/*  onClick={() => setCoordinates([])}*/}
        {/*  className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"*/}
        {/*>*/}
        {/*  Clear All*/}
        {/*</button>*/}
      {/*</div>*/}

      <div className="relative inline-block">
        <img 
          src={mapSide.image} 
          alt={`${mapSide.name} ski map`} 
          className="w-[1200px] max-w-none h-auto cursor-crosshair"
          // onClick={handleImageClick}
        />
        
        {/* Display existing coordinates */}
        {mapSide.coordinates.map((coordinate, index) => {
          const mapItem = mapItems.find(mapItem => {
            return mapItem.fullName === coordinate.id});
          return (
            <div
              key={index}
              className={`absolute cursor-pointer transition-all duration-300 ${
                  !mapItem?.isOpen && 'line-through'
              }`}
              style={ mapItem.type === 'lift' ? {
                left: `${coordinate.x}%`,
                top: `${coordinate.y}%`,
                transform: 'translate(-50%, -50%)',
                fontWeight: 'bold',
                padding: '3px',
                borderRadius: '10px',
                backgroundColor:  mapItem?.isOpen ? 'rgba(243,145,0, 1)' : 'gray',
              } : {
                left: `${coordinate.x}%`,
                top: `${coordinate.y}%`,
                transform: 'translate(-50%, -50%)',
                fontWeight: 'bold',
                padding: '5px, 3px',
                borderRadius: '1px',
                backgroundColor:  mapItem?.isOpen ? slopeColourMap[mapItem.difficulty] : 'gray',
                color: (mapItem?.isOpen && mapItem.difficulty === 'black') ? 'white' : '',
              }}
            >
              {mapItem?.prefix}
            </div>
          );
        })}

        {/* Preview for selected slope */}
        {/*{selectedSlope && (*/}
        {/*  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 text-white text-xl pointer-events-none">*/}
        {/*    Click on the map to place {mapItems.find(mapItem => mapItem.fullName === selectedSlope)?.fullName}*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>

      {/* Display coordinates for debugging */}
      {/*<div className="mt-4 p-4 bg-gray-100 rounded-lg">*/}
      {/*  <h4 className="font-semibold mb-2">Placed Coordinates:</h4>*/}
      {/*  <pre className="text-sm overflow-x-auto">*/}
      {/*    {JSON.stringify(coordinates, null, 2)}*/}
      {/*  </pre>*/}
      {/*</div>*/}
    </div>
  );
};

export default SlopeMap;