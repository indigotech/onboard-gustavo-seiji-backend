import type { User } from '@domain/models/users.model.js';
import type { Address } from '@models/address.model.js';
import type { Address as AddressEntity, User as UserEntity } from '@prisma/client';

export const mapUser = (user: UserEntity, addresses: AddressEntity[]): User => {
  const formattedAddresses: Address[] = addresses.map(address => {
    const response: Address = {
      id: 1,
      zipCode: address.zipCode,
      street: address.street,
      streetNumber: address.streetNumber,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    };

    if (address.complement) {
      response.complement = address.complement;
    }

    return response;
  });

  return {
    ...user,
    addresses: formattedAddresses,
  };
};
