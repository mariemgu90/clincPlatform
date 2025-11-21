#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const APP_API_DIR = path.resolve(__dirname, '..', 'src', 'app', 'api');
const OUT_PATH = path.resolve(__dirname, '..', 'public', 'openapi.json');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function isRouteFile(file) {
  return /route\.(js|jsx|ts|tsx)$/.test(file);
}

function pathFromFile(file) {
  // file is like .../src/app/api/clinics/[id]/route.js
  const rel = path.relative(path.resolve(__dirname, '..', 'src', 'app'), file);
  // rel e.g. api/clinics/[id]/route.js
  if (!rel.startsWith('api' + path.sep)) return null;
  const parts = rel.split(path.sep);
  parts.shift(); // remove 'api'
  // remove the trailing 'route.*'
  if (parts[parts.length - 1].startsWith('route.')) parts.pop();
  // build path
  const urlParts = parts.map(p => {
    // convert [id] -> {id}
    if (/^\[.+\]$/.test(p)) return '{' + p.slice(1, -1) + '}';
    return p;
  });
  return '/' + ['api', ...urlParts].filter(Boolean).join('/');
}

function findExports(content) {
  const methods = new Set();
  const regexes = [
    /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS)\b/g,
    /export\s+const\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS)\b/g,
    /export\s+function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS)\b/g,
  ];
  for (const re of regexes) {
    let m;
    while ((m = re.exec(content))) methods.add(m[1].toLowerCase());
  }
  return Array.from(methods);
}

function parseOpenApiFromComments(content, filePathForLog) {
  // look for /** ... @openapi ... */ blocks
  const blockRe = /\/\*\*[\s\S]*?@openapi([\s\S]*?)\*\//g;
  const results = [];
  let m;
  while ((m = blockRe.exec(content))) {
    let raw = m[1];
    // strip leading * and spaces from each line
    raw = raw.split('\n').map(l => l.replace(/^\s*\*?\s?/, '')).join('\n').trim();
    // find first { and last } to extract JSON
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      const jsonStr = raw.slice(first, last + 1);
      try {
        const obj = JSON.parse(jsonStr);
        results.push(obj);
      } catch (err) {
        console.warn(`Failed to parse @openapi JSON in comment block in ${filePathForLog || '<unknown file>'}:`, err.message);
      }
    }
  }
  return results;
}

function paramsFromPath(pathStr) {
  const params = [];
  const re = /\{([^/}]+)\}/g;
  let m;
  while ((m = re.exec(pathStr))) {
    params.push({ name: m[1], in: 'path', required: true, schema: { type: 'string' }, description: '' });
  }
  return params;
}

function inferRequestBody(content) {
  // look for `const body = await request.json();` and destructuring `const { a, b } = body;`
  if (!/await\s+request\.json\(\)/.test(content) && !/request\.json\(\)/.test(content)) return null;
  const props = {};
  const required = [];

  // find destructured fields like: const { a, b = 'x', c: alias } = body;
  const destrRe = /const\s*\{([^}]+)\}\s*=\s*body\s*;/g;
  let m;
  while ((m = destrRe.exec(content))) {
    const fields = m[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const f of fields) {
      // handle `a`, `a = 'x'`, `a: alias`
      let name = f.split(':')[0].split('=')[0].trim();
      // strip default values or rest syntax
      name = name.replace(/^\.\.\./, '').trim();
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) continue;
      props[name] = { type: 'string' };
      // naive required detection: look for `if (!name` or `!name` occurrences
  const reqRe = new RegExp("(if\\s*\\(\\s*!\\s*" + name + "\\b)|(!\\s*" + name + "\\b)");
      if (reqRe.test(content) && !required.includes(name)) required.push(name);
    }
  }

  // also try to detect individual usages: const foo = body.foo;
  const propRe = /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*body\.([a-zA-Z0-9_]+)/g;
  while ((m = propRe.exec(content))) {
    const name = m[2];
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) continue;
    if (!props[name]) props[name] = { type: 'string' };
  const reqRe = new RegExp("(if\\s*\\(\\s*!\\s*" + name + "\\b)|(!\\s*" + name + "\\b)");
    if (reqRe.test(content) && !required.includes(name)) required.push(name);
  }

  if (Object.keys(props).length === 0) return null;
  const uniqueRequired = Array.from(new Set(required));
  const cleanedProps = {};
  for (const k of Object.keys(props)) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k)) continue;
    cleanedProps[k] = props[k];
  }
  return { ...(uniqueRequired.length ? { required: uniqueRequired } : {}), content: { 'application/json': { schema: { type: 'object', properties: cleanedProps, ...(uniqueRequired.length ? { required: uniqueRequired } : {}) } } } };
}

function inferQueryParams(content) {
  // find searchParams.get('name') usages
  const params = [];
  const re = /searchParams\.get\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  let m;
  const seen = new Set();
  while ((m = re.exec(content))) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    params.push({ name, in: 'query', schema: { type: 'string' } });
  }
  return params.length ? params : null;
}

function mapPrismaTypeToJsonSchema(typeStr) {
  // map basic Prisma scalar types to JSON Schema
  switch (typeStr) {
    case 'String':
      return { type: 'string' };
    case 'Int':
      return { type: 'integer', format: 'int32' };
    case 'Float':
      return { type: 'number', format: 'float' };
    case 'Boolean':
      return { type: 'boolean' };
    case 'DateTime':
      return { type: 'string', format: 'date-time' };
    case 'Json':
      return { type: 'object' };
    case 'BigInt':
      return { type: 'integer' };
    case 'Decimal':
      return { type: 'string' };
    default:
      return null; // non-scalar (likely relation/enum)
  }
}

function parsePrismaModels(prismaText) {
  const models = {};
  // match model blocks
  const modelRe = /model\s+([A-Za-z0-9_]+)\s*\{([\s\S]*?)\n\}/g;
  let m;
  while ((m = modelRe.exec(prismaText))) {
    const name = m[1];
    const body = m[2];
    const props = {};
    const required = [];
    const lines = body.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('//'));
    for (const line of lines) {
      // field lines look like: name Type? @attr @attr
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;
      const fieldName = parts[0];
      let typeRaw = parts[1];
      // strip attribute tokens from line to check for @id/@default
      const attrs = line.includes('@') ? line.slice(line.indexOf('@')) : '';
      const isOptional = /\?$/.test(typeRaw);
      const isArray = /\[\]$/.test(typeRaw);
      let baseType = typeRaw.replace(/\?$/, '').replace(/\[\]$/, '');

      // map scalar types
      const scalar = mapPrismaTypeToJsonSchema(baseType);
      let schema;
      if (isArray) {
        if (scalar) schema = { type: 'array', items: scalar };
        else schema = { type: 'array', items: { $ref: `#/components/schemas/${baseType}` } };
      } else {
        if (scalar) schema = scalar;
        else schema = { $ref: `#/components/schemas/${baseType}` };
      }

      props[fieldName] = schema;
      // consider field required if not optional and not auto-generated (id/default)
      const autoGenerated = /@id\b|@default\(/.test(attrs);
      if (!isOptional && !autoGenerated) required.push(fieldName);
    }
    models[name] = { type: 'object', properties: props };
    if (required.length) models[name].required = Array.from(new Set(required));
  }
  return models;
}

function generate() {
  if (!fs.existsSync(APP_API_DIR)) {
    console.error('API directory not found at', APP_API_DIR);
    process.exit(1);
  }

  const files = walk(APP_API_DIR).filter(isRouteFile);
  const paths = {};

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const routePath = pathFromFile(file);
    if (!routePath) continue;
    const methods = findExports(content);
    if (methods.length === 0) {
      // default to get if none detected
      methods.push('get');
    }
    if (!paths[routePath]) paths[routePath] = {};
  // merge any @openapi comment blocks
  const commentSpecs = parseOpenApiFromComments(content, file);
    // if commentSpecs contain a 'paths' object, merge it at top level
    for (const spec of commentSpecs) {
      if (spec.paths && typeof spec.paths === 'object') {
        for (const p in spec.paths) {
          paths[p] = paths[p] || {};
          Object.assign(paths[p], spec.paths[p]);
        }
      }
    }
    for (const method of methods) {
      const operation = {
        summary: `${method.toUpperCase()} ${routePath}`,
        responses: {
          '200': { description: 'Success' },
        },
      };
      const params = paramsFromPath(routePath);
      if (params.length) operation.parameters = params;
      // if a comment spec provides details for this method, merge it
      for (const spec of commentSpecs) {
        // spec might directly specify methods
        if (spec[method] && typeof spec[method] === 'object') {
          Object.assign(operation, spec[method]);
        }
      }
      // infer request bodies and query params if missing (don't infer bodies for GET)
      if (method !== 'get' && !operation.requestBody) {
        const inferred = inferRequestBody(content);
        if (inferred) operation.requestBody = inferred;
      }
      if ((!operation.parameters || operation.parameters.length === 0)) {
        const qs = inferQueryParams(content);
        if (qs) operation.parameters = (operation.parameters || []).concat(qs);
      }

      paths[routePath][method] = operation;
    }
  }

  const doc = {
    openapi: '3.0.3',
    info: { title: 'clinicPlatform API', version: '1.0.0', description: 'Auto-generated OpenAPI from Next app routes' },
    servers: [{ url: 'http://localhost:3000' }],
      paths,
  };

    // try to load Prisma schema and generate components.schemas
    const prismaSchemaPath = path.resolve(__dirname, '..', 'prisma', 'schema.prisma');
    const components = {};
    if (fs.existsSync(prismaSchemaPath)) {
      try {
        const prismaText = fs.readFileSync(prismaSchemaPath, 'utf8');
        const models = parsePrismaModels(prismaText);
        if (Object.keys(models).length) {
          components.schemas = models;
          // attach some heuristics: if a path matches a plural of a model, wire responses
          const modelNames = Object.keys(models);
          for (const p of Object.keys(paths)) {
            const segs = p.split('/').filter(Boolean);
            // segs[1] is resource after 'api'
            const resource = segs[1];
            if (!resource) continue;
            for (const modelName of modelNames) {
              const lower = modelName.toLowerCase();
              const plural = lower + 's';
              if (resource === plural || resource === lower) {
                // if GET on collection, set response schema to array of model
                if (paths[p].get && !paths[p].get.responses['200']?.content) {
                  paths[p].get.responses['200'] = { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: `#/components/schemas/${modelName}` } } } } };
                }
                // if POST on collection, use model schema as requestBody and 201 response
                if (paths[p].post) {
                  if (!paths[p].post.requestBody) {
                    paths[p].post.requestBody = { required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${modelName}` } } } };
                  }
                  if (!paths[p].post.responses['201']) {
                    paths[p].post.responses['201'] = { description: 'Created', content: { 'application/json': { schema: { $ref: `#/components/schemas/${modelName}` } } } };
                  }
                }
                // if GET/PUT/DELETE on item path, set responses to model
                if (p.includes('{') && (paths[p].get || paths[p].put || paths[p].delete)) {
                  for (const m of ['get', 'put', 'delete', 'patch']) {
                    if (paths[p][m] && !paths[p][m].responses['200']?.content) {
                      paths[p][m].responses['200'] = { description: 'Success', content: { 'application/json': { schema: { $ref: `#/components/schemas/${modelName}` } } } };
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Failed to parse prisma schema:', err.message);
      }
    }

    if (components.schemas) doc.components = components;

  // ensure public dir
  const publicDir = path.resolve(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  fs.writeFileSync(OUT_PATH, JSON.stringify(doc, null, 2), 'utf8');
  console.log('Wrote', OUT_PATH);
}

generate();
