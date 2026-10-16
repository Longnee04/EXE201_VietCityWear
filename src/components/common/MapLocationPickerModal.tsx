"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, MapPin, Navigation, Loader2, Check, Search } from "lucide-react";

interface MapLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, coords?: [number, number]) => void;
  initialAddress?: string;
  initialCoords?: [number, number]; // [lng, lat]
}

const DEFAULT_MAPVINA_KEY = "3d1782815560911298d03b9ac0c68f4437";

// Default coordinates: Hoan Kiem Lake, Hanoi
const DEFAULT_CENTER: [number, number] = [105.8521, 21.0285];

export default function MapLocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialAddress = "",
  initialCoords,
}: MapLocationPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(initialCoords || DEFAULT_CENTER);
  const [detectedAddress, setDetectedAddress] = useState<string>(initialAddress);
  const [isReverseLoading, setIsReverseLoading] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: string; label: string; coordinates: [number, number] }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 1. Load MapVina GL JS & CSS
  useEffect(() => {
    if (!isOpen) return;

    // Check if stylesheet is already in document
    const cssId = "mapvina-gl-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/mapvina-gl@1.1.0/dist/mapvina-gl.css";
      document.head.appendChild(link);
    }

    // Check if script is already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).mapvinagl) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = "mapvina-gl-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/mapvina-gl@1.1.0/dist/mapvina-gl.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsScriptLoaded(true));
    }
  }, [isOpen]);

  // Reverse Geocoding Helper
  const reverseGeocode = useCallback(async (lng: number, lat: number) => {
    setIsReverseLoading(true);
    try {
      const res = await fetch(`/api/mapvina/reverse?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data?.success && data.formatted_address) {
        setDetectedAddress(data.formatted_address);
      } else {
        setDetectedAddress(`Vị trí: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch {
      setDetectedAddress(`Vị trí: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsReverseLoading(false);
    }
  }, []);

  // 2. Initialize Map when script is ready and modal is open
  useEffect(() => {
    if (!isOpen || !isScriptLoaded || !mapContainerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapvinagl = (window as any).mapvinagl;
    if (!mapvinagl) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPVINA_API_KEY || DEFAULT_MAPVINA_KEY;
    const startCenter: [number, number] = initialCoords || DEFAULT_CENTER;

    if (!mapInstanceRef.current) {
      const map = new mapvinagl.Map({
        container: mapContainerRef.current,
        style: `https://maps.mapvina.com/styles/v2/streets.json?key=${apiKey}`,
        center: startCenter,
        zoom: 15,
      });

      // Add navigation controls (zoom in/out)
      map.addControl(new mapvinagl.NavigationControl(), "top-right");

      // Create Draggable Pin Marker
      const marker = new mapvinagl.Marker({
        draggable: true,
        color: "#111111",
      })
        .setLngLat(startCenter)
        .addTo(map);

      // Listener: Marker Drag End
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        const nextCoords: [number, number] = [lngLat.lng, lngLat.lat];
        setCurrentCoords(nextCoords);
        reverseGeocode(lngLat.lng, lngLat.lat);
      });

      // Listener: Map Click
      map.on("click", (e: { lngLat: { lng: number; lat: number } }) => {
        const { lng, lat } = e.lngLat;
        marker.setLngLat([lng, lat]);
        const nextCoords: [number, number] = [lng, lat];
        setCurrentCoords(nextCoords);
        reverseGeocode(lng, lat);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // If initial address was empty, reverse geocode initial point
      if (!initialAddress) {
        reverseGeocode(startCenter[0], startCenter[1]);
      }
    } else {
      // If map already exists, resize it properly
      setTimeout(() => {
        mapInstanceRef.current?.resize();
      }, 200);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, isScriptLoaded, initialCoords, initialAddress, reverseGeocode]);

  // GPS Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGPS(false);
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        const coords: [number, number] = [lng, lat];

        setCurrentCoords(coords);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: coords,
            zoom: 16,
            essential: true,
          });
        }
        if (markerRef.current) {
          markerRef.current.setLngLat(coords);
        }

        reverseGeocode(lng, lat);
      },
      (err) => {
        setIsLocatingGPS(false);
        console.warn("GPS error:", err);
        alert("Không thể lấy vị trí hiện tại. Vui lòng cho phép quyền truy cập vị trí trên trình duyệt.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Search places in modal
  const handleSearchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim() || searchKeyword.trim().length < 2) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/mapvina/autocomplete?text=${encodeURIComponent(searchKeyword.trim())}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.suggestions)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const withCoords = data.suggestions.filter((s: any) => s.coordinates && s.coordinates.length === 2);
        setSearchResults(withCoords);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: { label: string; coordinates: [number, number] }) => {
    const coords = result.coordinates;
    setCurrentCoords(coords);
    setDetectedAddress(result.label);
    setSearchResults([]);
    setSearchKeyword("");

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: coords,
        zoom: 16,
      });
    }
    if (markerRef.current) {
      markerRef.current.setLngLat(coords);
    }
  };

  const handleConfirm = () => {
    if (!detectedAddress.trim()) {
      alert("Chưa xác định được địa chỉ. Vui lòng di chuyển ghim trên bản đồ.");
      return;
    }
    onSelectLocation(detectedAddress, currentCoords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-black">
                Chọn vị trí giao hàng trên bản đồ
              </h3>
              <p className="text-[11px] text-stone-500">
                Kéo thả ghim hoặc chạm vào bản đồ để định vị đúng số nhà của bạn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200/60 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside map */}
        <div className="relative p-2.5 bg-white border-b border-stone-100 z-10 flex gap-2">
          <form onSubmit={handleSearchPlace} className="flex-1 relative flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm khu vực / đường phố để nhảy nhanh đến..."
              className="w-full pl-8 pr-16 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1 px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:text-black"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Tìm"}
            </button>
          </form>

          {/* GPS Locate Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocatingGPS}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded border border-stone-200 flex items-center gap-1.5 shrink-0 transition-colors"
            title="Định vị vị trí hiện tại của tôi"
          >
            {isLocatingGPS ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span className="hidden sm:inline">Vị trí của tôi</span>
          </button>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-2.5 right-2.5 top-full mt-1 bg-white border border-stone-200 rounded shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-stone-100">
              {searchResults.map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSearchResult(r)}
                  className="p-2.5 hover:bg-stone-50 cursor-pointer text-xs text-stone-800 flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Canvas */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-stone-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {!isScriptLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 text-stone-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-stone-600" />
              <p className="text-xs font-medium">Đang tải bản đồ số...</p>
            </div>
          )}

          {/* Floating Crosshair Hint Overlay */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-stone-200 text-[10px] text-stone-600 shadow-xs pointer-events-none">
            💡 Kéo ghim màu đen đến đúng vị trí nhà bạn
          </div>
        </div>

        {/* Bottom Address Confirmation Bar */}
        <div className="p-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
              <span>Địa chỉ được định vị:</span>
              {isReverseLoading && <Loader2 className="w-3 h-3 animate-spin text-stone-400" />}
            </div>
            <p className="text-xs font-semibold text-black line-clamp-2">
              {detectedAddress || "Đang xác định địa chỉ tại điểm ghim..."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isReverseLoading || !detectedAddress}
              className="px-5 py-2 bg-black text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-800 disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Xác nhận vị trí</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
