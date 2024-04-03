<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Agregar esta línea
import helpersGenerales from '../helpers/generales.js'
import { useStoreUsuarios } from '../stores/usuarios';
import logoSena from '../assets/logoSena.png'

const profileDialog = ref(false);
const router = useRouter(); // Agregar esta línea

const showProfileDialog = () => {
  profileDialog.value = true;
};

const editProfile = () => {
};

const logout = () => {
};

const closeProfileDialog = () => {
  profileDialog.value = false;
};
const useUsuario = useStoreUsuarios()
const usuario = useUsuario.usuario
const rol = usuario.rol

//Editar Perfil
function Perfil() {
  router.push('/editar-perfil')
  profileDialog.value = false;
}

function cerrarSesion() {
  useUsuario.token = ''
  useUsuario.usuario = ''
  useUsuario.id = ''

  router.push('/')
}
const opciones = {
  admin: [
    { label: 'Administración General', o: ['fichas', 'lotes', 'areas', 'productos', 'cuentas'], e: ['Fichas', 'Lotes', 'Areas', 'Productos', 'Cuentas'] },
    // { label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: 'Formato de devolución' },
    // { label: 'Presupuestos', o: ['item', 'distribucion-item-lote', 'distribucion-lote-ficha'], e: ['Items', 'Item y lote', 'Lote y ficha'] },
    { label: 'Presupuestos', o: ['dependencia'], e: ['Dependencias'] },

  ],
  instructor: [
    // { label: 'Devoluciones', o: ['formato-devolucion', 'historial'], e: ['Formato de devolución', 'Historial'] },
    { label: 'Pedidos', o: ['solicitar-pedido', 'historial-pedido'], e: ['Generar Pedido', 'Historial'] },
  ],

  bodega: [
    // { label: 'Productos', o: ['registro-devoluciones', 'Historial'], e: ['Registro de devolución', 'Historial'] },
    { label: 'Pedidos', o: ['historial', 'listado'] },
  ]
}

const mobile = window.innerWidth < 650
const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function irHome() {
  router.push('/home')
}
</script>
<template>
  <div class="stocktrackHome">
    <q-layout view="hHh lpR fFf">
      <nav class="header" v-if="!mobile">
        <div class="logo">
          <router-link to="/home" class="boton-home">
            <img :src="logoSena" alt="" srcset="" style="max-width: 100px;">
          </router-link>
        </div>

        <div class="spacer"></div>

        <q-btn-dropdown v-for="(opcion, index) in opciones[rol]" :key="index" class="menuDesplegable"
          :label="opcion.label" flat style="color: black; background: transparent;">
          <router-link v-for="(o, i) in opcion.o" :key="i" :to="'/' + o" class="items">
            <q-item>{{ opcion.e ? opcion.e[i] : helpersGenerales.primeraMayus(o) }}</q-item>
          </router-link>
        </q-btn-dropdown>

        <q-btn class="usuarioMenu" icon="person" style="color: black; background: #39A900;" @click="showProfileDialog" />

        <q-dialog v-model="profileDialog">
          <q-card>
            <q-card-section>
              <div style="display: flex; justify-content: flex-end;">
                <q-icon name="close" @click="closeProfileDialog" style="cursor: pointer;" />
              </div>
              <div
                style="display: flex; align-items: center; justify-content: center; flex-direction: column; margin-bottom: 10px;">
                <q-icon name="info" size="md" color="primary" />
                <p style="margin: 0 3px 0px">INFORMACIÓN DE USUARIO</p>
              </div>
              <div style="display: flex; align-items: center; justify-content: center;">
                <img :src="usuario.fotoPerfil ?? ''" alt="Foto de perfil"
                  style="width: 100px; height: 100px; border-radius: 50%;">
              </div>
              <div v-if="usuario">
                <p><q-icon name="person" size="25px" /> Nombre: {{ usuario.nombre }} {{ usuario.apellido }}</p>
                <p><q-icon name="email" size="25px" /> Correo: {{ usuario.correo }}</p>
                <p><q-icon name="phone" size="25px" /> Telefono: {{ usuario.telefono }}</p>
              </div>
              <q-btn label="Editar perfil" @click="Perfil" />
              <q-btn label="Cerrar sesión" @click="cerrarSesion" />
            </q-card-section>
          </q-card>
        </q-dialog>
      </nav>

      <div v-if="mobile">
        <q-header bordered class="bg-primary text-white">
          <q-toolbar>
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
            <q-toolbar-title>
              StockTrack
            </q-toolbar-title>
            <q-avatar to="/home" @click="irHome">
              <img :src="logoSena" alt="" srcset="" style="max-width: 100px;">
            </q-avatar>
          </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered show-if-above :width="200"
          :breakpoint="400">
          <q-scroll-area style="height: calc(100% - 175px); margin-top: 175px; border-right: 1px solid #ddd">
            <q-list padding>
              <q-expansion-item v-for="(opcion, index) in opciones[rol]" :key="index" expand-separator
                :label="opcion.label">
                <q-item clickable v-ripple v-for="(o, i) in opcion.o" :key="i" style="margin-left: 15px;" :to="'/' + o">
                  <q-item-section>
                    {{ opcion.e ? opcion.e[i] : helpersGenerales.primeraMayus(o) }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>
          </q-scroll-area>

          <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 175px">
            <div class="absolute-bottom bg-transparent">
              <q-avatar size="56px" class="q-mb-sm">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
              <div class="text-weight-bold">{{ usuario.nombre }} {{ usuario.apellido }}</div>
              <div>{{ helpersGenerales.primeraMayus(usuario.rol) }}</div>
              <q-btn @click="Perfil" color="secondary">
                <q-icon name="edit" size="25px" />
              </q-btn>
              <q-btn @click="cerrarSesion" color="secondary">
                <q-icon name="logout" size="25px" />
              </q-btn>

            </div>
          </q-img>
        </q-drawer>

      </div>

      <q-page-container>
        <router-view />
      </q-page-container>

    </q-layout>
  </div>
</template>


<style scoped>
.stocktrackHome {
  background-color: #ffffff;
}

.header {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: auto;
}

.spacer {
  flex: 1;
}

.usuarioMenu {
  margin-right: 3%;
}

.q-btn {
  margin-right: 10px;
}

.items {
  text-decoration: none;
  color: black
}
</style>
