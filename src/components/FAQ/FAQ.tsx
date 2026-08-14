import "./Faq.css";

function Faq() {
  return (
    <section className="faq" id="faq">

      <div className="container">

        <div className="faq-header">

          <p className="faq-eyebrow">
            PERGUNTAS FREQUENTES
          </p>

          <h2>
            Ainda ficou alguma dúvida?
          </h2>

          <p>
            Respondemos as perguntas mais comuns sobre o
            Queridinho Supreme.
          </p>

        </div>

        <div className="faq-list">

          <details>

            <summary>
              O Queridinho Supreme pesa os fios?
            </summary>

            <p>
              Não. O Queridinho Supreme possui uma textura leve e foi
              desenvolvido para deixar os cabelos macios e alinhados
              sem sensação pesada.
            </p>

          </details>

          <details>

            <summary>
              Posso usar o Queridinho Supreme todos os dias?
            </summary>

            <p>
              Sim. Ele pode ser utilizado diariamente em cabelos
              secos ou úmidos, aplicando uma pequena quantidade
              no comprimento e nas pontas.
            </p>

          </details>

          <details>

            <summary>
              O Queridinho Supreme serve para qualquer tipo de cabelo?
            </summary>

            <p>
              Sim. O produto pode ser utilizado em diferentes tipos
              de cabelo, incluindo lisos, ondulados, cacheados e crespos.
            </p>

          </details>

          <details>

            <summary>
              Quanto tempo dura a fragrância?
            </summary>

            <p>
              A duração da fragrância pode variar de acordo com o
              tipo de cabelo, quantidade aplicada e rotina de cada pessoa.
            </p>

          </details>

          <details>

            <summary>
              Como funciona o envio?
            </summary>

            <p>
              Enviamos para todo o Brasil. Após a confirmação do pagamento,
              o pedido é preparado para envio e você poderá acompanhar
              a entrega conforme a modalidade disponível.
            </p>

          </details>

        </div>

      </div>

    </section>
  );
}

export default Faq;