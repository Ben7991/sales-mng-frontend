import {UserAccountStatus, UserRole} from '@shared/models/types';

export interface addUserInterface{
  "name": "string",
  "username": "string",
  "email": "string",
  "role": UserRole
}

export interface addUserApiResponse {
  "message": string,
  "data": {
    "id": number
    "name": string
    "username": string
    "email": string
    "role": UserRole
    "createdAt": string,
    "updatedAt": string,
    "status": UserAccountStatus,
    "setPassword": boolean
  }
}
