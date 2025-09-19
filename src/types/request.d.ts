import { Request } from 'express';

export interface RequestCustom extends Request {
    user?: {
        id: number,
        role: string,
    };
}