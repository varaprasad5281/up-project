import { Route, Routes } from "react-router-dom"
import { Root, Homepage, District, Admin, PageNotFound } from './Routes'

function App() {

  return (
    <>
     <Routes>
        <Route path="/" element={<Root />}>
          <Route path="" element={<Homepage />} />
          <Route path="admin" element={<Admin />} />
          <Route path="district/:districtId" element={<District />} />
        </Route>
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
