// BE-29: Review entity — domain layer

export interface Review {
  id: string;
  clientId: string;
  artistProfileId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/** Extended version that includes client info for display */
export interface ReviewWithClient extends Review {
  clientEmail: string;
}

export interface CreateReviewData {
  clientId: string;
  artistProfileId: string;
  rating: number;
  comment: string;
}
