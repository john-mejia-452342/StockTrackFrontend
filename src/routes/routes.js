import {createRouter, createWebHashHistory} from 'vue-router'
import Nav from '../components/nav.vue'
import Home from '../components/home.vue'
import Ficha from '../components/ficha.vue'
import Cuentas from '../components/registro.vue'
import Login from '../components/login.vue'
import NuevaContra from '../components/nuevaContraseña.vue'
import recuperarContra from '../components/recuperarContraseña.vue'
import solicitar from '../components/solicitarPedido.vue'
import solicitarSalida from '../components/solicitarSalida.vue'
import GestionProductos from '../components/gestionProductos.vue'
import entrada from '../components/entrada.vue'
import Lote from '../components/lote.vue'
import Dependencia from '../components/dependencia.vue'
import Area from '../components/area.vue'
import formatoDevolucion from '../components/formatoDevoluciones.vue'
import historial from '../components/historialDevolucion.vue'
import historialPedido from '../components/historialPedido.vue'
import distribucionDependencia from '../components/distribucionDependencia.vue';
import distribucionDependenciaRed from '../components/distribucionDependenciaRed.vue';
import editarPerfil from '../components/editarPerfil.vue';
import {useStoreUsuarios} from '../stores/usuarios.js'

const checkAuth = () => {
  const useUsuario = useStoreUsuarios()

  const token = useUsuario.token

  if (!token) return false
  return true
};

const auth = (to, from, next) => {
  console.log(to);
  if (checkAuth()) {
      const useUsuario = useStoreUsuarios()
      const rol = useUsuario.usuario.rol
      console.log(rol);
      if (!to.meta.rol.includes(rol)) {
          return next({ path: '/' })
      }
      next()
  } else {
      return next({ path: '/' })
  }
}

const routes = [
  { path: '/', component: Login},
  { path: '/recuperar-password', component: recuperarContra},
  { path: '/nav', component: Nav, children:[
    { path:'/nav', redirect:'/home'},
    { path: '/home', beforeEnter: auth, meta: {rol: ['admin', 'instructor', 'bodega']}, component: Home },
    { path: '/fichas', beforeEnter: auth, meta: {rol: ['admin']}, component: Ficha},
    { path: '/cuentas', beforeEnter: auth, meta: {rol: ['admin']}, component: Cuentas},
    { path: '/nueva-password', beforeEnter: auth, meta: {rol: ['admin', 'instructor', 'bodega']}, component: NuevaContra},
    { path: '/solicitar-pedido', beforeEnter: auth, meta: {rol: ['instructor', 'bodega']}, component: solicitar},
    { path: '/solicitar-salida', beforeEnter: auth, meta: {rol: ['admin', 'bodega']}, component: solicitar},
    { path: '/productos', beforeEnter: auth, meta: {rol: ['admin', 'bodega']}, component: GestionProductos},
    { path: '/entrada', beforeEnter: auth, meta: {rol: ['admin', 'bodega']}, component: entrada},
    { path: '/lotes', beforeEnter: auth, meta: {rol: ['admin', 'bodega']}, component: Lote},
    { path: '/lotes/:idDistribucion', name: 'LoteConID', beforeEnter: auth, meta: {rol: ['admin', 'bodega']}, component: Lote},
    { path: '/dependencia', beforeEnter: auth, meta: {rol: ['admin']}, component: Dependencia},
    { path: '/areas', beforeEnter: auth, meta: {rol: ['admin']}, component: Area},
    { path: '/formato-devolucion', beforeEnter: auth, meta: {rol: ['bodega']}, component: formatoDevolucion},
    { path: '/historial', beforeEnter: auth, meta: {rol: ['admin', 'instructor', 'bodega']}, component: historial},
    { path: '/historial-pedido', beforeEnter: auth, meta: {rol: ['admin', 'instructor', 'bodega']}, component: historialPedido},
    { path: '/distribucion-dependencia/:idDependencia', beforeEnter: auth, meta: {rol: ['admin']}, name: 'Dependencia con ID', component: distribucionDependencia, props: true },
    { path: '/distribucion-dependencia-red', beforeEnter: auth, meta: {rol: ['admin']}, component: distribucionDependenciaRed},
    { path: '/distribucion-dependencia-red/:idDistribucionDependencia', beforeEnter: auth, meta: {rol: ['admin']}, name: 'FichasConID', component: distribucionDependenciaRed, props:true},
    { path: '/editar-perfil', beforeEnter: auth, meta: {rol: ['admin', 'instructor', 'bodega']}, component: editarPerfil}
  ]}
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})