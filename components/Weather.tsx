'use client';

/* import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css'; */
import FullScreenLoader from './FullScreenLoader';

export default function Weather() {
  /* const [LeafletMap, setLeafletMap] = useState<JSX.Element | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet modules only on client
    import('react-leaflet').then(({ MapContainer, TileLayer }) => {
      const map = (
        <MapContainer
          center={[30.59, 80]}
          zoom={5}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://api.tomorrow.io/v4/map/tile/5/28/15/precipitationIntensity/now.png?apikey=KSlyOA3Ij7yZgVlsBssfaA5zT0KdtRmf"
          />
        </MapContainer>
      );
      setLeafletMap(map);
    });
  }, []); */

  return (
    <div>
      {<FullScreenLoader/>}
    </div>
  );
}
