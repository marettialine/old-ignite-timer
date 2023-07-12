import { Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { History } from './pages/History'
import { DefaultLayout } from './layouts/DefaultLayout'

export function Router() {
  // O Route é de rotas encadeadas, então pra acessar o "/products" sempre terá que ter o "/admin" na frente
  // https:localhost:3000/admin/products

  /*
    <Route path="/admin" element={<DefaultLayout />}>
      <Route path="/products" element={<Home />} />
    </Route>
  */

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
