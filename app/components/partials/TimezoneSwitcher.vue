<template>
	<div class="@container w-full">
		<div
			class="text-black text-base rounded-2xl flex gap-1 flex-col @3xl:flex-row @3xl:items-center @3xl:justify-center @3xl:gap-2"
			:class="{ 'px-4 py-2 bg-white': withBackground }"
		>
			<div class="font-medium flex items-center gap-2 leading-tight">
				<span>{{ timezoneLabel }}</span>
			</div>
			<div
				v-if="user_timezone !== tournament_timezone"
				class="flex gap-1 items-center cursor-pointer font-bold"
				@click="toggleTimezone"
			>
				<UIcon name="ic:round-language" class="size-6 text-red-text" />
				<p class="underline underline-offset-2 text-red-text leading-none">
					{{
						active_timezone === tournament_timezone
							? t("calendar.use_user_timezone", {
									timezone: user_timezone,
								})
							: t("calendar.use_tournament_timezone")
					}}
					<span
						v-if="active_timezone === tournament_timezone"
						class="font-normal text-sm italic whitespace-nowrap"
						>({{ user_timezone }})</span
					>
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const { active_timezone, tournament_timezone, user_timezone, toggleTimezone } = useTimezone();
const { t } = useI18n();

withDefaults(
	defineProps<{
		withBackground?: boolean;
	}>(),
	{
		withBackground: true,
	}
);

const timezoneLabel = computed(() => {
	const timezoneName =
		active_timezone.value === tournament_timezone
			? t("calendar.tournament_timezone")
			: user_timezone;
	return t("calendar.current_timezone", { timezone: timezoneName });
});
</script>
