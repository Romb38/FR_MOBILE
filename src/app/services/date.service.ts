import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  getDateAsHumanReadable(date: string): string {
    const inputDate = new Date(date);  // Convert the input date string to a Date object
    const now = new Date();  // Get the current date

    const isToday = inputDate.toDateString() === now.toDateString();
    if (isToday) {
      const hours = inputDate.getHours().toString().padStart(2, '0');
      const minutes = inputDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
