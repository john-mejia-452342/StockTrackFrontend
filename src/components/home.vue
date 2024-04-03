<script setup>
import { useStoreUsuarios } from '../stores/usuarios';
const useUsuario = useStoreUsuarios()
const rol = useUsuario.usuario.rol

</script>
<template>
    <div class="main">
        <div class="section">
            <h1>StockTrack</h1>
        </div>

        <div class="section">
            <h5>Lleva un seguimiento de tu inventario, controla la entrada y salida de los materiales de formación</h5>
        </div>

        <div class="section">
            <q-btn class="btn-administrar" color="green-7" text-color="white" :label="rol=='admin' ? 'Administrar' : 'Generar pedido'" :to="rol=='admin' ? '/fichas' : '/solicitar-pedido'"/>
            <q-btn class="btn-saber-mas" color="grey" label="Saber más" />
        </div>
    </div>
</template>


<style scoped>
.btn-administrar,
.btn-saber-mas {
    margin-right: 10px; 
    padding: 15px;
    border-radius: 10px;
}
.main{
    margin-left: 1%;
    margin-top: 7%;
}

.btn-administrar:hover{
    box-shadow: 2px 2px 2px 2px #4c7c26;
}
</style>