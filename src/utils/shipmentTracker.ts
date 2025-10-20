import { shipmentService } from '../services/shipment.service';
import { Shipment } from '../types';

export class ShipmentTracker {
  private static instance: ShipmentTracker;
  private trackingCache: Map<string, { data: Shipment; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  public static getInstance(): ShipmentTracker {
    if (!ShipmentTracker.instance) {
      ShipmentTracker.instance = new ShipmentTracker();
    }
    return ShipmentTracker.instance;
  }

  /**
   * Track a shipment by tracking number with caching
   */
  async trackShipment(trackingNumber: string, useCache: boolean = true): Promise<Shipment> {
    const cacheKey = `track_${trackingNumber}`;
    
    if (useCache && this.trackingCache.has(cacheKey)) {
      const cached = this.trackingCache.get(cacheKey)!;
      const now = Date.now();
      
      if (now - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      const shipment = await shipmentService.trackShipment(trackingNumber);
      
      // Cache the result
      this.trackingCache.set(cacheKey, {
        data: shipment,
        timestamp: Date.now()
      });

      return shipment;
    } catch (error) {
      console.error('Failed to track shipment:', error);
      throw error;
    }
  }

  /**
   * Get shipment details by ID with caching
   */
  async getShipmentById(id: string, useCache: boolean = true): Promise<Shipment> {
    const cacheKey = `shipment_${id}`;
    
    if (useCache && this.trackingCache.has(cacheKey)) {
      const cached = this.trackingCache.get(cacheKey)!;
      const now = Date.now();
      
      if (now - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      const shipment = await shipmentService.getShipmentById(id);
      
      // Cache the result
      this.trackingCache.set(cacheKey, {
        data: shipment,
        timestamp: Date.now()
      });

      return shipment;
    } catch (error) {
      console.error('Failed to get shipment details:', error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific tracking number
   */
  clearCache(trackingNumber?: string): void {
    if (trackingNumber) {
      this.trackingCache.delete(`track_${trackingNumber}`);
    } else {
      this.trackingCache.clear();
    }
  }

  /**
   * Get tracking status summary
   */
  getTrackingStatusSummary(shipment: Shipment) {
    const updates = shipment.trackingUpdates || [];
    const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;
    
    return {
      currentStatus: shipment.status,
      lastUpdate: latestUpdate,
      totalUpdates: updates.length,
      isInTransit: shipment.status === 'InTransit',
      isDelivered: shipment.status === 'Delivered',
      isCancelled: shipment.status === 'Cancelled',
      hasDriver: !!shipment.assignedDriver,
      timeline: updates.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    };
  }

  /**
   * Format tracking number for display
   */
  formatTrackingNumber(trackingNumber: string): string {
    // Add formatting like LST-123-456 instead of LST123456
    return trackingNumber.replace(/^([A-Z]+)(\d+)$/, '$1-$2').replace(/(\d{3})(\d{3})$/, '$1-$2');
  }

  /**
   * Validate tracking number format
   */
  isValidTrackingNumber(trackingNumber: string): boolean {
    // Basic validation for tracking number format (e.g., LST123456)
    const pattern = /^[A-Z]{2,4}\d{6,8}$/;
    return pattern.test(trackingNumber.replace(/[-\s]/g, ''));
  }

  /**
   * Generate shipment status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'Created': return 'gray';
      case 'PickedUp': return 'blue';
      case 'InTransit': return 'yellow';
      case 'Delivered': return 'green';
      case 'Cancelled': return 'red';
      default: return 'gray';
    }
  }

  /**
   * Estimate delivery time based on status and creation date
   */
  estimateDelivery(shipment: Shipment): { estimated: Date | null; isEstimate: boolean } {
    const createdAt = new Date(shipment.createdAt);
    const now = new Date();
    
    // Simple estimation logic - can be made more sophisticated
    let estimatedDays = 3; // Default 3 days
    
    switch (shipment.status) {
      case 'Created':
        estimatedDays = 3;
        break;
      case 'PickedUp':
        estimatedDays = 2;
        break;
      case 'InTransit':
        estimatedDays = 1;
        break;
      case 'Delivered':
        return { estimated: null, isEstimate: false };
      case 'Cancelled':
        return { estimated: null, isEstimate: false };
    }

    const estimated = new Date(createdAt);
    estimated.setDate(estimated.getDate() + estimatedDays);
    
    return {
      estimated: estimated > now ? estimated : new Date(now.getTime() + 24 * 60 * 60 * 1000), // At least tomorrow
      isEstimate: true
    };
  }
}

// Export singleton instance
export const shipmentTracker = ShipmentTracker.getInstance();