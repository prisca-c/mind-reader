'use client';
import { socket } from '~/socket';
import { useEffect, useState } from 'react';

export default function Stats() {
	const [userCount, setUserCount] = useState(0);
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState<string>('N/A');

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);

			socket.io.engine.on('upgrade', (transport: { name: string }) => {
				setTransport(transport.name);
			});

			socket.emit('user_count');
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
		};
	}, []);

	socket.on('user_count', (count: number) => {
		setUserCount(count);
	});

	const status = isConnected ? 'connected' : 'disconnected';

	return (
		<div className="flex gap-2 text-xs">
			<p>
				Status :&nbsp;
				<span className={`${isConnected ? 'text-green-500' : 'text-red-500'}`}>{status}</span>
			</p>
			<p>Users : {userCount}</p>
		</div>
	);
}
