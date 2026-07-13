import api from './api';
import { Employee, EmployeePayload, EmployeeQuery, EmployeeUpdatePayload } from '../types/employee.types';

type EmployeeResponse = {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const employeeService = {
  getEmployees: async (params: EmployeeQuery = {}): Promise<EmployeeResponse> => {
    const response = await api.get('/employees', { params });
    return {
      employees: response.data.employees || [],
      pagination: response.data.pagination,
    };
  },

  createEmployee: async (payload: EmployeePayload): Promise<Employee> => {
    const response = await api.post('/employees', payload);
    return response.data.employee;
  },

  updateEmployee: async (id: string, payload: EmployeeUpdatePayload): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, payload);
    return response.data.employee;
  },

  activateEmployee: async (id: string): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/activate`);
    return response.data.employee;
  },

  deactivateEmployee: async (id: string): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/deactivate`);
    return response.data.employee;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  resetPassword: async (id: string, password: string): Promise<void> => {
    await api.patch(`/employees/${id}/reset-password`, { password });
  },
};
