<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStoreUsuarios } from "../stores/usuarios.js";
import { useQuasar } from "quasar";

const useUsuario = useStoreUsuarios();
const router = useRouter();
const data = ref({});
const $q = useQuasar();

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

function validarCampos() {
  const arrData = Object.entries(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar("negative", "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === "string") {
      if (d[1].trim() === "") {
        notificar("negative", "Por favor complete todos los campos");
        return;
      }
    }
  }

  login();
}

const loadIngresar = ref(false);
async function login() {
  try {
    loadIngresar.value = true;
    const response = await useUsuario.login(data.value);
    console.log(response);

    if (!response) return;

    if (response.status != 200) {
      notificar("negative", response.error);
      return;
    }

    router.push("/nav");
  } catch (error) {
    console.log(error);
  } finally {
    loadIngresar.value = false;
  }
}

function limitarLongitud(input, maxLength) {
  if (data.value[input] > maxLength) {
    data.value[input] = data.value[input].slice(0, maxLength);
  }
}

const clicks = ref({
  password: true,
});

function olvidoPassword(){
  router.push('/recuperar-password')
}
</script>

<template>
  <main>
    <section id="container">
      <div class="form-container" >
        <p>Iniciar sesión</p>
        <q-form class="form" @submit="validarCampos">
          <label>Identificación</label>
          <q-input
            filled
            v-model="data.identificacion"
            label="Número de documento"
            lazy-rules
            mask="##########"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Por favor ingrese su documento',
              val => val.length>7 || 'Número de documento no válido'
            ]"
            :oninput="limitarLongitud('identificacion', 10)"
          >
            <template v-slot:error> Please use maximum 3 characters. </template>
          </q-input>
          <label>Contraseña</label>
          <q-input
            filled
            v-model="data.password"
            label="Ingrese su contraseña"
            lazy-rules
            :type="clicks.password ? 'password' : 'text'"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Por favor ingrese su contraseña',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="clicks.password ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="clicks.password = !clicks.password"
              />
            </template>
          </q-input>
          <q-btn type="submit" :loading="loadIngresar">Ingresar</q-btn>
        </q-form>
        <span id="olvidoPassword" @click="olvidoPassword">¿Olvidaste tu contraseña?</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
#container {
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("../assets/fondo.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

#olvidoPassword {
  margin-top: 15px;
  text-decoration: underline;
  color: #26A69A;
  cursor: pointer;
}

.form-container {
  width: 300px;
  background: linear-gradient(180deg, #2E7D32 18%, rgb(255, 255, 255) 10%);
  height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid rgb(96, 96, 96);
  box-shadow: 10px 10px 5px #888888;
  border-radius: 15px;
}

.form {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-top: 80px;
}

.form-container p {
  position: absolute;
  top: 5%;
  left: 10%;
  font-size: 30px;
  font-weight: 900;
  color: rgb(255, 255, 255);
}

.form-container label {
  color: rgb(40, 42, 44);
  margin-top: 15px;
  margin-bottom: 5px;
  font-size: 20px;
}

.form-container .input {
  padding: 10px;
  height: 35px;
  border: none;
  background-color: rgb(224, 231, 236);
}

.form-container .input:focus {
  outline: none;
}

.form-container button {
  border: none;
  height: 35px;
  margin-top: 30px;
  background-color: #2E7D32;
  color: white;
  font-size: 16px;
}
</style>
