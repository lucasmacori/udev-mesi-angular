import { Constructor } from './constructor.model';

export class Model {
  constructor(
    public id: number,
    public name: string,
    public manufacturer: Constructor
  ) {}
}
