export interface User {
  userEmail: string;
  userName: string;
  roles: string[];
  langs: string[];
  preferLanguage: string;
  isActive: boolean;
  activationHistory?: any[];
}
