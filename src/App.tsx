import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader as Load } from 'lucide-react';
import * as cheerio from 'cheerio';

import SlopeMap from './components/SlopeMapPicker';
import { MapItem, MapSide } from './types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const SLOPE_STATUS_URL = 'https://www.skigeilo.no/webkamera-og-vaer';

const mapSides: MapSide[] = [
  {
    name: 'Slaatta, Havsdalen, Geiloheisen + Halstensgard',
    image: '/src/images/SlaattaHavsdalenGeiloheisen+Halstensgard.png'
  },
  {
    name: 'Kikut + Vestlia',
    image: '/src/images/Kitkut+Vestlia.png'
  }
];

// Difficulty mapping based on Norwegian terms
const difficultyMap: { [key: string]: 'green' | 'blue' | 'red' | 'black' } = {
  'Meget lett': 'very easy',
  'Lett': 'easy',
  'Middels': 'medium',
  'Krevende': 'demanding'
};

function App() {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlopeStatuses = async () => {
      console.log('Looking at geilo lift status page:', SLOPE_STATUS_URL)
      try {
        setError(null)
        setLoading(true)
        const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(SLOPE_STATUS_URL)}`);
        const $ = cheerio.load(response.data);
        
        const itemsForMap: MapItem[] = [];

        // Process all list items
        $('.list-group-item').each((_, element) => {
          const slopOrLiftTexts = $(element).contents().map((_, el) => $(el).text().trim()).get().filter(text => text.length > 0); // Remove empty text nodes
          // console.log(slopOrLiftTexts); // Slope: ["11-Ølkorken", "Åpen"], Lift: ["B-Fugleleiken", "Åpen"]

     
          if (slopOrLiftTexts.length === 2) {
            const fullName = slopOrLiftTexts[0]
            const prefix = slopOrLiftTexts[0].split('-')[0]
            const name = slopOrLiftTexts[0].split('-')[1];
            const statusText = slopOrLiftTexts[1].toLowerCase();
            const isOpen = statusText === 'åpen' || statusText === 'open';
            
            // Determine if it's a lift by checking if id is [A-Z], (the slopes have digit for id)
            const isLift = /^[A-Z]$/i.test(prefix);
            console.log({ prefix, name, isOpen, isLift });            

            itemsForMap.push({
              prefix: prefix,
              name: name,
              fullName: fullName,
              isOpen: isOpen,
              type: isLift ? 'lift' : 'slope',
              // ...(difficulty && { difficulty })
            });
          }
        });
        itemsForMap.sort((a, b) => {
          const isANumber = /^\d+$/.test(a.prefix);
          const isBNumber = /^\d+$/.test(b.prefix);
        
          if (isANumber && isBNumber) {
            return Number(a.prefix) - Number(b.prefix); // Proper numeric comparison
          }
          
          return a.prefix.localeCompare(b.prefix); // Default alphabetical sorting for letters
        });
        console.log(itemsForMap)

        setMapItems(itemsForMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch slope statuses. Please try again later. Error:', err);
        console.warn(err);
        setLoading(false);
      }
    };

    fetchSlopeStatuses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Load className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Geilo Ski Resort Status</h1>
        <a href={SLOPE_STATUS_URL}>see source here</a>
        
        <div className="grid grid-cols-1 gap-8">
          {mapSides.map((mapSide) => (
            <div key={mapSide.name} className="bg-white rounded-lg shadow-lg p-6 w-fit">
              <SlopeMap 
                mapSide={mapSide}
                mapItems={mapItems}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Status Overview</h2>
          
          {/* Lifts Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Lifts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapItems
                .filter(item => item.type === 'lift')
                .map((lift) => (
                  <div
                    key={lift.fullName}
                    className={`p-4 rounded-lg ${
                      lift.isOpen ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                    } border`}
                  >
                    <div className="font-semibold">{lift.fullName}</div>
                    <div className={`text-sm ${lift.isOpen ? 'text-green-700' : 'text-red-700'}`}>
                      {lift.isOpen ? 'Open' : 'Closed'}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Slopes Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Slopes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapItems
                .filter(item => item.type === 'slope')
                .map((slope) => (
                  <div
                    key={slope.fullName}
                    className={`p-4 rounded-lg ${
                      slope.isOpen ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                    } border`}
                  >
                    <div className="font-semibold">{slope.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {slope.difficulty && `Difficulty: ${slope.difficulty}`}
                    </div>
                    <div className={`text-sm ${slope.isOpen ? 'text-green-700' : 'text-red-700'}`}>
                      {slope.isOpen ? 'Open' : 'Closed'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;