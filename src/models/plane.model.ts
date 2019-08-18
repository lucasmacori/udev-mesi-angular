import { Model } from './model.model';
import { FlightDetail } from './flightDetail.model';

export class Plane {
    constructor(
      public ARN?: string,
      public model?: Model,
      public isUnderMaintenance?: boolean,
      public isActive?: boolean,
      public model_name?: string,
      public flightDetails?: Array<FlightDetail>
    ) {}
  }
