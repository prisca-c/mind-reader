import { db } from '~/server/db';

async function main() {
	await db.role.upsert({
		where: { id: 1, name: 'admin' },
		update: {},
		create: { id: 1, name: 'admin' },
	});

	await db.role.upsert({
		where: { id: 2, name: 'user' },
		update: {},
		create: { id: 2, name: 'user' },
	});
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
