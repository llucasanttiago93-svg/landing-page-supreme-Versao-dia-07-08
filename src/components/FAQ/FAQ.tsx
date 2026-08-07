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
              O produto pesa os fios?
            </summary>

            <p>
              Não. Sua fórmula possui toque leve e deixa
              os cabelos macios e alinhados sem aspecto oleoso.
            </p>

          </details>

          <details>

            <summary>
              Posso usar todos os dias?
            </summary>

            <p>
              Sim. O produto pode ser utilizado diariamente
              em cabelos secos ou úmidos.
            </p>

          </details>

          <details>

            <summary>
              Serve para qualquer tipo de cabelo?
            </summary>

            <p>
              Sim. É indicado para cabelos lisos,
              ondulados, cacheados e crespos.
            </p>

          </details>

          <details>

            <summary>
              Quanto tempo dura a fragrância?
            </summary>

            <p>
              A fragrância permanece nos fios por horas,
              variando conforme a rotina e o tipo de cabelo.
            </p>

          </details>

          <details>

            <summary>
              Como funciona o envio?
            </summary>

            <p>
              Enviamos para todo o Brasil com rastreamento
              após a confirmação do pagamento.
            </p>

          </details>

        </div>

      </div>

    </section>
  );
}

export default Faq;