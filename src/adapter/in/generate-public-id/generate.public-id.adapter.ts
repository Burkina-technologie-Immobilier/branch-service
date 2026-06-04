import { nanoid } from 'nanoid';
import { PublicIdGeneratorPort } from 'src/domain/port/in/generate-public-id/generator-public-id.port';

export class PublicIdGeneratorAdapter implements PublicIdGeneratorPort {
  generateNanoid(): string {
    return nanoid();
  }
}
