import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { driverService } from '../services';
import { RateDriverRequest } from '../types';

interface DriverRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string;
  driverName: string;
  shipmentId: string;
  onRatingSubmitted?: (rating: number, comment?: string) => void;
}

export const DriverRatingModal: React.FC<DriverRatingModalProps> = ({
  isOpen,
  onClose,
  driverId,
  driverName,
  shipmentId,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const rateRequest: RateDriverRequest = {
        rating,
        comment: comment.trim() || undefined,
        shipmentId,
      };

      await driverService.rateDriver(driverId, rateRequest);
      
      // Call the callback with rating data before resetting form
      onRatingSubmitted?.(rating, comment.trim() || undefined);
      
      // Reset form
      setRating(5);
      setComment('');
      onClose();
    } catch (err) {
      console.error('Error rating driver:', err);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    setError('');
    onClose();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`text-2xl ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400 transition-colors`}
          onClick={() => setRating(i)}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Rate Driver: ${driverName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this driver..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};