import { Injectable } from '@angular/core';
import { User } from '@shared/models/interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: User | null = null;
}

