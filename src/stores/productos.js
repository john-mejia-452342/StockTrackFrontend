import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "./usuarios";

const modelo = "producto";

export const useStoreProductos = defineStore(modelo, () => {
  function insertarToken(){
    const useUsuario = useStoreUsuarios()

    axios.defaults.headers.common["x-token"] = useUsuario.token
  }

  const $q = useQuasar();
  const productos = ref([]);
  function notificar(tipo, msg) {
    $q.notify({
      type: tipo,
      message: msg,
      position: "top",
    });
  }

  const router = useRouter();
  function salir() {
    notificar("negative", "Por favor vuela a iniciar sesión");
    router.push("/");
  }

  const getAll = async () => {
    try {
      insertarToken()
      const response = await axios.get(`${modelo}/all`);
      console.log(response);
      productos.value = response.data;

      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  const getPorLote =async(idLote)=>{
    try {
      insertarToken()
      const response = await axios.get(`${modelo}/getPorLote/${idLote}`)
      console.log(response);

      return response.data
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  }

  const agregar = async (data) => {
    try {
      insertarToken()
      const response = await axios.post(`${modelo}/agregar`, data);
      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        notificar("negative", "Por favor vuelva a iniciar sesión");
        router.push("/");
        return null;
      }
      return error.response.data;
    }
  };

  const editar = async (id, data) => {
    try {
      insertarToken()
      const response = await axios.put(`${modelo}/editar/${id}`, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }

      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  const activar = async (id) => {
    try {
      insertarToken()
      const response = await axios.put(`${modelo}/activar/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("Sin conexión, por favor intente recargar");
        return null;
      }

      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  const inactivar = async (id) => {
    try {
      insertarToken()
      const response = await axios.put(`${modelo}/inactivar/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("Sin conexión, por favor intente recargar");
        return null;
      }

      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  return { getAll, getPorLote, agregar, editar, activar, inactivar, productos };
});
