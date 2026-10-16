"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, X, Search, Check } from "lucide-react";

export interface MapVinaSuggestion {
  id: string;
  name: string;
  label: string;
  housenumber?: string;
  street?: string;
  locality?: string;
  region?: string;
  coordinates?: [number, number];
}

interface AddressAutocompleteInputProps {
  value: string;
  onChange: (value: string, suggestion?: MapVinaSuggestion) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const DEFAULT_MAPVINA_KEY = "3d1782815560911298d03b9ac0c68f4437";

export default function AddressAutocompleteInput({
  value,
  onChange,
  placeholder = "Nhập số nhà, tên đường, phường/xã, quận/huyện...",
  required = false,
  className = "",
  id,
  disabled = false,
}: AddressAutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<MapVinaSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions from MapVina
  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Try local API proxy
      const res = await fetch(`/api/mapvina/autocomplete?text=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data?.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setIsOpen(true);
        setIsLoading(false);
        return;
      }

      // 2. Fallback directly to MapVina API if proxy returned empty or error
      const apiKey = process.env.NEXT_PUBLIC_MAPVINA_API_KEY || DEFAULT_MAPVINA_KEY;
      const fallbackUrl = `https://maps.mapvina.com/api/v1/autocomplete?text=${encodeURIComponent(
        query.trim()
      )}&key=${apiKey}&lang=vi&size=6&new_admin=true`;

      const directRes = await fetch(fallbackUrl);
      if (directRes.ok) {
        const directData = await directRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features: any[] = directData?.features || [];
        const fallbackList: MapVinaSuggestion[] = features.map((f) => ({
          id: f.properties?.id || f.properties?.gid || Math.random().toString(),
          name: f.properties?.name || "",
          label: f.properties?.label || f.properties?.name || "",
          housenumber: f.properties?.housenumber || "",
          street: f.properties?.street || "",
          locality: f.properties?.locality || "",
          region: f.properties?.region || "",
          coordinates: f.geometry?.coordinates || null,
        }));

        setSuggestions(fallbackList);
        setIsOpen(fallbackList.length > 0);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.warn("MapVina Autocomplete warning:", err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    onChange(nextVal);
    setSelectedIndex(-1);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(nextVal);
    }, 280);
  };

  const handleSelectSuggestion = (s: MapVinaSuggestion) => {
    const fullAddress = s.label || s.name;
    setInputValue(fullAddress);
    onChange(fullAddress, s);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-stone-400 pointer-events-none flex items-center">
          <MapPin className="w-4 h-4 text-stone-500" />
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
            else if (inputValue.trim().length >= 2) fetchSuggestions(inputValue);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="off"
          className={`w-full pl-9 pr-14 py-2.5 text-xs bg-white border border-stone-300 focus:outline-none focus:border-black rounded-xs transition-colors ${className}`}
        />

        {/* Right action icons */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="w-3.5 h-3.5 text-stone-400 animate-spin" />
          )}

          {!isLoading && inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-stone-400 hover:text-black rounded-full hover:bg-stone-100 transition-colors"
              title="Xóa địa chỉ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <span
            className="text-[9px] font-bold tracking-tight text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 select-none hidden sm:inline-block"
            title="Được định tuyến bởi MapVina"
          >
            MapVina
          </span>
        </div>
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-stone-200 rounded-md shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-72 overflow-y-auto">
          {/* Header indicator */}
          <div className="px-3 py-1.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Search className="w-3 h-3 text-stone-400" />
              <span>Gợi ý địa chỉ từ <strong>MapVina</strong></span>
            </span>
            <span className="text-[9px] text-stone-400">Dùng phím ↑ ↓ Enter để chọn</span>
          </div>

          {/* List of items */}
          <ul className="divide-y divide-stone-100">
            {suggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 cursor-pointer transition-colors flex items-start gap-2.5 ${
                    isSelected ? "bg-stone-100 text-black" : "hover:bg-stone-50 text-stone-800"
                  }`}
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {item.name || item.street || item.label}
                    </p>
                    <p className="text-[11px] text-stone-500 leading-snug line-clamp-2 mt-0.5">
                      {item.label}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-black shrink-0 self-center" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer note */}
          <div className="px-3 py-1.5 bg-[#FBFBFA] border-t border-stone-100 text-center text-[9px] text-stone-400">
            Dữ liệu địa giới hành chính cập nhật chính xác bởi MapVina API
          </div>
        </div>
      )}
    </div>
  );
}
