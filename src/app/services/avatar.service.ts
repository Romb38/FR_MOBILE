import {Injectable} from '@angular/core';
import cryptoJS from 'crypto-js';  // Import crypto-js for hashing


@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  getDicebearAvatarUrl(userId: string, size: number = 200): string {
    // Hash the user ID to create a unique Gravatar URL (you can also use an email)
    const hash = cryptoJS.SHA256(userId).toString(cryptoJS.enc.Hex);
    return `https://api.dicebear.com/9.x/dylan/svg?flip=false&seed=${hash}`;
  }
}
