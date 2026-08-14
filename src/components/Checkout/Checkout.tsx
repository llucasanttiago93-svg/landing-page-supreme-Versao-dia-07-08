import { useEffect } from "react";
import "./Checkout.css";

interface CheckoutProps {
  isOpen: boolean;
  quantity: 1 | 2;
  onClose: () => void;
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

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


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
              placeholder="00000-000"
              maxLength={9}
            />

            <button
              type="button"
              className="checkout-calculate"
            >
              Calcular frete
            </button>

          </div>

          <p className="checkout-helper">
            O frete será calculado de acordo com seu endereço.
          </p>

        </div>


        {/* ========================= */}
        {/* FRETE */}
        {/* ========================= */}

        <div className="checkout-shipping">

          <div>

            <span>
              Frete
            </span>

            <strong>
              —
            </strong>

          </div>

          <p>
            Digite seu CEP para consultar as opções de envio.
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
              —
            </strong>

          </div>

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              R$ {price.toFixed(2).replace(".", ",")}
            </strong>

          </div>

        </div>


        {/* ========================= */}
        {/* BOTÃO */}
        {/* ========================= */}

        <button
          type="button"
          className="checkout-button"
          disabled
        >
          Calcule o frete para continuar
        </button>


        {/* ========================= */}
        {/* SEGURANÇA */}
        {/* ========================= */}

        <div className="checkout-security">

          <span>🔒</span>

          <p>
            Compra segura e pagamento protegido.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Checkout;