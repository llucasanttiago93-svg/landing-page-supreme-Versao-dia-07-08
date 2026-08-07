import "./Fragrance.css";

function Fragrance() {
  return (
    <section
      className="fragrance"
      id="fragrancia"
      style={{
        backgroundImage: "url('/images/fragrance-bg.png')",
      }}
    >
      <div className="fragrance-overlay">

        <div className="container">

          <div className="fragrance-content">



            <h2>
              Não é apenas um reparador.
            </h2>

            <h3>
              É a fragrância que transforma a presença dos seus cabelos.
            </h3>

            <p className="fragrance-description">
              Brilho, maciez e um perfume sofisticado que acompanha você durante 
              todo o dia. Cada movimento dos fios revela uma experiência elegante e marcante.
            </p>

          </div>

          <div className="fragrance-cards">

            <div className="fragrance-card">

              <div className="card-icon">
                ✨
              </div>

              <h4>Fragrância Sofisticada</h4>

              <p>
                Aroma elegante e marcante que acompanha você durante todo o dia.
              </p>

            </div>

            <div className="fragrance-card">

              <div className="card-icon">
                🌸
              </div>

              <h4>Perfume Premium</h4>

              <p>
                Uma fragrância floral, quente e envolvente para cabelos inesquecíveis.
              </p>

            </div>

            <div className="fragrance-card">

              <div className="card-icon">
                ⏳
              </div>

              <h4>Longa duração</h4>

              <p>
                Sensação de cabelo recém-perfumado por muito mais tempo.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Fragrance;