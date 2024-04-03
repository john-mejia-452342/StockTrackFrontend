<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUsuarios } from '../stores/usuarios';
import { useQuasar } from "quasar";

const $q = useQuasar();

const router = useRouter();

const storeUsuarios = useStoreUsuarios();
const userData = ref({...storeUsuarios.usuario});
const isLoading = ref(false); 

function guardarCambios() {
    isLoading.value = true;
    storeUsuarios.editar(userData.value._id, userData.value)
        .then((res) => {
            $q.notify({
                color: 'positive',
                message: 'Cambios guardados correctamente',
                position: 'top'
            });
            storeUsuarios.usuario=res
        })
        .catch((error) => {
            $q.notify({
                color: 'negative',
                message: `Error al guardar cambios: ${error.message}`,
                position: 'top'
            });
        })
        .finally(() => {
            isLoading.value = false;
        });
}

function cambiarContraseña() {
    router.push('/nueva-password');
}
</script>

<template>
    <q-card class="profile-card">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <h4>Editar Perfil</h4>
            <q-input v-model="userData.nombre" label="Nombre" readonly style="width: 300px;" />
            <q-input v-model="userData.apellido" label="Apellido" readonly style="width: 300px;" />
            <q-input v-model="userData.identificacion" label="Identificación" readonly style="width: 300px;"/>
            <q-input v-model="userData.correo" label="Correo" style="width: 300px;" />
            <q-input v-model="userData.telefono" label="Teléfono" style="width: 300px;" />
            <q-btn @click="guardarCambios" style="margin-top: 20px;">
                <q-spinner-hourglass v-if="isLoading" /> Guardar cambios
            </q-btn>
            <q-btn @click="cambiarContraseña" style="margin-top: 20px;">Cambiar Contraseña</q-btn>
        </div>
    </q-card>
</template>


<style scoped>
q-input[readonly] {
    background-color: #f9f9f9;
    color: #333;
    cursor: not-allowed;
}
.profile-card {
    width: 400px;
    margin: 0 auto; 
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
