export class FormatService {
  public dateStringFormat(date: Date): string {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  public stringDateFormat(str: string): Date {
    const date = new Date();
    str += '';

    // Récupération de la date
    const dateElements = str.split('-');
    if (dateElements.length === 3 && dateElements[2].indexOf(' ') > -1) {
      const day = parseInt(dateElements[0]);
      const month = parseInt(dateElements[1]);
      const spaceIndex = dateElements[2].indexOf(' ');
      const year = parseInt(dateElements[2].substring(0, spaceIndex));

      // Récupération de l'heure
      const timeElements = dateElements[2].substring(spaceIndex + 1).split('-');
      if (timeElements.length === 3) {
        const hours = parseInt(timeElements[0]);
        const minutes = parseInt(timeElements[1]);
        const seconds = parseInt(timeElements[2]);

        // Affection de la date
        date.setDate(day);
        date.setMonth(month);
        date.setFullYear(year);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
      }
    }

    return date;
  }
}
