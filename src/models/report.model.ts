export class Report {
  constructor(
    public code: string,
    public description: string,
    public query: string,
    public parameters: Array<string>,
    public isActive: boolean
  ) {}
}
