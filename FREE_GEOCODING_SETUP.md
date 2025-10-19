# Free Geocoding Implementation

This project uses completely free geocoding services for getting coordinates from location names. Google Maps API has been removed and replaced with free alternatives.

## Current Implementation

### Primary Service: OpenStreetMap Nominatim (100% Free)

- **API**: Nominatim (OpenStreetMap)
- **Cost**: Completely free
- **Rate Limit**: 1 request per second
- **No API Key Required**: Works out of the box
- **Coverage**: Global coverage with detailed address data
- **Usage**: Primary geocoding service (Google Maps completely removed)

### Features Implemented

1. **Forward Geocoding**: Convert addresses to coordinates
2. **Reverse Geocoding**: Convert coordinates back to addresses
3. **Address Suggestions**: Multiple location results with selection dropdown
4. **Rate Limiting**: Automatic throttling to respect API limits
5. **Error Handling**: Graceful fallback and error messages
6. **Simple Map Picker**: Coordinate picker without external maps

## Alternative Services (Optional)

### 1. MapBox Geocoding API
- **Free Tier**: 100,000 requests/month
- **API Key Required**: Set `VITE_MAPBOX_API_KEY` in `.env`
- **Usage**: Automatic fallback if Nominatim fails

### 2. LocationIQ
- **Free Tier**: 5,000 requests/day  
- **API Key Required**: Set `VITE_LOCATIONIQ_API_KEY` in `.env`
- **Usage**: Secondary fallback option

### 3. Positionstack
- **Free Tier**: 25,000 requests/month
- **API Key Required**: Can be added similarly
- **Usage**: Can be integrated as additional fallback

## Setup Instructions

### No Setup Required (Default)
The application works out of the box using OpenStreetMap Nominatim with no configuration needed.

### Optional: Enhanced Services
To enable additional geocoding services, add to your `.env` file:

```bash
# Optional: MapBox API (100k requests/month free)
VITE_MAPBOX_API_KEY=your_mapbox_api_key

# Optional: LocationIQ API (5k requests/day free)
VITE_LOCATIONIQ_API_KEY=your_locationiq_api_key
```

## Smart Fallback System

The geocoding service uses a smart fallback approach:

1. **OpenStreetMap Nominatim** (always available, no key required)
2. **MapBox** (if API key configured)
3. **LocationIQ** (if API key configured)

Google Maps has been completely removed from the application.

## Components Updated

### 1. AddressSearchInput
- Now supports free geocoding services
- Shows suggestion dropdown with multiple results
- Keyboard navigation (arrow keys, enter, escape)
- Works without any API keys

### 2. ModularLocationPicker
- Uses SimpleMapPicker as fallback when Google Maps unavailable
- Supports reverse geocoding with free services
- Graceful degradation from full maps to coordinate picker

### 3. SimpleMapPicker (New)
- Visual coordinate picker without external map dependencies
- Manual coordinate input
- Quick location buttons for major cities
- Works entirely offline after initial load

## Benefits

1. **Zero Cost**: Works completely free with no API keys
2. **No Vendor Lock-in**: Multiple service providers
3. **Reliable**: OpenStreetMap has excellent global coverage
4. **Privacy Friendly**: No tracking from major tech companies
5. **Rate Limit Friendly**: Automatic throttling built-in
6. **Offline Capable**: Coordinate picker works without internet

## Usage Examples

### Basic Address Search
```typescript
// User types "New York City"
// Results: Multiple NYC locations with coordinates
// Selection: User picks specific result
// Output: { address: "New York, NY, USA", lat: 40.7128, lng: -74.0060 }
```

### Coordinate Input
```typescript
// User enters lat: 40.7128, lng: -74.0060
// Reverse geocoding: "New York, NY, USA"
// Works with any valid coordinates worldwide
```

## Rate Limits & Fair Usage

### OpenStreetMap Nominatim
- **Limit**: 1 request per second
- **Policy**: Free for reasonable usage
- **Throttling**: Automatically implemented
- **Bulk Usage**: Consider running your own Nominatim instance

### Best Practices
1. Cache geocoding results locally
2. Debounce user input before searching
3. Use the suggestion system to minimize requests
4. Implement coordinate input for precise locations
5. Consider user's location for better default coordinates

## Migration from Google Maps

If you were previously using Google Maps API:

1. **No Code Changes Required**: Components automatically use free services
2. **Keep Google Maps**: Can still be used as primary service if configured
3. **Gradual Migration**: Remove Google Maps API key when ready
4. **Feature Parity**: All geocoding features work with free alternatives

## Limitations

### OpenStreetMap Nominatim
- 1 request per second rate limit
- No satellite imagery (use coordinate picker instead)
- Less detailed business information compared to Google

### General
- Visual maps require either Google Maps API or alternative map providers
- Coordinate picker provides functionality without visual maps
- Some remote locations may have less detailed addressing