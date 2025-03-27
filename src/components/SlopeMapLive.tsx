import React from 'react';
import { MapItem, MapSide } from '../types';
import { slopeColourMap } from '../utils/constants.ts';

interface SlopeMapProps {
  mapSide: MapSide;
  mapItems: MapItem[];
}

const SlopeMap: React.FC<SlopeMapProps> = ({ mapSide, mapItems }) => {
  return (
      <div className="relative">
        <h2 className="text-xl font-bold mb-4">{mapSide.name}</h2>
        <div className="relative inline-block">
          <img
              src={mapSide.image}
              alt={`${mapSide.name} ski map`}
              className="w-[1200px] max-w-none h-auto cursor-crosshair"
          />
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
        </div>
      </div>
  );
};

export default SlopeMap;