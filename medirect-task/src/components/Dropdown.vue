<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps({
  currencies: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  otherCurrency: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <Select class="md:w-60" @update:modelValue="updateValue" :modelValue="modelValue">
    <SelectTrigger class="md:w-60 px-4 py-3 rounded-lg border border-gray-300">
      <SelectValue class="w-60" placeholder="Select a currency" />
    </SelectTrigger>
    <SelectContent class="md:w-60 rounded-lg border border-gray-200 bg-white">
      <SelectGroup>
        <SelectItem
          v-for="currency in currencies"
          :disabled="currency.code === otherCurrency"
          :key="currency.code"
          :value="currency.code"
          class="flex items-center gap-3 px-4 py-3 rounded-md"
        >
          <span class="font-medium">{{ currency.name }} ({{ currency.code }})</span>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
