<template>
	<div class="maxed padded pb-6 sm:pb-10">
		<div v-for="(faqs, category) in faqsByCategory" :key="category" class="mb-10 last:mb-0">
			<h2 class="font-shoulders font-medium text-2xl sm:text-3xl text-yellow mb-4">
				{{ $t(`faq_category.${category}`) }}
			</h2>
			<UAccordion
				:items="faqs"
				:ui="{
					item: 'bg-white/10 rounded-lg mb-4 last:mb-0',
					trigger:
						'group/hash flex items-center gap-2 px-6 py-4 font-shoulders font-medium text-xl sm:text-2xl text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer',
					body: 'px-6 pb-4 text-white/80 font-cabin text-base sm:text-lg',
					trailingIcon: 'shrink-0 size-5 text-white/60',
				}"
			>
				<template #default="{ item }">
					<div :id="(item as any).slug" class="flex items-center gap-2 w-full">
						<a
							:href="`#${(item as any).slug}`"
							class="shrink-0 text-blue-light opacity-0 group-hover/hash:opacity-100 transition-opacity duration-200 no-underline cursor-pointer"
							:aria-label="`Copy link to ${item.label}`"
							@click.prevent.stop="copyLink((item as any).slug)"
						>
							#
						</a>
						<span class="flex-1">{{ item.label }}</span>
					</div>
				</template>
				<template #body="{ item }">
					<div v-html="(item as any).content" />
				</template>
			</UAccordion>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useFaqsStore } from "~/stores/faqs";

const faqsStore = useFaqsStore();

const copyLink = (slug: string) => {
	const url = `${window.location.origin}${window.location.pathname}#${slug}`;
	navigator.clipboard.writeText(url);
};

const CATEGORY_ORDER = [
	"payment",
	"travel",
	"tickets",
	"accessibility",
	"onsite",
	"photo-video",
	"safety",
	"team-accreditation",
	"contact",
];

const faqsByCategory = computed(() => {
	const groups: Record<
		string,
		Array<{ label: string; content: string; slug: string; defaultOpen: boolean }>
	> = {};
	for (const faq of faqsStore.localizedFaqs) {
		const category = faq.category || "general";
		if (!groups[category]) {
			groups[category] = [];
		}
		groups[category].push({
			label: faq.question,
			content: faq.answer,
			slug: faq.slug,
			defaultOpen: false,
		});
	}
	// Sort by defined category order, unknown categories go last
	const sorted: typeof groups = {};
	for (const key of CATEGORY_ORDER) {
		if (groups[key]) {
			sorted[key] = groups[key]!;
		}
	}
	// Add any categories not in the order list
	for (const key of Object.keys(groups)) {
		if (!sorted[key]) {
			sorted[key] = groups[key]!;
		}
	}
	return sorted;
});
</script>

<style scoped>
:deep(hr) {
	display: none;
}

:deep([data-state]) {
	border-bottom: none !important;
}
</style>
