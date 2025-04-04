import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Loader, XCircle } from 'lucide-react';
import * as cheerio from 'cheerio';

import SlopeMapLive from './components/SlopeMapLive';
import { mapSides } from './data/data.tsx';
import {Coordinate, MapItem, MapItemLive } from './types';
import { slopeColourMap, CORS_PROXY, SLOPE_STATUS_URL } from './utils/constants.ts';


function App() {
  const [mapSidesLive, setMapSidesLive] = useState<{ name: string; image: string; mapItems: MapItem[], coordinates: Coordinate[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false); // Track if fetch has run
  useEffect(() => {
    if (hasFetched.current) return; // Prevent second fetch
    hasFetched.current = true;

    const fetchSlopeStatuses = async () => {
      try {
        setError(null)
        setLoading(true)
        const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(SLOPE_STATUS_URL)}`);
        const $ = cheerio.load(response.data);
        const mapItemsLiveStatuses: MapItemLive[] = [];

        // Extract live slope/life statuses from Geilo website
        $('.list-group-item').each((_, element) => {
          const slopOrLiftTexts = $(element).contents().map((_, el) => $(el).text().trim()).get().filter(text => text.length > 0); // Remove empty text nodes

          if (slopOrLiftTexts.length === 2) {
            const fullName = slopOrLiftTexts[0]
            const statusText = slopOrLiftTexts[1].toLowerCase();
            const isOpen = statusText === 'åpen' || statusText === 'open';

            mapItemsLiveStatuses.push({
              fullName: fullName,
              isOpen: isOpen,
            });
          }
        });

        // Convert MapItemLive array to a lookup Map (key: fullName, value: isOpen)
        const liveStatusMap = new Map(mapItemsLiveStatuses.map(item => [item.fullName, item.isOpen]));

        // Loop through mapSides and update mapItems with the live isOpen status
        const updatedMapSides = mapSides.map(side => ({
          ...side,
          mapItems: side.mapItems.map(item => ({
            ...item,
            isOpen: liveStatusMap.get(item.fullName) ?? false // Default to false if not found
          }))
        }));

        setMapSidesLive(updatedMapSides);
        setLoading(false);
      } catch (error) {
        setError(`Failed to fetch live status. Please try again later: ${error}`);
        console.warn(error);
        setLoading(false);
      }
    };

    fetchSlopeStatuses();
  }, []);

  const liveStatusUpdate = () => {
    if (loading) {
      return (
          <div className="h-[100px] bg-gray-100 flex items-center justify-center">
            <div className="bg-blue-300 border border-blue-500 px-4 py-3 rounded flex items-center gap-2"><Loader className="w-8 h-8 animate-spin text-blue-600" string='Fetching Live Statuses'/>Fetching Live Statuses</div>
          </div>
      );
    }
    if (error) {
      return (
          <div className="h-[100px] bg-gray-100 flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Geilo Ski Resort Status</h1>
        <a   className="text-blue-600 hover:text-blue-800 underline underline-offset-2 font-medium transition duration-200"
             href={SLOPE_STATUS_URL}>see source here</a>
        {liveStatusUpdate()}
        {!loading && <div className="grid grid-cols-1 gap-8">
          {mapSidesLive.map((mapSide) => (
            <div key={mapSide.name}>
              <div className="bg-white rounded-lg shadow-lg p-6 w-fit">
                <SlopeMapLive
                    mapSide={mapSide}
                    mapItems={mapSide.mapItems}
                />
              </div>
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Status Overview</h2>

                {/* Lifts Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">{`${mapSide.name} Lifts`}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mapSide.mapItems
                        .filter(item => item.type === 'lift')
                        .map((lift) => (
                            <div
                                key={lift.fullName}
                                className={`p-2 rounded-lg ${
                                    lift.isOpen ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                                } border`}
                            >
                              <div className="font-semibold">{lift.fullName}</div>
                            </div>
                        ))}
                  </div>
                </div>

                {/* Slopes Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{`${mapSide.name} Slopes`}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mapSide.mapItems
                      .filter(item => item.type === 'slope')
                      .map((slope) => (
                        <div className="flex">
                          {/* Color Strip on the Right Side */}
                          <div
                              className="relative top-0 right-0 h-full w-[30px] rounded-l-lg"
                              style={{ backgroundColor: slope.difficulty ? slopeColourMap[slope.difficulty] : "gray" }}
                          />
                          <div
                            key={slope.fullName}
                            className={`relative p-2 flex items-center flex-grow gap-4 ${
                                slope.isOpen ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                            } border-r border-t border-b rounded-tr-lg rounded-br-lg`}
                          >
                            <div className="font-semibold">{slope.fullName}</div>
                            {!slope.isOpen && <XCircle className="text-red-700 w-5 h-5 mt-1"/>}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

export default App;