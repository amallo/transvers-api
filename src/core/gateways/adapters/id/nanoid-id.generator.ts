/* eslint-disable @typescript-eslint/no-require-imports */
//import { nanoid } from 'nanoid';
import { IdGenerator } from '../../id.generator';

const { nanoid } = require('fix-esm').require('nanoid');
export class NanoidIdGenerator implements IdGenerator {
  generate(): string {
    return nanoid();
  }
}
