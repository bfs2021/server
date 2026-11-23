<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { DashboardWidget, DashboardWidgetItems } from '../dashboardApi.ts'

import { mdiArrowTopRight } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import ApiDashboardWidget from './ApiDashboardWidget.vue'

const props = defineProps<{
	widget: DashboardWidget
	items?: DashboardWidgetItems
}>()

const buttons = computed(() => (props.widget.buttons ?? []).filter((button) => button.type !== 'setup' || props.items?.items.length === 0))
</script>

<template>
	<section class="team-dashboard-widget" :aria-label="widget.title">
		<h2 class="team-dashboard-widget__heading">
			<img v-if="widget.icon_url" :src="widget.icon_url" alt="">
			<span v-else :class="widget.icon_class" aria-hidden="true" />
			<a v-if="widget.widget_url" :href="widget.widget_url">{{ widget.title }}</a>
			<template v-else>
				{{ widget.title }}
			</template>
		</h2>
		<ApiDashboardWidget
			:widget="widget"
			:data="items"
			:loading="false"
			hideMoreButton>
			<template #emptyContent>
				<NcEmptyContent :name="items?.emptyContentMessage || t('dashboard', 'No content yet')" />
			</template>
		</ApiDashboardWidget>
		<div v-if="items && buttons.length" class="team-dashboard-widget__actions">
			<NcButton v-for="button in buttons" :key="`${button.type}:${button.link}`" :href="button.link">
				<template #icon>
					<NcIconSvgWrapper :path="mdiArrowTopRight" />
				</template>
				{{ button.text }}
			</NcButton>
		</div>
	</section>
</template>

<style scoped lang="scss">
.team-dashboard-widget {
	min-width: 0;

	&__heading {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		font-size: 20px;
		overflow-wrap: anywhere;

		img, span {
			width: 24px;
			height: 24px;
			flex-shrink: 0;
		}

		img { filter: var(--background-invert-if-dark); }
		a { color: inherit; }
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
}
</style>
