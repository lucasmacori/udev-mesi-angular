import { Model } from './model.model';

export class Plane {
    constructor(
      public ARN?: string,
      public model?: Model,
      public isUnderMaintenance?: boolean,
      public isActive?: boolean
    ) {}
  }
