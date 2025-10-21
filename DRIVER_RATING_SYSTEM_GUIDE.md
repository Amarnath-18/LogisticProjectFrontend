# Driver Rating System Implementation Guide

This guide covers the implementation of the driver rating system APIs and components in the LogisticProjectFrontend application.

## API Endpoints

### 1. Rate Driver
**Endpoint:** `POST /api/Drivers/{driverId}/rate`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service and timely delivery!",
  "shipmentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Parameters:**
- `rating` (number, required): Rating from 1-5 stars
- `comment` (string, optional): Customer feedback comment
- `shipmentId` (string, required): UUID of the shipment being rated

### 2. Check Shipment Rating Status ✅ NEW
**Endpoint:** `GET /api/Shipments/{shipmentId}/rating-status`

**Response:**
```json
{
  "shipmentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "trackingNumber": "TRK123456",
  "isRated": true,
  "existingRating": {
    "rating": 5,
    "comment": "Excellent service!",
    "ratedAt": "2025-10-19T14:30:00.000Z",
    "ratedByCustomer": "John Smith",
    "shipmentTrackingNumber": "TRK123456"
  },
  "driver": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "fullName": "Mike Johnson",
    "email": "mike.johnson@example.com",
    "phone": "+1234567890",
    "role": "Driver",
    "createdAt": "2025-10-15T10:00:00.000Z"
  },
  "canBeRated": false,
  "ratingIneligibilityReason": "Already rated by customer"
}
```

**Usage:**
- Check if shipment has been rated before showing rating options
- Get existing rating details to display to customer
- Determine if shipment is eligible for rating
- Get ineligibility reason if rating is not allowed

### 3. Get Driver Ratings
**Endpoint:** `GET /api/Drivers/{driverId}/ratings`

**Response:**
```json
{
  "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "driver": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "fullName": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "role": "Driver",
    "createdAt": "2025-10-20T15:57:03.462Z"
  },
  "averageRating": 4.2,
  "totalRatings": 15,
  "completedShipments": 28,
  "isVerified": true,
  "recentRatings": [
    {
      "rating": 5,
      "comment": "Great driver, very professional!",
      "ratedAt": "2025-10-19T14:30:00.000Z",
      "ratedByCustomer": "Alice Johnson",
      "shipmentTrackingNumber": "TRK123456"
    }
  ]
}
```

## Frontend Implementation

### TypeScript Types

The following types have been added to `src/types/index.ts`:

```typescript
export interface RateDriverRequest {
  rating: number;
  comment?: string;
  shipmentId: string;
}

export interface DriverRating {
  rating: number;
  comment?: string;
  ratedAt: string;
  ratedByCustomer: string;
  shipmentTrackingNumber: string;
}

export interface DriverRatingsResponse {
  driverId: string;
  driver: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
  };
  averageRating: number;
  totalRatings: number;
  completedShipments: number;
  isVerified: boolean;
  recentRatings: DriverRating[];
}
```

### Service Methods

Added to `src/services/driver.service.ts`:

```typescript
export const driverService = {
  // ... existing methods

  rateDriver: async (driverId: string, data: RateDriverRequest): Promise<void> => {
    await api.post(`/Drivers/${driverId}/rate`, data);
  },

  getDriverRatings: async (driverId: string): Promise<DriverRatingsResponse> => {
    const response = await api.get(`/Drivers/${driverId}/ratings`);
    return response.data;
  },
};
```

### React Components

#### 1. DriverRatingModal Component
**File:** `src/components/DriverRatingModal.tsx`

A modal component for rating drivers with star rating and optional comments.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `driverId: string` - ID of the driver being rated
- `driverName: string` - Display name of the driver
- `shipmentId: string` - ID of the related shipment
- `onRatingSubmitted?: () => void` - Optional callback after successful rating

**Usage Example:**
```tsx
import { DriverRatingModal } from '../components';

const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

<DriverRatingModal
  isOpen={isRatingModalOpen}
  onClose={() => setIsRatingModalOpen(false)}
  driverId="driver-uuid"
  driverName="John Smith"
  shipmentId="shipment-uuid"
  onRatingSubmitted={() => {
    // Refresh data or show success message
    console.log('Rating submitted successfully!');
  }}
/>
```

#### 2. DriverRatingsDisplay Component
**File:** `src/components/DriverRatingsDisplay.tsx`

A component that displays driver ratings, statistics, and recent reviews.

**Props:**
- `driverId: string` - ID of the driver to display ratings for
- `showFullProfile?: boolean` - Whether to show full driver profile (default: false)

**Usage Example:**
```tsx
import { DriverRatingsDisplay } from '../components';

<DriverRatingsDisplay 
  driverId="driver-uuid"
  showFullProfile={true}
/>
```

## Integration Examples

### 1. In Shipment Details Page ✅ IMPLEMENTED
After a shipment is delivered, customers will see a "Rate Driver" button:

**Location:** `src/pages/ShipmentDetailsPage.tsx`

**Features:**
- Yellow "⭐ Rate Driver" button appears for customers when shipment status is "Delivered"
- Helpful notification box reminds customers to rate the driver
- Rating modal opens when button is clicked
- Success toast message after rating submission

```tsx
// Automatically shows for customers with delivered shipments
{user?.role === 'Customer' && shipment.status === 'Delivered' && shipment.assignedDriver && (
  <Button 
    onClick={() => setIsRatingModalOpen(true)}
    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
  >
    ⭐ Rate Driver
  </Button>
)}
```

### 2. In Customer Dashboard ✅ IMPLEMENTED  
Shows pending ratings in a dedicated card:

**Location:** `src/pages/CustomerDashboard.tsx`

**Features:**
- `PendingRatingsCard` component displays up to 3 recent delivered shipments
- Quick "⭐ Rate" buttons for each delivery
- Shows tracking number, driver name, and destination
- Appears only for customers with delivered shipments

### 3. PendingRatingsCard Component ✅ NEW
**Location:** `src/components/PendingRatingsCard.tsx`

A smart component that:
- Automatically loads customer's delivered shipments
- Filters shipments that have assigned drivers
- Shows compact rating interface in dashboard
- Handles rating modal for multiple shipments

### 4. In Driver Profile/Management Page
Display driver ratings and statistics:

```tsx
import { DriverRatingsDisplay } from '../components';

<div className="mt-6">
  <h3 className="text-lg font-semibold mb-4">Driver Performance</h3>
  <DriverRatingsDisplay 
    driverId={driver.id}
    showFullProfile={true}
  />
</div>
```

### 3. In Available Drivers List
Show ratings summary in driver selection:

```tsx
// Fetch and display average rating for each driver
const [driverRatings, setDriverRatings] = useState<Record<string, number>>({});

useEffect(() => {
  // Load ratings for all drivers
  drivers.forEach(async (driver) => {
    try {
      const ratings = await driverService.getDriverRatings(driver.id);
      setDriverRatings(prev => ({
        ...prev,
        [driver.id]: ratings.averageRating
      }));
    } catch (error) {
      console.error('Failed to load ratings for driver:', driver.id);
    }
  });
}, [drivers]);

// In driver list item
<div className="flex items-center gap-2">
  <span>★ {driverRatings[driver.id]?.toFixed(1) || 'N/A'}</span>
</div>
```

## Test Page

A test page has been created at `/driver-ratings-test` (accessible at `http://localhost:3000/driver-ratings-test`) to demonstrate the rating functionality.

## Features

### DriverRatingModal Features:
- ✅ Interactive star rating (1-5 stars)
- ✅ Optional comment field
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success callbacks with rating data

### DriverRatingsDisplay Features:
- ✅ Driver profile information
- ✅ Average rating display with stars
- ✅ Total ratings and completed shipments count
- ✅ Verification status badge
- ✅ Recent ratings list with comments
- ✅ Responsive design
- ✅ Loading and error states

### Rating Status Tracking Features:
- ✅ **No Duplicate Ratings**: Shipments already rated are filtered out automatically
- ✅ **Rating Status API**: Uses `/api/Shipments/{id}/rating-status` to check if rated
- ✅ **Smart Filtering**: Only shows deliveries that can and haven't been rated
- ✅ **Real-time Updates**: UI updates immediately after rating submission
- ✅ **Rating History**: Shows customer's previous rating with date and comment
- ✅ **Eligibility Check**: Displays reason if delivery cannot be rated

### PendingRatingsCard Features:
- ✅ Auto-loads customer's delivered shipments
- ✅ Compact card display for dashboard
- ✅ Quick rating buttons
- ✅ Integration with DriverRatingModal
- ✅ Shows only for customers with pending ratings

### Complete Integration Features:
- ✅ **Shipment Details Page**: Rate button appears when delivery is completed
- ✅ **Customer Dashboard**: Dedicated pending ratings card
- ✅ **Visual Indicators**: Notification boxes and helpful text
- ✅ **User Experience**: Seamless flow from delivery to rating
- ✅ **Success Feedback**: Toast messages and UI updates

## Error Handling

Both components include comprehensive error handling:
- Network errors are caught and displayed to users
- Form validation prevents invalid submissions
- Loading states provide user feedback
- Graceful fallbacks for missing data

## Styling

The components use Tailwind CSS classes consistent with the existing application design:
- Responsive grid layouts
- Consistent color schemes
- Hover states and transitions
- Accessibility considerations

## Next Steps

1. **Backend Integration**: Ensure the backend APIs are implemented according to the specifications
2. **Authentication**: Add proper authentication headers to API calls
3. **Pagination**: Consider adding pagination for large numbers of ratings
4. **Real-time Updates**: Implement WebSocket connections for live rating updates
5. **Analytics**: Add rating analytics to admin dashboard
6. **Notification System**: Send notifications when drivers receive new ratings

## API Testing

Use the test page at `/driver-ratings-test` to verify:
1. Rating submission works correctly
2. Ratings display loads properly
3. Error handling functions as expected
4. UI components render correctly across different screen sizes

The test page includes sample data and demonstrates both components in action.