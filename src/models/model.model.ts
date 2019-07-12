import { Constructor } from './constructor.model';

export class Model {
  constructor(
    public id: number = undefined,
    public name: string = undefined,
    public manufacturer: Constructor = undefined,
    public countEcoSlots: number = undefined,
    public countBusinessSlots: number = undefined
  ) {}
}
