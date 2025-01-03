import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Alert from '../Alert.vue';

const mockAlert = {
  title: 'Alert title',
  label: 'My content',
  show: true,
};

describe('UI / Alert', () => {
  test('Renderiza Alert com props basicas', () => {
    const wrapper = mount(Alert, {
      props: mockAlert,
    });

    expect(wrapper.text()).toContain(mockAlert.title);
  });

  test('Renderiza Alert com variação de sucesso', () => {
    const wrapper = mount(Alert, {
      props: { ...mockAlert, variant: 'success' },
    });

    expect(wrapper.classes()).toContain('-success');
  });

  test('Title do Alert não deve ser renderizado', () => {
    const wrapper = mount(Alert, {
      props: { ...mockAlert, show: false },
    });

    expect(wrapper.text()).not.contains(mockAlert.title);
  });

  test('Renderiza Alert com a opção de fechar', async () => {
    const wrapper = mount(Alert, {
      props: { ...mockAlert, dismissible: true },
    });

    await wrapper.get('.ui-alert-close').trigger('click');

    expect(wrapper.emitted().dismissed).toBeTruthy();
  });
});
