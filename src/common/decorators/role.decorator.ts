import { SetMetadata } from '@nestjs/common';
import { setMetadataKey } from '../constatns/consts';

export const Roles = (...args: string[]) => SetMetadata(setMetadataKey, args);
