import { useEffect, useState } from "react";
import "./Header.css";


/* =====================================================
   CTA CONTEXTUAL DO HEADER

   null = a própria seção já possui CTA,
          então o header não mostra botão.

   objeto = a seção não possui CTA,
            então o header mostra o CTA pertinente.
===================================================== */

type HeaderCta = {
    label: string;
    href: string;
} | null;


const SECTION_CTA: Record<string, HeaderCta> = {

    /* =================================================
       SEÇÕES QUE JÁ POSSUEM CTA PRÓPRIO
    ================================================= */

    inicio: null,

    beneficios: null,

    garantia: null,

    comprar: null,

    faq: null,


    /* =================================================
       SEÇÕES QUE NÃO POSSUEM CTA PRÓPRIO
    ================================================= */

    depoimentos: {
        label: "QUERO MEU QUERIDINHO",
        href: "#comprar",
    },

    fragrancia: {
        label: "QUERO SENTIR ESSA EXPERIÊNCIA",
        href: "#comprar",
    },

    ingredientes: {
        label: "QUERO EXPERIMENTAR",
        href: "#comprar",
    },

    resultados: {
        label: "QUERO ESSE RESULTADO",
        href: "#comprar",
    },

    "como-usar": {
        label: "QUERO EXPERIMENTAR",
        href: "#comprar",
    },

    footer: {
        label: "QUERO MEU QUERIDINHO",
        href: "#comprar",
    },

};


/* =====================================================
   ORDEM DAS SEÇÕES
===================================================== */

const SECTION_IDS = [

    "inicio",
    "depoimentos",
    "beneficios",
    "fragrancia",
    "ingredientes",
    "resultados",
    "como-usar",
    "garantia",
    "comprar",
    "faq",
    "footer",

] as const;


function Header() {

    const [menuOpen, setMenuOpen] =
        useState(false);


    const [scrolled, setScrolled] =
        useState(false);


    const [activeSection, setActiveSection] =
        useState("inicio");


    /* =================================================
       DETECTAR SCROLL + SEÇÃO ATIVA
    ================================================= */

    useEffect(() => {

        const updateHeader = () => {

            setScrolled(
                window.scrollY > 30
            );


            const headerOffset = 110;

            let currentSection =
                "inicio";


            for (
                const sectionId of SECTION_IDS
            ) {

                const element =
                    document.getElementById(
                        sectionId
                    );


                if (!element) {
                    continue;
                }


                const rect =
                    element.getBoundingClientRect();


                if (
                    rect.top <= headerOffset &&
                    rect.bottom > headerOffset
                ) {

                    currentSection =
                        sectionId;

                    break;

                }

            }


            if (
                window.scrollY <= 80
            ) {

                currentSection =
                    "inicio";

            }


            setActiveSection(
                currentSection
            );

        };


        updateHeader();


        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true,
            }
        );


        window.addEventListener(
            "resize",
            updateHeader
        );


        return () => {

            window.removeEventListener(
                "scroll",
                updateHeader
            );


            window.removeEventListener(
                "resize",
                updateHeader
            );

        };

    }, []);


    /* =================================================
       FECHAR MENU
    ================================================= */

    const closeMenu = () => {

        setMenuOpen(false);

    };


    /* =================================================
       CTA ATUAL
    ================================================= */

    const currentCta =
        SECTION_CTA[
            activeSection
        ] ?? null;


    /*
     * Se a seção já possui CTA próprio,
     * o header fica sem CTA.
     */

    const sectionHasOwnCta =
        currentCta === null;


    /* =================================================
       RENDER
    ================================================= */

    return (

        <header
            className={`
                header
                ${scrolled ? "scrolled" : ""}
                ${
                    sectionHasOwnCta
                        ? "header-without-cta"
                        : "header-with-cta"
                }
            `}
        >

            <div className="container header-container">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="header-left">

                    <a
                        href="#inicio"
                        className="logo"
                        aria-label="Vanti Cosméticos - início"
                        onClick={closeMenu}
                    >

                        <img
                            src={`${import.meta.env.BASE_URL}images/logo.webp`}
                            alt="Vanti Cosméticos"
                        />

                    </a>

                </div>


                {/* =================================================
                    CTA MOBILE
                    Fica visível no header quando a seção
                    não possui CTA próprio.
                ================================================= */}

                {currentCta && (

                    <a
                        key={currentCta.label}
                        href={currentCta.href}
                        className="
                            header-button
                            mobile-header-button
                            cta-switch
                        "
                        onClick={closeMenu}
                    >
                        {currentCta.label}
                    </a>

                )}


                {/* =================================================
                    NAVEGAÇÃO
                ================================================= */}

                <nav
                    id="navigation"
                    className={`
                        navigation
                        ${menuOpen ? "active" : ""}
                    `}
                >

                    <a
                        href="#beneficios"
                        onClick={closeMenu}
                    >
                        Benefícios
                    </a>


                    <a
                        href="#fragrancia"
                        onClick={closeMenu}
                    >
                        Fragrância
                    </a>


                    <a
                        href="#como-usar"
                        onClick={closeMenu}
                    >
                        Como usar
                    </a>


                    <a
                        href="#faq"
                        onClick={closeMenu}
                    >
                        FAQ
                    </a>


                    {/* =================================================
                        CTA DENTRO DO MENU
                        Removido para não duplicar o CTA que
                        já fica visível no header mobile.
                    ================================================= */}

                </nav>


                {/* =================================================
                    CTA DESKTOP
                ================================================= */}

                <div className="header-right">

                    {currentCta && (

                        <a
                            key={currentCta.label}
                            href={currentCta.href}
                            className="
                                header-button
                                desktop-button
                                cta-switch
                            "
                        >
                            {currentCta.label}
                        </a>

                    )}

                </div>


                {/* =================================================
                    MENU MOBILE
                ================================================= */}

                <button
                    type="button"
                    className={`
                        menu-toggle
                        ${menuOpen ? "active" : ""}
                    `}
                    onClick={() =>
                        setMenuOpen(
                            !menuOpen
                        )
                    }
                    aria-label={
                        menuOpen
                            ? "Fechar menu"
                            : "Abrir menu"
                    }
                    aria-expanded={
                        menuOpen
                    }
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </div>

        </header>

    );

}


export default Header;