import { Constructor } from './constructor.model';
import { Plane } from './plane.model';

export class Model {
  constructor(
    public id?: number,
    public name?: string,
    public manufacturer?: Constructor,
    public countEcoSlots?: number,
    public countBusinessSlots?: number,
    public manufacturer_name?: string,
    public planes?: Array<Plane>
  ) {}
}
