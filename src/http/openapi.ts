import { readFile } from 'node:fs/promises';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance, FastifySchema } from 'fastify';

const objectWithAdditionalProperties = {
	type: 'object',
	additionalProperties: true,
} as const;

const stringMap = {
	type: 'object',
	additionalProperties: {
		type: 'string',
	},
} as const;

const stringArrayMap = {
	type: 'object',
	additionalProperties: {
		type: 'array',
		items: {
			type: 'string',
		},
	},
} as const;

const queryCommon = {
	pretty: {
		type: 'boolean',
		description: 'Pretty-print JSON responses.',
	},
	callback: {
		type: 'string',
		description: 'Optional JSONP callback name.',
	},
} as const;

const routeDocumentation: Record<string, FastifySchema> = {
	['GET /:prefix(^[a-z0-9]+(-[a-z0-9]+)*$)/:name(^[a-z0-9]+(-[a-z0-9]+)*$).svg']: {
		tags: ['Icons'],
		summary: 'Render an icon as SVG',
		params: {
			type: 'object',
			required: ['prefix', 'name'],
			properties: {
				prefix: {
					type: 'string',
				},
				name: {
					type: 'string',
				},
			},
		},
		querystring: {
			type: 'object',
			properties: {
				width: { type: 'string' },
				height: { type: 'string' },
				rotate: { type: 'string' },
				flip: { type: 'string' },
				box: { type: 'boolean' },
				color: { type: 'string' },
				download: { type: 'boolean' },
			},
		},
		response: {
			200: {
				description: 'Rendered icon as SVG markup.',
				content: {
					'image/svg+xml': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon or icon set was not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /:name(^[a-z0-9]+(-[a-z0-9]+)*(:[a-z0-9]+(-[a-z0-9]+)*)?).svg']: {
		tags: ['Icons'],
		summary: 'Render an icon as SVG',
		params: {
			type: 'object',
			required: ['name'],
			properties: {
				name: {
					type: 'string',
					description: 'Icon name in prefix:name or prefix-name format.',
				},
			},
		},
		querystring: {
			type: 'object',
			properties: {
				width: { type: 'string' },
				height: { type: 'string' },
				rotate: { type: 'string' },
				flip: { type: 'string' },
				box: { type: 'boolean' },
				color: { type: 'string' },
				download: { type: 'boolean' },
			},
		},
		response: {
			200: {
				description: 'Rendered icon as SVG markup.',
				content: {
					'image/svg+xml': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon or icon set was not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /:prefix(^[a-z0-9]+(-[a-z0-9]+)*$)/icons.json']: {
		tags: ['Icons'],
		summary: 'Get icon data as JSON',
		params: {
			type: 'object',
			required: ['prefix'],
			properties: {
				prefix: {
					type: 'string',
				},
			},
		},
		querystring: {
			type: 'object',
			required: ['icons'],
			properties: {
				...queryCommon,
				icons: {
					type: 'string',
					description: 'Comma-separated list of icon names.',
				},
			},
		},
		response: {
			200: {
				description: 'Requested icon data.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/IconifyJSON',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon set or icons were not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /:prefix(^[a-z0-9]+(-[a-z0-9]+)*$).json']: {
		tags: ['Icons'],
		summary: 'Get icon data as JSON',
		params: {
			type: 'object',
			required: ['prefix'],
			properties: {
				prefix: {
					type: 'string',
				},
			},
		},
		querystring: {
			type: 'object',
			required: ['icons'],
			properties: {
				...queryCommon,
				icons: {
					type: 'string',
					description: 'Comma-separated list of icon names.',
				},
			},
		},
		response: {
			200: {
				description: 'Requested icon data.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/IconifyJSON',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon set or icons were not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /:prefix(^[a-z0-9]+(-[a-z0-9]+)*$).css']: {
		tags: ['Icons'],
		summary: 'Generate icon CSS',
		params: {
			type: 'object',
			required: ['prefix'],
			properties: {
				prefix: {
					type: 'string',
				},
			},
		},
		querystring: {
			type: 'object',
			required: ['icons'],
			properties: {
				icons: {
					type: 'string',
					description: 'Comma-separated list of icon names.',
				},
				format: {
					type: 'string',
					enum: ['compact', 'compressed', 'expanded'],
				},
				color: { type: 'string' },
				mode: {
					type: 'string',
					enum: ['background', 'mask', 'bg'],
				},
				square: { type: 'boolean' },
				forceSquare: { type: 'boolean' },
				'force-square': { type: 'boolean' },
				pseudo: { type: 'boolean' },
				pseudoSelector: { type: 'boolean' },
				'pseudo-selector': { type: 'boolean' },
				common: { type: 'string' },
				commonSelector: { type: 'string' },
				selector: { type: 'string' },
				iconSelector: { type: 'string' },
				override: { type: 'string' },
				overrideSelector: { type: 'string' },
				var: { type: 'string' },
				varName: { type: 'string' },
				download: { type: 'boolean' },
			},
		},
		response: {
			200: {
				description: 'Generated stylesheet for requested icons.',
				content: {
					'text/css': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon set or icons were not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /:prefix(^[a-z0-9]+(-[a-z0-9]+)*$)/icons.js']: {
		tags: ['Icons'],
		summary: 'Get icon data wrapped for browser loaders',
		params: {
			type: 'object',
			required: ['prefix'],
			properties: {
				prefix: {
					type: 'string',
				},
			},
		},
		querystring: {
			type: 'object',
			required: ['icons'],
			properties: {
				callback: {
					type: 'string',
					description: 'Optional callback override for wrapped output.',
				},
				icons: {
					type: 'string',
					description: 'Comma-separated list of icon names.',
				},
				pretty: {
					type: 'boolean',
				},
			},
		},
		response: {
			200: {
				description: 'Requested icon data wrapped as JavaScript.',
				content: {
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon set or icons were not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /:prefix(^[a-z0-9]+(-[a-z0-9]+)*$).js']: {
		tags: ['Icons'],
		summary: 'Get icon data wrapped for browser loaders',
		params: {
			type: 'object',
			required: ['prefix'],
			properties: {
				prefix: {
					type: 'string',
				},
			},
		},
		querystring: {
			type: 'object',
			required: ['icons'],
			properties: {
				callback: {
					type: 'string',
					description: 'Optional callback override for wrapped output.',
				},
				icons: {
					type: 'string',
					description: 'Comma-separated list of icon names.',
				},
				pretty: {
					type: 'boolean',
				},
			},
		},
		response: {
			200: {
				description: 'Requested icon data wrapped as JavaScript.',
				content: {
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			404: {
				description: 'Icon set or icons were not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /last-modified']: {
		tags: ['Metadata'],
		summary: 'Get last-modified timestamps for icon sets',
		querystring: {
			type: 'object',
			properties: {
				...queryCommon,
				prefix: {
					type: 'string',
				},
				prefixes: {
					type: 'string',
					description: 'Comma-separated full or partial prefixes.',
				},
			},
		},
		response: {
			200: {
				description: 'Last-modified timestamps keyed by prefix.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/APIv3LastModifiedResponse',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid JSONP callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /collections']: {
		tags: ['Metadata'],
		summary: 'List available icon collections',
		querystring: {
			type: 'object',
			properties: {
				...queryCommon,
				version: {
					type: 'number',
				},
				hidden: {
					type: 'boolean',
				},
				prefixes: {
					type: 'string',
					description: 'Comma-separated full or partial prefixes.',
				},
			},
		},
		response: {
			200: {
				description: 'Collections keyed by prefix.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/APIv2CollectionsResponse',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid JSONP callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /collection']: {
		tags: ['Metadata'],
		summary: 'Get metadata for one icon collection',
		querystring: {
			type: 'object',
			required: ['prefix'],
			properties: {
				...queryCommon,
				prefix: {
					type: 'string',
				},
				info: {
					type: 'boolean',
				},
				aliases: {
					type: 'boolean',
				},
				chars: {
					type: 'boolean',
				},
				hidden: {
					type: 'boolean',
				},
			},
		},
		response: {
			200: {
				description: 'Collection contents and metadata.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/APIv2CollectionResponse',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid JSONP callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
			404: {
				description: 'Collection not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /list-icons']: {
		tags: ['Metadata'],
		summary: 'List icons using the legacy v1 response shape',
		querystring: {
			type: 'object',
			properties: {
				...queryCommon,
				prefix: {
					type: 'string',
				},
				prefixes: {
					type: 'string',
				},
				info: {
					type: 'boolean',
				},
				aliases: {
					type: 'boolean',
				},
				chars: {
					type: 'boolean',
				},
			},
		},
		response: {
			200: {
				description: 'Legacy icon list response.',
				content: {
					'application/json': {
						schema: {
							oneOf: [
								{
									$ref: '#/components/schemas/APIv1ListIconsResponse',
								},
								{
									$ref: '#/components/schemas/APIv1ListIconsPrefixedResponse',
								},
							],
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid request or callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
			404: {
				description: 'Matching collection was not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /list-icons-categorized']: {
		tags: ['Metadata'],
		summary: 'List icons using the legacy categorized v1 response shape',
		querystring: {
			type: 'object',
			properties: {
				...queryCommon,
				prefix: {
					type: 'string',
				},
				prefixes: {
					type: 'string',
				},
				info: {
					type: 'boolean',
				},
				aliases: {
					type: 'boolean',
				},
				chars: {
					type: 'boolean',
				},
			},
		},
		response: {
			200: {
				description: 'Legacy categorized icon list response.',
				content: {
					'application/json': {
						schema: {
							oneOf: [
								{
									$ref: '#/components/schemas/APIv1ListIconsCategorisedResponse',
								},
								{
									$ref: '#/components/schemas/APIv1ListIconsCategorisedPrefixedResponse',
								},
							],
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid request or callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
			404: {
				description: 'Matching collection was not found.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /search']: {
		tags: ['Search'],
		summary: 'Search for icons',
		querystring: {
			type: 'object',
			required: ['query'],
			properties: {
				...queryCommon,
				query: {
					type: 'string',
				},
				limit: {
					type: 'number',
				},
				min: {
					type: 'number',
				},
				start: {
					type: 'number',
				},
				prefix: {
					type: 'string',
				},
				collection: {
					type: 'string',
				},
				prefixes: {
					type: 'string',
				},
				category: {
					type: 'string',
				},
				similar: {
					type: 'boolean',
				},
			},
		},
		response: {
			200: {
				description: 'Search results.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/APIv2SearchResponse',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid request or callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
			404: {
				description: 'Search index is unavailable.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /keywords']: {
		tags: ['Search'],
		summary: 'Find keyword completions',
		querystring: {
			type: 'object',
			properties: {
				...queryCommon,
				prefix: {
					type: 'string',
				},
				keyword: {
					type: 'string',
				},
			},
		},
		response: {
			200: {
				description: 'Keyword completion results.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/APIv3KeywordsResponse',
						},
					},
					'application/javascript': {
						schema: {
							type: 'string',
						},
					},
				},
			},
			400: {
				description: 'Invalid request or callback.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
			404: {
				description: 'Search index is unavailable.',
				content: {
					'text/plain': {
						schema: {
							$ref: '#/components/schemas/ErrorText',
						},
					},
				},
			},
		},
	},
	['GET /update']: {
		tags: ['Maintenance'],
		summary: 'Trigger an icon set update check',
		querystring: {
			type: 'object',
			properties: {
				secret: {
					type: 'string',
					description: 'Secret query parameter when update protection is enabled.',
				},
			},
		},
		response: {
			200: {
				description: 'Update request accepted or ignored. The response body is always "ok".',
				content: {
					'text/plain': {
						schema: {
							type: 'string',
							example: 'ok',
						},
					},
				},
			},
		},
	},
	['POST /update']: {
		tags: ['Maintenance'],
		summary: 'Trigger an icon set update check',
		querystring: {
			type: 'object',
			properties: {
				secret: {
					type: 'string',
					description: 'Secret query parameter when update protection is enabled.',
				},
			},
		},
		response: {
			200: {
				description: 'Update request accepted or ignored. The response body is always "ok".',
				content: {
					'text/plain': {
						schema: {
							type: 'string',
							example: 'ok',
						},
					},
				},
			},
		},
	},
	['OPTIONS /*']: {
		tags: ['Utility'],
		summary: 'CORS preflight response',
		response: {
			204: {
				description: 'No content.',
			},
		},
	},
	['GET /robots.txt']: {
		tags: ['Utility'],
		summary: 'Get robots exclusion rules',
		response: {
			200: {
				description: 'Robots file contents.',
				content: {
					'text/plain': {
						schema: {
							type: 'string',
						},
					},
				},
			},
		},
	},
	['GET /version']: {
		tags: ['Utility'],
		summary: 'Get the API version string',
		response: {
			200: {
				description: 'Plain-text version response.',
				content: {
					'text/plain': {
						schema: {
							type: 'string',
						},
					},
				},
			},
		},
	},
	['POST /version']: {
		tags: ['Utility'],
		summary: 'Get the API version string',
		response: {
			200: {
				description: 'Plain-text version response.',
				content: {
					'text/plain': {
						schema: {
							type: 'string',
						},
					},
				},
			},
		},
	},
	['GET /']: {
		tags: ['Utility'],
		summary: 'Redirect to the main Iconify documentation',
		response: {
			301: {
				description: 'Permanent redirect.',
			},
		},
	},
};

async function getPackageVersion() {
	try {
		const packageContent = JSON.parse(await readFile('package.json', 'utf8'));
		if (typeof packageContent.version === 'string') {
			return packageContent.version;
		}
	} catch {}

	return '0.0.0';
}

function getRouteDocumentation(method: string | string[], url: string): FastifySchema | undefined {
	const methods = Array.isArray(method) ? method : [method];
	for (let i = 0; i < methods.length; i++) {
		const docs = routeDocumentation[methods[i].toUpperCase() + ' ' + url];
		if (docs) {
			return docs;
		}
	}
}

function shouldEnableOpenAPI() {
	return process.env['NODE_ENV'] !== 'production';
}

export async function registerOpenAPI(server: FastifyInstance) {
	if (!shouldEnableOpenAPI()) {
		return;
	}

	const version = await getPackageVersion();

	await server.register(fastifySwagger, {
		openapi: {
			info: {
				title: 'Iconify API',
				description: 'OpenAPI documentation for the Iconify API.',
				version,
			},
			servers: [
				{
					url: '/',
				},
			],
			components: {
				schemas: {
					ErrorText: {
						type: 'string',
						examples: ['Not found', 'Bad request', 'Internal server error'],
					},
					IconifyInfo: objectWithAdditionalProperties,
					IconifyJSON: {
						type: 'object',
						properties: {
							prefix: {
								type: 'string',
							},
							icons: objectWithAdditionalProperties,
							aliases: objectWithAdditionalProperties,
							chars: stringMap,
							info: {
								$ref: '#/components/schemas/IconifyInfo',
							},
							themes: objectWithAdditionalProperties,
							prefixes: objectWithAdditionalProperties,
							suffixes: objectWithAdditionalProperties,
						},
						additionalProperties: true,
					},
					APIv2CollectionsResponse: {
						type: 'object',
						additionalProperties: {
							$ref: '#/components/schemas/IconifyInfo',
						},
					},
					APIv2CollectionResponse: {
						type: 'object',
						properties: {
							prefix: {
								type: 'string',
							},
							total: {
								type: 'number',
							},
							title: {
								type: 'string',
							},
							info: {
								$ref: '#/components/schemas/IconifyInfo',
							},
							uncategorized: {
								type: 'array',
								items: {
									type: 'string',
								},
							},
							categories: stringArrayMap,
							hidden: {
								type: 'array',
								items: {
									type: 'string',
								},
							},
							aliases: stringMap,
							chars: stringMap,
							themes: objectWithAdditionalProperties,
							prefixes: objectWithAdditionalProperties,
							suffixes: objectWithAdditionalProperties,
						},
						required: ['prefix', 'total'],
						additionalProperties: false,
					},
					APIv2SearchResponse: {
						type: 'object',
						properties: {
							icons: {
								type: 'array',
								items: {
									type: 'string',
								},
							},
							total: {
								type: 'number',
							},
							limit: {
								type: 'number',
							},
							start: {
								type: 'number',
							},
							collections: {
								$ref: '#/components/schemas/APIv2CollectionsResponse',
							},
							request: stringMap,
						},
						required: ['icons', 'total', 'limit', 'start', 'collections', 'request'],
						additionalProperties: false,
					},
					APIv1ListIconsResponse: {
						type: 'object',
						properties: {
							prefix: {
								type: 'string',
							},
							total: {
								type: 'number',
							},
							title: {
								type: 'string',
							},
							info: {
								$ref: '#/components/schemas/IconifyInfo',
							},
							aliases: stringMap,
							chars: stringMap,
							icons: {
								type: 'array',
								items: {
									type: 'string',
								},
							},
						},
						required: ['prefix', 'total', 'icons'],
						additionalProperties: false,
					},
					APIv1ListIconsCategorisedResponse: {
						type: 'object',
						properties: {
							prefix: {
								type: 'string',
							},
							total: {
								type: 'number',
							},
							title: {
								type: 'string',
							},
							info: {
								$ref: '#/components/schemas/IconifyInfo',
							},
							aliases: stringMap,
							chars: stringMap,
							categories: stringArrayMap,
							uncategorized: {
								type: 'array',
								items: {
									type: 'string',
								},
							},
							themes: objectWithAdditionalProperties,
						},
						required: ['prefix', 'total'],
						additionalProperties: false,
					},
					APIv1ListIconsPrefixedResponse: {
						type: 'object',
						additionalProperties: {
							$ref: '#/components/schemas/APIv1ListIconsResponse',
						},
					},
					APIv1ListIconsCategorisedPrefixedResponse: {
						type: 'object',
						additionalProperties: {
							$ref: '#/components/schemas/APIv1ListIconsCategorisedResponse',
						},
					},
					APIv3LastModifiedResponse: {
						type: 'object',
						properties: {
							lastModified: {
								type: 'object',
								additionalProperties: {
									type: 'number',
								},
							},
						},
						required: ['lastModified'],
						additionalProperties: false,
					},
					APIv3KeywordsResponse: {
						type: 'object',
						properties: {
							prefix: {
								type: 'string',
							},
							keyword: {
								type: 'string',
							},
							invalid: {
								type: 'boolean',
							},
							exists: {
								type: 'boolean',
							},
							matches: {
								type: 'array',
								items: {
									type: 'string',
								},
							},
						},
						required: ['exists', 'matches'],
						additionalProperties: false,
					},
				},
			},
		},
		transform: ({ schema, url, route }) => ({
			schema: {
				...(schema || {}),
				...(getRouteDocumentation(route.method, url) || {}),
			},
			url,
		}),
	});

	server.get('/swagger/v1/swagger.json', {
		schema: {
			hide: true,
		},
	}, (_req, res) => {
		res.type('application/json; charset=utf-8').send(server.swagger());
	});

	await server.register(fastifySwaggerUI, {
		routePrefix: '/swagger',
	});
}
