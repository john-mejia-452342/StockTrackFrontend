<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStoreUsuarios } from "../stores/usuarios.js";
import VerificarCodigo from "./validarCodigo.vue";
import Cookies from 'js-cookie'
import logoSena from '../assets/logoSena.png'
import { useRouter } from 'vue-router';

// Alertas notify
const $q = useQuasar();
const router = useRouter();
const loadingCorreo = ref(false);
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

const email = ref("");
const componenteVerificar = ref(false);

const correoValido = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
};

function validarCampo() {

  if (correoValido()) {
    enviarCodigo();

  }
}

const useUsuario = useStoreUsuarios();

async function enviarCodigo() {
  loadingCorreo.value = true;
  try {
    const response = await useUsuario.codigoRecuperar(email.value);
    console.log(response);
    loadingCorreo.value = false;
    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    Cookies.set('correo', email.value, { expires: 1 })
    componenteVerificar.value = true;
  } catch (error) {
    console.log(error);
  }
}

function home() {
  router.push('/')
}
</script>

<template>
  <main>
    <section v-if="!componenteVerificar">
      <article id="image">
        <img :src="logoSena" alt="" @click="home" style="max-width: 145px;cursor: pointer;" />
      </article>

      <article id="text">
        <p id="message">
          Por favor, digite su correo para el proceso de recuperación de
          contraseña.
        </p>
        <div class="prueba">
          
          <div id="text2">
            <div >
              <h3>Correo electrónico</h3>
            </div>

            <div id="text3">
              <q-form @submit="validarCampo" id="inputcorreo" class="correo">
                <q-input class="inputcorreo" outlined v-model="email" lazy-rules hide-bottom-space color="dark"
                  bg-color="white" :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Por favor ingrese su correo',
                    (val) =>
                      (val && correoValido()) ||
                      'Por favor ingrese un correo valido',
                  ]" />

                <div style="margin-top: 20px;">
                  <q-btn id="buttonpassword" type="submit" class="bg-primary" :loading="loadingCorreo">Recuperar contraseña</q-btn>
                </div>
              </q-form>
            </div>

          </div>

        </div>

      </article>
    </section>

    <VerificarCodigo v-if="componenteVerificar" />

  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(../assets/fondo.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

section {
  width: 100%;
  height: 100%;
}

#image {
  display: flex;
  width: 100%;
  padding: 15px;
  text-align: center;
}

#text {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100vh;
  width: 100%;
}

.prueba {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  box-shadow: 25px 20px 5px #888888;
  width: 80%;
  max-width: 600px;
  height: 38vh;
  max-height: 50vh;
  margin: 20px;
  gap: 20px;
}

#text2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7%;
  height: 100%;
}

#text3 {
  gap: 20px;
  width: 100%;
}

#message {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  font-size: 2rem;
}

#inputcorreo {
  width: 100%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.inputcorreo {
  width: 100%;
  font-size: 130%;
}

#buttonpassword {
  color: white;
  font-weight: bolder;
  font-size: 1.3rem;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
}


@media screen and (min-width: 471px) and (max-width: 600px) {
  .prueba {
    width: 90%;
  }

  #message {
    font-size: 1.5rem;
  }

  #buttonpassword {
    font-size: 1.2rem;
  }


}

@media screen and (max-width: 470px) and (min-width: 100px) {
  #image{
    display: flex;
    justify-content: center;
  }
  
  .prueba {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 90%;
    height: 100vh;
    box-shadow: none;
  }
  .correo{
    max-width: 90%;
    margin-left: 15px
  }

  #message {
    font-size: 1.4rem;
  }

  #buttonpassword {
    font-size: 1rem;
    width: 80%;
  }
} 

@media screen and (max-height: 850px){

  .prueba {
    height: 48vh;
  }

} 



</style>