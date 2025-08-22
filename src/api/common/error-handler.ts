import type { BaseError } from '@models/error.model.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (error: BaseError, _: FastifyRequest, reply: FastifyReply) => {
  reply.status(error.status || 500).send({
    code: error.code,
    message: error.message,
    details: error.details,
  });
};
