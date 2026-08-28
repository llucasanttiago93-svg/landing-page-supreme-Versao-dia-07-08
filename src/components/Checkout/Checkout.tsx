import { useEffect, useRef, useState } from "react";
import "./Checkout.css";

/*
 * =====================================================
 * MODO DE TESTE TEMPORÁRIO
 * =====================================================
 *
 * Deixe TRUE somente enquanto estivermos fazendo
 * o teste de pagamento de R$ 1,00.
 *
 * Depois do teste, volte para FALSE.
 */

const TEST_PAYMENT_MODE = false;


/* =====================================================
   PROPS
===================================================== */

interface CheckoutProps {
  isOpen: boolean;
  quantity: 1 | 2;
  onClose: () => void;
}


/* =====================================================
   FRETE
===================================================== */

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


/* =====================================================
   ENDEREÇO VIA CEP
===================================================== */

interface CepAddress {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}


/* =====================================================
   COMPONENTE
===================================================== */

function Checkout({
  isOpen,
  quantity,
  onClose,
}: CheckoutProps) {


  /* =================================================
     PRODUTO
  ================================================= */

  const price =
    TEST_PAYMENT_MODE
      ? 1
      : quantity === 1
        ? 57
        : 97;


  const productLabel =
    quantity === 1
      ? "Queridinho Supreme — 1 unidade"
      : "Queridinho Supreme — 2 unidades";


  /* =================================================
     CEP / FRETE
  ================================================= */

  const [cep, setCep] = useState("");

  const [cepError, setCepError] =
    useState("");

  const [shippingOptions, setShippingOptions] =
    useState<ShippingOption[]>([]);

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  const [loadingShipping, setLoadingShipping] =
    useState(false);


  /* =================================================
     BUSCA DE ENDEREÇO
  ================================================= */

  const [loadingAddress, setLoadingAddress] =
    useState(false);

  const [addressError, setAddressError] =
    useState("");

  const [addressFound, setAddressFound] =
    useState(false);


  /*
   * Guarda a requisição atual para podermos
   * cancelar caso outra seja iniciada.
   */

  const addressAbortController =
    useRef<AbortController | null>(null);


  /*
   * Cache simples de CEP.
   *
   * Se o mesmo CEP for consultado novamente,
   * não fazemos outra requisição.
   */

  const addressCache =
    useRef<Map<string, CepAddress>>(
      new Map()
    );


  /* =================================================
     DADOS DO CLIENTE
  ================================================= */

  const [customerName, setCustomerName] =
    useState("");

  const [customerCpf, setCustomerCpf] =
    useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");


  /* =================================================
     ENDEREÇO
  ================================================= */

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

  const [addressReference, setAddressReference] =
    useState("");


  /* =================================================
     PAGAMENTO / DUPLO CLIQUE
  ================================================= */

  /*
   * Estado visual.
   *
   * Quando TRUE:
   * - botão fica desabilitado
   * - texto muda para "Processando..."
   */

  const [loadingPayment, setLoadingPayment] =
    useState(false);


  /*
   * Trava imediata contra duplo clique.
   *
   * Usamos useRef além do useState porque o estado
   * do React é atualizado de forma assíncrona.
   *
   * O ref bloqueia uma segunda execução
   * imediatamente, inclusive em cliques muito rápidos.
   */

  const paymentLocked =
    useRef(false);


  /* =================================================
     BLOQUEAR SCROLL / OVERFLOW HORIZONTAL
  ================================================= */

  useEffect(() => {

    if (!isOpen) {
      return;
    }


    const html = document.documentElement;
    const body = document.body;


    /*
     * Guarda os valores originais.
     *
     * Isso é importante para que, ao fechar o checkout,
     * o site volte exatamente ao estado anterior.
     */

    const previousHtmlOverflow =
      html.style.overflow;

    const previousHtmlOverflowX =
      html.style.overflowX;

    const previousBodyOverflow =
      body.style.overflow;

    const previousBodyOverflowX =
      body.style.overflowX;


    /*
     * Bloqueia o scroll horizontal do documento.
     */

    html.style.overflow = "hidden";
    html.style.overflowX = "hidden";

    body.style.overflow = "hidden";
    body.style.overflowX = "hidden";


    return () => {

      /*
       * Restaura os valores originais.
       */

      html.style.overflow =
        previousHtmlOverflow;

      html.style.overflowX =
        previousHtmlOverflowX;

      body.style.overflow =
        previousBodyOverflow;

      body.style.overflowX =
        previousBodyOverflowX;

    };

  }, [isOpen]);


  /* =================================================
     LIMPAR ESTADO DE PAGAMENTO AO FECHAR
  ================================================= */

  useEffect(() => {

    if (!isOpen) {

      paymentLocked.current =
        false;

      setLoadingPayment(false);

    }

  }, [isOpen]);


  /* =================================================
     LIMPAR ABORT CONTROLLER AO FECHAR
  ================================================= */

  useEffect(() => {

    if (!isOpen) {

      addressAbortController.current?.abort();

      addressAbortController.current = null;

    }

  }, [isOpen]);


  /* =================================================
     FORMATAR CEP
  ================================================= */

  const handleCepChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const value =
      event.target.value;


    const numbersOnly =
      value.replace(/\D/g, "");


    const limited =
      numbersOnly.slice(0, 8);


    const formatted =
      limited.length > 5
        ? `${limited.slice(0, 5)}-${limited.slice(5)}`
        : limited;


    setCep(formatted);

    setCepError("");

    setAddressError("");

    setAddressFound(false);


    /*
     * Se o CEP mudar, a cotação antiga
     * deixa de ser válida.
     */

    setShippingOptions([]);

    setSelectedShipping(null);


    /*
     * Limpamos o endereço porque ele pode
     * pertencer ao CEP anterior.
     *
     * Todos os campos serão preenchidos novamente
     * quando o novo CEP for consultado.
     */

    setAddressStreet("");

    setAddressNumber("");

    setAddressComplement("");

    setAddressNeighborhood("");

    setAddressCity("");

    setAddressState("");

    setAddressReference("");

  };


  /* =================================================
     BUSCAR ENDEREÇO PELO CEP
  ================================================= */

  const fetchAddressByCep = async (
    cepNumber: string
  ) => {

    /*
     * Cancela uma consulta anterior.
     */

    addressAbortController.current?.abort();


    const controller =
      new AbortController();


    addressAbortController.current =
      controller;


    setLoadingAddress(true);

    setAddressError("");

    setAddressFound(false);


    /*
     * Verifica primeiro o cache.
     */

    const cachedAddress =
      addressCache.current.get(
        cepNumber
      );


    if (cachedAddress) {

      setAddressStreet(
        cachedAddress.logradouro || ""
      );

      setAddressNeighborhood(
        cachedAddress.bairro || ""
      );

      setAddressCity(
        cachedAddress.localidade || ""
      );

      setAddressState(
        cachedAddress.uf || ""
      );

      setAddressFound(true);

      setLoadingAddress(false);

      return;
    }


    try {

      const response =
        await fetch(
          `https://viacep.com.br/ws/${cepNumber}/json/`,
          {
            signal:
              controller.signal,
          }
        );


      if (!response.ok) {

        throw new Error(
          "Não foi possível consultar o endereço."
        );

      }


      const data:
        CepAddress =
        await response.json();


      if (data.erro) {

        throw new Error(
          "CEP não encontrado."
        );

      }


      /*
       * Salva no cache.
       */

      addressCache.current.set(
        cepNumber,
        data
      );


      /*
       * Preenche automaticamente
       * os campos do endereço.
       *
       * IMPORTANTE:
       * Esses campos continuam editáveis.
       */

      setAddressStreet(
        data.logradouro || ""
      );

      setAddressNeighborhood(
        data.bairro || ""
      );

      setAddressCity(
        data.localidade || ""
      );

      setAddressState(
        data.uf || ""
      );

      setAddressFound(true);


    } catch (error) {

      /*
       * AbortError significa apenas que
       * cancelamos uma requisição anterior.
       */

      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {

        return;

      }


      console.error(
        "Erro ao consultar CEP:",
        error
      );


      setAddressError(
        error instanceof Error
          ? error.message
          : "Não foi possível localizar o endereço."
      );


    } finally {

      if (
        addressAbortController.current ===
        controller
      ) {

        setLoadingAddress(false);

      }

    }

  };


  /* =================================================
     CALCULAR FRETE
  ================================================= */

  const handleCalculateShipping = async () => {

    const numbersOnly =
      cep.replace(/\D/g, "");


    if (
      numbersOnly.length !== 8
    ) {

      setCepError(
        "Digite um CEP válido com 8 números."
      );

      return;

    }


    setCepError("");

    setAddressError("");

    setAddressFound(false);

    setLoadingShipping(true);

    setShippingOptions([]);

    setSelectedShipping(null);


    try {

      const response =
        await fetch(
          "https://api.vanticompany.com.br/api/frete",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              cepDestino:
                numbersOnly,

              quantidade:
                quantity,

            }),

          }
        );


      const data =
        await response.json();


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

      const options:
        ShippingOption[] =
        data
          .filter(
            (option: ShippingOption) =>
              option.custom_price != null
          )
          .map(
            (option: ShippingOption) => ({

              ...option,

              custom_price:
                Number(
                  option.custom_price
                ),

            })
          );


      if (
        options.length === 0
      ) {

        throw new Error(
          "Nenhuma opção de frete encontrada para este CEP."
        );

      }


      setShippingOptions(
        options
      );


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


  /* =================================================
     SELECIONAR FRETE
  ================================================= */

  const handleSelectShipping = async (
    option: ShippingOption
  ) => {

    /*
     * Seleciona imediatamente o frete.
     */

    setSelectedShipping(
      option
    );


    /*
     * O CEP já foi validado para
     * chegar até aqui.
     */

    const numbersOnly =
      cep.replace(/\D/g, "");


    if (
      numbersOnly.length !== 8
    ) {

      return;

    }


    /*
     * Busca automaticamente o endereço
     * referente ao CEP.
     */

    await fetchAddressByCep(
      numbersOnly
    );

  };


  /* =================================================
     CEP VÁLIDO
  ================================================= */

  const isCepValid =
    cep.replace(/\D/g, "").length === 8;


  /* =================================================
     FRETE SELECIONADO
  ================================================= */

  const shippingPrice =
    TEST_PAYMENT_MODE
      ? 0
      : selectedShipping
        ? selectedShipping.custom_price
        : 0;


  /* =================================================
     TOTAL
  ================================================= */

  const total =
    price + shippingPrice;


  /* =================================================
     FORMATAR CPF
  ================================================= */

  const handleCpfChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const numbersOnly =
      event.target.value
        .replace(/\D/g, "");


    const limited =
      numbersOnly.slice(0, 11);


    let formatted =
      limited;


    if (
      limited.length > 9
    ) {

      formatted =
        `${limited.slice(0, 3)}.` +
        `${limited.slice(3, 6)}.` +
        `${limited.slice(6, 9)}-` +
        limited.slice(9);

    } else if (
      limited.length > 6
    ) {

      formatted =
        `${limited.slice(0, 3)}.` +
        `${limited.slice(3, 6)}.` +
        limited.slice(6);

    } else if (
      limited.length > 3
    ) {

      formatted =
        `${limited.slice(0, 3)}.` +
        limited.slice(3);

    }


    setCustomerCpf(
      formatted
    );

  };


  /* =================================================
     FORMATAR TELEFONE
  ================================================= */

  const handlePhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const numbersOnly =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 11);


    let formatted =
      numbersOnly;


    if (
      numbersOnly.length > 10
    ) {

      formatted =
        `(${numbersOnly.slice(0, 2)}) ` +
        `${numbersOnly.slice(2, 7)}-` +
        numbersOnly.slice(7);

    } else if (
      numbersOnly.length > 6
    ) {

      formatted =
        `(${numbersOnly.slice(0, 2)}) ` +
        `${numbersOnly.slice(2, 6)}-` +
        numbersOnly.slice(6);

    } else if (
      numbersOnly.length > 2
    ) {

      formatted =
        `(${numbersOnly.slice(0, 2)}) ` +
        numbersOnly.slice(2);

    }


    setCustomerPhone(
      formatted
    );

  };


  /* =================================================
     DADOS DO CLIENTE VÁLIDOS
  ================================================= */

  const customerDataValid =
    customerName.trim().length >= 3 &&

    customerCpf
      .replace(/\D/g, "")
      .length === 11 &&

    customerEmail.includes("@") &&

    customerPhone
      .replace(/\D/g, "")
      .length >= 10 &&

    addressStreet.trim().length >= 3 &&

    addressNumber.trim().length > 0 &&

    addressNeighborhood.trim().length >= 2 &&

    addressCity.trim().length >= 2 &&

    addressState.trim().length === 2;


  /* =================================================
     PODE CONTINUAR?
  ================================================= */

  const canContinue =
    selectedShipping !== null &&
    customerDataValid &&
    !loadingAddress;


  /* =================================================
     PAGAMENTO
  ================================================= */

  const handleContinuePayment =
    async () => {

      /*
       * Primeira trava:
       * impede chamadas repetidas enquanto
       * o pagamento já está sendo processado.
       */

      if (paymentLocked.current) {
        return;
      }


      /*
       * Segunda trava:
       * mantém a validação original.
       */

      if (
        !canContinue ||
        !selectedShipping
      ) {

        return;

      }


      /*
       * TRAVA IMEDIATAMENTE.
       *
       * O ref é alterado antes do fetch.
       * Assim um segundo clique muito rápido
       * não consegue iniciar outra requisição.
       */

      paymentLocked.current =
        true;


      /*
       * Atualiza o estado visual do botão.
       */

      setLoadingPayment(true);


      try {

        const response =
          await fetch(
            "https://api.vanticompany.com.br/api/pagamento",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                quantidade:
                  quantity,

                shippingId:
                  selectedShipping.id,

                cliente: {

                  nome:
                    customerName,

                  cpf:
                    customerCpf,

                  email:
                    customerEmail,

                  telefone:
                    customerPhone,

                },

                endereco: {

                  cep:
                    cep.replace(
                      /\D/g,
                      ""
                    ),

                  rua:
                    addressStreet,

                  numero:
                    addressNumber,

                  complemento:
                    addressComplement,

                  bairro:
                    addressNeighborhood,

                  cidade:
                    addressCity,

                  estado:
                    addressState,

                  referencia:
                    addressReference,

                },

              }),

            }
          );


        const data =
          await response.json();


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
         * Se chegou aqui, o checkout foi criado
         * com sucesso.
         *
         * Mantemos o loading TRUE porque agora
         * estamos redirecionando para o pagamento.
         */

        window.location.href =
          data.url;


      } catch (error) {

        console.error(
          "Erro ao criar pagamento:",
          error
        );


        /*
         * Se deu erro, liberamos novamente
         * o botão para o cliente poder tentar.
         */

        paymentLocked.current =
          false;

        setLoadingPayment(false);


        alert(
          error instanceof Error
            ? error.message
            : "Não foi possível iniciar o pagamento."
        );

      }

    };


  /* =================================================
     NÃO MOSTRAR
  ================================================= */

  if (!isOpen) {

    return null;

  }


  /* =================================================
     INTERFACE
  ================================================= */

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


        {/* =================================================
            CABEÇALHO
        ================================================= */}

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


        {/* =================================================
            PRODUTO
        ================================================= */}

        <div className="checkout-product">

          <img
            src={
              quantity === 1
                ? `${import.meta.env.BASE_URL}images/product-front.webp`
                : `${import.meta.env.BASE_URL}images/product-front-2un.webp`
            }
            alt={productLabel}
            loading="eager"
            decoding="async"
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


        {/* =================================================
            CEP
        ================================================= */}

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
              disabled={
                loadingShipping
              }
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
                : "Digite seu CEP para consultar as opções de entrega."}

            </p>

          )}

        </div>


        {/* =================================================
            OPÇÕES DE FRETE
        ================================================= */}

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
                      selectedShipping?.id === option.id
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    handleSelectShipping(
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


        {/* =================================================
            ENDEREÇO + DADOS DO CLIENTE
        ================================================= */}

        {selectedShipping && (

          <div className="checkout-customer">

            {/* =================================================
                ENDEREÇO
            ================================================= */}

            <div className="checkout-customer-heading">

              <div>

                <span className="checkout-step">
                  02
                </span>

                <div>

                  <h3>
                    Endereço de entrega
                  </h3>

                  <p>
                    Preenchemos pelo CEP. Confira e altere se necessário.
                  </p>

                </div>

              </div>


              {loadingAddress && (

                <span className="checkout-address-loading">
                  Buscando endereço...
                </span>

              )}


              {addressFound &&
                !loadingAddress && (

                  <span className="checkout-address-success">
                    ✓ Endereço encontrado
                  </span>

                )}

            </div>


            {addressError && (

              <div className="checkout-address-error">
                {addressError}
              </div>

            )}


            {/* =================================================
                RUA
            ================================================= */}

            <div className="checkout-field">

              <label htmlFor="customer-street">
                Rua
              </label>

              <input
                id="customer-street"
                className={
                  addressFound
                    ? "address-auto-filled"
                    : ""
                }
                type="text"
                placeholder={
                  loadingAddress
                    ? "Buscando endereço..."
                    : "Nome da rua"
                }
                value={addressStreet}
                onChange={(event) =>
                  setAddressStreet(
                    event.target.value
                  )
                }
                autoComplete="street-address"
              />

            </div>


            {/* =================================================
                NÚMERO + COMPLEMENTO
            ================================================= */}

            <div className="checkout-address-row">

              <div className="checkout-field">

                <label htmlFor="customer-number">
                  Número
                </label>

                <input
                  id="customer-number"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex.: 123"
                  value={addressNumber}
                  onChange={(event) =>
                    setAddressNumber(
                      event.target.value
                    )
                  }
                  autoComplete="address-line2"
                />

              </div>


              <div className="checkout-field">

                <label htmlFor="customer-complement">
                  Complemento
                  <span> opcional</span>
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
                  autoComplete="address-line2"
                />

              </div>

            </div>


            {/* =================================================
                BAIRRO
            ================================================= */}

            <div className="checkout-field">

              <label htmlFor="customer-neighborhood">
                Bairro
              </label>

              <input
                id="customer-neighborhood"
                className={
                  addressFound
                    ? "address-auto-filled"
                    : ""
                }
                type="text"
                placeholder="Seu bairro"
                value={addressNeighborhood}
                onChange={(event) =>
                  setAddressNeighborhood(
                    event.target.value
                  )
                }
                autoComplete="address-level3"
              />

            </div>


            {/* =================================================
                CIDADE + ESTADO
            ================================================= */}

            <div className="checkout-address-row">

              <div className="checkout-field">

                <label htmlFor="customer-city">
                  Cidade
                </label>

                <input
                  id="customer-city"
                  className={
                    addressFound
                      ? "address-auto-filled"
                      : ""
                  }
                  type="text"
                  placeholder="São Paulo"
                  value={addressCity}
                  onChange={(event) =>
                    setAddressCity(
                      event.target.value
                    )
                  }
                  autoComplete="address-level2"
                />

              </div>


              <div className="checkout-field checkout-state-field">

                <label htmlFor="customer-state">
                  UF
                </label>

                <input
                  id="customer-state"
                  className={
                    addressFound
                      ? "address-auto-filled"
                      : ""
                  }
                  type="text"
                  placeholder="SP"
                  maxLength={2}
                  value={addressState}
                  onChange={(event) =>
                    setAddressState(
                      event.target.value
                        .toUpperCase()
                    )
                  }
                  autoComplete="address-level1"
                />

              </div>

            </div>


            {/* =================================================
                REFERÊNCIA
            ================================================= */}

            <div className="checkout-field">

              <label htmlFor="customer-reference">
                Referência
                <span> opcional</span>
              </label>

              <input
                id="customer-reference"
                type="text"
                placeholder="Ex.: próximo ao mercado, portão azul..."
                value={addressReference}
                onChange={(event) =>
                  setAddressReference(
                    event.target.value
                  )
                }
                autoComplete="off"
              />

            </div>


            {/* =================================================
                DADOS PESSOAIS
            ================================================= */}

            <div className="checkout-customer-heading checkout-personal-heading">

              <div>

                <span className="checkout-step">
                  03
                </span>

                <div>

                  <h3>
                    Seus dados
                  </h3>

                  <p>
                    Preencha seus dados para receber o pedido.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                NOME
            ================================================= */}

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


            {/* =================================================
                CPF + WHATSAPP
            ================================================= */}

            <div className="checkout-address-row">

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


              <div className="checkout-field">

                <label htmlFor="customer-phone">
                  WhatsApp
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  autoComplete="tel"
                />

              </div>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

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


          </div>

        )}


        {/* =================================================
            RESUMO
        ================================================= */}

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


        {/* =================================================
            BOTÃO
        ================================================= */}

        <button
          type="button"
          className="checkout-button"
          disabled={
            !canContinue ||
            loadingPayment
          }
          onClick={
            handleContinuePayment
          }
        >

          {loadingPayment
            ? "Processando pagamento..."
            : !selectedShipping
              ? "Selecione o frete para continuar"
              : loadingAddress
                ? "Localizando endereço..."
                : !customerDataValid
                  ? "Preencha seus dados para continuar"
                  : "Continuar para pagamento"}

        </button>


        {/* =================================================
            SEGURANÇA
        ================================================= */}

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