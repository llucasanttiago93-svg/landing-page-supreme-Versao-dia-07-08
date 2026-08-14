import { useState } from "react";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Solution from "./components/Solution/Solution";
import Fragrance from "./components/Fragrance/Fragrance";
import Ingredients from "./components/Ingredients/Ingredients";
import Results from "./components/Results/Results";
import HowTo from "./components/HowToUse/HowTo";
import Testimonials from "./components/Testimonials/Testimonials";
import Guarantee from "./components/Guarantee/Guarantee";
import Offer from "./components/Offer/Offer";
import Faq from "./components/FAQ/FAQ";
import Footer from "./components/Footer/Footer";
import Checkout from "./components/Checkout/Checkout";

function App() {

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [checkoutQuantity, setCheckoutQuantity] =
    useState<1 | 2>(1);


  const openCheckout = (quantity: 1 | 2) => {

    setCheckoutQuantity(quantity);

    setCheckoutOpen(true);

  };


  const closeCheckout = () => {

    setCheckoutOpen(false);

  };


  return (
    <>

      <Header />

      <Hero />

      <Testimonials />

      <Solution />

      <Fragrance />

      <Ingredients />

      <Results />

      <HowTo />

      <Guarantee />

      <Offer
        onBuy={openCheckout}
      />

      <Faq />

      <Footer />


      <Checkout
        isOpen={checkoutOpen}
        quantity={checkoutQuantity}
        onClose={closeCheckout}
      />

    </>
  );
}

export default App;