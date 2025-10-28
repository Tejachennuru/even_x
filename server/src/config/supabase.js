const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// For local debugging, log the key 'role' claim (service_role vs anon) without
// printing the key itself. This helps detect when the server is running with
// the public/anon key which will cause RLS failures on inserts.
if (supabaseKey) {
	try {
		const jwt = require('jsonwebtoken');
		const decoded = jwt.decode(supabaseKey) || {};
		if (decoded && decoded.role) {
			console.log('Supabase key role detected:', decoded.role);
		}
	} catch (e) {
		// ignore decode errors
	}
}

// If environment variables appear to be placeholders or invalid, provide a
// minimal in-memory mock so the server can run in local dev without a real
// Supabase project. The mock implements the chainable API used by the
// controllers and resolves to empty results.
function createMockClient() {
	const makeQuery = () => {
		const q = {
			_ops: [],
			select() { this._ops.push(['select']); return this; },
			eq() { this._ops.push(['eq']); return this; },
			gte() { this._ops.push(['gte']); return this; },
			lte() { this._ops.push(['lte']); return this; },
			order() { this._ops.push(['order']); return this; },
			insert() { this._ops.push(['insert']); return this; },
			update() { this._ops.push(['update']); return this; },
			delete() { this._ops.push(['delete']); return this; },
			single() { this._ops.push(['single']); return this; },
			// make awaitable
			then(resolve) { return resolve({ data: [], error: null }); },
		};
		return q;
	};

	return {
		from() { return makeQuery(); },
		storage: {
			from() {
				return {
					upload: async () => ({ data: {}, error: null }),
					getPublicUrl: (fileName) => ({ data: { publicUrl: `https://via.placeholder.com/800` }, error: null }),
				};
			}
		}
	};
}

let supabase;
try {
	// Basic validation: createClient will throw for invalid URL; guard with a check
	if (supabaseUrl && /^https?:\/\//.test(supabaseUrl)) {
		supabase = createClient(supabaseUrl, supabaseKey);
	} else {
		console.warn('Supabase URL not configured or invalid; using mock supabase client for local dev.');
		supabase = createMockClient();
	}
} catch (err) {
	console.warn('Failed to initialize Supabase client, falling back to mock client:', err.message);
	supabase = createMockClient();
}

module.exports = supabase;