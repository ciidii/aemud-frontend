import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flexibleDate',
  standalone: true
})
export class FlexibleDatePipe implements PipeTransform {

  transform(value: string | number | null | undefined): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // If the value is a number (likely a UNIX timestamp in seconds)
    if (typeof value === 'number') {
      // Multiply by 1000 to convert to milliseconds
      return new Date(value * 1000);
    }

    // If the value is a string, try to parse it.
    // This handles ISO strings like "2025-12-31T23:59:59Z"
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      console.warn(`FlexibleDatePipe: Invalid date string provided: "${value}"`);
      return null;
    }
    
    return date;
  }

}
