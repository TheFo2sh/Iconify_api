import { createHTTPServer } from '../../lib/http/index';
import { appConfig } from '../../lib/config/app';

const escapedRedirectIndex = appConfig.redirectIndex
	.replaceAll('&', '&amp;')
	.replaceAll('"', '&quot;')
	.replaceAll("'", '&#39;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;');

describe('Welcome page', () => {
	test('serves welcome page on root route', async () => {
		const server = await createHTTPServer();
		await server.ready();

		try {
			const response = await server.inject({
				method: 'GET',
				url: '/',
			});

			expect(response.statusCode).toBe(200);
			expect(response.headers['content-type']).toContain('text/html');
			expect(response.body).toContain('<meta name="viewport"');
			expect(response.body).toContain('Iconify API');
			expect(response.body).toContain('Access thousands of open-source icons');
			expect(response.body).toContain(`href="${escapedRedirectIndex}"`);
		} finally {
			await server.close();
		}
	});
});
