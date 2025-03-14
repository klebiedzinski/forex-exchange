<script setup>
import VueApexCharts from "vue3-apexcharts";
import { ref, onMounted, watch, computed, toRefs, onUnmounted } from "vue";
import Badge from "./ui/badge/Badge.vue";
import { getFlag } from "@/utils/getFlag";
import RangeControls from "@/components/RangeControls.vue";
import { getSymbol } from "@/utils/getSymbol";
import { formatApiUrl } from "@/utils/formatApiUrl";
import Spinner from "./ui/Spinner.vue";
import { initialChartOptions } from "@/utils/chartOptions";

const props = defineProps({
  selectedBaseCurrency: { type: String, required: true },
  selectedQuoteCurrency: { type: String, required: true },
});

const { selectedBaseCurrency, selectedQuoteCurrency } = toRefs(props);

const initWebsocket = () => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.close();
  }
  socket.value = new WebSocket("wss://marketdata.tradermade.com/feedadv");

  socket.value.onopen = () => {
    socket.value.send(
      JSON.stringify({
        userKey: import.meta.env.VITE_TRADER_MADE_SOCKET_KEY,
        symbol: `${selectedBaseCurrency.value}${selectedQuoteCurrency.value}`,
        fmt: "CSV",
      })
    );
  };
  socket.value.onmessage = (event) => {
    if (event.data === "Connected") return;
    const [pair, , , mid] = event.data.split(",");
    if (
      mid &&
      pair === `${selectedBaseCurrency.value}${selectedQuoteCurrency.value}`
    ) {
      currentPrice.value = Number(mid);
    }
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.value.onclose = () => {
    // console.info('WebSocket connection closed');
  };
};

const chartData = ref([]);
const currentPrice = ref(null);
const fetchedCurrentPrice = ref(null);
const selectedPeriod = ref("15M");
const previousPrice = ref(null);
const isLoading = ref(false);
const socket = ref(null);
const error = ref(null);

const chartOptions = ref(initialChartOptions);

const fetchChartData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(
      `${formatApiUrl(
        `${selectedBaseCurrency.value}${selectedQuoteCurrency.value}`,
        selectedPeriod.value
      )}`
    );

    if (!response.ok) {
      console.error(`TraderMade Error: ${response.status}`);
    }

    const data = await response.json();

    previousPrice.value = Object.values(data.quotes)[0].close;
    currentPrice.value = Object.values(data.quotes).at(-1)?.close;

    chartData.value = [
      {
        data: Object.values(data.quotes).map((quote) => quote.close),
      },
    ];
  } catch (error) {
    console.error("Error fetching chart data:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCurrentPrice = async () => {
  try {
    if (!selectedBaseCurrency.value || !selectedQuoteCurrency.value) return;

    const response = await fetch(
      `https://marketdata.tradermade.com/api/v1/live?api_key=${
        import.meta.env.VITE_TRADER_MADE_API_KEY
      }&currency=${selectedBaseCurrency.value}${selectedQuoteCurrency.value}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        error.value = "Ran out of free requests";
        return;
      }
      console.error(`TraderMade Error: ${response.status}`);
    }

    const data = await response.json();
    currentPrice.value = data.quotes[0].mid;
    fetchedCurrentPrice.value = data.quotes[0].mid;
  } catch (error) {
    console.error("Error fetching current price:", error);
  } finally {
    isLoading.value = false;
  }
};

watch([selectedBaseCurrency, selectedQuoteCurrency], () => {
  fetchCurrentPrice();
  initWebsocket();
});

watch([selectedBaseCurrency, selectedQuoteCurrency, selectedPeriod], () => {
  fetchChartData();
});

onUnmounted(() => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.close();
  }
});

onMounted(() => {
  fetchChartData();
  fetchCurrentPrice();

  initWebsocket();
});
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 w-full max-w-[600px] min-h-[400px]"
  >
    <div class="flex gap-2 items-center">
      <p class="text-xl">{{ getFlag(selectedBaseCurrency) }}</p>
      <p class="text-xl">{{ getFlag(selectedQuoteCurrency) }}</p>
      <Badge variant="secondary" class="text-gray-600 text-l px-3 py-1"
        >Forex.com</Badge
      >
    </div>
    <div class="flex gap-2 items-center justify-between">
      <h2 class="text-xl font-semibold">
        {{ selectedBaseCurrency }}/{{ selectedQuoteCurrency }}
      </h2>
      <div class="flex flex-col gap-1">
        <p class="text-xl">
          {{ getSymbol(selectedQuoteCurrency) }} {{ currentPrice }}
        </p>
        <p
          class="text-l"
          :class="
            currentPrice - previousPrice >= 0
              ? 'text-green-500'
              : 'text-red-500'
          "
        >
          {{ (currentPrice - previousPrice).toFixed(6) }} ({{
            ((currentPrice / previousPrice) * 100 - 100).toFixed(2)
          }}%)
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-[300px]">
      <div role="status">
        <Spinner />
      </div>
    </div>

    <div v-else-if="error" class="h-[300px]">
      <p class="text-red-500 text-lg">{{ error }}</p>
    </div>

    <div v-else class="h-[300px]">
      <VueApexCharts
        v-if="chartData.length > 0"
        type="area"
        height="100%"
        width="100%"
        :options="chartOptions"
        :series="chartData"
      />
    </div>

    <RangeControls v-model="selectedPeriod" :isLoading="isLoading" />
  </div>
</template>
