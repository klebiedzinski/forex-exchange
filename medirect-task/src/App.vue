<script setup>
import Dropdown from './components/Dropdown.vue';
import { ref, onMounted } from 'vue';
import PriceChart from './components/PriceChart.vue';

const FOREX_CURRENCIES_CACHE_KEY = 'forex_currencies';
const CACHE_EXPIRATION = 1000 * 60 * 60 * 24; // every 24h

const currencies = ref([]);
const selectedBaseCurrency = ref('EUR');
const selectedQuoteCurrency = ref('PLN');

const fetchCurrencies = async () => {
  try {
    const cachedCurrencies = localStorage.getItem(FOREX_CURRENCIES_CACHE_KEY);
    if (
      cachedCurrencies &&
      JSON.parse(cachedCurrencies).timestamp + CACHE_EXPIRATION > Date.now()
    ) {
      currencies.value = JSON.parse(cachedCurrencies).data;
      return;
    }

    const response = await fetch(
      `https://marketdata.tradermade.com/api/v1/live_currencies_list?api_key=${import.meta.env.VITE_TRADER_MADE_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    currencies.value = Object.entries(data.available_currencies).map(([code, name]) => ({
      code,
      name,
    }));
    localStorage.setItem(
      FOREX_CURRENCIES_CACHE_KEY,
      JSON.stringify({ data: currencies.value, timestamp: Date.now() }),
    );
  } catch (error) {
    console.error('Error fetching currencies:', error);
  }
};

onMounted(fetchCurrencies);
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center max-w-[900px] mx-auto">
    <header class="p-4">
      <h1 class="text-3xl md:text-5xl font-bold">Forex Exchange</h1>
      <p class="text-small text-gray-600">Check out the current price for a currency pair</p>
    </header>
    <main class="flex flex-col-reverse md:flex-row w-full justify-center items-center p-4 gap-4">
      <div class="flex flex-col gap-4 w-[90%] md:max-w-xs">
        <Dropdown
          v-model="selectedBaseCurrency"
          :currencies="currencies"
          :otherCurrency="selectedQuoteCurrency"
        />
        <Dropdown
          v-model="selectedQuoteCurrency"
          :currencies="currencies"
          :otherCurrency="selectedBaseCurrency"
        />
      </div>

      <PriceChart
        :selectedBaseCurrency="selectedBaseCurrency"
        :selectedQuoteCurrency="selectedQuoteCurrency"
      />
    </main>
  </div>
</template>
