# Google Maps Integration Setup

This guide will help you set up Google Maps integration for location picking in the shipment creation form.

## Prerequisites

1. **Google Cloud Console Account**: You need a Google Cloud Console account to get API keys.
2. **Billing Account**: Google Maps APIs require a billing account to be set up (though they offer free monthly usage limits).

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Library**
4. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**

5. Navigate to **APIs & Services** > **Credentials**
6. Click **Create Credentials** > **API Key**
7. Copy the generated API key

## Step 2: Configure API Key Restrictions (Recommended)

1. Click on your API key in the credentials list
2. Under **API restrictions**, select **Restrict key**
3. Choose the APIs you enabled (Maps JavaScript API, Places API, Geocoding API)
4. Under **Application restrictions**, you can restrict by:
   - **HTTP referrers** for web applications (recommended for production)
   - **IP addresses** for server applications

## Step 3: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Add `.env.local` to your `.gitignore` file to keep your API key secure:
   ```
   # Environment variables
   .env.local
   ```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Shipments page and click "Create Shipment"
3. You should see the location picker fields with:
   - Text input for address search
   - Search button for manual address lookup
   - Map button to show/hide the interactive map

## Features

### Location Picker Component

The `LocationPicker` component provides:

- **Text Input**: Users can type addresses directly
- **Autocomplete**: Google Places autocomplete suggestions
- **Interactive Map**: Click or drag to select locations
- **Reverse Geocoding**: Converts coordinates to addresses
- **Manual Search**: Search button for address lookup

### API Integration

The form now sends complete location data including:

```json
{
  "receiverName": "John Doe",
  "receiverEmail": "john@example.com",
  "receiverPhone": "123-456-7890",
  "originAddress": "123 Main St, New York, NY 10001, USA",
  "destinationAddress": "456 Oak Ave, Brooklyn, NY 11201, USA",
  "originLatitude": 40.7128,
  "originLongitude": -74.0060,
  "destinationLatitude": 40.6892,
  "destinationLongitude": -73.9442
}
```

## Troubleshooting

### Common Issues

1. **"Error loading Google Maps"**
   - Check if your API key is correct
   - Verify that the Maps JavaScript API is enabled
   - Check browser console for specific error messages

2. **"This page can't load Google Maps correctly"**
   - Usually indicates API key issues or billing not set up
   - Check your Google Cloud Console for API quotas and billing

3. **Autocomplete not working**
   - Ensure Places API is enabled
   - Check if API key has proper restrictions

4. **Map not displaying**
   - Check browser console for errors
   - Verify internet connection
   - Ensure the API key has proper permissions

### Development Tips

1. **Testing without API Key**: The component will show an error but won't break the form. Users can still enter addresses manually.

2. **Rate Limiting**: Google Maps APIs have usage limits. Monitor your usage in Google Cloud Console.

3. **Styling**: The map container has a fixed height of 256px. You can customize this in the LocationPicker component.

## Security Considerations

1. **Never commit API keys** to version control
2. **Use API key restrictions** in production
3. **Monitor API usage** regularly
4. **Consider server-side proxy** for additional security

## Production Deployment

For production deployment:

1. Set up HTTP referrer restrictions
2. Use environment variables on your hosting platform
3. Monitor API usage and costs
4. Consider implementing rate limiting on your backend