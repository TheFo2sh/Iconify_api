import { createHTTPServer } from '../../lib/http/index';
import { loaded } from '../../lib/data/loading';
import { setImporters, updateIconSets } from '../../lib/data/icon-sets';
import { createHardcodedCollectionsListImporter } from '../../lib/importers/collections/list';
import { createJSONIconSetImporter } from '../../lib/importers/icon-set/json';
import { DirectoryDownloader } from '../../lib/downloaders/directory';
import type { IconSetImportedData } from '../../lib/types/importers/common';

async function initTestData() {
	const importer = createHardcodedCollectionsListImporter(['mdi-light'], (prefix) =>
		createJSONIconSetImporter(new DirectoryDownloader<IconSetImportedData>('tests/fixtures'), {
			prefix,
			filename: `/json/${prefix}.json`,
		})
	);
	await importer.init();
	setImporters([importer]);
	updateIconSets();
	loaded();
}

describe('Swagger/OpenAPI', () => {
	beforeAll(async () => {
		await initTestData();
	});

	test('serves OpenAPI JSON and Swagger UI outside production', async () => {
		const oldNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		const server = await createHTTPServer();
		await server.ready();

		try {
			const specResponse = await server.inject({
				method: 'GET',
				url: '/swagger/v1/swagger.json',
			});
			expect(specResponse.statusCode).toBe(200);

			const spec = specResponse.json();
			expect(spec.openapi).toMatch(/^3\./);
			expect(spec.paths['/collections']).toBeTruthy();
			expect(spec.paths['/collection']).toBeTruthy();
			expect(spec.paths['/search']).toBeTruthy();
			expect(spec.paths['/{prefix}/{name}.svg']).toBeTruthy();
			expect(spec.components.schemas.APIv2CollectionResponse).toBeTruthy();
			expect(
				spec.paths['/collection'].get.responses['200'].content['application/json'].schema.$ref
			).toBe('#/components/schemas/APIv2CollectionResponse');

			const uiResponse = await server.inject({
				method: 'GET',
				url: '/swagger/',
			});
			expect(uiResponse.statusCode).toBe(200);
			expect(uiResponse.headers['content-type']).toContain('text/html');
			expect(uiResponse.body).toContain('Swagger UI');
		} finally {
			process.env.NODE_ENV = oldNodeEnv;
			await server.close();
		}
	});

	test('does not expose Swagger routes in production', async () => {
		const oldNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';

		const server = await createHTTPServer();
		await server.ready();

		try {
			const specResponse = await server.inject({
				method: 'GET',
				url: '/swagger/v1/swagger.json',
			});
			expect(specResponse.statusCode).toBe(404);

			const uiResponse = await server.inject({
				method: 'GET',
				url: '/swagger/',
			});
			expect(uiResponse.statusCode).toBe(404);
		} finally {
			process.env.NODE_ENV = oldNodeEnv;
			await server.close();
		}
	});
});
