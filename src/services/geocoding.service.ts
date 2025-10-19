// Geocoding service using free APIs as alternatives to Google Maps
export interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  displayName?: string;
}

export interface ReverseGeocodeResult {
  address: string;
  lat: number;
  lng: number;
}

class GeocodingService {
  private readonly nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
  private readonly userAgent = 'LogisticApp/1.0';
  
  // Rate limiting for Nominatim (max 1 request per second)
  private lastRequestTime = 0;
  private readonly minInterval = 1000; // 1 second

  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Geocode an address to get coordinates using OpenStreetMap Nominatim
   */
  async geocode(address: string): Promise<GeocodeResult[]> {
    if (!address.trim()) {
      throw new Error('Address is required');
    }

    await this.throttleRequest();

    try {
      const params = new URLSearchParams({
        q: address,
        format: 'json',
        limit: '5',
        addressdetails: '1',
      });

      const response = await fetch(`${this.nominatimBaseUrl}/search?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data.map((item: any) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
      }));
    } catch (error) {
      console.error('Nominatim geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to get an address
   */
  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
    await this.throttleRequest();

    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: '1',
      });

      const response = await fetch(`${this.nominatimBaseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        address: data.display_name,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
      };
    } catch (error) {
      console.error('Nominatim reverse geocoding error:', error);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  /**
   * Alternative geocoding using MapBox (requires API key in environment)
   */
  async geocodeWithMapBox(address: string): Promise<GeocodeResult[]> {
    const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
    
    if (!apiKey) {
      throw new Error('MapBox API key not configured');
    }

    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}&limit=5`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data.features.map((feature: any) => ({
        address: feature.place_name,
        lat: feature.center[1],
        lng: feature.center[0],
        displayName: feature.place_name,
      }));
    } catch (error) {
      console.error('MapBox geocoding error:', error);
      throw new Error('Failed to geocode address with MapBox');
    }
  }

  /**
   * Alternative geocoding using LocationIQ (requires API key)
   */
  async geocodeWithLocationIQ(address: string): Promise<GeocodeResult[]> {
    const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('LocationIQ API key not configured');
    }

    try {
      const params = new URLSearchParams({
        q: address,
        key: apiKey,
        format: 'json',
        limit: '5',
      });

      const response = await fetch(`https://us1.locationiq.com/v1/search.php?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data.map((item: any) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
      }));
    } catch (error) {
      console.error('LocationIQ geocoding error:', error);
      throw new Error('Failed to geocode address with LocationIQ');
    }
  }

  /**
   * Smart geocoding that tries multiple free services
   */
  async smartGeocode(address: string): Promise<GeocodeResult[]> {
    // Try Nominatim first (free, no API key required)
    try {
      const results = await this.geocode(address);
      if (results.length > 0) {
        return results;
      }
    } catch (error) {
      console.warn('Nominatim geocoding failed, trying alternatives:', error);
    }

    // Try MapBox if API key is available
    try {
      return await this.geocodeWithMapBox(address);
    } catch (error) {
      console.warn('MapBox geocoding failed:', error);
    }

    // Try LocationIQ if API key is available
    try {
      return await this.geocodeWithLocationIQ(address);
    } catch (error) {
      console.warn('LocationIQ geocoding failed:', error);
    }

    throw new Error('All geocoding services failed');
  }
}

export const geocodingService = new GeocodingService();