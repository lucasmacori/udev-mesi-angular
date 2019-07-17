import { Model } from './model.model';

export class Constructor {
  constructor(
    public id?: number,
    public name?: string,
    public isActive?: boolean,
    public models?: Array<Model>
  ) {}
}
