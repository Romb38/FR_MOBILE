import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  getDateAsHumanReadable(date: string, lang: string = 'en'): string {
    const inputDate = new Date(date); // Convert the input date string to a Date object
    const now = new Date(); // Get the current date

    const diffInMilliseconds = now.getTime() - inputDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 3600); // Difference in hours
    const diffInDays = diffInMilliseconds / (1000 * 3600 * 24); // Difference in days

    // If the date is today
    const isToday = inputDate.toDateString() === now.toDateString();
    if (isToday) {
      const hours = inputDate.getHours().toString().padStart(2, '0');
      const minutes = inputDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    // If the date is within the last 23 hours but not today
    if (diffInHours < 24) {
      const hoursAgo = Math.floor(diffInHours);
      return `${hoursAgo}h`; // Use 'h' for both lang
    }

    // If the date is within the last 31 days
    if (diffInDays < 31) {
      const daysAgo = Math.floor(diffInDays);
      return `${daysAgo}${lang === 'fr' ? 'j' : 'd'}`; // 'j' for French and 'd' for English
    }

    // Else return the date
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
