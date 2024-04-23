/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	singleQuote: true,
	semi: true,
	tabWidth: 2,
	useTabs: true,
	printWidth: 80,
	trailingComma: 'all',
};

export default config;
