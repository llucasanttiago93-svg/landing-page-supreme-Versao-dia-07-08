import { useEffect, useState } from "react";
import "./Checkout.css";

interface CheckoutProps {
  isOpen: boolean;
  quantity: 1 | 2;
  onClose: () => void;
}

interface ShippingOption {
  id: number;
  name: string;
  price: number;
  custom_price: number;
  delivery_time: number;
  custom_delivery_time: number;

  company: {
    id: number;
    name: string;
    picture: string;
  };
}

function Checkout({
  isOpen,
  quantity,
  onClose,
}: CheckoutProps) {

  const price = quantity === 1 ? 57 : 97;

  const productLabel =
    quantity === 1
      ? "Queridinho Supreme — 1 unidade"
      : "Queridinho Supreme — 2 unidades";

  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState("");

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  const [loadingShipping, setLoadingShipping] = useState(false);


  /* ========================= */
  /* BLOQUEAR SCROLL */
  /* ========================= */

  useEffect(() => {

    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };

  }, [isOpen]);


  /* ========================= */
  /* FORMATAR CEP */
  /* ========================= */

  const handleCepChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const value = event.target.value;

    const numbersOnly = value.replace(/\D/g, "");

    const limited = numbersOnly.slice(0, 8);

    const formatted =
      limited.length > 5
        ? `${limited.slice(0, 5)}-${limited.slice(5)}`
        : limited;

    setCep(formatted);

    if (cepError) {
      setCepError("");
    }

    // Se o usuário alterar o CEP,
    // apagamos a cotação anterior.
    setShippingOptions([]);
    setSelectedShipping(null);

  };


  /* ========================= */
  /* CALCULAR FRETE */
  /* ========================= */

  const handleCalculateShipping = async () => {

    const numbersOnly = cep.replace(/\D/g, "");

    if (numbersOnly.length !== 8) {

      setCepError(
        "Digite um CEP válido com 8 números."
      );

      return;
    }

    setCepError("");
    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {

      const response = await fetch(
        "http://localhost:3001/api/frete",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            cepDestino: numbersOnly,
            quantidade: quantity,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Não foi possível calcular o frete."
        );

      }


      // O Melhor Envio retorna uma lista
      // com as opções de transporte.
      const options: ShippingOption[] = data
        .filter(
          (option: ShippingOption) =>
            option.custom_price != null
        )
        .map(
          (option: ShippingOption) => ({
            ...option,
            custom_price: Number(option.custom_price),
          })
        );


      if (options.length === 0) {

        throw new Error(
          "Nenhuma opção de frete encontrada para este CEP."
        );

      }


      setShippingOptions(options);

    } catch (error) {

      console.error("Erro ao calcular frete:", error);

      setCepError(
        error instanceof Error
          ? error.message
          : "Erro ao calcular o frete."
      );

    } finally {

      setLoadingShipping(false);

    }

  };


  /* ========================= */
  /* CEP VÁLIDO */
  /* ========================= */

  const isCepValid =
    cep.replace(/\D/g, "").length === 8;


  /* ========================= */
  /* FRETE SELECIONADO */
  /* ========================= */

  const shippingPrice =
    selectedShipping
      ? selectedShipping.custom_price
      : 0;


  /* ========================= */
  /* TOTAL */
  /* ========================= */

  const total =
    price + shippingPrice;


  if (!isOpen) {
    return null;
  }


  return (

    <div
      className="checkout-overlay"
      onClick={onClose}
    >

      <div
        className="checkout-modal"
        onClick={(event) => event.stopPropagation()}
      >


        {/* ========================= */}
        {/* CABEÇALHO */}
        {/* ========================= */}

        <div className="checkout-header">

          <div>

            <p className="checkout-eyebrow">
              FINALIZAR PEDIDO
            </p>

            <h2>
              Seu pedido
            </h2>

          </div>

          <button
            type="button"
            className="checkout-close"
            onClick={onClose}
            aria-label="Fechar checkout"
          >
            ×
          </button>

        </div>


        {/* ========================= */}
        {/* PRODUTO */}
        {/* ========================= */}

        <div className="checkout-product">

          <img
            src={
              quantity === 1
                ? "/images/product-front.webp"
                : "/images/product-front-2un.webp"
            }
            alt={productLabel}
          />

          <div className="checkout-product-info">

            <h3>
              Queridinho Supreme
            </h3>

            <p>
              {quantity === 1
                ? "1 unidade"
                : "2 unidades"}
            </p>

            <strong>
              R$ {price.toFixed(2).replace(".", ",")}
            </strong>

          </div>

        </div>


        {/* ========================= */}
        {/* CEP */}
        {/* ========================= */}

        <div className="checkout-section">

          <label htmlFor="checkout-cep">
            CEP de entrega
          </label>

          <div className="checkout-cep">

            <input
              id="checkout-cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={cep}
              onChange={handleCepChange}
              maxLength={9}
              aria-invalid={cepError ? "true" : "false"}
            />

            <button
              type="button"
              className="checkout-calculate"
              onClick={handleCalculateShipping}
              disabled={loadingShipping}
            >
              {loadingShipping
                ? "Calculando..."
                : "Calcular frete"}
            </button>

          </div>


          {cepError ? (

            <p
              className="checkout-error"
            >
              {cepError}
            </p>

          ) : (

            <p className="checkout-helper">

              {isCepValid
                ? "CEP pronto para consultar o frete."
                : "O frete será calculado de acordo com seu endereço."}

            </p>

          )}

        </div>


        {/* ========================= */}
        {/* OPÇÕES DE FRETE */}
        {/* ========================= */}

        {shippingOptions.length > 0 && (

          <div className="checkout-shipping-options">

            <h3>
              Escolha a forma de entrega
            </h3>


            {shippingOptions.map((option) => (

              <button
                key={option.id}
                type="button"
                className={
                  `checkout-shipping-option ${selectedShipping?.id === option.id
                    ? "selected"
                    : ""
                  }`
                }
                onClick={() => setSelectedShipping(option)}
              >

                <div>

                  <strong>
                    {option.company.name}
                  </strong>

                  <span>
                    Entrega em até{" "}
                    {option.custom_delivery_time ||
                      option.delivery_time}{" "}
                    dias úteis
                  </span>

                </div>

                <strong>
                  R$ {option.custom_price
                    .toFixed(2)
                    .replace(".", ",")}
                </strong>

              </button>

            ))}

          </div>

        )}


        {/* ========================= */}
        {/* FRETE */}
        {/* ========================= */}

        <div className="checkout-shipping">

          <div>

            <span>
              Frete
            </span>

            <strong>

              {selectedShipping
                ? `R$ ${shippingPrice
                  .toFixed(2)
                  .replace(".", ",")}`
                : "—"}

            </strong>

          </div>

          <p>

            {selectedShipping
              ? selectedShipping.name
              : "Digite seu CEP para consultar as opções de envio."}

          </p>

        </div>


        {/* ========================= */}
        {/* RESUMO */}
        {/* ========================= */}

        <div className="checkout-summary">

          <div>

            <span>
              Produto
            </span>

            <strong>
              R$ {price.toFixed(2).replace(".", ",")}
            </strong>

          </div>


          <div>

            <span>
              Frete
            </span>

            <strong>

              {selectedShipping
                ? `R$ ${shippingPrice
                  .toFixed(2)
                  .replace(".", ",")}`
                : "—"}

            </strong>

          </div>


          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              R$ {total.toFixed(2).replace(".", ",")}
            </strong>

          </div>

        </div>


        {/* ========================= */}
        {/* BOTÃO */}
        {/* ========================= */}

        <button
          type="button"
          className="checkout-button"
          disabled={!selectedShipping}
        >

          {selectedShipping
            ? "Continuar para pagamento"
            : "Selecione o frete para continuar"}

        </button>


        {/* ========================= */}
        {/* SEGURANÇA */}
        {/* ========================= */}

        <div className="checkout-security">

          <span>
            🔒
          </span>

          <p>
            Compra segura e pagamento protegido.
          </p>

        </div>


      </div>

    </div>

  );

}

export default Checkout;