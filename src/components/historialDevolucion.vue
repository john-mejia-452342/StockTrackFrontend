<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { useStoreProductos } from '../stores/productos';

const rows = ref([]);
const useProductos = useStoreProductos();
const loadingTable = ref(false);
const filter = ref("");

async function getInfo() {
    try {
        loadingTable.value = true

        const response = await useProductos.getAll()
        console.log(response);

        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rows.value = response

    } catch (error) {
        console.log(error);
    }
    finally {
        loadingTable.value = false
    }
}
getInfo()

const columns = ref([
    {
        name: 'numdevolucion',
        label: 'Número de devolucion',
        align: 'center',
        field: 'numdevolucion'
    },
    {
        name: 'producto',
        label: 'Producto',
        align: 'center',
        field: 'producto'
    },
    {
        name: 'cantidad',
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad'
    },
    {
        name: 'tipodevolucion',
        label: 'Tipo Devolución',
        align: 'center',
        field: 'tipodevolucion'
    },
    {
        name: 'fechadevolucion',
        label: 'Fecha Devolucion',
        align: 'center',
        field: 'fechadevolucion',
    },
    {
        name: 'estado',
        label: 'Estado',
        align: 'center',
        field: 'estado'
    },
]);


function volver(){
  router.push('/')
}
</script>


<template>
    <main>
        <section id="primeraseccion">
            <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
                :filter="filter" rows-per-page-label="Visualización de filas" page="2" id="tabla"
                :rows-per-page-options="[10, 20, 40, 0]" no-results-label="No hay resultados para la búsqueda."
                wrap-cells="false" label="Productos" no-data-label="No hay productos registrados.">
                <template v-slot:top-left>
                    <h4 id="titleTable">Historial de Devolución</h4>
                </template>
                <template v-slot:top-right>
                    <q-input outlined dense debounce="300" color="primary" v-model="filter" class="buscar"
                        placeholder="Buscar cualquier campo" id="boxBuscar">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
            </q-table>
        </section>

        <section id="segundaseccion">
            <q-btn type="submit" @click="volver()" id="button" bg-color="primary" class="text-h6">Cerrar</q-btn>
        </section>
       

    </main>
</template>

<style scoped>
main {
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}

#primeraseccion {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#tabla{
    width: 70%;
}

#segundaseccion{
    width: 80%;
    display: flex;
    justify-content: flex-end;
}

#button{
    width: 8%;
    background-color: #39A900;
    color: white;
    border: none;
    height: 8%;
    border-radius: 10px;
    font-weight: bolder;
}


</style>