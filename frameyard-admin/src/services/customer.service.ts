import api from './api';
import { Customer } from '../types';

export interface CustomerResponse {
  customers: Customer[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerLookupResponse {
  id: string;
  name: string;
  phoneNumber: string;
}

export const customerService = {
  getCustomerById: async (id: string) => {
    const response = await api.get(`/customers/${id}`);
    return response.data.customer;
  },

  lookupCustomerByPhoneNumber: async (
    phoneNumber: string
  ): Promise<CustomerLookupResponse> => {
    const response = await api.get('/customers/lookup', {
      params: {
        phoneNumber,
      },
    });

    return response.data.customer;
  },

  getCustomers: async (
    page: number = 1,
    limit: number = 10
    
  ): Promise<CustomerResponse> => {
    const response = await api.get(
      `/customers?page=${page}&limit=${limit}`
    );

    return response.data;
  },
};


export default customerService;
