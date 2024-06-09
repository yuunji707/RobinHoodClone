import React, { useState } from 'react';
import { getPortfolioReview } from '../api';

const PortfolioReview: React.FC = () => {
    const [review, setReview] = useState<string>('');

    const handleGenerateReview = async () => {
        try {
            const reviewText = await getPortfolioReview();
            setReview(reviewText); // Set the review state directly from the response
        } catch (error) {
            console.error('Error generating portfolio review:', error);
            // Handle error
        }
    };

    return (
        <div>
            <button onClick={handleGenerateReview}>Generate Review</button>
            {review && <p>{review}</p>}
        </div>
    );
};

export default PortfolioReview;


