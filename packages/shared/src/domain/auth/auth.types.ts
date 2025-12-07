import { z } from 'zod';

export const AccessTokenSchema = z.string().min(10);
export const RefreshTokenSchema = z.string().min(10);

export type AccessToken = z.infer<typeof AccessTokenSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;