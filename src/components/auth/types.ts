export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    provider: 'email' | 'google' | 'facebook';
    createdAt: Date;
  }
  
  export interface UserProfileFormData {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface HealthMetric {
    title: string;
    value: string;
    unit: string;
    lastMeasured: string;
    color: string;
    icon: React.ReactNode;
  }