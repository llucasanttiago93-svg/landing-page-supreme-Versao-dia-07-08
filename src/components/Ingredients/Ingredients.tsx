import "./Ingredients.css";

function Ingredients() {
  return (
    <section className="ingredients" id="ingredientes">

      <div className="container ingredients-container">

        <div className="ingredients-image">

          <img
            src={`${import.meta.env.BASE_URL}images/product-angle.webp`}
            alt="Frasco do Queridinho Supreme, reparador de pontas da Vanti Cosméticos"
          />

        </div>

        <div className="ingredients-content">

          <p className="ingredients-eyebrow">
            INGREDIENTES
          </p>

          <h2>
            Tratamento que cuida. Fragrância que marca.
          </h2>

          <p className="ingredients-description">
            Uma combinação de óleos vegetais nutritivos e uma fragrância
            premium para deixar os cabelos macios, brilhantes, alinhados
            e perfumados.
          </p>

          <div className="ingredients-list">

            <div className="ingredient">

              <div className="ingredient-icon">
                🌿
              </div>

              <div>

                <h3>
                  Óleo de Jojoba
                </h3>

                <p>
                  Ajuda a nutrir os fios sem deixar o cabelo pesado.
                </p>

              </div>

            </div>

            <div className="ingredient">

              <div className="ingredient-icon">
                🥥
              </div>

              <div>

                <h3>
                  Óleo de Buriti
                </h3>

                <p>
                  Ajuda a proporcionar brilho e um acabamento luminoso aos fios.
                </p>

              </div>

            </div>

            <div className="ingredient">

              <div className="ingredient-icon">
                🍃
              </div>

              <div>

                <h3>
                  Óleo de Patauá
                </h3>

                <p>
                  Contribui para fios mais macios, alinhados e com menos frizz.
                </p>

              </div>

            </div>

            <div className="ingredient">

              <div className="ingredient-icon">
                🌸
              </div>

              <div>

                <h3>
                  Fragrância Premium
                </h3>

                <p>
                  Perfuma os cabelos com uma fragrância sofisticada e de longa duração.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Ingredients;