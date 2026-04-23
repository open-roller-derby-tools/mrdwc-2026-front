import { defineStore } from "pinia";
import type { IChannel, IUserSubscription } from "~~/types/custom";

export const useNotificationsStore = defineStore("notifications", {
	state: () => ({
		//Channels
		channelsLoaded: false,
		channels: [] as IChannel[],
		subscribedSlugs: new Set<string>(),
		//teamSubscriptions: new Set<number>(),
		// Global notifications
		notificationsEnabled: false,
		notificationsLoaded: false,
	}),

	getters: {
		isSubscribed: (state) => (slug: string) => state.subscribedSlugs.has(slug),

		//isTeamSubscribed: (state) => (teamId: number) => state.teamSubscriptions.has(teamId),
	},

	actions: {
		async fetchChannels() {
			if (this.channelsLoaded) return;
			this.channels = await $fetch<IChannel[]>("/api/channels/list");
			this.channelsLoaded = true;
		},

		async fetchSubscriptions(userId: string) {
			//const [userSubs, teamSubs] = await Promise.all([
			const [userSubs] = await Promise.all([
				$fetch<IUserSubscription[]>(`/api/channel-subscriptions/${userId}`),
				//$fetch<{ team_id: number }[]>(`/api/team-subscriptions/${userId}`),
			]);
			this.subscribedSlugs = new Set(userSubs.map((s) => s.slug));
			//this.teamSubscriptions = new Set(teamSubs.map((t) => t.team_id));
		},

		async fetchAll(userId: string) {
			await this.fetchChannels();
			await this.fetchSubscriptions(userId);
		},

		async toggleChannel(slug: string, userId: string) {
			const wasSubscribed = this.subscribedSlugs.has(slug);

			// Optimistic update
			if (wasSubscribed) this.subscribedSlugs.delete(slug);
			else this.subscribedSlugs.add(slug);

			try {
				// API call
				const endpoint = wasSubscribed
					? "/api/channel-subscriptions/unsubscribe"
					: "/api/channel-subscriptions/subscribe";

				await $fetch(endpoint, {
					method: "POST",
					body: { user_id: userId, channel_slug: slug },
				});
			} catch (err) {
				// Rollback
				if (wasSubscribed) this.subscribedSlugs.add(slug);
				else this.subscribedSlugs.delete(slug);

				throw err;
			}
		},

		/*		async toggleTeam(teamId: number, userId: string) {
			const wasSubscribed = this.teamSubscriptions.has(teamId);

			// Optimistic update
			if (wasSubscribed) this.teamSubscriptions.delete(teamId);
			else this.teamSubscriptions.add(teamId);

			try {
				// API call
				const endpoint = wasSubscribed
					? "/api/team-subscriptions/unsubscribe"
					: "/api/team-subscriptions/subscribe";

				await $fetch(endpoint, {
					method: "POST",
					body: { user_id: userId, team_id: teamId },
				});
			} catch (err) {
				// Rollback
				if (wasSubscribed) this.teamSubscriptions.add(teamId);
				else this.teamSubscriptions.delete(teamId);

				throw err;
			}
		},*/

		async loadNotificationsEnabled() {
			if (this.notificationsLoaded) return;

			const registration = await navigator.serviceWorker.getRegistration();
			const sub = await registration?.pushManager.getSubscription();

			this.notificationsEnabled = !!sub;
			this.notificationsLoaded = true;
		},

		async toggleNotifications() {
			const { subscribe, unsubscribe, isSupported } = usePushNotifications();
			if (!isSupported.value) return;

			const previous = this.notificationsEnabled;
			this.notificationsEnabled = !previous; // optimistic

			try {
				if (this.notificationsEnabled) {
					await subscribe();
				} else {
					await unsubscribe();
				}
			} catch (err) {
				this.notificationsEnabled = previous; // rollback
				throw err;
			}
		},
	},
});
