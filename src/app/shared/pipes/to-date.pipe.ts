import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toDate',
  standalone: true
})
export class ToDatePipe implements PipeTransform {
  transform(value: number[]): Date | null {
    if (!Array.isArray(value) || value.length < 3) {
      return null;
    }
    // Assumes [year, month, day]. Note: Month is 0-indexed in JS Date.
    return new Date(value[0], value[1] - 1, value[2]);
  }
}
