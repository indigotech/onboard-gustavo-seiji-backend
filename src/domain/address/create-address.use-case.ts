import { AddressDbDatasource } from '@data/address/address.db.datasource.js';
import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { type Address, AddressErrors, type AddressInput } from '@models/address.model.js';

export const createAddressUseCase = async (addressData: AddressInput): Promise<Address> => {
  const user = await UserDbDatasource.findById(addressData.userId);
  if (!user) {
    throw AddressErrors.USER_NOT_FOUND;
  }
  const response = await AddressDbDatasource.create(addressData);

  const address: Address = {
    id: 1,
    zipCode: response.zipCode,
    street: response.street,
    streetNumber: response.streetNumber,
    neighborhood: response.neighborhood,
    city: response.city,
    state: response.state,
  };

  if (response.complement) {
    address.complement = response.complement;
  }

  return address;
};
