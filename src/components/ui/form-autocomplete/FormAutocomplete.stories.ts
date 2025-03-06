import FormAutocomplete from './FormAutocomplete.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

/** Autocomplete is like a smart text box that helps you find things faster. It suggests options, so you can quickly pick what you want from a big list. */
const meta: Meta<typeof FormAutocomplete> = {
	title: 'Ui/Form/FormAutocomplete',
	component: FormAutocomplete,
	tags: ['autodocs'],
	args: {
		placeholder: 'Placeholder',
		label: 'Label',
		options: [
			{ value: 1, label: 'Hello' },
			{ value: 2, label: 'World' }
		]
	},
	argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** searchResultLimit parameter sets the maximum number of search results to display. In this example it is set to 2 */
export const WithResultSearchLimit: Story = {
	args: {
		config: {
			searchResultLimit: 2
		},
		placeholder: 'Placeholder',
		label: 'Label',
		options: [
			{ value: 1, label: 'Hello' },
			{ value: 2, label: 'World' },
			{ value: 3, label: 'Foo' },
			{ value: 4, label: 'Foo' },
			{ value: 5, label: 'Foo' },
			{ value: 6, label: 'Foo' },
			{ value: 7, label: 'Foo' },
			{ value: 8, label: 'Foo' },
			{ value: 9, label: 'Foo' },
			{ value: 10, label: 'Foo' },
			{ value: 11, label: 'Foo' },
			{ value: 12, label: 'Foo' },
			{ value: 13, label: 'Foo' },
			{ value: 14, label: 'Foo' },
			{ value: 15, label: 'Foo' },
			{ value: 16, label: 'Bar' },
			{ value: 17, label: 'John' },
			{ value: 18, label: 'Doyle' }
		]
	}
}
