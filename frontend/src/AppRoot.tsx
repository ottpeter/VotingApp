import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";


/** 
 * This is a component that will load the nav and the footer, and in between the content inside <main> 
 * (this is what React Router considers root)
 * */
export default function AppRoot() {
  return(
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}