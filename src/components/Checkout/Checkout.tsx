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
  /* =====================================================
     PRODUTO
  ===================================================== */

  const price = quantity === 1 ? 57 : 97;

  const productLabel =
    quantity === 1
      ? "Queridinho Supreme — 1 unidade"
      : "Queridinho Supreme — 2 unidades";


  /* =====================================================
     CEP / FRETE
  ===================================================== */

  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState("");

  const [shippingOptions, setShippingOptions] =
    useState<ShippingOption[]>([]);

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  const [loadingShipping, setLoadingShipping] =
    useState(false);


  /* =====================================================
     DADOS DO CLIENTE
  ===================================================== */

  const [customerName, setCustomerName] =
    useState("");

  const [customerCpf, setCustomerCpf] =
    useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");


  /* =====================================================
     ENDEREÇO
  ===================================================== */

  const [addressStreet, setAddressStreet] =
    useState("");

  const [addressNumber, setAddressNumber] =
    useState("");

  const [addressComplement, setAddressComplement] =
    useState("");

  const [addressNeighborhood, setAddressNeighborhood] =
    useState("");

  const [addressCity, setAddressCity] =
    useState("");

  const [addressState, setAddressState] =
    useState("");


  /* =====================================================
     BLOQUEAR SCROLL
  ===================================================== */

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  /* =====================================================
     FORMATAR CEP
  ===================================================== */

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


  /* =====================================================
     CALCULAR FRETE
  ===================================================== */

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
        "/api/frete",
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

      /*
       * O Melhor Envio retorna uma lista
       * com as opções de transporte.
       */

      const options: ShippingOption[] = data
        .filter(
          (option: ShippingOption) =>
            option.custom_price != null
        )
        .map(
          (option: ShippingOption) => ({
            ...option,
            custom_price: Number(
              option.custom_price
            ),
          })
        );

      if (options.length === 0) {
        throw new Error(
          "Nenhuma opção de frete encontrada para este CEP."
        );
      }

      setShippingOptions(options);

    } catch (error) {
      console.error(
        "Erro ao calcular frete:",
        error
      );

      setCepError(
        error instanceof Error
          ? error.message
          : "Erro ao calcular o frete."
      );

    } finally {
      setLoadingShipping(false);
    }
  };


  /* =====================================================
     CEP VÁLIDO
  ===================================================== */

  const isCepValid =
    cep.replace(/\D/g, "").length === 8;


  /* =====================================================
     FRETE SELECIONADO
  ===================================================== */

  const shippingPrice =
    selectedShipping
      ? selectedShipping.custom_price
      : 0;


  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
    price + shippingPrice;


  /* =====================================================
     FORMATAR CPF
  ===================================================== */

  const handleCpfChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numbersOnly =
      event.target.value.replace(/\D/g, "");

    const limited =
      numbersOnly.slice(0, 11);

    let formatted = limited;

    if (limited.length > 9) {
      formatted =
        `${limited.slice(0, 3)}.` +
        `${limited.slice(3, 6)}.` +
        `${limited.slice(6, 9)}-` +
        limited.slice(9);

    } else if (limited.length > 6) {
      formatted =
        `${limited.slice(0, 3)}.` +
        `${limited.slice(3, 6)}.` +
        limited.slice(6);

    } else if (limited.length > 3) {
      formatted =
        `${limited.slice(0, 3)}.` +
        limited.slice(3);
    }

    setCustomerCpf(formatted);
  };


  /* =====================================================
     DADOS DO CLIENTE VÁLIDOS
  ===================================================== */

  const customerDataValid =
    customerName.trim().length >= 3 &&
    customerCpf.replace(/\D/g, "").length === 11 &&
    customerEmail.includes("@") &&
    customerPhone.replace(/\D/g, "").length >= 10 &&
    addressStreet.trim().length >= 3 &&
    addressNumber.trim().length > 0 &&
    addressNeighborhood.trim().length >= 2 &&
    addressCity.trim().length >= 2 &&
    addressState.length === 2;


  /* =====================================================
     PODE CONTINUAR?
  ===================================================== */

  const canContinue =
    selectedShipping !== null &&
    customerDataValid;


  /* =====================================================
     BOTÃO DE PAGAMENTO
  ===================================================== */

  const handleContinuePayment = async () => {
    if (!canContinue || !selectedShipping) {
      return;
    }

    try {
      const response = await fetch(
        "/api/pagamento",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            quantidade: quantity,

            frete: shippingPrice,

            cliente: {
              nome: customerName,
              cpf: customerCpf,
              email: customerEmail,
              telefone: customerPhone,
            },

            endereco: {
              cep: cep.replace(/\D/g, ""),
              rua: addressStreet,
              numero: addressNumber,
              complemento: addressComplement,
              bairro: addressNeighborhood,
              cidade: addressCity,
              estado: addressState,
            },

            freteDetalhes: {
              id: selectedShipping.id,
              empresa:
                selectedShipping.company.name,
              nome: selectedShipping.name,
              valor: shippingPrice,
              prazo:
                selectedShipping.custom_delivery_time ||
                selectedShipping.delivery_time,
            },
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Resposta do pagamento:",
        data
      );

      if (
        !response.ok ||
        !data?.success ||
        !data?.url
      ) {
        throw new Error(
          data?.error ||
            "Não foi possível criar o checkout."
        );
      }

      /*
       * Redireciona o cliente para
       * o checkout da InfinitePay.
       */

      window.location.href = data.url;

    } catch (error) {
      console.error(
        "Erro ao criar pagamento:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o pagamento."
      );
    }
  };


  /* =====================================================
     NÃO MOSTRAR
  ===================================================== */

  if (!isOpen) {
    return null;
  }


  /* =====================================================
     INTERFACE
  ===================================================== */

  return (
    <div
      className="checkout-overlay"
      onClick={onClose}
    >

      <div
        className="checkout-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >


        {/* =====================================================
            CABEÇALHO
        ===================================================== */}

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


        {/* =====================================================
            PRODUTO
        ===================================================== */}

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
              R${" "}
              {price
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </div>

        </div>


        {/* =====================================================
            CEP
        ===================================================== */}

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
              aria-invalid={
                cepError
                  ? "true"
                  : "false"
              }
            />

            <button
              type="button"
              className="checkout-calculate"
              onClick={
                handleCalculateShipping
              }
              disabled={loadingShipping}
            >
              {loadingShipping
                ? "Calculando..."
                : "Calcular frete"}
            </button>

          </div>

          {cepError ? (

            <p className="checkout-error">
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


        {/* =====================================================
            OPÇÕES DE FRETE
        ===================================================== */}

        {shippingOptions.length > 0 && (

          <div className="checkout-shipping-options">

            <h3>
              Escolha a forma de entrega
            </h3>

            {shippingOptions.map(
              (option) => (

                <button
                  key={option.id}
                  type="button"
                  className={
                    `checkout-shipping-option ${
                      selectedShipping?.id ===
                      option.id
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setSelectedShipping(
                      option
                    )
                  }
                >

                  <div>

                    <strong>
                      {option.company.name}
                    </strong>

                    <span>
                      Entrega em até{" "}
                      {
                        option.custom_delivery_time ||
                        option.delivery_time
                      }{" "}
                      dias úteis
                    </span>

                  </div>

                  <strong>
                    R${" "}
                    {option.custom_price
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                </button>

              )
            )}

          </div>

        )}


        {/* =====================================================
            DADOS DO CLIENTE
        ===================================================== */}

        {selectedShipping && (

          <div className="checkout-customer">

            <h3>
              Dados para entrega
            </h3>


            {/* NOME */}

            <div className="checkout-field">

              <label htmlFor="customer-name">
                Nome completo
              </label>

              <input
                id="customer-name"
                type="text"
                placeholder="Digite seu nome completo"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                autoComplete="name"
              />

            </div>


            {/* CPF */}

            <div className="checkout-field">

              <label htmlFor="customer-cpf">
                CPF
              </label>

              <input
                id="customer-cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={customerCpf}
                onChange={handleCpfChange}
                maxLength={14}
                autoComplete="off"
              />

            </div>


            {/* EMAIL */}

            <div className="checkout-field">

              <label htmlFor="customer-email">
                E-mail
              </label>

              <input
                id="customer-email"
                type="email"
                placeholder="seuemail@email.com"
                value={customerEmail}
                onChange={(event) =>
                  setCustomerEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
              />

            </div>


            {/* TELEFONE */}

            <div className="checkout-field">

              <label htmlFor="customer-phone">
                WhatsApp
              </label>

              <input
                id="customer-phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(
                    event.target.value
                  )
                }
                autoComplete="tel"
              />

            </div>


            {/* =====================================================
                ENDEREÇO
            ===================================================== */}

            <h3 className="checkout-address-title">
              Endereço de entrega
            </h3>


            {/* RUA */}

            <div className="checkout-field">

              <label htmlFor="customer-street">
                Rua
              </label>

              <input
                id="customer-street"
                type="text"
                placeholder="Nome da rua"
                value={addressStreet}
                onChange={(event) =>
                  setAddressStreet(
                    event.target.value
                  )
                }
                autoComplete="street-address"
              />

            </div>


            {/* NÚMERO + COMPLEMENTO */}

            <div className="checkout-address-row">

              <div className="checkout-field">

                <label htmlFor="customer-number">
                  Número
                </label>

                <input
                  id="customer-number"
                  type="text"
                  placeholder="123"
                  value={addressNumber}
                  onChange={(event) =>
                    setAddressNumber(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="checkout-field">

                <label htmlFor="customer-complement">
                  Complemento
                </label>

                <input
                  id="customer-complement"
                  type="text"
                  placeholder="Apto, casa..."
                  value={addressComplement}
                  onChange={(event) =>
                    setAddressComplement(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* BAIRRO */}

            <div className="checkout-field">

              <label htmlFor="customer-neighborhood">
                Bairro
              </label>

              <input
                id="customer-neighborhood"
                type="text"
                placeholder="Seu bairro"
                value={addressNeighborhood}
                onChange={(event) =>
                  setAddressNeighborhood(
                    event.target.value
                  )
                }
                autoComplete="address-level2"
              />

            </div>


            {/* CIDADE + ESTADO */}

            <div className="checkout-address-row">

              <div className="checkout-field">

                <label htmlFor="customer-city">
                  Cidade
                </label>

                <input
                  id="customer-city"
                  type="text"
                  placeholder="São Paulo"
                  value={addressCity}
                  onChange={(event) =>
                    setAddressCity(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="checkout-field">

                <label htmlFor="customer-state">
                  Estado
                </label>

                <input
                  id="customer-state"
                  type="text"
                  placeholder="SP"
                  maxLength={2}
                  value={addressState}
                  onChange={(event) =>
                    setAddressState(
                      event.target.value.toUpperCase()
                    )
                  }
                />

              </div>

            </div>

          </div>

        )}


        {/* =====================================================
            FRETE
        ===================================================== */}

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


        {/* =====================================================
            RESUMO
        ===================================================== */}

        <div className="checkout-summary">

          <div>

            <span>
              Produto
            </span>

            <strong>
              R${" "}
              {price
                .toFixed(2)
                .replace(".", ",")}
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
              R${" "}
              {total
                .toFixed(2)
                .replace(".", ",")}
            </strong>

          </div>

        </div>


        {/* =====================================================
            BOTÃO
        ===================================================== */}

        <button
          type="button"
          className="checkout-button"
          disabled={!canContinue}
          onClick={handleContinuePayment}
        >

          {!selectedShipping
            ? "Selecione o frete para continuar"
            : !customerDataValid
            ? "Preencha seus dados para continuar"
            : "Continuar para pagamento"}

        </button>


        {/* =====================================================
            SEGURANÇA
        ===================================================== */}

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