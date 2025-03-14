<script setup>
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const props = defineProps({
  modelValue: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
});
const emit = defineEmits(['update:modelValue']);

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <ToggleGroup
    type="single"
    @update:modelValue="updateValue"
    :modelValue="modelValue"
    :disabled="isLoading"
  >
    <ToggleGroupItem value="15M"> 15M </ToggleGroupItem>
    <ToggleGroupItem value="1H"> 1H </ToggleGroupItem>
    <ToggleGroupItem value="1D"> 1D </ToggleGroupItem>
    <ToggleGroupItem value="1W"> 1W </ToggleGroupItem>
    <ToggleGroupItem value="1M"> 1M </ToggleGroupItem>
  </ToggleGroup>
</template>
