import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  CityGeo,
  DEFAULT_ISRAEL_CENTER,
  DEFAULT_ISRAEL_ZOOM,
  ISRAEL_CITIES_GEO,
  getCityCoordinates,
} from '../data/israelGeo';
import { HostingRequest, HostProfile } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Compass, Layers, Check, Sparkles, AlertTriangle } from 'lucide-react';

interface IsraelMapProps {
  mode: 'picker' | 'feed' | 'preview';
  // Picker props:
  selectedCity?: string;
  selectedCities?: string[];
  isMultiCity?: boolean;
  onSelectCity?: (city: string) => void;
  onToggleMultiCity?: (city: string) => void;

  // Feed props:
  requests?: HostingRequest[];
  onSelectRequest?: (req: HostingRequest) => void;
  hostProfile?: HostProfile | null;

  // Preview props:
  previewCity?: string;
  previewAddress?: string;
  previewTitle?: string;

  height?: string;
  className?: string;
}

export const IsraelMap: React.FC<IsraelMapProps> = ({
  mode,
  selectedCity = 'Jerusalem',
  selectedCities = [],
  isMultiCity = false,
  onSelectCity,
  onToggleMultiCity,
  requests = [],
  onSelectRequest,
  hostProfile,
  previewCity,
  previewAddress,
  previewTitle,
  height = '340px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const { t, lang } = useApp();
  const [activeRegion, setActiveRegion] = useState<'All' | 'Jerusalem' | 'Central' | 'North' | 'South'>('All');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      let initialCenter = DEFAULT_ISRAEL_CENTER;
      let initialZoom = DEFAULT_ISRAEL_ZOOM;

      if (mode === 'preview' && previewCity) {
        initialCenter = getCityCoordinates(previewCity);
        initialZoom = 13;
      } else if (mode === 'picker' && selectedCity) {
        initialCenter = getCityCoordinates(selectedCity);
        initialZoom = 9;
      }

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
        minZoom: 7,
        maxZoom: 16,
      });

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // CartoDB Voyager tiles (crisp, beautiful, modern warm aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Invalidate size once DOM finishes layout
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers based on mode and state
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // MODE 1: PICKER MODE (Hosting request flow)
    if (mode === 'picker') {
      const activeCities = isMultiCity ? selectedCities : [selectedCity];

      Object.values(ISRAEL_CITIES_GEO).forEach((cityGeo: CityGeo) => {
        const isSelected = activeCities.includes(cityGeo.name);

        // Custom HTML Marker Pin
        const markerHtml = `
          <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md border text-xs font-bold whitespace-nowrap ${
              isSelected
                ? 'bg-amber-600 text-white border-amber-300 ring-4 ring-amber-500/30'
                : 'bg-white/95 text-slate-800 border-slate-200 hover:border-amber-400 hover:bg-amber-50'
            }">
              <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-amber-500'}"></span>
              <span>${lang === 'he' ? cityGeo.hebrewName : cityGeo.name}</span>
              ${isSelected ? '<span class="text-[10px] font-black">✓</span>' : ''}
            </div>
            ${
              isSelected
                ? '<div class="w-2 h-2 bg-amber-600 rotate-45 mx-auto -mt-1 shadow-xs"></div>'
                : ''
            }
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-div-icon',
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });

        const marker = L.marker([cityGeo.lat, cityGeo.lng], { icon });

        marker.on('click', () => {
          if (isMultiCity) {
            onToggleMultiCity?.(cityGeo.name);
          } else {
            onSelectCity?.(cityGeo.name);
            map.flyTo([cityGeo.lat, cityGeo.lng], 10, { duration: 0.8 });
          }
        });

        // Popup with city overview
        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
            <p style="font-weight: 800; font-size: 13px; color: #0f172a; margin: 0;">
              ${lang === 'he' ? cityGeo.hebrewName : cityGeo.name}
            </p>
            <p style="color: #64748b; font-size: 11px; margin: 4px 0 8px 0;">
              ${lang === 'he' ? cityGeo.descriptionHe : cityGeo.descriptionEn}
            </p>
            <button id="btn-select-${cityGeo.name.replace(/[^a-zA-Z]/g, '')}" style="
              width: 100%;
              padding: 5px 8px;
              background-color: ${isSelected ? '#dc2626' : '#d97706'};
              color: white;
              font-weight: bold;
              border: none;
              border-radius: 8px;
              cursor: pointer;
            ">
              ${
                isSelected
                  ? lang === 'he'
                    ? 'הסר עיר'
                    : 'Remove City'
                  : lang === 'he'
                  ? 'בחר עיר זו'
                  : 'Select City'
              }
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-${cityGeo.name.replace(/[^a-zA-Z]/g, '')}`);
          if (btn) {
            btn.onclick = () => {
              if (isMultiCity) onToggleMultiCity?.(cityGeo.name);
              else onSelectCity?.(cityGeo.name);
              marker.closePopup();
            };
          }
        });

        marker.addTo(layer);
      });

      // If single city changed, pan smoothly
      if (!isMultiCity && selectedCity) {
        const coords = getCityCoordinates(selectedCity);
        map.panTo(coords);
      }
    }

    // MODE 2: FEED MODE (Host & Admin View)
    else if (mode === 'feed') {
      // Group requests by city
      const cityMap: Record<string, HostingRequest[]> = {};
      requests.forEach(r => {
        const targetCity = r.city;
        if (!cityMap[targetCity]) cityMap[targetCity] = [];
        cityMap[targetCity].push(r);
      });

      Object.entries(cityMap).forEach(([cityName, reqs]) => {
        const coords = getCityCoordinates(cityName);
        const isHaifaShortage = cityName === 'Haifa' && reqs.some(r => r.status === 'open');
        const openCount = reqs.filter(r => r.status === 'open').length;

        // Custom Host Feed Pin
        const markerHtml = `
          <div class="relative group cursor-pointer transition-transform duration-200 hover:scale-110">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-lg border text-xs font-black whitespace-nowrap ${
              isHaifaShortage
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border-amber-300 ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-slate-900 text-white border-amber-400/60 ring-2 ring-slate-900/20'
            }">
              <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-black">
                ${openCount}
              </span>
              <span>${cityName}</span>
              ${isHaifaShortage ? '<span class="text-xs">⚠️</span>' : ''}
            </div>
            <div class="w-2.5 h-2.5 ${isHaifaShortage ? 'bg-rose-600' : 'bg-slate-900'} rotate-45 mx-auto -mt-1 shadow-xs"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-feed-icon',
          iconSize: [110, 36],
          iconAnchor: [55, 18],
        });

        const marker = L.marker(coords, { icon });

        // Popup with preview of guests in this city
        const guestListHtml = reqs
          .slice(0, 3)
          .map(
            g => `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; padding: 4px; background: #f8fafc; border-radius: 8px;">
              <img src="${g.guestAvatar}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" />
              <div style="flex: 1; min-width: 0;">
                <p style="font-weight: bold; font-size: 11px; margin: 0; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${g.guestName}</p>
                <p style="font-size: 10px; margin: 0; color: #64748b;">${g.institution}</p>
              </div>
            </div>
          `
          )
          .join('');

        const popupHtml = `
          <div style="font-family: inherit; font-size: 12px; min-width: 200px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 13px; color: #0f172a;">${cityName} (${reqs.length} ${lang === 'he' ? 'בקשות' : 'Requests'})</strong>
              ${isHaifaShortage ? '<span style="font-size: 10px; font-weight: bold; color: #dc2626; background: #fee2e2; padding: 2px 6px; border-radius: 9999px;">Shortage</span>' : ''}
            </div>
            ${guestListHtml}
            ${reqs.length > 3 ? `<p style="font-size: 10px; color: #94a3b8; text-align: center; margin: 4px 0;">+ ${reqs.length - 3} more guests</p>` : ''}
            <button id="btn-view-city-${cityName.replace(/[^a-zA-Z]/g, '')}" style="
              width: 100%;
              padding: 6px 10px;
              margin-top: 4px;
              background-color: #d97706;
              color: white;
              font-weight: bold;
              border: none;
              border-radius: 8px;
              cursor: pointer;
            ">
              ${lang === 'he' ? 'צפה בבקשות של עיר זו' : 'View Guests in this City'}
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-city-${cityName.replace(/[^a-zA-Z]/g, '')}`);
          if (btn) {
            btn.onclick = () => {
              if (reqs.length > 0 && onSelectRequest) {
                onSelectRequest(reqs[0]);
              }
              marker.closePopup();
            };
          }
        });

        marker.addTo(layer);
      });
    }

    // MODE 3: PREVIEW MODE (Single location / Host address unlocked)
    else if (mode === 'preview') {
      const city = previewCity || 'Jerusalem';
      const coords = getCityCoordinates(city);

      // Circle representing neighborhood radius (~800m)
      L.circle(coords, {
        radius: 800,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '4, 6',
      }).addTo(layer);

      const markerHtml = `
        <div class="relative flex flex-col items-center">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-700 text-white shadow-xl border-2 border-white font-bold text-xs">
            <span>🏠</span>
            <span>${previewTitle || (lang === 'he' ? 'מיקום המארחים' : 'Host Family Area')}</span>
          </div>
          <div class="w-3 h-3 bg-emerald-700 rotate-45 -mt-1.5 border-r border-b border-white"></div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'preview-host-icon',
        iconSize: [140, 40],
        iconAnchor: [70, 40],
      });

      const marker = L.marker(coords, { icon });

      if (previewAddress) {
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px;">
            <strong style="color: #065f46; font-size: 13px;">${previewTitle || 'Host Family Location'}</strong>
            <p style="margin: 4px 0 8px 0; color: #334155;">${previewAddress}</p>
            <div style="display: flex; gap: 4px;">
              <a href="https://maps.google.com/?q=${encodeURIComponent(previewAddress)}" target="_blank" style="
                flex: 1; text-align: center; padding: 5px 8px; background: #059669; color: white; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 11px;
              ">Google Maps</a>
              <a href="https://waze.com/ul?q=${encodeURIComponent(previewAddress)}" target="_blank" style="
                flex: 1; text-align: center; padding: 5px 8px; background: #0284c7; color: white; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 11px;
              ">Waze</a>
            </div>
          </div>
        `);
      }

      marker.addTo(layer);
      map.setView(coords, 14);
    }
  }, [
    mode,
    selectedCity,
    selectedCities,
    isMultiCity,
    requests,
    previewCity,
    previewAddress,
    lang,
    activeRegion,
  ]);

  // Center on Israel or zoom to selected
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DEFAULT_ISRAEL_CENTER, DEFAULT_ISRAEL_ZOOM);
    }
  };

  const handleRegionClick = (region: 'All' | 'Jerusalem' | 'Central' | 'North' | 'South') => {
    setActiveRegion(region);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (region === 'All') {
      map.setView(DEFAULT_ISRAEL_CENTER, DEFAULT_ISRAEL_ZOOM);
    } else if (region === 'Jerusalem') {
      map.setView([31.7683, 35.15], 10);
    } else if (region === 'Central') {
      map.setView([32.08, 34.82], 10);
    } else if (region === 'North') {
      map.setView([32.85, 35.2], 9);
    } else if (region === 'South') {
      map.setView([31.4, 34.75], 9);
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-100 ${className}`}>
      {/* Map region filter toolbar */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-slate-200/80 text-[11px] font-bold">
        {(['All', 'Jerusalem', 'Central', 'North', 'South'] as const).map(reg => {
          const labels: Record<string, { en: string; he: string }> = {
            All: { en: 'All Israel', he: 'כל הארץ' },
            Jerusalem: { en: 'Jerusalem & Hills', he: 'ירושלים ויהודה' },
            Central: { en: 'Central / Gush Dan', he: 'מרכז וגוש דן' },
            North: { en: 'North / Haifa', he: 'צפון וחיפה' },
            South: { en: 'South / Coast', he: 'דרום והשפלה' },
          };

          return (
            <button
              key={reg}
              type="button"
              onClick={() => handleRegionClick(reg)}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                activeRegion === reg
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {lang === 'he' ? labels[reg].he : labels[reg].en}
            </button>
          );
        })}
      </div>

      {/* Recenter button */}
      <button
        type="button"
        onClick={handleResetView}
        className="absolute bottom-3 right-3 z-[1000] p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 transition-colors cursor-pointer"
        title={t('Center map on Israel', 'מרכז מפה על ישראל')}
      >
        <Navigation className="w-4 h-4 text-amber-600" />
      </button>

      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Mode hint caption */}
      {mode === 'picker' && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-slate-200/80 text-[10px] text-slate-600 font-medium">
          {isMultiCity
            ? t('Tap cities on the map to add or remove them from your request', 'לחצו על ערים במפה כדי להוסיף או להסיר מבקשתכם')
            : t('Tap any city pin to select your Shabbat destination', 'לחצו על עיר במפה כדי לבחור יעד לשבת')}
        </div>
      )}
    </div>
  );
};
