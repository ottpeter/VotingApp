import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
declare let window: any;


/** 
 * This is a component that will load the nav and the footer, and in between the content inside <main> 
 * (this is what React Router considers root)
 * */
export default function AppRoot() {

  // Switch network if we are not on Sepoliass
  useEffect(() => {
    const switchToSepolia = async () => {
      const networkId = "0xaa36a7";   // Sepolia
      if (window.ethereum) {
        if (window.ethereum.networkVersion != 11155111) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: networkId }],
            });
            window.location.reload();
          } catch (error) {
            console.error("Error switching network:", error);
            toast.error("Error switching network. This app only works on the Sepolia test network.");
          }
        }
      } else {
        toast.error("Can not connect to MetaMask");
      } 
    }

    switchToSepolia();
  }, []);

  

  return(
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />

      <ToastContainer />
    </>
  );
}