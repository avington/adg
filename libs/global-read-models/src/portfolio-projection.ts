export interface PortfolioProjection {
  _id?: string;
  id?: string;
  portfolioId?: string;
  userId?: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  lastUpdatedBy?: string;
}
