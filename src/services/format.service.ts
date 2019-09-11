export class FormatService {
  public dateStringFormat(date: Date): string {

    return date.getFullYear() + '-' + this.addZeroToNumber(date.getMonth() + 1) + '-' + this.addZeroToNumber(date.getDate())
      + ' ' + this.addZeroToNumber(date.getHours()) + ':' + this.addZeroToNumber(date.getMinutes()) + ':'
      + this.addZeroToNumber(date.getSeconds());
  }

  public stringDateFormat(str: string): Date {
    return new Date(str);
  }

  private addZeroToNumber(number: number): string {
    if (number < 10 && number >= 0) {
      return '0' + number;
    }
    return number.toString();
  }
}
