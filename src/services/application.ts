import { openDatabaseAsync } from 'expo-sqlite';

import { Repository } from '@/db/repository';
import { DATABASE_NAME } from '@/db/schema';

let application: Promise<Repository> | undefined;

export function getApplication() {
  if (!application) {
    application = (async () => {
      const database = await openDatabaseAsync(DATABASE_NAME);
      const repository = new Repository(database);
      try {
        await repository.initialize();
      } catch (error) {
        await database.closeAsync();
        throw error;
      }
      return repository;
    })().catch((error: unknown) => {
      application = undefined;
      throw error;
    });
  }
  return application;
}
