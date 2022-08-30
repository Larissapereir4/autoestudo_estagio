<template>
    <div class="">
      <!-- showcase -->
      <div
        :style="{
          backgroundImage: `url(${img})`,
          backgroundColor: `rgba(0, 0, 0, 0.8)`,
          backgroundBlendMode: `multiply`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          height: `70vh`,
        }"
        class="w-screen flex items-center relative"
        ref="showcase"
      >
        <div class="w-1/2 p-5">
          <h1 class="text-6xl text-white mb-3 uppercase font-bold my-auto">
            {{ event.attributes.name }}
          </h1>
          <p class="leading-normal text-lg font-thin text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit natus
            illum cupiditate qui, asperiores quod sapiente. A exercitationem
            quidem cupiditate repudiandae, odio sequi quae nam ipsam obcaecati
            itaque, suscipit dolores.
          </p>
        </div>
      </div>
  
      <div class="text-center flex justify-center items-center">
        <div class="mt-3 mb-3">
          <h3 class="text-4xl mt-5 mb-5">Obter Ingressos</h3>
  
          <table class="table-auto w-screen">
            <thead>
              <tr>
                <th class="w-1/2">Opções</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="p-3">
                <td class="p-3">Assentos sem pipoca e bebidas</td>
                <td class="p-3">${{ formatCurrency(price_of_seats_without) }}</td>
                <td class="p-3">
                  <select class="p-3" id="" v-model="no_of_seats_without">
                    <option
                      class="p-3 bg-dark"
                      v-for="(num, i) of quantityModel"
                      :key="i"
                      :value="`${num}`"
                    >
                      {{ num }}
                    </option>
                  </select>
                </td>
                <td>${{ formatCurrency(calcWithoutTotal) }}</td>
              </tr>
  
              <tr class="p-3">
                <td class="p-3">Assentos com pipoca e bebidas</td>
                <td class="p-3">${{ formatCurrency(price_of_seats_with) }}</td>
                <td class="p-3">
                  <select class="p-3" id="" v-model="no_of_seats_with">
                    <option
                      class="p-3 bg-black"
                      v-for="(num, i) of quantityModel"
                      :key="i"
                      :value="`${num}`"
                    >
                      {{ num }}
                    </option>
                  </select>
                </td>
                <td>${{ formatCurrency(calcWithTotal) }}</td>
              </tr>
            </tbody>
          </table>
  
          <div class="m-3">
            <p class="mb-3">Total de Ingressos: ${{ formatCurrency(calcTotal) }}</p>
            <button
              @click="bookTicket"
              :disabled="calcTotal == 0"
              class="bg-black text-white p-3"
            >
              Agendar Agora
            </button>
          </div>
        </div>
      </div>
  
      <ticket
        :data="res"
        class="mx-auto h-full z-10 absolute top-0"
        v-if="booked == true"
      />
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import randomstring from "randomstring";
  import ticket from "../components/Ticket.vue";
  
  export default {
    data() {
      return {
        quantityModel: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        no_of_seats_without: 0,
        price_of_seats_without: 3,
        no_of_seats_with: 0,
        price_of_seats_with: 4,
        id: "",
        event: {},
        img: "",
        booked: false,
      };
    },
  
    components: {
      ticket,
    },
  
    methods: {
      getDetail() {
        console.log("btn clicked");
        this.$router.push("/");
      },
  
      assignValue(num) {
        console.log(num);
        this.no_of_seats_without = num;
      },
  
      async bookTicket() {
        console.log("booking ticket");
        console.log(this.booked, "booked");
        try {
  
          const res = await axios.post(`http://localhost:1337/api/tickets`, {
            data: {
              seats_with: this.no_of_seats_with,
              seats_without: this.no_of_seats_without,
              total_seats:
                parseInt(this.no_of_seats_without) +
                parseInt(this.no_of_seats_with),
              total: this.calcTotal,
              event: this.id,
              reference_number: randomstring.generate(),
            },
          });
  
          this.res = res.data;
          this.res.event = this.event.attributes.name;
          this.res.date = this.event.attributes.date;
          this.booked = true;
          this.no_of_seats_with = 0;
          this.no_of_seats_without = 0;
          
        } catch (error) {
          return alert(
            "Não foi possível agendar os ingressos, pois os ingressos disponíveis foram excedidos. Escolha um número de ingresso que seja  menor ou igual ao número de ingressos disponíveis"
          );
        }
      },
  
      formatCurrency(num) {
        if (num.toString().indexOf(".") != -1) {
          return num;
        } else {
          return `${num}.00`;
        }
      },
    },
  
    computed: {
      calcWithoutTotal() {
        return (
          parseFloat(this.no_of_seats_without) *
          parseFloat(this.price_of_seats_without)
        );
      },
  
      calcWithTotal() {
        return (
          parseFloat(this.no_of_seats_with) * parseFloat(this.price_of_seats_with)
        );
      },
  
      calcTotal() {
        return this.calcWithoutTotal + this.calcWithTotal;
      },
    },
  
    async created() {
      this.id = this.$route.params.id;
      try {
  
        const res = await axios.get(
          `http://localhost:1337/api/events/${this.$route.params.id}?populate=*`
        );
        this.event = res.data.data;
        this.price_of_seats_without = res.data.data.attributes.price;
        this.price_of_seats_with = res.data.data.attributes.price + 2;
        const img =
          res.data.data.attributes.image.data.attributes.formats.large.url;
        this.img = `"http://localhost:1337${img}"`;
        
      } catch (error) {
        return alert('Um erro ocorreu, por favor tente novamente')
      }
      
    },
  };
  </script>
  
  <style scoped></style>
  