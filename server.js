import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME;
const port = parseInt(process.env.PORT ?? '3000');
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

void app.prepare().then(() => {
	const httpServer = createServer((req, res) => {
		handler(req, res).catch((err) => console.error(err));
	});

	const io = new Server(httpServer);

	io.on('connection', (socket) => {
		socket.on('user_count', () => {
			const count = io.engine.clientsCount;
			io.emit('user_count', count);
		});
	});

	httpServer
		.once('error', (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			const hostname = process.env.HOSTNAME;
			const port = parseInt(process.env.PORT ?? '3000');
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});