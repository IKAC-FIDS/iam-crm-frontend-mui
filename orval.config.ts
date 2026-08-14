import { defineConfig } from 'orval';

const generatedRoot = process.env.API_GENERATED_ROOT || 'src/api/generated';

export default defineConfig({
  crm: {
    input: {
      target: 'contracts/backend/openapi.json',
      filters: {
        mode: 'include',
        tags: ['Companies', 'Tasks', 'Quotas'],
      },
    },
    output: {
      target: `${generatedRoot}/endpoints.ts`,
      schemas: `${generatedRoot}/models`,
      mode: 'split',
      client: 'axios-functions',
      httpClient: 'axios',
      clean: true,
      indexFiles: true,
      override: {
        header: () => [
          'AUTO-GENERATED FILE.',
          'DO NOT EDIT MANUALLY.',
          'Source: contracts/backend/openapi.json.',
        ],
        mutator: {
          path: './src/api/generatedApiMutator.ts',
          name: 'generatedApiMutator',
        },
      },
    },
  },
});
