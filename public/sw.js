self.addEventListener("push", (event) => {
	if (!event.data) return;

	const payload = event.data.json();

	const title = payload.title || "Notification";
	const options = {
		body: payload.body,
		data: payload.data || {},
		icon: "/mrdwc_logo.png",
		badge: "/roller-skate.png",
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const url = event.notification.data?.url || "/";

	event.waitUntil(
		clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
			// If a window in already openned = focus
			for (const client of windowClients) {
				if (client.url.startsWith(self.location.origin)) {
					client.focus();
					client.navigate(url);
					return;
				}
			}
			// Else, open new window
			return clients.openWindow(url);
		})
	);
});
