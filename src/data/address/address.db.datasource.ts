import { prisma } from '@core/db/db.js';
import type { AddressInput } from '@models/address.model.js';

const create = async (addressData: AddressInput) => {
  return await prisma.address.create({
    data: {
      user: {
        connect: {
          id: addressData.userId,
        },
      },
      zipCode: addressData.zipCode,
      street: addressData.street,
      streetNumber: addressData.streetNumber,
      complement: addressData.complement ?? null,
      neighborhood: addressData.neighborhood,
      city: addressData.city,
      state: addressData.state,
    },
  });
};

export const AddressDbDatasource = {
  create,
};
