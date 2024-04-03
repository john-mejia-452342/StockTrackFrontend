<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { useStorePedidos } from '../stores/pedido.js';
import { useStoreDetallePedido } from '../stores/detallePedido.js'
import { format } from "date-fns";
import { useRouter } from 'vue-router';
import logoSena from '../assets/logoSena.png'

const rows = ref([]);
const rowsdetails = ref([]);
const usePedidos = useStorePedidos();
const useDetallePedidos = useStoreDetallePedido();
const pedidoSeleccionado = ref(null);
const loadingTable = ref(false);
const filter = ref("");
const modal = ref(false);
const $q = useQuasar();
const subTotal = ref();
const iva = ref();
const router = useRouter();

function notificar(tipo, msg, posicion = "top") {
    $q.notify({
        type: tipo,
        message: msg,
        position: posicion,
    });
}



const columns = ref([
    {
        name: 'numpedido',
        label: 'Nro pedido',
        align: 'center',
        field: 'numero'
    },
    {
        name: 'ficha',
        label: 'Ficha',
        align: "center",
        field: (row) => row.idFicha.codigo
    },
    {
        name: 'fechapedido',
        label: 'Fecha Creación',
        align: "center",
        field: (row) => `${format(new Date(row.createAT), "yyyy-MM-dd")}`
    },
    {
        name: 'Estado',
        label: 'Estado',
        align: 'center',
        field: (row) => row.estado ? 'Aprobado' : 'En revisión'
    },
    {
        name: 'Entregado',
        label: 'Entregado',
        align: 'center',
        field: (row) => row.entregado ? 'Sí' : 'No',
    },
    {
        name: "opciones",
        label: "Opciones",
        field: (row) => null, sortable: false,
        align: "center"
    },
]);

const columnsdetails = ref([
    // {
    //     name: 'numProducto',
    //     label: 'Nro',
    //     align: 'center',
    //     field: 'numero'
    // },
    {
        name: 'codigo',
        label: 'Item',
        align: 'center',
        field: (row) => row.idProducto.codigo
    },
    {
        name: 'producto',
        label: 'Producto',
        align: "center",
        field: (row) => row.idProducto.nombre
    },
    {
        name: 'descripcion',
        label: 'Descripción',
        align: 'center',
        field: (row) => row.idProducto.descripcion
        ,
    },
    {
        name: 'cantidad',
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
    },
    {
        name: 'unidadmedida',
        label: 'Unidad de Medida',
        align: 'center',
        field: (row) => row.idProducto.unidadMedida
    },
]);

async function getInfo() {
    try {
        loadingTable.value = true
        const response = await usePedidos.getAll()
        console.log("Hola soy pedidos", response);

        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rows.value = response.reverse()

    } catch (error) {
        console.log(error);
    }
    finally {
        loadingTable.value = false
    }
}
getInfo()


function verDetallesPedido(idPedido) {
    rowsdetails.value = []
    modal.value = true;
    obtenerDetallePedido(idPedido);
    pedidoSeleccionado.value = rows.value.find(pedido => pedido._id === idPedido);
}

async function obtenerDetallePedido(idPedido) {
    try {
        const response = await useDetallePedidos.getPorPedido(idPedido);
        console.log("Hola soy detalle pedido", response);

        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rowsdetails.value = response
        if (!response) return;

        if (response.error) {
            notificar("negative", response.error);
            return;
        }
    } catch (error) {
        console.log(error);
    }
}

function formatearFecha(fecha) {
    return fecha ? format(new Date(fecha), 'yyyy-MM-dd HH:mm') : '';
}

function realizarPedido() {
    router.push('/solicitar-pedido')
}


</script>


<template>
    <main>
        <q-dialog v-model="modal">
            <q-card class="modal">
                <q-card-section class="q-gutter-md">
                    <q-form class="q-gutter-md">
                        <div class="row justify-center items-center" style="width: 100%;">
                            <div>
                                <img :src="logoSena" alt="Imagen" class="img1">
                                
                            </div>
                            <div  class="title-modal">
                                <h3 class="title-details">Servicio Nacional de Aprendizaje</h3>
                                <q-card-actions  class="q-gutter-md row  justify-end">
                                <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                            </q-card-actions>
                            </div>
                           
                        </div>

                        <div style="display: flex; flex-wrap: wrap;" id="container-details">
                            <div style="flex: 1; margin-right: 20px; margin-left: 5%;">
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Número pedido: </p>
                                    <p class="text-h5">{{ pedidoSeleccionado ? pedidoSeleccionado.numero : '' }}</p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Instructor: </p>
                                    <p class="text-h5" id="text">{{ pedidoSeleccionado ?
                                        pedidoSeleccionado.idInstructorEncargado.nombre : '' }}</p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Código Ficha: </p>
                                    <p class="text-h5" id="text">{{ pedidoSeleccionado ? pedidoSeleccionado.idFicha.codigo :
                                        '' }}</p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Ficha: </p>
                                    <p class="text-h5" id="text">{{ pedidoSeleccionado ? pedidoSeleccionado.idFicha.nombre :
                                        '' }}</p>
                                </div>
                            </div>
                            <div style="flex: 1;">
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Estado: </p>
                                    <p class="text-h5" id="text">{{ pedidoSeleccionado ? (pedidoSeleccionado.estado ?
                                        'Aprobado' : 'En revisión') : '' }}
                                    </p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Entregado: </p>
                                    <p class="text-h5" id="text">{{ pedidoSeleccionado ? (pedidoSeleccionado.entregado ?
                                        'Sí' : 'No') : '' }}</p>
                                </div>

                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Fecha Creación: </p>
                                    <p class="text-h5" id="text">{{ pedidoSeleccionado ?
                                        formatearFecha(pedidoSeleccionado.createAT) : '' }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="q-pa-sm" style="flex-basis: 100%;">
                            <q-table flat bordered :rows="rowsdetails" :columns="columnsdetails" row-key="name" hide-bottom
                                class="table-details">
                            </q-table>
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>



        <section id="primeraseccion">
            <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
                :filter="filter" rows-per-page-label="Visualización de filas" page="2" id="tabla"
                :rows-per-page-options="[10, 20, 40, 0]" no-results-label="No hay resultados para la búsqueda."
                wrap-cells="false" label="Productos" no-data-label="No hay productos registrados.">
                <template v-slot:top-left>
                    <div style=" display: flex; gap: 10px;">
                        <h4 id="titleTable">Pedidos</h4>
                        <q-btn @click="realizarPedido()" color="primary">
                            <q-icon name="add" color="white" center />
                        </q-btn>
                    </div>

                </template>
                <template v-slot:top-right>
                    <q-input outlined dense debounce="300" color="primary" v-model="filter" class="buscar"
                        placeholder="Buscar cualquier campo" id="boxBuscar">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn @click="verDetallesPedido(props.row._id)" icon="description" color="secondary">  </q-btn>
                    </q-td>
                </template>
            </q-table>
        </section>
    </main>
</template>

<style scoped>
main {
    width: 100%;
}

#primeraseccion {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#tabla {
    width: 90%;
}

#segundaseccion {
    width: 80%;
    display: flex;
    justify-content: flex-end;
}

#button {
    width: 8%;
    background-color: #39A900;
    color: white;
    border: none;
    height: 8%;
    border-radius: 10px;
    font-weight: bolder;
}

#titleTable {
    margin: auto;
}

.editBtn {
    width: 55px;
    height: 55px;
    border-radius: 20px;
    border: none;
    background-color: #39A900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.123);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    margin: 0 auto;
}

.editBtn::before {
    content: "";
    width: 200%;
    height: 200%;
    background-color: #39A900;
    position: absolute;
    z-index: 1;
    transform: scale(0);
    transition: all 0.3s;
    border-radius: 50%;
    filter: blur(10px);
}

.editBtn:hover::before {
    transform: scale(1);
}

.editBtn:hover {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.336);
}

.editBtn svg {
    height: 17px;
    fill: white;
    z-index: 3;
    transition: all 0.2s;
    transform-origin: bottom;
}
.title-modal{
    width: 85%;
    display: flex;
    justify-content: space-between;
}
.editBtn:hover svg {
    transform: rotate(-15deg) translateX(5px);
}

.editBtn::after {
    content: "";
    width: 25px;
    height: 1.5px;
    position: absolute;
    bottom: 19px;
    left: -5px;
    background-color: white;
    border-radius: 2px;
    z-index: 2;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease-out;
}

.editBtn:hover::after {
    transform: scaleX(1);
    left: 0px;
    transform-origin: right;
}

.modal {
    max-width: 95%;
    width: 100%;
    max-height: 95%;
    height: auto;
}



.text {
    display: flex;
    align-items: center;
}

#text {
    margin-left: 12px;
}

.img1 {
    border-radius: 50%;
    max-width: 175px;
}

#container-details {
    width: 98%;
    padding: 20px;
    display: flex;
    border: 3px solid black;
}

.table-details {
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.table-details thead {
    background-color: #f2f2f2;
}

.table-details th {
    font-weight: bold;
    text-align: center;
}

.table-details td,
.table-details th {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.table-details td:last-child,
.table-details th:last-child {
    border-right: none;
}

.table-details th {
    font-size: 14px;
}

::-webkit-scrollbar {
  width: 10px; 
}

::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

::-webkit-scrollbar-thumb {
  background: #888; 
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}


</style>