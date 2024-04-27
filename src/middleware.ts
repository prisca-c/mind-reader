import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { type NextRequest } from 'next/server';

const locales = ['en', 'fr'];
const publicPages = ['/', '/en', '/fr', '/en/login', '/fr/login'];

const intlMiddleware = createMiddleware({
	// A list of all locales that are supported
	locales,

	// Used when no locale matches
	defaultLocale: 'fr',
});

const authMiddleware = withAuth(
	function onSuccess(req) {
		return intlMiddleware(req);
	},
	{
		callbacks: {
			authorized: ({ token }) => token !== null,
		},
		pages: {
			signIn: '/en/login',
		},
	},
);

export default function middleware(req: NextRequest) {
	const publicPathnameRegex = RegExp(
		`^(/(${locales.join('|')}))?(${publicPages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
		'i',
	);
	const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

	if (isPublicPage) {
		return intlMiddleware(req);
	} else {
		return (authMiddleware as any)(req);
	}
}
export const config = {
	matcher: ['/((?!api|_next|.*\\..*).*)'],
};
