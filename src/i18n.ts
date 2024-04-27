import { notFound } from 'next/navigation';
import { getRequestConfig, unstable_setRequestLocale } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'fr'];

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale)) {
		return notFound();
	}

	unstable_setRequestLocale(locale);

	return {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
		messages: (await import(`./translations/${locale}.json`)).default,
	};
});
