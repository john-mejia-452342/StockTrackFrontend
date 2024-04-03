<script setup>
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';
import { useStoreProductos } from '../stores/productos.js';

const useProductos = useStoreProductos()
const producto = ref();
const cantidad = ref();
const tipoDevolucion = ref();
const dataProductos = ref([]);
const opcionesTipoOriginal  = ref([
  "Por uso", "Mal estado"
]);
const opcionesTipo = ref([]);






const getFilteredProducts = (dataProductos) => {
  const productsOptions = dataProductos.map((c) => {
    return {
      label: c.estado === false ? `${c.nombre} - No disponible` : c.nombre,
      value: c,
      disable: c.estado === false,
    };
  });
  return productsOptions;
};

const filtrarProductos = (val, update) => {
  if (val === '') {
    update(() => {
      dataProductos.value = useProductos.productos;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    dataProductos.value = dataProductos.value.filter(c => c.nombre.toLowerCase().includes(needle));
  });
  return;
};

const getFilteredTypes = () => opcionesTipo.value;

const filtrarTipos = (val, update) => {
  if (val === '') {
    update(() => {
      opcionesTipo.value = opcionesTipoOriginal.value.slice(); 
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesTipo.value = opcionesTipoOriginal.value.filter(c => c.toLowerCase().includes(needle));
  });
  return;
};




async function getInfo() {
  try {
    const response = await useProductos.getAll()
    console.log(response);
    if (!response) return;
    if (response.error) {
      notificar('negative', response.error)
      return
    }
    dataProductos.value = response
  } catch (error) {
    console.log(error);
  }
}
getInfo()

</script>

<template>
  <main>
    <section id="first-section">
      <article>
        <p class="text-h3">Solicitud de Devolución</p>
      </article>
    </section>

    <section id="second-section">
      <article style="width: 50%;">
        <p class="text-h4">Producto</p>
        <q-select outlined v-model="producto" clearable use-input hide-selected fill-input input-debounce="0"
          label="Seleccione el producto" :options="getFilteredProducts(dataProductos)" style="width: 100%; background-color: rgb(217, 250, 252)"
          @filter="filtrarProductos">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se encontraron resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </article>

      <article style="width: 50%;">
        <p class="text-h4">Cantidad</p>
        <q-input outlined v-model="cantidad" lazy-rules type="number" color="dark" label="Digite la cantidad" id="inputcantidad" hide-bottom-space
          :rules="[val => val && val.length > 0 || 'Por favor ingrese una cantidad', val => val > 0 || 'Por favor ingrese una cantidad mayor a 0' ]"
          style="background: rgb(217, 250, 252)"/>
      </article>

      <article style="width: 50%;">
        <p class="text-h4">Tipo de Devolución</p>
        <q-select outlined v-model="tipoDevolucion" clearable use-input hide-selected fill-input input-debounce="0"
          label="Seleccione el producto" :options="getFilteredTypes()" style="background-color: rgb(217, 250, 252);"
          @filter="filtrarTipos">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se encontraron resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </article>

    </section>
    <q-btn class="enviar">Enviar</q-btn>

  </main>
</template>

<style scoped>

main{
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}


#first-section{
  width: 100%;
  display: flex;
  justify-content: center;
}

#second-section{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;

}

.enviar {
    width: 10%;
    background-color: #39A900;
    color: white;
    border: none;
    height: 10%;
    border-radius: 10px;
    font-size: 15px;
    font-weight: bolder;
}
/* Posible solucion q-input cantidad */
/* ::v-deep .q-field__bottom {
  background-color: #ffffff;
  padding: 10px;
} */


</style>