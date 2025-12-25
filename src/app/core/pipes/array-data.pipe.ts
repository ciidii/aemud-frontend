import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'arrayDate'
})
export class ArrayDatePipe implements PipeTransform {

  transform(value: [number, number, number] | null, format: string = 'dd/MM/yyyy'): string {
    if (!value) return '';

    const [y, m, d] = value;
    const date = new Date(y, m - 1, d);

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}
