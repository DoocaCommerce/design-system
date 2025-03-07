<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import * as Choices from 'choices.js'
import FormLabel from '../form-label/FormLabel.vue'
import type { Size } from '../../../types'

interface AutocompleteOption {
	label: string
	value: string | number
}

export interface Props {
	modelValue?: any
	placeholder?: string
	options?: AutocompleteOption[]
	label?: string
	size?: Size
	last?: boolean
	template?: any
	position?: 'top' | 'bottom' | 'auto'
	config?: Record<string, any>
	required?: boolean
	searchResultLimit?: number
}

const emit = defineEmits(['update:modelValue', 'open', 'close', 'update'])
const Plugin = Choices.default || Choices
const props = withDefaults(defineProps<Props>(), {
	placeholder: 'Selecione',
	config: () => ({
		searchResultLimit: 20
	}),
	options: () => [],
	position: 'bottom',
	size: 'md'
})

const uid = `ui-form-select-${getCurrentInstance()?.uid}`
const element = shallowRef()
const focus = ref(false)
let el: HTMLElement | null

const getTemplateChoice = (data: any) => {
	return props.template.choice(data)
}

const settings = computed(() => {
	const _choices: any = cloneDeep(props.options)
	_choices.options = _choices.options ?? []

	const config: any = {
		searchEnabled: true,
		searchChoices: true,
		removeItems: true,
		position: props.position,
		removeItemButton: true,
		addItems: true,
		placeholder: true,
		noResultsText: 'Nenhum resultado encontrado',
		noChoicesText: 'Sem opções para escolher',
		items: [],
		choices: _choices,
		allowHTML: false,
		options: [],
		...props.config
	}

	if (props.template?.choice) {
		config.callbackOnCreateTemplates = function (template: any) {
			return {
				choice: ({ classNames }: any, data: any) => {
					return template(`
						<div class="${classNames.item} ${classNames.itemChoice} ${
							data.disabled ? classNames.itemDisabled : classNames.itemSelectable
						}"
						data-select-text="${this.config.itemSelectText}"
						data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'}
						data-id="${data.id}"
						data-value="${data.value}" ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}
						>
							${getTemplateChoice(data)}
						</div>
					`)
				}
			}
		}
	}

	return config
})

const init = () => {
	nextTick(() => {
		if (element.value) {
			element.value.destroy()
		}

		if (el) {
			element.value = new Plugin(el, settings.value)
			checkModelValue()
		}
	})
}

const update = (val: string, raw: any) => {
	emit('update:modelValue', val)
	emit('update', val, raw)
}

const checkModelValue = () => {
	nextTick(() => {
		if (element.value) {
			if (props.modelValue == null) {
				element.value.setChoiceByValue('')
			} else {
				element.value.setChoiceByValue(props.modelValue)
			}
		}
	})
}

function onFocus() {
	if (element.value) element.value.showDropdown()
}

onMounted(() => {
	el = document.getElementById(`${uid}`)

	if (el) {
		el.addEventListener('showDropdown', () => emit('open'), false)
		el.addEventListener(
			'change',
			function (event) {
				update(element.value.getValue(true), element.value.getValue())
				// element.value.hideDropdown()
			},
			false
		)
	}

	watch(
		() => props.modelValue,
		() => checkModelValue()
	)

	watch(
		() => [props.options],
		() => init(),
		{ immediate: true, deep: true }
	)
})

defineExpose({
	setChoices(choices: any[], replaceOptions?: boolean) {
		if (element.value) {
			element.value.setChoices(choices, undefined, undefined, replaceOptions)
		}
	}
})
</script>

<template>
	<div class="ui-form-autocomplete" :class="[{ '-focus': focus, 'mb-0': last }, `-${size}`]">
		<FormLabel v-if="label" :label="label" @click="onFocus" />
		<select class="ui-form-select" :id="uid" :required="required">
			<option value="" disabled selected>{{ placeholder }}</option>
		</select>
	</div>
</template>

<style lang="scss">
@import 'choices.js/src/styles/choices.scss';
@import './FormAutocomplete.scss';
</style>
