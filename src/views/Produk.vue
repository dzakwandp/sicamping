<template lang="">
    <v-container>
    <v-card variant="outlined" color="brown" density="comfortable" class="card-border">
      <v-card-title class="text-center text-h4 mt-4">Daftar Barang</v-card-title>
      <v-card-text class="text-center text-body-1">Di Sistem Kantin Barokah</v-card-text>
      <v-card-text class="text-right">Ticking time</v-card-text>
    </v-card>
  </v-container>
  <EasyDataTable class="mx-12 text-body-1" :headers="headers" :items="items" theme-color="#009688" table-class-name="custom-table" alternating buttons-pagination>
  </EasyDataTable>
</template>
<script>
export default {
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  data: () => ({
    headers: [
      { text: "PLAYER", value: "player" },
      { text: "TEAM", value: "team" },
      { text: "NUMBER", value: "number" },
      { text: "POSITION", value: "position" },
      { text: "HEIGHT", value: "indicator.height" },
      { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
      { text: "LAST ATTENDED", value: "lastAttended", width: 200 },
      { text: "COUNTRY", value: "country" },
    ],
    items: [
      { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
      { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: { "height": '6-9', "weight": 250 }, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA" },
      { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: { "height": '6-10', "weight": 240 }, lastAttended: "Texas-Austin", country: "USA" },
      { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: { "height": '6-11', "weight": 242 }, lastAttended: "Filathlitikos", country: "Greece" },
    ],
  }),
}
</script>
<style lang="">
    
</style>

<style>
.card-border {
  border-width: 3px;
}

.custom-table {
  --easy-table-footer-font-size: 14px;
  --easy-table-body-row-font-size: 14px;
}
</style>