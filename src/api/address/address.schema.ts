import type { Address, AddressInput } from '@models/address.model.js';

export interface CreateAddressRequestBody extends AddressInput {}

export interface CreateAddressResponse extends Address {}
