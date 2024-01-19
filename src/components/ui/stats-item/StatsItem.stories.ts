import type { Meta, StoryObj } from '@storybook/vue3'

import StatsItem from './StatsItem.vue'

const meta = {
	title: 'Ui/Stats Item',
	component: StatsItem,
	tags: ['autodocs'],
	args: {
		label: 'StatsItem label',
		value: 'R$ 10',
		perc: undefined,
		info: undefined,
		primaryAction: undefined,
		text: undefined
	},
	argTypes: {}
} satisfies Meta<typeof StatsItem>

type Story = StoryObj<typeof meta>

export default meta

export const Default: Story = {
	args: {}
}
