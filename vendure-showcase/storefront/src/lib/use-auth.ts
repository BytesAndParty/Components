import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shopApiRequest } from './vendure-client';
import {
  GET_ACTIVE_CUSTOMER,
  GET_ADDRESSES,
  GET_AVAILABLE_COUNTRIES,
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  LOGIN,
  LOGOUT,
  REGISTER,
  UPDATE_CUSTOMER,
  UPDATE_PASSWORD,
} from './auth-queries';
import type {
  Customer,
  Country,
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  LoginResult,
  RegisterResult,
  RegisterCustomerInput,
  UpdateCustomerInput,
  UpdatePasswordResult,
} from './types';

export const CUSTOMER_KEY = ['active-customer'] as const;
export const ADDRESSES_KEY = ['customer-addresses'] as const;
export const COUNTRIES_KEY = ['available-countries'] as const;

async function fetchActiveCustomer(): Promise<Customer | null> {
  try {
    const data = await shopApiRequest<{ activeCustomer: Customer | null }>(GET_ACTIVE_CUSTOMER);
    return data.activeCustomer ?? null;
  } catch (err) {
    console.error('Error fetching active customer:', err);
    return null;
  }
}

export function useActiveCustomer() {
  return useQuery({
    queryKey: CUSTOMER_KEY,
    queryFn: fetchActiveCustomer,
    staleTime: 5 * 60 * 1000, // Customer status is cached, changes on login/logout
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const data = await shopApiRequest<{ login: LoginResult }>(LOGIN, {
        username,
        password,
      });
      return data.login;
    },
    onSuccess: (data) => {
      if (data.__typename === 'CurrentUser') {
        // Clear cached customer & cart on successful login to force fresh fetch
        queryClient.invalidateQueries({ queryKey: CUSTOMER_KEY });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const data = await shopApiRequest<{ logout: { success: boolean } }>(LOGOUT);
      return data.logout;
    },
    onSuccess: () => {
      // Clear data immediately
      queryClient.setQueryData(CUSTOMER_KEY, null);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterCustomerInput) => {
      const data = await shopApiRequest<{ registerCustomerAccount: RegisterResult }>(REGISTER, {
        input,
      });
      return data.registerCustomerAccount;
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateCustomerInput) => {
      const data = await shopApiRequest<{ updateCustomer: Customer }>(UPDATE_CUSTOMER, { input });
      return data.updateCustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEY });
    },
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: async () => {
      const data = await shopApiRequest<{ activeCustomer: { addresses: Address[] } | null }>(
        GET_ADDRESSES,
      );
      return data.activeCustomer?.addresses ?? [];
    },
  });
}

export function useAvailableCountries() {
  return useQuery({
    queryKey: COUNTRIES_KEY,
    queryFn: async () => {
      const data = await shopApiRequest<{ availableCountries: Country[] }>(GET_AVAILABLE_COUNTRIES);
      return data.availableCountries;
    },
    staleTime: Infinity, // Country list is effectively static
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAddressInput) => {
      const data = await shopApiRequest<{ createCustomerAddress: Address }>(CREATE_ADDRESS, {
        input,
      });
      return data.createCustomerAddress;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateAddressInput) => {
      const data = await shopApiRequest<{ updateCustomerAddress: Address }>(UPDATE_ADDRESS, {
        input,
      });
      return data.updateCustomerAddress;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await shopApiRequest<{ deleteCustomerAddress: { success: boolean } }>(
        DELETE_ADDRESS,
        { id },
      );
      return data.deleteCustomerAddress;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const data = await shopApiRequest<{ updateCustomerPassword: UpdatePasswordResult }>(
        UPDATE_PASSWORD,
        { currentPassword, newPassword },
      );
      return data.updateCustomerPassword;
    },
  });
}
