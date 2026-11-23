/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { App } from 'vue'
import type { TeamDashboardOptions } from './dashboardApi.ts'

import { registerWidget } from '@nextcloud/vue/functions/registerReference'
import { createApp } from 'vue'
import TeamDashboard from './components/TeamDashboard.vue'
import { logger } from './logger.ts'

const type = 'dashboard-team'
const instances = new WeakMap<HTMLElement, App>()

registerWidget(type, (el, { accessible, richObject }) => {
	if (!accessible) {
		return
	}

	const options = richObject[type] as Partial<TeamDashboardOptions> | null | undefined
	if (!options || typeof options.teamId !== 'string' || !options.teamId
		|| typeof options.loadLayout !== 'function' || typeof options.saveLayout !== 'function'
		|| typeof options.onUnavailable !== 'function') {
		logger.error('Invalid team dashboard embed options')
		return
	}

	const app = createApp(TeamDashboard, { options })
	app.mount(el)
	instances.set(el, app)
}, (el) => {
	const app = instances.get(el)
	app?.unmount()
	instances.delete(el)
})
