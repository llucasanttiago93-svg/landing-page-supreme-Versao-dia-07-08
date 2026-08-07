import "./Ingredients.css";

function Ingredients() {
  return (
    <section className="ingredients" id="ingredientes">

      <div className="container ingredients-container">

        <div className="ingredients-image">

          <img
            src="/images/product-angle.png"
            alt="Queridinho Supreme"
          />

        </div>

        <div className="ingredients-content">

          <p className="ingredients-eyebrow">
            COMO FUNCIONA
          </p>

          <h2>
            Tratamento que cuida. Fragrância que marca.
          </h2>

          <p className="ingredients-description">
            Uma combinação de óleos vegetais nutritivos 
            e uma fragrância premium para deixar seus 
            cabelos macios, brilhantes, protegidos e 
            perfumados durante todo o dia.
          </p>

          <div className="ingredients-list">

            <div className="ingredient">

              <div className="ingredient-icon">
                🌿
              </div>

              <div>

                <h3>Óleo de Jojoba</h3>

                <p>
                  Nutre profundamente sem deixar os fios pesados.
                </p>

              </div>

            </div>

            <div className="ingredient">

              <div className="ingredient-icon">
                🥥
              </div>

              <div>

                <h3>Óleo de Buriti</h3>

                <p>
                  Intensifica o brilho natural e protege os cabelos.
                </p>

              </div>

            </div>

            <div className="ingredient">

              <div className="ingredient-icon">
                🍃
              </div>

              <div>

                <h3>Óleo de Patauá</h3>

                <p>
                  Reduz o frizz e proporciona toque extremamente sedoso.
                </p>

              </div>

            </div>

            <div className="ingredient">

              <div className="ingredient-icon">
                🌸
              </div>

              <div>

                <h3>Fragrância Premium</h3>

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