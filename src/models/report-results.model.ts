export class ReportResults {
  constructor(
    public code: string,
    public description: string,
    public fields: Array<string>,
    public results: Array<object>
  ) {}
}
