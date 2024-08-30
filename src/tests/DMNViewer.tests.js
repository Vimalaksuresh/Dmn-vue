// tests/DMNViewer.test.js
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DMNViewer from '../src/components/DMNViewer.vue';
import { page } from './setup.js'; 

describe('DMNViewer', () => {
  it('should render DMNViewer component', () => {
    const wrapper = mount(DMNViewer);
    expect(wrapper.exists()).toBe(true);
  });

  it('should display the DMN diagram', async () => {
    await page.goto('http://localhost:3000');
    const dmnElement = await page.$('.dmn-diagram-container');
    expect(dmnElement).not.toBeNull();
  });
});
