export interface Employee {
  id: string;
  employeeId?: string | null;
  name: string;
  email: string;
  designation?: string | null;
  department?: string | null;
  role: 'EMPLOYEE';
  isActive: boolean;
  createdBy?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EmployeePayload = {
  name: string;
  email: string;
  designation: string;
  department: string;
  password: string;
};

export type EmployeeUpdatePayload = {
  name: string;
  designation: string;
  department: string;
};

export type EmployeeQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
};
