import { defineStore } from "pinia";
import type {
  IChannel,
  IUserSubscription
} from "~~/types/custom";

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    channels: [] as IChannel[],
    subscribedSlugs: new Set<string>(),
    teamSubscriptions: new Set<number>()
  }),

  getters: {
    isSubscribed: (state) => (slug: string) =>
      state.subscribedSlugs.has(slug),

    isTeamSubscribed: (state) => (teamId: number) =>
      state.teamSubscriptions.has(teamId)
  },

  actions: {
    async fetchAll(userId: string) {
      const [allChannels, userSubs, teamSubs] = await Promise.all([
        $fetch<IChannel[]>('/api/channels/list'),
        $fetch<IUserSubscription[]>(`/api/subscriptions/${userId}`),
        $fetch<{ team_id: number }[]>(`/api/team-subscriptions/${userId}`)
      ])

      this.channels = allChannels
      this.subscribedSlugs = new Set(userSubs.map(s => s.slug))
      this.teamSubscriptions = new Set(teamSubs.map(t => t.team_id))
    },

    async toggleChannel(slug: string, userId: string) {
      const wasSubscribed = this.subscribedSlugs.has(slug)

      // Optimistic update
      if (wasSubscribed) this.subscribedSlugs.delete(slug)
      else this.subscribedSlugs.add(slug)

      try {
        // API call
        const endpoint = wasSubscribed
          ? '/api/subscriptions/unsubscribe'
          : '/api/subscriptions/subscribe'

        await $fetch(endpoint, {
          method: 'POST',
          body: { user_id: userId, channel_slug: slug }
        })
      } catch (err) {
        // Rollback
        if (wasSubscribed) this.subscribedSlugs.add(slug)
        else this.subscribedSlugs.delete(slug)

        throw err
      }
    },

    async toggleTeam(teamId: number, userId: string) {
      const wasSubscribed = this.teamSubscriptions.has(teamId)

      // Optimistic update
      if (wasSubscribed) this.teamSubscriptions.delete(teamId)
      else this.teamSubscriptions.add(teamId)

      try {
        // API call
        const endpoint = wasSubscribed
          ? '/api/team-subscriptions/unsubscribe'
          : '/api/team-subscriptions/subscribe'

        await $fetch(endpoint, {
          method: 'POST',
          body: { user_id: userId, team_id: teamId }
        })
      } catch (err) {
        // Rollback
        if (wasSubscribed) this.teamSubscriptions.add(teamId)
        else this.teamSubscriptions.delete(teamId)

        throw err
      }
    }
  }
})
