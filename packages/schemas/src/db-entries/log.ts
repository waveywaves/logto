// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import { z } from 'zod';

import { ArbitraryObject, arbitraryObjectGuard, GeneratedSchema, Guard } from '../foundations';

export type CreateLog = {
  id: string;
  type: string;
  payload?: ArbitraryObject;
  createdAt?: number;
};

export type Log = {
  id: string;
  type: string;
  payload: ArbitraryObject;
  createdAt: number;
};

const createGuard: Guard<CreateLog> = z.object({
  id: z.string(),
  type: z.string(),
  payload: arbitraryObjectGuard.optional(),
  createdAt: z.number().optional(),
});

export const Logs: GeneratedSchema<CreateLog> = Object.freeze({
  table: 'logs',
  tableSingular: 'log',
  fields: {
    id: 'id',
    type: 'type',
    payload: 'payload',
    createdAt: 'created_at',
  },
  fieldKeys: ['id', 'type', 'payload', 'createdAt'],
  createGuard,
});